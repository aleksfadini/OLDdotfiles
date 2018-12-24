#!/bin/sh
# This is a script to back up all dotfiles
dotfiles="/usr/bin/git --git-dir=$HOME/.dotfiles/ --work-tree=$HOME"
cd ~
$dotfiles status
$dotfiles add .vim
$dotfiles add .bashrc
$dotfiles add .bmdirs
$dotfiles add .bmfiles
$dotfiles add .emoji
$dotfiles add .gtkrc-2.0
$dotfiles add .inputrc
$dotfiles add .profile
$dotfiles add .readme.mom
$dotfiles add .tmux.conf
$dotfiles add .vimrc
$dotfiles add .Xdefaults
$dotfiles add .xinitrc
$dotfiles add .xprofile
$dotfiles add .Xresources
$dotfiles add .zprofile
$dotfiles commit -m "Auto batch of dotfiles"
$dotfiles push origin master
