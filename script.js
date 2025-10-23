/**
 * macOS Safari Clone - 高级网页加载系统
 * 支持真实加载任何网站，包括Twitter、Facebook、GitHub等
 */

// 配置
const CONFIG = {
    PROXY_SERVER: 'http://localhost:3001',
    FALLBACK_PROXIES: [
        'https://api.allorigins.win/get?url=',
        'https://cors-anywhere.herokuapp.com/',
        'https://thingproxy.freeboard.io/fetch/'
    ],
    TIMEOUT: 30000,
    MAX_RETRIES: 3
};

/**
 * 实时更新菜单栏上的时间
 */
function updateTime() {
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        const now = new Date();
        const options = { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        };
        timeElement.textContent = now.toLocaleTimeString('zh-CN', options);
    }
}

/**
 * 实现窗口拖拽、聚焦和控制功能
 */
function setupWindow(windowElement) {
    const titleBar = windowElement.querySelector('.window-title-bar');
    let isDragging = false;
    let offsetX, offsetY;

    // 窗口聚焦
    windowElement.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('resize-handle')) return;
        focusWindow(windowElement);
    });

    // 拖拽功能
    titleBar.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - windowElement.offsetLeft;
        offsetY = e.clientY - windowElement.offsetTop;
        e.preventDefault();
        titleBar.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;
        const maxX = window.innerWidth - windowElement.offsetWidth;
        const maxY = window.innerHeight - windowElement.offsetHeight;
        const minMenuY = 24;
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(minMenuY, Math.min(newY, maxY));
        windowElement.style.left = newX + 'px';
        windowElement.style.top = newY + 'px';
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            titleBar.style.cursor = 'grab';
        }
    });

    // 窗口控制按钮
    const closeBtn = windowElement.querySelector('.close-btn');
    const minimizeBtn = windowElement.querySelector('.minimize-btn');
    const maximizeBtn = windowElement.querySelector('.maximize-btn');

    closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeWindow(windowElement);
    });

    minimizeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        minimizeWindow(windowElement);
    });

    maximizeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMaximizeWindow(windowElement);
    });

    // 双击标题栏最大化
    titleBar.addEventListener('dblclick', (e) => {
        if (e.target.classList.contains('control-btn')) return;
        e.preventDefault();
        e.stopPropagation();
        toggleMaximizeWindow(windowElement);
    });
}

/**
 * 窗口管理函数
 */
function focusWindow(windowElement) {
    const allWindows = document.querySelectorAll('.window');
    let maxZIndex = 0;
    
    allWindows.forEach(win => {
        const zIndex = parseInt(win.style.zIndex) || 50;
        if (zIndex > maxZIndex) maxZIndex = zIndex;
        win.classList.remove('focused');
    });

    windowElement.style.zIndex = maxZIndex + 1;
    windowElement.classList.add('focused');
    
    const appName = windowElement.getAttribute('data-app');
    const appNames = {
        'finder': 'Finder',
        'safari': 'Safari',
        'mail': '邮件',
        'trash': 'Finder'
    };
    updateMenuBarAppName(appNames[appName] || 'Finder');
}

function closeWindow(windowElement) {
    if (windowElement.classList.contains('closing')) return;
    
    windowElement.classList.add('closing');
    windowElement.style.transform = 'scale(0.9)';
    windowElement.style.opacity = '0';
    windowElement.style.pointerEvents = 'none';
    
    setTimeout(() => {
        windowElement.style.display = 'none';
        windowElement.classList.remove('closing');
        windowElement.style.transform = 'scale(1)';
        windowElement.style.opacity = '1';
        windowElement.style.pointerEvents = 'auto';
    }, 300);
}

function minimizeWindow(windowElement) {
    if (windowElement.classList.contains('closing')) return;
    
    windowElement.classList.add('closing');
    windowElement.style.transform = 'scale(0.1)';
    windowElement.style.opacity = '0';
    windowElement.style.pointerEvents = 'none';
    
    setTimeout(() => {
        windowElement.style.display = 'none';
        windowElement.classList.remove('closing');
        windowElement.style.transform = 'scale(1)';
        windowElement.style.opacity = '1';
        windowElement.style.pointerEvents = 'auto';
    }, 300);
}

function toggleMaximizeWindow(windowElement) {
    if (windowElement.classList.contains('maximized')) {
        windowElement.classList.remove('maximized');
        const savedWidth = windowElement.dataset.beforeMaxWidth;
        const savedHeight = windowElement.dataset.beforeMaxHeight;
        const savedLeft = windowElement.dataset.beforeMaxLeft;
        const savedTop = windowElement.dataset.beforeMaxTop;
        
        if (savedWidth && savedHeight) {
            windowElement.style.width = savedWidth;
            windowElement.style.height = savedHeight;
            windowElement.style.left = savedLeft || '200px';
            windowElement.style.top = savedTop || '150px';
        } else {
            const appName = windowElement.getAttribute('data-app');
            const defaultSizes = {
                'finder': { width: 700, height: 450 },
                'safari': { width: 800, height: 600 },
                'mail': { width: 900, height: 650 }
            };
            const defaultSize = defaultSizes[appName] || { width: 700, height: 450 };
            windowElement.style.width = defaultSize.width + 'px';
            windowElement.style.height = defaultSize.height + 'px';
            windowElement.style.left = '200px';
            windowElement.style.top = '150px';
        }
        
        delete windowElement.dataset.beforeMaxWidth;
        delete windowElement.dataset.beforeMaxHeight;
        delete windowElement.dataset.beforeMaxLeft;
        delete windowElement.dataset.beforeMaxTop;
    } else {
        windowElement.dataset.beforeMaxWidth = windowElement.style.width;
        windowElement.dataset.beforeMaxHeight = windowElement.style.height;
        windowElement.dataset.beforeMaxLeft = windowElement.style.left;
        windowElement.dataset.beforeMaxTop = windowElement.style.top;
        windowElement.classList.add('maximized');
    }
}

function openWindow(windowElement) {
    if (windowElement.classList.contains('closing')) return;
    
    if (windowElement.style.display === 'none' || !windowElement.style.display) {
        windowElement.style.transform = 'scale(1)';
        windowElement.style.opacity = '1';
        windowElement.classList.add('opening');
        windowElement.style.display = 'block';
        
        setTimeout(() => {
            windowElement.classList.remove('opening');
            focusWindow(windowElement);
        }, 50);
    } else {
        focusWindow(windowElement);
    }
}

/**
 * 应用启动器
 */
function initializeAppLauncher() {
    const launcherTargets = document.querySelectorAll('.desktop-icon, .dock-app');
    const windows = document.querySelectorAll('.window');

    const appWindowMap = {};
    windows.forEach(win => {
        const appName = win.getAttribute('data-app');
        if (appName) {
            appWindowMap[appName] = win;
            setupWindow(win);
        }
    });

    launcherTargets.forEach(target => {
        target.addEventListener('click', () => {
            const appName = target.getAttribute('data-app');
            const targetWindow = appWindowMap[appName];

            if (targetWindow) {
                openWindow(targetWindow);
                const appNames = {
                    'finder': 'Finder',
                    'safari': 'Safari',
                    'mail': '邮件',
                    'trash': 'Finder'
                };
                updateMenuBarAppName(appNames[appName] || 'Finder');
            }
        });
    });
}

/**
 * 高级网页加载系统
 */
class AdvancedWebLoader {
    constructor() {
        this.retryCount = new Map();
        this.loadingCache = new Map();
        this.proxyServerOnline = false;
        this.checkProxyServer();
    }

    async checkProxyServer() {
        try {
            const response = await fetch(`${CONFIG.PROXY_SERVER}/health`, { 
                method: 'GET',
                timeout: 5000 
            });
            this.proxyServerOnline = response.ok;
            console.log('代理服务器状态:', this.proxyServerOnline ? '在线' : '离线');
        } catch (error) {
            this.proxyServerOnline = false;
            console.log('代理服务器离线，将使用备用方案');
        }
    }

    async loadUrl(url) {
        const addressBar = document.querySelector('#safari-window .address-bar');
        if (!addressBar) return;

        // 格式化URL
        let fullUrl = url.trim();
        if (fullUrl && !fullUrl.match(/^(http|https|ftp):\/\//i)) {
            if (fullUrl.includes(' ') || !fullUrl.includes('.')) {
                fullUrl = `https://www.google.com/search?q=${encodeURIComponent(fullUrl)}`;
            } else {
                fullUrl = 'https://' + fullUrl;
            }
        }

        addressBar.value = fullUrl;
        this.showLoading();

        try {
            await this.loadWebpage(fullUrl);
            this.addToHistory(fullUrl);
        } catch (error) {
            console.error('加载失败:', error);
            this.showErrorPage(fullUrl, error.message);
        }
    }

    async loadWebpage(url) {
        const strategies = this.getLoadingStrategies(url);
        
        for (const strategy of strategies) {
            try {
                console.log(`尝试策略: ${strategy.name}`);
                await strategy.execute(url);
                console.log(`策略 ${strategy.name} 成功`);
                return;
            } catch (error) {
                console.log(`策略 ${strategy.name} 失败:`, error.message);
                continue;
            }
        }
        
        throw new Error('所有加载策略都失败了');
    }

    getLoadingStrategies(url) {
        const domain = this.extractDomain(url);
        const strategies = [];

        // 策略1: 本地Puppeteer代理服务器（最强大）
        if (this.proxyServerOnline) {
            strategies.push({
                name: 'Puppeteer代理服务器',
                execute: async (url) => {
                    const response = await fetch(`${CONFIG.PROXY_SERVER}/api/render?url=${encodeURIComponent(url)}`, {
                        method: 'GET',
                        timeout: CONFIG.TIMEOUT
                    });
                    
                    if (!response.ok) {
                        throw new Error(`服务器响应错误: ${response.status}`);
                    }
                    
                    const data = await response.json();
                    if (!data.success) {
                        throw new Error(data.error || '渲染失败');
                    }
                    
                    this.displayContent(data.html, url);
                }
            });

            // 策略2: 本地HTTP代理
            strategies.push({
                name: '本地HTTP代理',
                execute: async (url) => {
                    const response = await fetch(`${CONFIG.PROXY_SERVER}/api/fetch?url=${encodeURIComponent(url)}`, {
                        method: 'GET',
                        timeout: CONFIG.TIMEOUT
                    });
                    
                    if (!response.ok) {
                        throw new Error(`服务器响应错误: ${response.status}`);
                    }
                    
                    const data = await response.json();
                    if (!data.success) {
                        throw new Error(data.error || '获取失败');
                    }
                    
                    this.displayContent(data.html, url);
                }
            });
        }

        // 策略3: 直接iframe加载
        strategies.push({
            name: '直接iframe加载',
            execute: async (url) => {
                return new Promise((resolve, reject) => {
                    const iframe = document.getElementById('safari-iframe');
                    const proxyContent = document.getElementById('safari-proxy-content');
                    
                    if (proxyContent) proxyContent.style.display = 'none';
                    iframe.style.display = 'block';
                    
                    const timeout = setTimeout(() => {
                        reject(new Error('iframe加载超时'));
                    }, 15000);
                    
                    iframe.onload = () => {
                        clearTimeout(timeout);
                        this.hideLoading();
                        resolve();
                    };
                    
                    iframe.onerror = () => {
                        clearTimeout(timeout);
                        reject(new Error('iframe加载错误'));
                    };
                    
                    iframe.src = url;
                });
            }
        });

        // 策略4: 公共CORS代理
        for (const proxyUrl of CONFIG.FALLBACK_PROXIES) {
            strategies.push({
                name: `公共代理: ${proxyUrl}`,
                execute: async (url) => {
                    let requestUrl;
                    if (proxyUrl.includes('allorigins')) {
                        requestUrl = `${proxyUrl}${encodeURIComponent(url)}`;
                    } else {
                        requestUrl = `${proxyUrl}${url}`;
                    }
                    
                    const response = await fetch(requestUrl, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json,text/html,application/xhtml+xml',
                            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
                        },
                        timeout: 10000
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}`);
                    }
                    
                    const contentType = response.headers.get('content-type');
                    let content;
                    
                    if (contentType && contentType.includes('application/json')) {
                        const data = await response.json();
                        content = data.contents || data.data || data;
                    } else {
                        content = await response.text();
                    }
                    
                    if (typeof content === 'string' && content.trim()) {
                        this.displayContent(content, url);
                    } else {
                        throw new Error('获取到空内容');
                    }
                }
            });
        }

        return strategies;
    }

    displayContent(htmlContent, originalUrl) {
        const iframe = document.getElementById('safari-iframe');
        const proxyContent = document.getElementById('safari-proxy-content');
        
        iframe.style.display = 'none';
        proxyContent.style.display = 'block';
        
        const processedContent = this.processHtmlContent(htmlContent, originalUrl);
        const blob = new Blob([processedContent], { type: 'text/html; charset=utf-8' });
        const blobUrl = URL.createObjectURL(blob);
        
        const newIframe = document.createElement('iframe');
        newIframe.src = blobUrl;
        newIframe.style.width = '100%';
        newIframe.style.height = '100%';
        newIframe.style.border = 'none';
        newIframe.style.borderRadius = '0 0 12px 12px';
        newIframe.sandbox = 'allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation-by-user-activation';
        
        newIframe.onload = () => {
            this.hideLoading();
        };
        
        proxyContent.innerHTML = '';
        proxyContent.appendChild(newIframe);
        
        setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
    }

    processHtmlContent(html, baseUrl) {
        try {
            const base = new URL(baseUrl);
            const baseHost = `${base.protocol}//${base.host}`;
            
            let processedHtml = html;
            
            // 添加meta标签和base标签
            if (!processedHtml.includes('<base')) {
                processedHtml = processedHtml.replace(
                    /<head>/i,
                    `<head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <base href="${baseHost}">`
                );
            }
            
            // 修复各种相对路径
            processedHtml = processedHtml.replace(
                /(href|src|action)="\/([^"]*?)"/g,
                `$1="${baseHost}/$2"`
            );
            
            // 添加导航脚本
            const navigationScript = `
                <script>
                document.addEventListener('click', function(e) {
                    const link = e.target.closest('a');
                    if (link && link.href && !link.target) {
                        e.preventDefault();
                        window.parent.postMessage({
                            action: 'navigate',
                            url: link.href
                        }, '*');
                    }
                });
                
                // 修复图片加载失败
                document.addEventListener('error', function(e) {
                    if (e.target.tagName === 'IMG' && e.target.src) {
                        const originalSrc = e.target.src;
                        if (!originalSrc.startsWith('${baseHost}')) {
                            e.target.src = '${baseHost}' + (originalSrc.startsWith('/') ? '' : '/') + originalSrc;
                        }
                    }
                }, true);
                </script>
            `;
            
            processedHtml = processedHtml.replace(
                /<\/body>/i,
                navigationScript + '</body>'
            );
            
            return processedHtml;
        } catch (error) {
            console.error('HTML处理错误:', error);
            return html;
        }
    }

    showLoading() {
        const loadingDiv = document.getElementById('safari-loading');
        const iframe = document.getElementById('safari-iframe');
        const proxyContent = document.getElementById('safari-proxy-content');
        
        if (loadingDiv) loadingDiv.classList.add('show');
        if (iframe) iframe.style.display = 'none';
        if (proxyContent) proxyContent.style.display = 'none';
    }

    hideLoading() {
        const loadingDiv = document.getElementById('safari-loading');
        if (loadingDiv) loadingDiv.classList.remove('show');
    }

    showErrorPage(url, errorMessage) {
        const iframe = document.getElementById('safari-iframe');
        const proxyContent = document.getElementById('safari-proxy-content');
        
        iframe.style.display = 'none';
        proxyContent.style.display = 'block';
        
        const errorHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>无法加载页面</title>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        height: 100vh;
                        margin: 0;
                        background-color: #f5f5f7;
                        color: #1d1d1f;
                        text-align: center;
                        padding: 20px;
                        box-sizing: border-box;
                    }
                    .error-icon { font-size: 64px; margin-bottom: 20px; opacity: 0.5; }
                    h1 { font-size: 24px; font-weight: 600; margin-bottom: 12px; }
                    p { font-size: 16px; line-height: 1.5; color: #6e6e73; margin-bottom: 24px; max-width: 500px; }
                    .url { background-color: #e5e5e7; padding: 8px 12px; border-radius: 6px; font-family: monospace; font-size: 14px; word-break: break-all; margin-bottom: 24px; }
                    .suggestions { text-align: left; max-width: 500px; }
                    .suggestions h3 { font-size: 18px; margin-bottom: 12px; }
                    .suggestions ul { padding-left: 20px; }
                    .suggestions li { margin-bottom: 8px; color: #6e6e73; }
                    .suggestions a { color: #007aff; text-decoration: none; cursor: pointer; }
                    .suggestions a:hover { text-decoration: underline; }
                    .retry-btn { background-color: #007aff; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 16px; cursor: pointer; margin-top: 20px; }
                    .retry-btn:hover { background-color: #0056cc; }
                    .server-status { background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 12px; margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="error-icon">🌐</div>
                <h1>无法加载页面</h1>
                <p>尝试了多种方法仍无法加载请求的页面。</p>
                <div class="url">${url}</div>
                
                ${!this.proxyServerOnline ? `
                <div class="server-status">
                    <strong>⚠️ 代理服务器离线</strong><br>
                    请运行 <code>npm start</code> 启动本地代理服务器以获得最佳体验
                </div>
                ` : ''}
                
                <div class="suggestions">
                    <h3>建议尝试这些网站：</h3>
                    <ul>
                        <li><a onclick="window.parent.postMessage({action: 'navigate', url: 'https://example.com'}, '*')">example.com</a> - 标准测试网站</li>
                        <li><a onclick="window.parent.postMessage({action: 'navigate', url: 'https://httpbin.org'}, '*')">httpbin.org</a> - HTTP 测试服务</li>
                        <li><a onclick="window.parent.postMessage({action: 'navigate', url: 'https://github.com'}, '*')">github.com</a> - 开发者平台</li>
                        <li><a onclick="window.parent.postMessage({action: 'navigate', url: 'https://news.ycombinator.com'}, '*')">news.ycombinator.com</a> - 技术新闻</li>
                    </ul>
                    
                    <h3>错误详情：</h3>
                    <p style="font-family: monospace; background: #f8f9fa; padding: 8px; border-radius: 4px; font-size: 12px;">
                        ${errorMessage}
                    </p>
                </div>
                
                <button class="retry-btn" onclick="window.parent.postMessage({action: 'retry', url: '${url}'}, '*')">
                    重试
                </button>
            </body>
            </html>
        `;
        
        const blob = new Blob([errorHtml], { type: 'text/html' });
        const blobUrl = URL.createObjectURL(blob);
        
        const errorIframe = document.createElement('iframe');
        errorIframe.src = blobUrl;
        errorIframe.style.width = '100%';
        errorIframe.style.height = '100%';
        errorIframe.style.border = 'none';
        errorIframe.style.borderRadius = '0 0 12px 12px';
        
        proxyContent.innerHTML = '';
        proxyContent.appendChild(errorIframe);
        
        this.hideLoading();
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    }

    extractDomain(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname.replace('www.', '');
        } catch (error) {
            return '';
        }
    }

    addToHistory(url) {
        if (browserHistory.length === 0 || browserHistory[browserHistory.length - 1] !== url) {
            browserHistory.push(url);
            currentHistoryIndex = browserHistory.length - 1;
            updateNavigationButtons();
        }
    }
}

// 浏览器历史记录
let browserHistory = [];
let currentHistoryIndex = -1;

function updateNavigationButtons() {
    const backBtn = document.querySelector('#safari-window .back-btn');
    const forwardBtn = document.querySelector('#safari-window .forward-btn');
    
    if (!backBtn || !forwardBtn) return;

    if (currentHistoryIndex > 0) {
        backBtn.classList.remove('disabled');
    } else {
        backBtn.classList.add('disabled');
    }
    
    if (currentHistoryIndex < browserHistory.length - 1) {
        forwardBtn.classList.remove('disabled');
    } else {
        forwardBtn.classList.add('disabled');
    }
}

function goBack() {
    if (currentHistoryIndex > 0) {
        currentHistoryIndex--;
        const url = browserHistory[currentHistoryIndex];
        webLoader.loadUrl(url);
        updateNavigationButtons();
    }
}

function goForward() {
    if (currentHistoryIndex < browserHistory.length - 1) {
        currentHistoryIndex++;
        const url = browserHistory[currentHistoryIndex];
        webLoader.loadUrl(url);
        updateNavigationButtons();
    }
}

// 全局网页加载器实例
let webLoader;

/**
 * 初始化 Safari 导航事件
 */
function setupSafariNavigation() {
    const safariWindow = document.getElementById('safari-window');
    if (!safariWindow) return;

    webLoader = new AdvancedWebLoader();

    const addressBar = safariWindow.querySelector('.address-bar');
    const backBtn = safariWindow.querySelector('.back-btn');
    const forwardBtn = safariWindow.querySelector('.forward-btn');

    // 地址栏输入
    addressBar.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            webLoader.loadUrl(addressBar.value);
            addressBar.blur();
        }
    });

    // 导航按钮
    backBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!backBtn.classList.contains('disabled')) {
            goBack();
        }
    });

    forwardBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!forwardBtn.classList.contains('disabled')) {
            goForward();
        }
    });

    // 监听iframe消息
    window.addEventListener('message', (event) => {
        if (event.data && event.data.action === 'retry') {
            webLoader.loadUrl(event.data.url);
        } else if (event.data && event.data.action === 'navigate') {
            webLoader.loadUrl(event.data.url);
        }
    });

    // 初始加载
    const initialUrl = 'https://example.com';
    webLoader.loadUrl(initialUrl);
}

/**
 * 邮件应用功能
 */
function setupMailApp() {
    const mailWindow = document.getElementById('mail-window');
    if (!mailWindow) return;

    const mailboxItems = mailWindow.querySelectorAll('.mailbox-item');
    mailboxItems.forEach(item => {
        item.addEventListener('click', () => {
            mailboxItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            const mailboxName = item.querySelector('.mailbox-name').textContent;
            const listHeader = mailWindow.querySelector('.mail-list-header h2');
            if (listHeader) {
                listHeader.textContent = mailboxName;
            }
        });
    });

    const mailItems = mailWindow.querySelectorAll('.mail-item');
    mailItems.forEach(item => {
        item.addEventListener('click', () => {
            mailItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            item.classList.remove('unread');
        });
    });

    const newMailBtn = mailWindow.querySelector('.mail-btn.primary');
    if (newMailBtn) {
        newMailBtn.addEventListener('click', () => {
            showNotification('新建邮件功能开发中...');
        });
    }
}

/**
 * 显示通知
 */
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 50px;
        right: 20px;
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 13px;
        z-index: 10000;
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

/**
 * 更新菜单栏应用名称
 */
function updateMenuBarAppName(appName) {
    const appNameElement = document.querySelector('.app-name');
    if (appNameElement) {
        appNameElement.textContent = appName;
    }
}

/**
 * 初始化系统状态
 */
function initializeSystem() {
    const appleLogo = document.querySelector('.apple-logo');
    if (appleLogo) {
        appleLogo.textContent = '';
    }

    const windows = document.querySelectorAll('.window');
    windows.forEach(win => {
        if (win.id !== 'finder-window') {
            win.style.display = 'none';
        }
    });

    const finderWindow = document.getElementById('finder-window');
    if (finderWindow) {
        focusWindow(finderWindow);
    }
}

// 主初始化
document.addEventListener('DOMContentLoaded', () => {
    initializeSystem();
    updateTime();
    setInterval(updateTime, 1000);
    initializeAppLauncher();
    setupSafariNavigation();
    setupMailApp();
});