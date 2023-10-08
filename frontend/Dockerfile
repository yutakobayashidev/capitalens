FROM node:18-buster-slim AS base

RUN apt-get update -y && apt-get install -y openssl

FROM base AS dev
ENV NODE_ENV=development
WORKDIR /app
COPY package.json ./
COPY bun.lockb ./
RUN ["npm", "install", "-g", "bun"]
RUN ["bun", "install"]
