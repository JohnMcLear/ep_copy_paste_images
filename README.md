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
 - [x] Fix IE being able to resize image IE problems....  Y'know...
 -Should be fixed now, needs testing
 - [x] Fix mobile issue where mouseout never fires so resize is always shown
 -Should be a relatively easy fix but will require handling aceEditEvent events
 - [x] Show span as active on click of "control" element
 - [x] Fix issue when a user selects content then hits paste (it currently throws up an error and breaks editing)
 -Creating a new line "might" fix this but other than that I don't have any other ideas other than inserting a special character
 - [x] Support image drag and drop to already populated lines (it currently does not allow the image to be uploaded to this point, imho it should create a new line with the image on)
 -Hopefully creating a "new line" event should fix this

 - [ ] ALL: Consider file upload experience (if we want to provide that) (see https://github.com/JohnMcLear/ep_copy_paste_images/issues/3)
 -Seeing ep_fileupload we can probably leverage this and store images on the server
 - [ ] ALL: Fix copy/paste within editor creating 2 copies Currently if you copy/paste an image inside the pad it spams the image onto the pad multiple times.
 -I might have to modify the hook to make this work effectively
 - [ ] ALL: Fix copy/paste creating two copies when copying from web browser

 - [ ] FIREFOX: Fix issue with Firefox not being able to drag an image UP towards the top of the pad due to race condition
 - [ ] ALL: Fix issue where dragging and dropping in same location nukes the image
 - [ ] CHROME: Drag and Drop from File system wont import image (Chrome bug) http://stackoverflow.com/questions/23548745/drag-and-drop-image-file-into-contenteditable-div-works-fine-in-ff-fails-miser  (NOTE I ALSO TESTED IN FF AND IE AND ITS WORKING FINE SO ALTERNATIVE IS TO TELL PEOPLE TO USE FIREFOX :P) also note copy/paste clipboard works fine

#V2:
 - [x] Investigate using shadow DOM Impossible
 - [ ] Disable Drag/resize handles in IE (see https://connect.microsoft.com/IE/Feedback/Details/907422)

#VNever:
 - [ ] Support wrap around image (This will never happen)

# MANUAL TESTS:
On each release of this plugin due to browser restrictions we have to do a lot of manual tests.

## Devices to test on
1. Mobile Phone (small / touch screen)
1. IE9/10/11
1. Firefox
1. Chrome

## Drag and Drop (using mouse)
1. Drag and Drop onto a blank line
1. Drag and drop onto content with a line
  1. Original copy of image is removed
  1. New image is visible
  1. Image size is maintained

## Copy / Paste (using control c / v AND right click copy/paste AND mobile copy/paste)
1. Paste onto a blank line
1. Paste onto a line populated with content (IE Type Hello world first)
  1. Original copy of image is kept
  1. New image is visible
  1. Image size is maintained

## Cut / Paste (using control x / v AND right click copy/paste AND mobile copy/paste)
1. Paste onto a blank line
1. Paste onto a line populated with content (IE Type Hello world first)
  1. Original copy of image is removed
  1. New image is visible
  1. Image size is maintained

## Resize
  1. Can resize the image small/medium/large

## Browser Resize
  1. Caret can still be moved before and after the image using arrow keys and page up/down

