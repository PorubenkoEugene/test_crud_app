#!/bin/bash

sleep 40

cd /api
npm install

cd /api
chmod +x /api/node_modules/.bin/nodemon

cd /api
npm run debug

