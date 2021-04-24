FROM node:fermium-alpine as build

ENV           WORKDIR=/usr/src/app
ENV           NODE_ENV=development
ENV           BLUEBIRD_DEBUG=0
WORKDIR       $WORKDIR

COPY .npmrc package.json package-lock.json ./

RUN npm ci

COPY . $WORKDIR/

RUN npm run build

FROM node:fermium-alpine as production

ENV                                     APP_ENV=production
ENV                                     PORT=3000
ENV                                     WORKDIR /usr/src/app

# unfortunately, we cannot use the environment variable in health check command
# HEALTHCHECK --interval=10s --timeout=5s --start-period=3s --retries=3 CMD curl --fail http://localhost:2021/liveness || exit 1

WORKDIR                                 $WORKDIR

COPY .npmrc package.json                $WORKDIR/
COPY --from=build $WORKDIR/dist         $WORKDIR/dist

EXPOSE                                  $PORT

CMD ["node", "./dist/apps/app/main"]
