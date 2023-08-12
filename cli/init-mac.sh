#!/bin/bash

if [ -z "$PERSONAL_SITE_ROOT" ]; then
    echo "Please set the PERSONAL_SITE_ROOT environment variable."
    exit 1
fi

root_dir="$PERSONAL_SITE_ROOT/cli"

if [ "$1" != "zsh" ] && [ "$1" != "bash" ]; then
    echo "Please specify either 'zsh' or 'bash' as the first argument."
    exit 1
fi

alias_command="alias pscli=\"$root_dir/pscli-mac\""

if [ "$1" == "zsh" ]; then
    echo $alias_command >> ~/.zshrc
elif [ "$1" == "bash" ]; then
    echo $alias_command >> ~/.bashrc
fi

echo "Added to .$1rc."

