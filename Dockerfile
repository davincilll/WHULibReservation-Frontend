# 使用 Node.js 官方镜像作为基础镜像
FROM node:20

# 设置工作目录
WORKDIR /app

# 复制项目文件
COPY . .


# 安装依赖
RUN yarn install



# 构建 Nuxt 应用
RUN yarn build

# 设置环境变量
ENV HOST=0.0.0.0
ENV PORT=3000

# 暴露应用端口
EXPOSE 3000

# 启动应用
CMD ["yarn", "start"]
