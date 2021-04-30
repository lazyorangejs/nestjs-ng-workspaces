ARG app_name=superhero-api

FROM node:fermium-alpine

ENV                                     APP_ENV=production NODE_ENV=production
ENV                                     PORT=3000
ENV                                     WORKDIR /usr/src/app
ENV                                     APP_NAME=${app_name}

# unfortunately, we cannot use the environment variable in health check command
# HEALTHCHECK --interval=10s --timeout=5s --start-period=3s --retries=3 CMD curl --fail http://localhost:2021/liveness || exit 1

WORKDIR                                 $WORKDIR

COPY .npmrc *.json                      $WORKDIR/
COPY ./dist                             $WORKDIR

WORKDIR                                 $WORKDIR/dist/apps/${app_name}

RUN npm ci --production

EXPOSE                                  $PORT

CMD ["node", "main"]
