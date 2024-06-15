# 使用 Node.js 16.18.0-alpine 作为基础镜像
FROM node:20.5.0-alpine as frontend

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

# 打包构建
RUN pnpm build

FROM nginx:alpine

# 将构建后的代码复制到 nginx 镜像中
COPY --from=frontend /app/dist /usr/share/nginx/html/xlsx-replace-web

#设置时区
RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo 'Asia/Shanghai' >/etc/timezone

# COPY dist  /usr/share/nginx/html/dist
#将当前Dockerfile文件同级的nginx.conf文件拷贝到容器内部的 /etc/nginx/nginx.conf
#如果没有会创建，如果有会覆盖
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露容器的 8080 端口，此处其实只是一个声明作用，不写的话也可以，后面运行容器的
EXPOSE 80

# 启动 nginx 服务
CMD ["nginx", "-g", "daemon off;"]
