FROM node:14-alpine as builder
WORKDIR /app

# dependencies
ADD package.json yarn.lock ./
RUN yarn --frozen-lockfile

# library code
ADD src src

# bundle
RUN yarn esbuild src/bin/start.ts --outdir=lib --platform=node --target=node14 --bundle

FROM node:14-alpine
WORKDIR /app
COPY --from=builder /app/lib .

# bindings
EXPOSE 8010
ENV HOST 0.0.0.0
ENV PORT 8010
VOLUME /app/.cognito
ENTRYPOINT ["node", "/app/start.js"]