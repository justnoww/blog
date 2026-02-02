# Stage 1: Install dependencies and build the project
# 使用一个包含 Node.js 环境的官方镜像作为构建阶段的基础
FROM local/node:20 AS builder
# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json 文件，并安装依赖
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# 复制项目所有文件
COPY . .

# 执行 Next.js 构建命令
# next build 会将独立运行所需的文件输出到 .next/standalone 目录
RUN npm run build

# Stage 2: Create the production image
# 使用一个更轻量级的 Node.js 镜像作为运行阶段的基础
FROM local/node:20 AS runner

# 设置工作目录
WORKDIR /app

# 设置环境变量，指示 Next.js 在生产模式下运行
ENV NODE_ENV production

# 复制 standalone 构建产物、public 文件夹和 .next/static 文件夹
# 确保 Next.js 在独立模式下运行所需的所有文件都已复制
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

# 暴露 Next.js 应用监听的端口
EXPOSE 33000

# 定义容器启动时执行的命令
# Next.js 在 standalone 模式下会生成一个 server.js 文件作为入口
CMD ["node", "server.js"]
