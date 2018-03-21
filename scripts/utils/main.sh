#!/usr/bin/env bash

function color() {
  if [ $1 ]
  then
    if [ $2 ]
    then
      defaultCode='\033[39m'
      code=$defaultCode
      case $2 in
      [black]*)
        code='\033[0;30m'
        ;;
      [red]*)
        code='\033[0;31m'
        ;;
      [green]*)
        code='\033[0;32m'
        ;;
      [yellow]*)
        code='\033[0;33m'
        ;;
      [blue]*)
        code='\033[0;34m'
        ;;
      [magenta]*)
        code='\033[0;35m'
        ;;
      [cyan]*)
        code='\033[0;36m'
        ;;
      esac
      printf "${code}$1${defaultCode}"
    else
      echo "Missing color (string) parameter."  
    fi
  else
    echo "Missing string parameter."
  fi
}

function bold() {
  if [ $1 ]
  then
    defaultCode='\033[21m'
    code='\033[1m'
    printf "${code}$1${defaultCode}"
  else
    echo "Missing string parameter."
  fi
}