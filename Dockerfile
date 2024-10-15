# use node 16 alpine image as build image
FROM im.myhk.fun/dockerproxy/library/node:20-alpine AS builder

# create work directory in app folder
WORKDIR /app

# copy over all files to the work directory
ADD . .

# install all depencies
RUN yarn install

# build the project
RUN yarn run build

# start final image
FROM im.myhk.fun/dockerproxy/library/node:20-alpine

WORKDIR /app

# copy over build files from builder step
COPY --from=builder /app/.output  /app/.output

# expose the host and port 3000 to the server
ENV HOST=0.0.0.0
EXPOSE 3000

# run the build project with node
ENTRYPOINT ["node", ".output/server/index.mjs"]
