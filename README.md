# macOS Safari Clone - 终极版

一个功能完整的macOS Safari浏览器克隆，支持真实加载任何网站，包括Twitter、Facebook、GitHub等通常无法在iframe中显示的网站。

## 🚀 核心特性

### 真实网页加载
- **Puppeteer渲染引擎** - 使用无头Chrome浏览器完整渲染页面
- **智能代理系统** - 多层代理策略，绕过所有CORS和X-Frame-Options限制
- **资源路径修复** - 自动修复相对路径、CSS、JavaScript和图片链接
- **交互式导航** - 支持页面内链接点击和表单提交

### macOS原生体验
- **完美的窗口管理** - 拖拽、调整大小、最大化、最小化
- **Dock交互** - 真实的macOS Dock体验
- **菜单栏** - 动态更新的菜单栏和状态显示
- **动画效果** - 流畅的窗口动画和过渡效果

### 高级功能
- **智能重试机制** - 自动重试失败的请求
- **网络状态检测** - 实时监控网络连接状态
- **浏览历史** - 完整的前进/后退功能
- **错误处理** - 详细的错误信息和建议

## 📋 系统要求

在开始之前，请确保你的系统满足以下要求：

- **Node.js** 16.0 或更高版本
- **npm** 7.0 或更高版本  
- **现代浏览器** (Chrome 90+, Firefox 88+, Safari 14+)
- **操作系统**: Windows 10+, macOS 10.15+, 或 Linux
- **内存**: 至少 4GB RAM (推荐 8GB+)
- **网络**: 稳定的互联网连接

### 检查系统要求

打开终端/命令提示符，运行以下命令检查：

```bash
# 检查 Node.js 版本
node --version
# 应该显示 v16.0.0 或更高

# 检查 npm 版本  
npm --version
# 应该显示 7.0.0 或更高
```

如果没有安装 Node.js，请访问 [https://nodejs.org/](https://nodejs.org/) 下载安装。

## 📦 详细安装步骤

### 步骤 1: 下载项目文件

确保你有以下文件在同一个文件夹中：
- `Safari.html` - 主页面文件
- `styles.css` - 样式文件
- `script.js` - 前端JavaScript
- `proxy-server.js` - 代理服务器
- `package.json` - 依赖配置
- `start-server.sh` - Linux/macOS启动脚本
- `start-server.bat` - Windows启动脚本
- `README.md` - 说明文档

### 步骤 2: 选择安装方法

#### 方法 A: 自动安装（推荐）

**在 Linux/macOS 上：**
```bash
# 1. 打开终端，进入项目文件夹
cd /path/to/your/project

# 2. 给启动脚本执行权限
chmod +x start-server.sh

# 3. 运行启动脚本
./start-server.sh
```

**在 Windows 上：**
```cmd
# 1. 打开命令提示符，进入项目文件夹
cd C:\path\to\your\project

# 2. 运行启动脚本
start-server.bat
```

#### 方法 B: 手动安装

```bash
# 1. 进入项目文件夹
cd /path/to/your/project

# 2. 安装依赖包
npm install

# 3. 启动代理服务器
npm start
```

### 步骤 3: 验证安装

如果安装成功，你应该看到类似以下的输出：

```
🚀 启动 macOS Safari Clone 代理服务器
==================================
✅ Node.js 版本: v18.17.0
✅ npm 版本: 9.6.7
📦 安装依赖包...
✅ 依赖安装完成
🌐 启动代理服务器...
   服务器地址: http://localhost:3001
   健康检查: http://localhost:3001/health

代理服务器运行在 http://localhost:3001
Puppeteer浏览器已启动
```

### 步骤 4: 打开Safari界面

1. **保持代理服务器运行** - 不要关闭终端窗口
2. **打开浏览器** - 使用Chrome、Firefox或Safari
3. **打开Safari.html文件**：
   - 方法1: 直接双击 `Safari.html` 文件
   - 方法2: 在浏览器中按 `Ctrl+O` (Windows) 或 `Cmd+O` (macOS)，选择 `Safari.html`
   - 方法3: 将 `Safari.html` 拖拽到浏览器窗口中

## 🎯 详细使用教程

### 第一次使用

1. **启动系统**
   - 确保代理服务器正在运行（终端显示"代理服务器运行在..."）
   - 在浏览器中打开 `Safari.html`

2. **界面介绍**
   - **菜单栏**（顶部）: 显示当前应用名称和系统状态
   - **Dock**（底部）: 包含Finder、Safari、邮件等应用图标
   - **窗口区域**（中间）: 显示打开的应用窗口

3. **打开Safari浏览器**
   - 点击Dock中的Safari图标（地球图标）
   - Safari窗口将会打开

### 浏览网页

1. **输入网址**
   - 点击Safari窗口中的地址栏
   - 输入完整网址，例如：`https://github.com`
   - 按 `Enter` 键开始加载

2. **搜索内容**
   - 在地址栏输入搜索词，例如：`macOS clone`
   - 按 `Enter` 键，系统会自动使用Google搜索

3. **加载过程**
   - 系统会显示加载动画
   - 自动尝试多种加载策略：
     1. Puppeteer渲染（最强大）
     2. 本地HTTP代理
     3. 直接iframe加载
     4. 公共CORS代理

4. **浏览网页**
   - 页面加载完成后，你可以：
     - 点击链接导航到其他页面
     - 滚动查看内容
     - 使用前进/后退按钮

### 窗口操作

1. **移动窗口**
   - 点击并拖拽窗口标题栏

2. **调整窗口大小**
   - 将鼠标移到窗口边缘或角落
   - 当鼠标变成调整大小图标时，拖拽调整

3. **最大化窗口**
   - 双击标题栏，或
   - 点击绿色的最大化按钮

4. **最小化窗口**
   - 点击黄色的最小化按钮

5. **关闭窗口**
   - 点击红色的关闭按钮

### 导航功能

1. **前进/后退**
   - 使用Safari工具栏中的 ◀ 和 ▶ 按钮
   - 或使用浏览器的前进/后退快捷键

2. **刷新页面**
   - 重新输入网址并按Enter
   - 或点击错误页面中的"重试"按钮

3. **新标签页**
   - 目前每次输入新网址会在同一窗口中加载
   - 可以打开多个Safari窗口来模拟多标签页

## 🌐 推荐测试网站

### 基础测试网站
```
https://example.com          # 标准测试网站
https://httpbin.org          # HTTP测试服务  
https://jsonplaceholder.typicode.com  # API测试
```

### 社交媒体平台
```
https://twitter.com          # Twitter/X
https://github.com           # GitHub
https://stackoverflow.com    # StackOverflow
https://reddit.com           # Reddit
https://news.ycombinator.com # Hacker News
```

### 新闻和内容网站
```
https://cnn.com              # CNN新闻
https://bbc.com              # BBC新闻
https://medium.com           # Medium博客
https://dev.to               # 开发者社区
```

### 注意事项
- 某些网站可能需要几秒钟加载时间
- 如果网站无法加载，系统会显示详细的错误信息
- 建议先测试基础网站，确保系统正常工作

## 🛠️ 故障排除指南

### 常见问题及解决方案

#### 问题1: 代理服务器无法启动

**症状**: 运行启动脚本时出现错误
```
Error: Cannot find module 'express'
或
Error: listen EADDRINUSE :::3001
```

**解决方案**:
```bash
# 1. 删除node_modules文件夹
rm -rf node_modules

# 2. 清除npm缓存
npm cache clean --force

# 3. 重新安装依赖
npm install

# 4. 如果端口被占用，查找并关闭占用进程
# Linux/macOS:
lsof -i :3001
kill -9 [进程ID]

# Windows:
netstat -ano | findstr :3001
taskkill /PID [进程ID] /F
```

#### 问题2: 网站加载失败

**症状**: 显示"无法加载页面"错误

**解决方案**:
1. **检查代理服务器状态**
   - 访问 `http://localhost:3001/health`
   - 应该显示 `{"status":"ok","puppeteer":"running"}`

2. **检查网络连接**
   ```bash
   # 测试网络连接
   ping google.com
   ```

3. **尝试基础网站**
   - 先测试 `https://example.com`
   - 再测试 `https://httpbin.org`

4. **查看详细错误**
   - 打开浏览器开发者工具 (F12)
   - 查看Console标签页中的错误信息

#### 问题3: Puppeteer安装失败

**症状**: 
```
Error: Failed to launch the browser process
或
Error downloading Chromium
```

**解决方案**:
```bash
# 1. 设置Puppeteer环境变量（如果在中国）
export PUPPETEER_DOWNLOAD_HOST=https://npm.taobao.org/mirrors

# 2. 重新安装Puppeteer
npm uninstall puppeteer
npm install puppeteer

# 3. 或者使用淘宝镜像
npm install puppeteer --registry=https://registry.npm.taobao.org
```

#### 问题4: 页面显示不完整

**症状**: 网页加载但样式错乱或图片不显示

**解决方案**:
1. **等待更长时间** - 某些网站需要10-15秒加载
2. **刷新页面** - 重新输入网址
3. **尝试不同网站** - 确认系统正常工作

#### 问题5: 内存使用过高

**症状**: 系统变慢，内存占用很高

**解决方案**:
```bash
# 1. 重启代理服务器
# 按 Ctrl+C 停止服务器，然后重新运行启动脚本

# 2. 关闭不必要的浏览器标签页

# 3. 增加系统内存或使用更强大的设备
```

### 性能优化建议

1. **系统要求**
   - 推荐 8GB+ 内存
   - 现代CPU (Intel i5+ 或 AMD Ryzen 5+)
   - SSD硬盘

2. **浏览器优化**
   - 使用Chrome浏览器获得最佳性能
   - 关闭不必要的浏览器扩展
   - 定期清理浏览器缓存

3. **网络优化**
   - 使用稳定的网络连接
   - 避免使用VPN（可能影响代理功能）

## 🔧 高级配置

### 自定义代理服务器端口

编辑 `script.js` 文件，修改配置：
```javascript
const CONFIG = {
    PROXY_SERVER: 'http://localhost:3001',  // 修改端口号
    TIMEOUT: 30000,                         // 请求超时时间(毫秒)
    MAX_RETRIES: 3                          // 最大重试次数
};
```

同时修改 `proxy-server.js` 文件：
```javascript
const PORT = 3001; // 修改为相同的端口号
```

### 添加自定义代理服务

在 `proxy-server.js` 中添加新的API端点：
```javascript
app.get('/api/custom', async (req, res) => {
    const { url } = req.query;
    // 自定义代理逻辑
    try {
        // 你的代理实现
        res.json({ success: true, html: processedHtml });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
```

### 修改用户代理

编辑 `proxy-server.js`，修改用户代理字符串：
```javascript
await page.setUserAgent('你的自定义用户代理字符串');
```

## 📊 系统监控

### 检查系统状态

1. **代理服务器健康检查**
   ```bash
   curl http://localhost:3001/health
   ```

2. **查看服务器日志**
   - 代理服务器的终端窗口会显示详细日志
   - 包括请求信息、错误信息等

3. **监控资源使用**
   ```bash
   # Linux/macOS
   top -p $(pgrep node)
   
   # Windows
   tasklist | findstr node
   ```

### 日志分析

代理服务器会输出以下类型的日志：
- `✅ 成功信息` - 正常操作
- `⚠️ 警告信息` - 非致命错误
- `❌ 错误信息` - 需要注意的问题
- `🔍 调试信息` - 详细的操作过程

## 🌐 支持的网站类型

### 完全支持（通过Puppeteer渲染）
- **社交媒体**: Twitter/X, Facebook, Instagram, LinkedIn, TikTok
- **开发平台**: GitHub, GitLab, StackOverflow, CodePen, JSFiddle
- **新闻媒体**: CNN, BBC, Reddit, Medium, Hacker News
- **视频平台**: YouTube, Vimeo, Bilibili
- **电商网站**: Amazon, eBay, 淘宝
- **搜索引擎**: Google, Bing, DuckDuckGo
- **其他**: 几乎所有现代网站

### 部分支持
- **银行网站** - 可能有额外的安全限制
- **政府网站** - 某些功能可能受限
- **需要登录的网站** - 无法保持登录状态

### 不支持
- **需要特殊插件的网站** (Flash, Java Applets等)
- **需要特定浏览器的网站**
- **有严格反爬虫机制的网站**

## 📝 完整使用流程总结

### 快速开始（5分钟设置）

1. **准备工作**
   ```bash
   # 确认系统要求
   node --version  # 需要 v16.0+
   npm --version   # 需要 v7.0+
   ```

2. **启动系统**
   ```bash
   # Linux/macOS
   chmod +x start-server.sh
   ./start-server.sh
   
   # Windows
   start-server.bat
   ```

3. **打开界面**
   - 双击 `Safari.html` 文件
   - 或在浏览器中打开该文件

4. **开始浏览**
   - 点击Dock中的Safari图标
   - 输入网址，按Enter
   - 享受真实的网页浏览体验！

### 详细操作步骤

#### 第一步: 启动代理服务器
1. 打开终端/命令提示符
2. 进入项目文件夹
3. 运行启动脚本
4. 等待看到"代理服务器运行在 http://localhost:3001"

#### 第二步: 打开Safari界面
1. 保持代理服务器运行（不要关闭终端）
2. 打开浏览器（推荐Chrome）
3. 打开 `Safari.html` 文件

#### 第三步: 使用Safari浏览器
1. 点击底部Dock中的Safari图标（🌐）
2. Safari窗口会打开
3. 在地址栏输入网址，例如：
   - `github.com`
   - `twitter.com`  
   - `stackoverflow.com`
4. 按Enter键开始加载

#### 第四步: 浏览网页
1. 等待页面加载（可能需要5-15秒）
2. 页面加载完成后可以：
   - 点击链接导航
   - 滚动查看内容
   - 使用前进/后退按钮

### 常用操作快捷方式

| 操作 | 方法 |
|------|------|
| 打开新网页 | 在地址栏输入URL，按Enter |
| 前进 | 点击 ▶ 按钮 |
| 后退 | 点击 ◀ 按钮 |
| 刷新页面 | 重新输入网址 |
| 最大化窗口 | 双击标题栏 |
| 移动窗口 | 拖拽标题栏 |
| 调整窗口大小 | 拖拽窗口边缘 |
| 关闭窗口 | 点击红色按钮 |

## 🔧 技术架构详解

### 系统组件

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Safari.html   │    │   proxy-server   │    │   Target Site   │
│   (前端界面)     │◄──►│   (代理服务器)    │◄──►│   (目标网站)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌──────────────────┐
│    script.js    │    │   Puppeteer      │
│   (客户端逻辑)   │    │   (浏览器引擎)    │
└─────────────────┘    └──────────────────┘
```

### 加载流程

1. **用户输入URL** → Safari界面
2. **发送请求** → 本地代理服务器
3. **策略选择** → 自动选择最佳加载方法
4. **内容获取** → Puppeteer渲染或HTTP代理
5. **内容处理** → 修复路径、注入脚本
6. **显示结果** → 在Safari窗口中显示

### 项目文件说明

```
macOS-Safari-Clone/
├── Safari.html              # 🖥️ 主界面文件
├── styles.css              # 🎨 样式文件
├── script.js               # ⚡ 前端JavaScript
├── proxy-server.js         # 🔧 代理服务器
├── package.json            # 📦 依赖配置
├── start-server.sh         # 🐧 Linux/macOS启动脚本
├── start-server.bat        # 🪟 Windows启动脚本
└── README.md              # 📖 说明文档
```

## 🚨 重要注意事项

### 安全提醒
- 本项目仅用于学习和演示目的
- 不要用于访问敏感或私人信息
- 代理服务器会记录访问日志
- 建议在安全的网络环境中使用

### 性能提醒
- Puppeteer会消耗较多内存和CPU
- 建议关闭不必要的其他程序
- 某些复杂网站可能需要较长加载时间
- 定期重启代理服务器以释放内存

### 兼容性提醒
- 某些网站可能有反爬虫机制
- 部分功能可能在不同浏览器中表现不同
- 建议使用最新版本的Chrome浏览器

## 🆘 获取帮助

如果遇到问题，请按以下顺序尝试：

1. **查看故障排除指南** - 本文档的故障排除部分
2. **检查系统要求** - 确保Node.js和npm版本正确
3. **查看终端日志** - 代理服务器会输出详细错误信息
4. **尝试基础网站** - 先测试 `example.com` 确保系统正常
5. **重启系统** - 关闭所有程序，重新开始

### 调试模式

启用详细日志输出：
```bash
# 设置环境变量启用调试模式
export DEBUG=*
npm start
```

## 🎉 成功标志

当你看到以下情况时，说明系统运行正常：

✅ **代理服务器启动成功**
```
代理服务器运行在 http://localhost:3001
Puppeteer浏览器已启动
```

✅ **Safari界面正常显示**
- 可以看到macOS风格的桌面
- Dock中有应用图标
- 菜单栏显示时间

✅ **网页加载成功**
- 能够访问 `https://example.com`
- 页面内容正常显示
- 链接可以点击

✅ **窗口操作正常**
- 可以拖拽移动窗口
- 可以调整窗口大小
- 前进/后退按钮工作正常

---

**🎊 恭喜！你现在可以使用这个强大的macOS Safari克隆来浏览任何网站了！**