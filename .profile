#!/bin/sh
# Profile file. Runs on login.

# Adds `~/.scripts` and all subdirectories to $PATH
export PATH="$(du $HOME/.scripts/ | cut -f2 | tr '\n' ':')$PATH"
# Add Cataclysm-DDA to path
#export PATH="$(du /media/BigTank/documents/LinuxStuff/LinuxGames/Cataclysm-DDA/ | cut -f2 | tr '\n' ':')$PATH"
export EDITOR="vim"
export TERMINAL="st"
# had to add this line for term errors, TERM was undefined
export TERM="st"
export BROWSER="firefox"
export READER="zathura"
export BIB="$HOME/Documents/LaTeX/uni.bib"
export REFER="$HOME/.referbib"
# PIX is here I have LARBS keep icons. Subject to change, hence a variable.
export PIX="$HOME/.scripts/pix"

# less/man colors
export LESS=-R
export LESS_TERMCAP_mb=$'\E[1;31m'     # begin bold
export LESS_TERMCAP_md=$'\E[1;36m'     # begin blink
export LESS_TERMCAP_me=$'\E[0m'        # reset bold/blink
export LESS_TERMCAP_so=$'\E[01;44;33m' # begin reverse video
export LESS_TERMCAP_se=$'\E[0m'        # reset reverse video
export LESS_TERMCAP_us=$'\E[1;32m'     # begin underline
export LESS_TERMCAP_ue=$'\E[0m'        # reset underline

[ ! -f ~/.shortcuts ] && shortcuts >/dev/null 2>&1

[ -f ~/.bashrc ] && source ~/.bashrc

# Start graphical server if i3 not already running.
 [ "$(tty)" = "/dev/tty1" ] && ! pgrep -x i3 >/dev/null && exec startx

# Switch escape and caps and use wal colors if tty:
sudo -n loadkeys ~/.scripts/ttymaps.kmap 2>/dev/null

# Added by me
#Touchpad Configuration (ideally change 10 with the name of the touchpad device at some point)
# Implemented in /usr/share/X11/xorg.conf/touchpad.conf
## Tapping Enabled
#xinput set-prop 10 298 1
## Drag Lock Enabled
#xinput set-prop 10 302 1
## Natural Scrolling Enabled
#xinput set-prop 10 280 1
## Accel Speed
#xinput set-prop 10 289 0.2
wal -c
wal -i ~/.config/wall.png
# Optimize for HiDPI
## set QT scale factor
export QT_SCALE_FACTOR=1.5
## Scale GTK apps
export GDK_SCALE=2
export GDK_DPI_SCALE=0.5
export QT_AUTO_SCREEN_SCALE_FACTOR=1
