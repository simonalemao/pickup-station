FROM node:lts-alpine
WORKDIR /workdir
COPY package.json /workdir
RUN npm install
COPY . .
CMD ["npm", "start"]