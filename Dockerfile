FROM oven/bun:latest

WORKDIR /app

COPY bun.lock . 
COPY package.json .

# RUN bun install --frozen-lockfile
RUN bun install --frozen-lockfile && bun add -d @expo/ngrok

COPY . .

EXPOSE 8081 19000 19001 19002

CMD ["bunx", "expo", "start", "--tunnel", "--clear", "--no-dev"]
