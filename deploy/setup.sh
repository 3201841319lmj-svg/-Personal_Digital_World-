#!/usr/bin/env bash
# ==============================================================================
# OpenClaw One-Click Deployment Script for AI Home Farm on Tencent Cloud
# ==============================================================================

set -e

echo "🚀 [OpenClaw Deploy] 正在为您自动安装依赖并编译打包..."
npm install
npm run build

echo "📦 [OpenClaw Deploy] 准备发布静态资源至 Web 目录 /var/www/ai-home-farm/dist..."
sudo mkdir -p /var/www/ai-home-farm
sudo rm -rf /var/www/ai-home-farm/dist
sudo cp -r dist /var/www/ai-home-farm/

echo "🛠️ [OpenClaw Deploy] 正在同步 Nginx 配置文件..."
if [ -d "/etc/nginx/conf.d" ]; then
    sudo cp deploy/nginx.conf /etc/nginx/conf.d/ai-farm.conf
    echo "🔄 检查 Nginx 配置并平滑重启..."
    sudo nginx -t && sudo nginx -s reload || sudo systemctl reload nginx
    echo "✅ 部署完成！织梦农场已成功在腾讯云轻量服务器上线运行！"
else
    echo "⚠️ 提醒：未查找到 /etc/nginx/conf.d 路径，请确认服务器已安装 Nginx。"
fi
