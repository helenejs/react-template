FROM node:20-alpine3.18 AS dependencies
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:20-alpine3.18 AS build
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN yarn run build

FROM node:20-alpine3.18 AS production
ENV NODE_ENV=production
WORKDIR /app
RUN mkdir dist
COPY --from=build /app/dist/client /app/dist/client
COPY --from=build /app/dist/server /app
EXPOSE $PORT
CMD ["node","--enable-source-maps","--trace-warnings","--max-old-space-size=2048","index.js"]
