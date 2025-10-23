#!/bin/bash

echo "🚀 启动 macOS Safari Clone 代理服务器"
echo "=================================="

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    echo "   下载地址: https://nodejs.org/"
    exit 1
fi

# 检查npm是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装，请先安装 npm"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"
echo "✅ npm 版本: $(npm --version)"

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖包..."
    npm install
    
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败"
        exit 1
    fi
    
    echo "✅ 依赖安装完成"
fi

# 启动服务器
echo "🌐 启动代理服务器..."
echo "   服务器地址: http://localhost:3001"
echo "   健康检查: http://localhost:3001/health"
echo ""
echo "💡 提示: 按 Ctrl+C 停止服务器"
echo ""

node proxy-server.js