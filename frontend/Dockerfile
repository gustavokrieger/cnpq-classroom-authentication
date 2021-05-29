FROM node:14.17.0

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .
RUN yarn install --production
RUN yarn add serve@11.3.2
