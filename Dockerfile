FROM node:10

RUN mkdir /usr/share/pos-tagger
COPY . /usr/share/pos-tagger
WORKDIR /usr/share/pos-tagger

RUN npm install
RUN npm install -g npx ts-node typescript

CMD [ "npm", "run", "start" ]