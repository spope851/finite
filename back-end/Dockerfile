FROM node

RUN mkdir -p /app

COPY ./src /app

WORKDIR "/app"

RUN yarn

CMD ["yarn", "start"]