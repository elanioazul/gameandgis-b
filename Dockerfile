# Base Stage
FROM node:18-alpine3.16 AS base

ENV DIR /gameandgis-b-app
WORKDIR $DIR

# Install bash
RUN apk add --no-cache bash

# Development Stage
FROM base AS dev

ENV NODE_ENV=development

COPY package*.json $DIR

# RUN echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > $DIR/.npmrc && \
#     npm install && \
#     rm -f .npmrc
RUN npm install

COPY tsconfig*.json $DIR
COPY src $DIR/src
COPY copy-default-avatar.js ./

EXPOSE $PORT
CMD ["npm", "run", "start:dev"]




# Build Stage
FROM base AS build

RUN apk update && apk add --no-cache dumb-init bash

COPY package*.json $DIR

# RUN echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > $DIR/.npmrc && \
#     npm ci && \
#     rm -f .npmrc
RUN npm ci

COPY tsconfig*.json $DIR
COPY src $DIR/src
COPY copy-default-avatar.js ./

RUN npm run build-and-copy  && \
    npm prune --production


# Production Stage
FROM base AS production

ENV NODE_ENV=production
ENV USER=node

COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init
COPY --from=build $DIR/node_modules $DIR/node_modules
COPY --from=build $DIR/dist $DIR/dist

USER $USER
EXPOSE $PORT
CMD ["dumb-init", "node", "dist/main.js"]