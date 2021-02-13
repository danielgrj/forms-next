FROM node:12-alpine

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# Default to port 4000 for Node, and 9229 and 9230 (tests) for debug
ARG PORT=3001
ENV PORT $PORT
EXPOSE $PORT 9229 9230

RUN npm i npm@latest -g

RUN mkdir /opt/next_app && chown node:node /opt/next_app
WORKDIR /opt/next_app

COPY package.json package-lock.json ./
RUN npm install --ignore-engines
ENV PATH /opt/next_app/node_modules/.bin:$PATH

# Checks every 30s to ensure this service returns HTTP 200'
HEALTHCHECK --interval=30s CMD node healthcheck.js

# Copy in our source code last, as it changes the most
WORKDIR /opt/next_app/app
COPY . .

# COPY docker-entrypoint.sh /usr/local/bin/
# ENTRYPOINT ["docker-entrypoint.sh"]

CMD [ "npm", "run", "dev" ]