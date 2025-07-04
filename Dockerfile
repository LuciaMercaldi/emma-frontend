FROM node:22-alpine as build-stage


#install git and ssh
RUN apk add --no-cache git openssh

# make the 'app' folder the current working directory
WORKDIR /vue

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package.json ./

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

