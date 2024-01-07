#!/usr/bin/bash

git pull
pnpm install
time pnpm build
sudo cp -r dist/* /var/www/html/neolefty.org/patch-perfect
sudo chown -R www-data:www-data /var/www/html/neolefty.org/patch-perfect
