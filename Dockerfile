FROM node:22-alpine
RUN mkdir -p /app/node_modules && chown -R node:node /app
RUN chmod 777 -R /app
WORKDIR /app
USER node
COPY --chown=node:node ./* .
EXPOSE 5000
RUN npm install
# CMD [ "ls", "-la", "node_modules", ";", "node", "index.js" ]
CMD [ "node", "index.js" ]