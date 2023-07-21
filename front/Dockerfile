FROM node:18-slim as base

WORKDIR /usr/src/front

COPY package.json .
COPY .env.example .

RUN npm install

COPY . .


#################
## DEVELOPMENT ##
#################

FROM base as development

CMD ["npm", "run", "start"]


###########
## BUILD ##
###########

FROM base as build

RUN npm run build 

################
## PRODUCTION ##
################

FROM nginx as production

#Copy production build files from build phase to nginx
COPY --from=build /usr/src/front/build /usr/share/nginx/html