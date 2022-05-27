#!/bin/bash
# -*- coding: utf-8 -*-

set -e +h

BUILD_CMD=${BUILD_CMD-"build"}

if which greadlink &> /dev/null; then
    DIR=$(dirname $(greadlink -f ${BASH_SOURCE[0]}))
else
    DIR=$(dirname $(readlink -f ${BASH_SOURCE[0]}))
fi

npm install --global yarn --force

cd $DIR

NODE_ENV=dev yarn install
yarn run lint
yarn run $BUILD_CMD
