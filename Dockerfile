FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="file:./build.db"
RUN npx prisma generate && npx prisma db push && npm run build

FROM node:20-alpine
WORKDIR /usr/src/app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="file:/data/app.db"
COPY --from=builder /usr/src/app ./
RUN mkdir -p /data
EXPOSE 3000
CMD ["sh", "-c", "npx prisma db push && npx prisma db seed && npm start"]
