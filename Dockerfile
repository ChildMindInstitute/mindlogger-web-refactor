
FROM node:20.11.0

WORKDIR /home/node

COPY package*.json ./

COPY yarn*.lock ./

COPY tsconfig*.json ./

RUN yarn install

COPY . ./

RUN yarn run build