#!/bin/bash

echo "Hello World!"

pm2 stop melib-req-service melib-product-service melib-sys-service

rm -rf melib-req-service melib-product-service melib-sys-service melib-web

unzip melib-web.*.zip
unzip melib-product-service.*.zip
unzip melib-req-service.*.zip
unzip melib-sys-service.*.zip

cd melib-req-service
npm run pm2:test
cd ../melib-product-service
npm run pm2:test
cd ../melib-sys-service
npm run pm2:test