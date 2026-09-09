# backend(Apollo Server) と frontend(React) の両サービスで共有する開発用イメージ。
# Prisma が musl(Alpine) では binaryTargets の明示指定を要するため Debian を採用。
FROM node:24-bookworm-slim

# Prisma が実行時に必要とする OpenSSL、証明書、開発用に git を入れる
RUN apt-get update && apt-get install -y --no-install-recommends \
      openssl \
      ca-certificates \
      git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 4000: Apollo Server / 5173: Vite dev server（ドキュメント目的。実際の公開は compose.yaml 側）
EXPOSE 4000 5173
