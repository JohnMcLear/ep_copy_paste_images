var underscore = require('ep_etherpad-lite/static/js/underscore');
var padeditor = require('ep_etherpad-lite/static/js/pad_editor').padeditor;
var padEditor;

exports.aceAttribsToClasses = function(name, context){
//  if(context.key.indexOf("img:") !== -1){
//    var img =  /(?:^| )img:([^>]*)/.exec(context.key);
//    return ['img:' + img[1] ];
//  }
  if(context.key == 'img'){
    return ['img:' + context.value ];
  }
  if(context.key == 'imgSize'){
    return ['imgSize:' + context.value ];
  }
}

exports.aceInitialized = function(hook, context){
  var editorInfo = context.editorInfo;
  editorInfo.ace_setImageSize = underscore(image.setImageSize).bind(context);
  editorInfo.ace_removeImage = underscore(image.removeImage).bind(context);
}

// Handle click events
exports.postAceInit = function(hook,context){

  context.ace.callWithAce(function(ace){
    var doc = ace.ace_getDocument();

    // Hide the controls by default -- I'm nto sure why I don't do this with CSS
    $(doc).find("head").append("<style type='text/css'>.control{display:none;}</style>");      

    var $inner = $(doc).find('#innerdocbody');

    // Don't allow resize handles to be shown
    doc.execCommand("enableObjectResizing", false, false);

    // On control select do fuck all, I hate this..
    $inner.on("oncontrolselect", ".control", function(){
    })

    // On control select do fuck all, I hate this..
    $inner.on("dragstart", ".control", function(){
    })

    // On control select do fuck all, I hate this..
    $inner.on("dragend", ".image", function(e){
      var id = e.currentTarget.id;
      var imageLine = $inner.find("#"+id).parent();
      var lineNumber = imageLine.prevAll().length;
      // Here I need to remove the lineAttribute from the source line
      context.ace.callWithAce(function(ace){
        ace.ace_removeImage(lineNumber);
      }, 'img', true);
    })
    
    // On click ensure all image controls are hidden
    $inner.on("click", "div", function(){
      // if it's an image
      var isImage = $(this).find(".image").length > 0;
      // Hide the controls
      if(!isImage){
        $(doc).find("head").append("<style>.control{display:none;}</style>");      
      }
    });

    // On clicking / hover of an image show the resize shiz
    $inner.on("click, mouseover", ".image", function(){
      var randomId = $(this)[0].id;
      // TODO Fix this so it's per image
      $(doc).find("head").append("<style>.control{display:block;}</style>");      
    });

    // On clicking / hover of an image show the resize shiz
    $inner.on("mouseout", ".image", function(){
      var randomId = $(this)[0].id;
      var isImage = $(this).context.className === "image";
      if(!isImage){
        $(doc).find("head").append("<style>.control{display:none;}</style>");
      }
    });

    // On click of a control (to resize image) perform some shit
    $inner.on("click", ".control", function(e){
      var newSize = e.currentTarget.id;
      var imageLine = $(this).parent().parent();;
      var lineNumber = imageLine.prevAll().length;
      context.ace.callWithAce(function(ace){
        ace.ace_setImageSize(newSize, lineNumber);
      }, 'img', true);
    });

  }, 'image', true);
}


var image = {
  setImageSize: function(size, lineNumber){
    var documentAttributeManager = this.documentAttributeManager;
    documentAttributeManager.setAttributeOnLine(lineNumber, 'imgSize', size); // make the line a task list
  },

  removeImage: function(lineNumber){
    var documentAttributeManager = this.documentAttributeManager;

    // This errors for some reason..
    documentAttributeManager.removeAttributeOnLine(lineNumber, 'img'); // make the line a task list
    documentAttributeManager.removeAttributeOnLine(lineNumber, 'imgSize'); // make the line a task list
  }
}

exports.aceEditorCSS = function(hook_name, cb){return ["/ep_copy_paste_images/static/css/ace.css"];} // inner pad CSS

// Rewrite the DOM contents when an IMG attribute is discovered
exports.aceDomLineProcessLineAttributes = function(name, context){
  var cls = context.cls;
  var exp = /(?:^| )img:([^>]*)/;
  var expSize = /(?:^| )imgSize:((\S+))/;
  var imgType = exp.exec(cls);
  var imgSize = expSize.exec(cls);
  if (!imgType) return [];

  var width = "width:25%";
  if(imgSize){
    if(imgSize[1] == "small"){
      var width = "width:25%"
    }
    if(imgSize[1] == "medium"){
      var width = "width:50%";
    }
    if(imgSize[1] == "large"){
      var width = "width:100%";
    }
  }

  var template = "";
  var randomId =  Math.floor((Math.random() * 100000) + 1); 
  var template = "<span class='control "+randomId+"' id='small' unselectable='on' contentEditable=false></span><span class='control' id='medium' contentEditable=false></span><span class='control' id='large' contentEditable=false></span>";
  if (imgType[1]){
    var modifier = {
      preHtml: '<span id="'+randomId+'" class="image" style="'+width+'">'+template+imgType[1]+' style="width:100%;" contentEditable="false">',
      postHtml:'</span>',
      processedMarker: true
    };
    return [modifier];
  }

  return [];
};

// When an image is detected give it a lineAttribute
// of Image with the URL to the iamge
// Images dragged / dropped from the Desktop will be Base64 encoded
exports.collectContentImage = function(name, context){
  context.state.lineAttributes.img = context.node.outerHTML;
  // I could do w/ moving the caret to the next line..
}



// look for images -- not sure if this is needed
exports.aceGetFilterStack = function(name, context){
/*
  return [
    context.linestylefilter.getRegexpFilter(
      new RegExp("img", "g"), 'img')
  ];
*/
}


exports.collectContentLineText = function(name, context){
}

exports.collectContentPre = function(name, context){
}

exports.collectContentPost = function(name, context){
}

exports.aceCreateDomLine = function(name, args){
}

exports.acePostWriteDomLineHTML = function (name, context){
}
exports.aceRegisterBlockElements = function (name, context){
//  return ['img'];
}

exports.aceAttribClasses = function(hook, attr){
}

