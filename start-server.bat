@echo off
echo 🚀 启动 macOS Safari Clone 代理服务器
echo ==================================

REM 检查Node.js是否安装
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js 未安装，请先安装 Node.js
    echo    下载地址: https://nodejs.org/
    pause
    exit /b 1
)

REM 检查npm是否安装
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm 未安装，请先安装 npm
    pause
    exit /b 1
)

echo ✅ Node.js 版本:
node --version
echo ✅ npm 版本:
npm --version

REM 检查是否已安装依赖
if not exist "node_modules" (
    echo 📦 安装依赖包...
    npm install
    
    if %errorlevel% neq 0 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
    
    echo ✅ 依赖安装完成
)

REM 启动服务器
echo 🌐 启动代理服务器...
echo    服务器地址: http://localhost:3001
echo    健康检查: http://localhost:3001/health
echo.
echo 💡 提示: 按 Ctrl+C 停止服务器
echo.

node proxy-server.js

pause