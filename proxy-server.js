/**
 * 本地代理服务器 - 用于绕过CORS和X-Frame-Options限制
 * 运行方式: node proxy-server.js
 */

const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3001;

// 启用CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(express.static('.'));

let browser = null;

// 初始化Puppeteer浏览器
async function initBrowser() {
    try {
        browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu'
            ]
        });
        console.log('Puppeteer浏览器已启动');
    } catch (error) {
        console.error('启动Puppeteer失败:', error);
    }
}

// 方法1: 使用Puppeteer渲染完整页面
app.get('/api/render', async (req, res) => {
    const { url } = req.query;
    
    if (!url) {
        return res.status(400).json({ error: '缺少URL参数' });
    }
    
    if (!browser) {
        await initBrowser();
    }
    
    try {
        const page = await browser.newPage();
        
        // 设置用户代理
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        
        // 设置视口
        await page.setViewport({ width: 1200, height: 800 });
        
        // 拦截请求，修复资源路径
        await page.setRequestInterception(true);
        page.on('request', (request) => {
            const requestUrl = request.url();
            
            // 允许所有请求
            request.continue();
        });
        
        // 导航到目标页面
        await page.goto(url, { 
            waitUntil: 'networkidle2',
            timeout: 30000 
        });
        
        // 等待页面完全加载
        await page.waitForTimeout(2000);
        
        // 注入修复脚本
        await page.evaluate((baseUrl) => {
            // 修复所有相对路径
            const base = new URL(baseUrl);
            const baseHost = `${base.protocol}//${base.host}`;
            
            // 修复图片
            document.querySelectorAll('img').forEach(img => {
                if (img.src && !img.src.startsWith('http') && !img.src.startsWith('data:')) {
                    img.src = baseHost + (img.src.startsWith('/') ? '' : '/') + img.src;
                }
            });
            
            // 修复链接
            document.querySelectorAll('a').forEach(link => {
                if (link.href && !link.href.startsWith('http')) {
                    link.href = baseHost + (link.href.startsWith('/') ? '' : '/') + link.href;
                }
                
                // 阻止链接跳转，发送消息给父窗口
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.parent.postMessage({
                        action: 'navigate',
                        url: link.href
                    }, '*');
                });
            });
            
            // 修复CSS背景图片
            document.querySelectorAll('*').forEach(el => {
                const style = window.getComputedStyle(el);
                if (style.backgroundImage && style.backgroundImage !== 'none') {
                    const bgImage = style.backgroundImage;
                    const urlMatch = bgImage.match(/url\(['"]?([^'"]*?)['"]?\)/);
                    if (urlMatch && !urlMatch[1].startsWith('http') && !urlMatch[1].startsWith('data:')) {
                        el.style.backgroundImage = `url('${baseHost}${urlMatch[1].startsWith('/') ? '' : '/'}${urlMatch[1]}')`;
                    }
                }
            });
            
        }, url);
        
        // 获取页面HTML
        const html = await page.content();
        
        await page.close();
        
        res.json({
            success: true,
            html: html,
            url: url
        });
        
    } catch (error) {
        console.error('Puppeteer渲染失败:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 方法2: 简单的HTTP代理
app.get('/api/fetch', async (req, res) => {
    const { url } = req.query;
    
    if (!url) {
        return res.status(400).json({ error: '缺少URL参数' });
    }
    
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1'
            },
            timeout: 15000
        });
        
        let html = response.data;
        
        // 使用cheerio处理HTML
        const $ = cheerio.load(html);
        
        // 添加base标签
        const base = new URL(url);
        const baseHost = `${base.protocol}//${base.host}`;
        
        if (!$('base').length) {
            $('head').prepend(`<base href="${baseHost}">`);
        }
        
        // 修复相对路径
        $('img, script, link').each((i, el) => {
            const $el = $(el);
            ['src', 'href'].forEach(attr => {
                const value = $el.attr(attr);
                if (value && !value.startsWith('http') && !value.startsWith('//') && !value.startsWith('data:')) {
                    $el.attr(attr, baseHost + (value.startsWith('/') ? '' : '/') + value);
                }
            });
        });
        
        // 注入导航脚本
        $('body').append(`
            <script>
            document.addEventListener('click', function(e) {
                const link = e.target.closest('a');
                if (link && link.href) {
                    e.preventDefault();
                    window.parent.postMessage({
                        action: 'navigate',
                        url: link.href
                    }, '*');
                }
            });
            </script>
        `);
        
        res.json({
            success: true,
            html: $.html(),
            url: url
        });
        
    } catch (error) {
        console.error('HTTP fetch失败:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 方法3: 通用代理中间件
app.use('/proxy', createProxyMiddleware({
    target: 'http://localhost',
    changeOrigin: true,
    pathRewrite: {
        '^/proxy': ''
    },
    router: (req) => {
        const targetUrl = req.query.url || req.headers['x-target-url'];
        if (targetUrl) {
            const url = new URL(targetUrl);
            return `${url.protocol}//${url.host}`;
        }
        return 'http://localhost';
    },
    onProxyReq: (proxyReq, req, res) => {
        // 设置请求头
        proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
        proxyReq.setHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8');
    },
    onProxyRes: (proxyRes, req, res) => {
        // 移除可能阻止嵌入的头部
        delete proxyRes.headers['x-frame-options'];
        delete proxyRes.headers['content-security-policy'];
        
        // 设置CORS头部
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With';
    }
}));

// 健康检查端点
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        puppeteer: browser ? 'running' : 'stopped',
        timestamp: new Date().toISOString()
    });
});

// 启动服务器
app.listen(PORT, async () => {
    console.log(`代理服务器运行在 http://localhost:${PORT}`);
    await initBrowser();
});

// 优雅关闭
process.on('SIGINT', async () => {
    console.log('正在关闭服务器...');
    if (browser) {
        await browser.close();
    }
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('正在关闭服务器...');
    if (browser) {
        await browser.close();
    }
    process.exit(0);
});