FROM node:20.14.0-alpine as frontend

# 将当前工作目录设置为/app
WORKDIR /app

RUN npm config set registry https://registry.npmmirror.com

# 运行 npm install 安装依赖
RUN npm install pnpm -g

# 将 package.json 和 package-lock.json 复制到 /app 目录下
COPY package*.json ./

RUN pnpm install

# 将源代码复制到 /app 目录下
COPY . .

CMD ls -al 

# 打包构建
# RUN pnpm build
