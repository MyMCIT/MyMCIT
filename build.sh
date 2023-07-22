#!/bin/zsh



rm -r dist
rm -r test-coverage

set -e # exit if the script encounters an error

npm run lint:fix

npm run test:coverage

npm run build
