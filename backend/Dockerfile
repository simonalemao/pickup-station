FROM node:lts-alpine
WORKDIR /workdir
COPY package.json /workdir
RUN npm install
COPY . /workdir
CMD ["npm", "start"]