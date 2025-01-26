# Specify the base image
FROM node:20-alpine
WORKDIR /app 
            # create our working directory which is the root of our project
             # at a directory called app
COPY package*.json ./ 
                    #first copy package.json and package lock that
                    #subsequent builds will be fast (results here will be cached)

RUN npm install -g yarn --force 
#Istalling yarn since I''m using yarn
RUN yarn #installing dependancies
COPY . .

RUN yarn standalone 
                    # building  using standalone
                    # check on the attached command on the build standalone
                    #that I have modified to copy static assets e.t.c

#Runtime stage installes nodejs to make the container smaller
FROM alpine:3.20
RUN apk update && apk add --no-cache nodejs
RUN addgroup -S node && adduser -S node -G node
USER node
RUN mkdir /home/node/code && chown -R node:node /home/node/code
WORKDIR /home/node/code
COPY --from=0 /app/.next/standalone .
EXPOSE 3000
CMD [ "node", "server.js" ]