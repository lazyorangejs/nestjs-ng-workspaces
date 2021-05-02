FROM node:fermium-alpine

ENV                                     APP_ENV=production NODE_ENV=production
ENV                                     PORT=3000
ENV                                     WORKDIR /usr/src/app

# unfortunately, we cannot use the environment variable in health check command
# HEALTHCHECK --interval=10s --timeout=5s --start-period=3s --retries=3 CMD curl --fail http://localhost:2021/liveness || exit 1

WORKDIR                                 $WORKDIR

COPY .npmrc *.json                      $WORKDIR/
COPY ./dist                             $WORKDIR/dist

COPY package-lock.json                  ${WORKDIR}/dist/apps/app
COPY package-lock.json                  ${WORKDIR}/dist/apps/superhero-api

RUN npm ci --prefix=./dist/apps/app --production
RUN npm ci --prefix=./dist/apps/superhero-api --production

WORKDIR                                 $WORKDIR/dist/apps/app/

EXPOSE                                  $PORT

CMD ["node", "main"]
