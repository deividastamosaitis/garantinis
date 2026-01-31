FROM node:18-alpine

WORKDIR /app

COPY package.json ./
COPY tsconfig.base.json ./
COPY apps/web/package.json ./apps/web/package.json

RUN npm install

COPY apps/web ./apps/web

RUN npm run -w apps/web build

EXPOSE 3000

CMD ["npm", "run", "-w", "apps/web", "start"]
