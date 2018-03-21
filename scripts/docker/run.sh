#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )" # Resolve current execution path

## Import utilities
source $DIR/utils/main.sh

removeAllContainers
echo "Starting project's containers..."
docker-compose -f "docker-compose.yml" up -d
