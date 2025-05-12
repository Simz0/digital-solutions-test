FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci                                 # точные версии turn0search6

FROM node:20-alpine AS runner
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser                               # non-root turn0search6
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
EXPOSE 8443
CMD ["npm", "run", "start"]
