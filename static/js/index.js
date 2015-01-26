exports.aceAttribsToClasses = function(name, context){
  if(context.key.indexOf("img:") !== -1){
  var img =  /(?:^| )img:([^>]*)/.exec(context.key);
    return ['img:' + img[1] ];
  }
  if(context.key == 'img'){
    return ['img:' + context.value ];
  }
}

exports.aceEditorCSS = function(hook_name, cb){return ["/ep_copy_paste_images/static/css/ace.css"];} // inner pad CSS

exports.aceDomLineProcessLineAttributes = function(name, context){
  var cls = context.cls;
  var domline = context.domline;
  var exp = /(?:^| )img:([^>]*)/;
  var imgType = exp.exec(cls);
  if (!imgType) return [];
  var template = "";
  var template = "<control id='small'></control><control id='medium'></control><control id='large'></control>";
  if (imgType[1]){
    var modifier = {
      preHtml: '<span class="image">'+template+imgType[1]+' style="max-width:100%;">',
      postHtml:'</span>',
      processedMarker: true
    };
    return [modifier];
  }
  return [];
};

exports.aceGetFilterStack = function(name, context){
  return [
    context.linestylefilter.getRegexpFilter(
      new RegExp("img", "g"), 'img')
  ];
}

exports.collectContentLineText = function(name, context){
}

exports.collectContentImage = function(name, context){
  console.log("collected image", context);
  context.state.lineAttributes.img = context.node.outerHTML;
  // I could do w/ moving the caret to the next line..
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

