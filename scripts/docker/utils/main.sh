#!/usr/bin/env bash

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
  for ID in $containers
  do
    printf "[$currentIndex/$containersLength] "
    docker stop $ID
    ((currentIndex++))
  done
}

function stopProjectContainers() {
  if [ "$1" ]
  then
    ##### Variables declaration
    containers=$(docker ps -f "name=$1-*" -aq)
    containersLength=$(countProjectContainers $1)
    currentIndex=1
    ##### Instructions
    for ID in $containers
    do
      printf "[$currentIndex/$containersLength] "
      docker stop $ID
      ((currentIndex++))
    done
  else
    echo "Missing 'project name' (string) parameter."
  fi
}