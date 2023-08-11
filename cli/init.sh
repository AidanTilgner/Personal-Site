#!/bin/bash

current_dir=$(pwd)

alias_command="alias pscli=\"$current_dir/pscli\""

echo "$alias_command" >> ~/.bashrc
echo "$alias_command" >> ~/.zshrc

echo "Alias added to .bashrc. You may need to run 'source ~/.bashrc' to apply the changes."