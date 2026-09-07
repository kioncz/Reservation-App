FROM node:22-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN corepack enable && \
    corepack prepare pnpm@11.5.2 --activate && \
    pnpm install --frozen-lockfile --ignore-scripts

COPY . .

EXPOSE 3000
CMD ["pnpm", "start"]