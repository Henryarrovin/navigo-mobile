FROM oven/bun:latest

WORKDIR /app

COPY bun.lock . 
COPY package.json .

RUN bun install --frozen-lockfile

COPY . .

EXPOSE 8081 19000 19001 19002

CMD ["bunx", "expo", "start", "--tunnel"]
