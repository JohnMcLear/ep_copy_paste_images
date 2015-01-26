# Paste images from clipboard into Etherpad
![Screenshot](http://i.imgur.com/emZqtwG.png)

## Warning
This plugin is WIP and isn't stable 

## How do I wrap content around an image and vice versa?
You don't.  It's as simple as that.  Etherpad is a line based editor meaning having lines wrap around other lines will be a mess.  We're not willing to accommodate this as your users will end up making messy horrible documents and you will feel bad.

# TODO:
 - [x] Find someone to sponsor development
 - [x] Make it work on develop branch (see https://github.com/ether/etherpad-lite/pull/2497/files)
 - [x] Support image resize
 - [x] Support image drag and drop
 - [ ] Fix issue when a user selects content then hits paste
 - [ ] Support image drag and drop to already populated lines
 - [ ] Consider file upload experience (if we want to provide that)
 - [ ] Fix copy/paste within editor creating multiple copies
 - [ ] Fix IE being able to resize image

#V2:
 - [ ] Investigate using shadow DOM
 - [ ] Disable Drag/resize handles in IE (see https://connect.microsoft.com/IE/Feedback/Details/907422)

#VNever:
 - [ ] Support wrap around image (This will never happen)

