FROM node:18-alpine

WORKDIR /app

COPY package.json ./
COPY tsconfig.base.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY packages/db/package.json ./packages/db/package.json

RUN npm install

COPY packages/db ./packages/db
COPY apps/api ./apps/api

RUN npm run -w packages/db prisma:generate
RUN npm run -w packages/db build
RUN npm run -w apps/api build

EXPOSE 4000

CMD ["sh", "-c", "npx prisma migrate deploy --schema=packages/db/prisma/schema.prisma && node apps/api/dist/index.js"]
