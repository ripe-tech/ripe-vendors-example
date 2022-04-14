#!/bin/bash
# -*- coding: utf-8 -*-

set -e +h

BUILD_CMD=${BUILD_CMD-"build"}

if which greadlink &> /dev/null; then
    DIR=$(dirname $(greadlink -f ${BASH_SOURCE[0]}))
else
    DIR=$(dirname $(readlink -f ${BASH_SOURCE[0]}))
fi

cd $DIR

npm install
npm install --only=dev
npm run lint
npm run $BUILD_CMD
npm prune
