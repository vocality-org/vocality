FROM node:alpine

# Install build-dependencies for building node_modules
RUN apk add --update
RUN apk add --no-cache --virtual build-dependencies git curl build-base g++ python make

# Install dependencies and copy src
WORKDIR /vocality
COPY package.json .
RUN npm install --silent
COPY . ./

# Remove build-dependencies
RUN apk del build-dependencies

# Build
RUN npm run build --silent

# Install runtime-dependencies
RUN apk add --no-cache --virtual runtime-dependencies ffmpeg

EXPOSE 3000

# Start
CMD npm run start:production