var underscore = require('ep_etherpad-lite/static/js/underscore');
var padeditor = require('ep_etherpad-lite/static/js/pad_editor').padeditor;
var padEditor;

exports.aceAttribsToClasses = function (name, context) {
  if (context.key == 'img') {
    return [`img:${context.value}`];
  }
  if (context.key == 'imgSize') {
    return [`imgSize:${context.value}`];
  }
};

exports.aceInitialized = function (hook, context) {
  const editorInfo = context.editorInfo;
  editorInfo.ace_addImage = underscore(image.addImage).bind(context);
  editorInfo.ace_setImageSize = underscore(image.setImageSize).bind(context);
  editorInfo.ace_removeImage = underscore(image.removeImage).bind(context);
};

// Handle click events
exports.postAceInit = function (hook, context) {
  // var oldLineNumber = 0;

  context.ace.callWithAce((ace) => {
    const doc = ace.ace_getDocument();

    // Hide the controls by default -- I'm nto sure why I don't do this with CSS
    $(doc).find('head').append("<style type='text/css'>.control{display:none;}</style>");

    const $inner = $(doc).find('#innerdocbody');
    const lineHasContent = false;

    $inner.on('drop', (e) => {
      e = e.originalEvent;
      const file = e.dataTransfer.files[0];
      if (!file) return;
      // don't try to mess with non-image files
      if (file.type.match('image.*')) {
        const reader = new FileReader();
        reader.onload = (function (theFile) {
          // get the data uri
          const dataURI = theFile.target.result;
          // make a new image element with the dataURI as the source
          const img = document.createElement('img');
          img.src = dataURI;
          // Now to insert the base64 encoded image into the pad
          context.ace.callWithAce((ace) => {
            const rep = ace.ace_getRep();
            ace.ace_addImage(rep, img.src);
          }, 'img', true);
        });
        reader.readAsDataURL(file);
      }
    });

    // Don't allow resize handles to be shown
    doc.execCommand('enableObjectResizing', false, false);

    // On control select do fuck all, I hate this..
    $inner.on('oncontrolselect', '.control', () => {
    });

    // On drag end remove the attribute on the line
    // Note we check the line number has actually changed, if not a drag start/end
    // to the same location would cause the image to be deleted!
    $inner.on('dragend', '.image', (e) => {
      const id = e.currentTarget.id;
      const imageContainer = $inner.find(`#${id}`);
      const imageLine = $inner.find(`.${id}`).parents('div');
      const oldLineNumber = imageLine.prevAll().length;
      context.ace.callWithAce((ace) => {
        const rep = ace.ace_getRep();
        const newLineNumber = rep.selStart[0];

        if (oldLineNumber !== newLineNumber) {
          // We just nuke the HTML, potentially dangerous but seems to work
          $(imageContainer).remove();
          // We also remove teh attribute hoping we get the number right..
          ace.ace_removeImage(oldLineNumber);
        }
      }, 'img', true);

      // TODO, if the image is moved only one line up it will create a duplicate
      // IF the line is already populated, nothing much I can do about that for now
    });

    // On click ensure all image controls are hidden
    $inner.on('click', 'div', function () {
      // if it's an image
      const isImage = $(this).find('.image').length > 0;
      // Hide the controls
      if (!isImage) {
        $(doc).find('head').append('<style>.control{display:none;}</style>');
      }
    });

    // On clicking / hover of an image show the resize shiz
    $inner.on('click, mouseover', '.image', function () {
      const randomId = $(this)[0].id;
      // TODO Fix this so it's per image
      $(doc).find('head').append('<style>.control{display:block;}</style>');
    });

    // On clicking / hover of an image show the resize shiz
    $inner.on('mouseout', '.image', function () {
      const randomId = $(this)[0].id;
      if ($(this).context) {
        var isImage = $(this).context.className === 'image';
      }
      if (isImage) {
        $(doc).find('head').append('<style>.control{display:none;}</style>');
      }
    });

    // On click of a control (to resize image) perform some shit
    $inner.on('click', '.control', function (e) {
      const newSize = e.currentTarget.id;
      const imageLine = $(this).parents('div');
      const lineNumber = imageLine.prevAll().length;
      context.ace.callWithAce((ace) => {
        ace.ace_setImageSize(newSize, lineNumber);
      }, 'img', true);
    });
  }, 'image', true);
};


var image = {
  setImageSize(size, lineNumber) {
    const documentAttributeManager = this.documentAttributeManager;
    documentAttributeManager.setAttributeOnLine(lineNumber, 'imgSize', size); // make the line a task list
  },

  removeImage(lineNumber) {
    const documentAttributeManager = this.documentAttributeManager;

    // This errors for some reason..
    documentAttributeManager.removeAttributeOnLine(lineNumber, 'img'); // make the line a task list
    documentAttributeManager.removeAttributeOnLine(lineNumber, 'imgSize'); // make the line a task list
  },

  addImage(rep, src) {
    const documentAttributeManager = this.documentAttributeManager;

    // Get the line number
    const lineNumber = rep.selStart[0];
    // This errors for some reason..
    src = `<img src=${src}>`;
    documentAttributeManager.setAttributeOnLine(lineNumber, 'img', src); // make the line a task list
  },

};

exports.aceEditorCSS = function (hook_name, cb) { return ['/ep_copy_paste_images/static/css/ace.css']; }; // inner pad CSS

// Rewrite the DOM contents when an IMG attribute is discovered
exports.aceDomLineProcessLineAttributes = function (name, context) {
  const cls = context.cls;
  const exp = /(?:^| )img:([^>]*)/;
  const expSize = /(?:^| )imgSize:((\S+))/;
  const imgType = exp.exec(cls);
  const imgSize = expSize.exec(cls);
  if (!imgType) return [];
  var width = 'width:25%';
  var height = 'height:25%;%';
  if (imgSize) {
    if (imgSize[1] == 'small') {
      var width = 'width:25%';
      var height = 'height:25%;';
    }
    if (imgSize[1] == 'medium') {
      var width = 'width:50%';
      var height = 'height:50%;';
    }
    if (imgSize[1] == 'large') {
      var width = 'width:100%';
      var height = 'height:100%;';
    }
  }

  // var template = "";
  const randomId = Math.floor((Math.random() * 100000) + 1);
  let template = `<span id="${randomId}" class="image" style="${width}">`;
  template += `<span class="control ${randomId}" id="small" unselectable="on" contentEditable=false></span>`;
  template += `<span class="control ${randomId}" id="medium" unselectable="on" contentEditable=false></span>`;
  template += `<span class="control ${randomId}" id="large" unselectable="on" contentEditable=false></span>`;
  if (imgType[1]) {
    const preHtml = `${template + imgType[1]} style="${height}width:100%;" width=100%>`;
    const postHtml = '</span>';
    const modifier = {
      preHtml,
      postHtml,
      processedMarker: true,
    };
    return [modifier];
  }

  return [];
};

// When an image is detected give it a lineAttribute
// of Image with the URL to the iamge
// Images dragged / dropped from the Desktop will be Base64 encoded
exports.collectContentImage = function (name, context) {
  const tname = context.tname;
  const state = context.state;
  const cc = context.cc;
  const lineAttributes = state.lineAttributes;
  if (tname === 'div' || tname === 'p') {
    delete lineAttributes.img;
    delete lineAttributes.imgSize;
  }
  if (tname == 'img') {
    lineAttributes.img = context.node.outerHTML;
  }
  if (context.node.parentNode && context.node.parentNode.style.width) {
    if (context.node.parentNode.style.width == '50%') {
      lineAttributes.imgSize = 'medium';
    }
  }
};


// look for images -- not sure if this is needed
exports.aceGetFilterStack = function (name, context) {
/*
  return [
    context.linestylefilter.getRegexpFilter(
      new RegExp("img", "g"), 'img')
  ];
*/
};


exports.collectContentLineText = function (name, context) {
};

exports.collectContentPre = function (name, context) {
};

exports.collectContentPost = function (name, context) {
  const tname = context.tname;
  const state = context.state;
  const lineAttributes = state.lineAttributes;
  if (tname == 'img') {
    delete lineAttributes.img;
  }
  if (tname == 'imgSize') {
    delete lineAttributes.imgSize;
  }
};

exports.aceCreateDomLine = function (name, args) {
};

exports.acePostWriteDomLineHTML = function (name, context) {
};
exports.ccRegisterBlockElements = function (name, context) {
  return ['img'];
};
exports.aceRegisterBlockElements = function (name, context) {
//  return ['img']; // doesn't seem to make any difference?
};

exports.aceAttribClasses = function (hook, attr) {
};
