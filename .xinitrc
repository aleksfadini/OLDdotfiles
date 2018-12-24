#!/bin/sh

xset r rate 200 50
xrandr --dpi 192

[ -f ~/.Xmodmap ] && xmodmap ~/.Xmodmap
[ -f ~/.Xresources ] && xrdb -merge ~/.Xresources

xset r rate 200 50
xrandr --dpi 192
xsetroot -xcf /usr/share/icons/whiteglass/cursors/left_ptr 48

exec i3
