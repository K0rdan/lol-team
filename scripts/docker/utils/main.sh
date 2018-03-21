#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )" # Resolve current execution path

## Import utilities
source $DIR/../../utils/main.sh

###################
function countContainers() {
  docker ps -aq | wc -l
}

function countProjectContainers() {
  if [ "$1" ]
  then
    docker ps -f "name=$1-*" -aq | wc -l
  else
    echo "Missing 'project name' (string) parameter."
  fi
}

function countImages() {
  docker images -aq | wc -l
}

function getContainerIDAtIndex() {
  index=${1-0} # Default index is 0

  containers=$(docker ps -aq)
  return ${containers[$index]}
}

function stopAllContainers() {
  ##### Variables declaration
  containers=$(docker ps -aq)
  containersLength=$(countContainers)
  currentIndex=1
  ##### Instructions
  echo "Stopping all containers..."
  if [ $containersLength -gt 0 ]
  then
    for ID in $containers
    do
      printf "$(color [$(bold $currentIndex)/$containersLength] green) "
      docker stop $ID
      ((currentIndex++))
    done
  else
    echo "No containers to stop."
  fi

  return $containersLength
}

function stopProjectContainers() {
  if [ "$1" ]
  then
    ##### Variables declaration
    containers=$(docker ps -f "name=$1-*" -aq)
    containersLength=$(countProjectContainers $1)
    currentIndex=1
    ##### Instructions
    echo "Stopping project [$1] containers..."
    if [ $containersLength -gt 0 ]
    then
      for ID in $containers
      do
        printf "$(color [$(bold $currentIndex)/$containersLength] green) "
        docker stop $ID
        ((currentIndex++))
      done
    else
      echo "No containers to stop."
    fi

    return $containersLength
  else
    echo "Missing 'project name' (string) parameter."
  fi
}

function removeAllContainers() {
  ##### Variables declaration
  containers=$(docker ps -aq)
  containersLength=$(countContainers)
  currentIndex=1
  ##### Instructions
  echo "Removing all containers..."
  if [ $containersLength -gt 0 ]
  then
    for ID in $containers
    do
      printf "$(color [$(bold $currentIndex)/$containersLength] green) "
      docker rm -f $ID
      ((currentIndex++))
    done
  else
    echo "No containers to remove."
  fi

  return $containersLength
}

function removeAllImages() {
  removeAllContainers
  ##### Variables declaration
  images=$(docker images -aq)
  imagesLength=$(countImages)
  currentIndex=1
  ##### Instructions
  echo "Removing all images..."
  if [ $imagesLength -gt 0 ]
  then
    for ID in $images
    do
      printf "$(color [$(bold $currentIndex)/$imagesLength] green) "
      docker rmi -f $ID
      ((currentIndex++))
    done
  else
    echo "No images to remove."
  fi

  return $imagesLength
}