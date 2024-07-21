FROM node:18-slim as base

WORKDIR /usr/src/api

COPY package*.json ./

#################
## DEVELOPMENT ##
#################

FROM base as development

ENV NODE_ENV=development

RUN npm install

COPY . .

CMD [ "npm", "run", "start:dev" ]

################
## PRODUCTION ##
################

FROM base AS production

ENV NODE_ENV=production

RUN npm install --production

COPY . .

RUN npm install -g @nestjs/cli

RUN npm build

CMD [ "npm", "run", "start:prod" ]