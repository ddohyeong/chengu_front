# 1단계: 빌드
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2단계: 실행 (Nginx)
FROM nginx:stable-alpine
# 빌드 결과물 복사 (Vite는 dist, CRA는 build)
COPY --from=build /app/dist /usr/share/nginx/html

# ★ 중요: 루트에 있는 nginx.conf를 컨테이너 설정 폴더로 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 50033
CMD ["nginx", "-g", "daemon off;"]