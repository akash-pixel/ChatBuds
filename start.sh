#!/bin/sh

cd /app/server && npm run start &

cd /app/client && npm run start &

wait
