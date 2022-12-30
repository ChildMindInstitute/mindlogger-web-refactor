FROM node:18

WORKDIR /usr/src/app

COPY . .

RUN yarn install
RUN yarn build

CMD [ "yarn", "dev" ]