FROM node:20-alpine AS prod-deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:20-alpine AS dev-deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS test
WORKDIR /app
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .
CMD ["npm", "test", "--", "--forceExit"]

FROM node:20-alpine AS production
WORKDIR /app
COPY --from=prod-deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3002
CMD ["node", "server.js"]