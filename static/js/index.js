exports.aceAttribsToClasses = function(name, context){
  if(context.key.indexOf("pastedImage:") !== -1){
  var pastedImage =  /(?:^| )pastedImage:([^>]*)/.exec(context.key);
    return ['pastedImage:' + pastedImage[1] ];
  }
  if(context.key == 'pastedImage'){
    return ['pastedImage:' + context.value ];
  }
}

exports.aceDomLineProcessLineAttributes = function(name, context){
  var cls = context.cls;
  var domline = context.domline;
  var exp = /(?:^| )pastedImage:([^>]*)/;
  var pastedImageType = exp.exec(cls);
  if (!pastedImageType) return [];
  if (pastedImageType[1]){
    var modifier = {
      preHtml: pastedImageType[1]+' style="max-width:100%;max-height:800px;">',
      postHtml: '',
      processedMarker: true
    };
    return [modifier];
  }
  return [];
};

exports.aceGetFilterStack = function(name, context){
  return [
    context.linestylefilter.getRegexpFilter(
      new RegExp("pastedImage", "g"), 'pastedImage')
  ];
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
  return ['img'];
}
