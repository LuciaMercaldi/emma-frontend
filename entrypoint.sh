#!/bin/bash

if [ -d "node_modules" ]; then
    echo "node_modules directory exists. Running 'npm run build'..."
    npm run build
    
else
    echo "node_modules directory does not exist. Running 'npm install' and 'npm run build'..."
    npm install
    npm run build
fi