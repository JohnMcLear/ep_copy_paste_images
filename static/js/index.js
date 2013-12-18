exports.aceAttribsToClasses = function(name, context){
  // WRONG BY HERE
console.log("STEP 3b", context);
  if(context.key == 'imageHeight'){
console.log("STEP 3bHeight", context.value);
    return ['imageHeight:' + context.value ];
  }

  if(context.key == 'imageWidth'){
    return ['imageWidth:' + context.value ];
  }

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
console.log("STEP 3c", context);
  var exp = /(?:^| )pastedImage:([^>]*)/;
  var pastedImageType = exp.exec(cls);
  
  var widthExp = /(?:^| )imageWidth:([A-Za-z0-9]*)/.exec(cls);
  var heightExp = /(?:^| )imageHeight:([A-Za-z0-9]*)/.exec(cls);

console.log("MOOO", widthExp, heightExp);

  var width = "";
  var height = "";

  if(widthExp && widthExp[1]) width += "width="+widthExp[1];
  if(heightExp && heightExp[1]) height += "height="+heightExp[1];

console.log(width, height);


  if (!pastedImageType) return [];
  if (pastedImageType[1]){
    var modifier = {
      preHtml: pastedImageType[1]+' style="max-width:90%;max-height:600px;" '+width+' '+height+'>',
      postHtml: '',
      processedMarker: true
    };
    return [modifier];
  }
  return [];
};

exports.aceGetFilterStack = function(name, context){
 // before here seems to be b0rked
  console.log("STEP 3a", context);
  return [
    context.linestylefilter.getRegexpFilter(
      new RegExp("pastedImage", "g"), 'pastedImage')
  ];
}

exports.collectContentLineText = function(name, context){
console.log("RAPE");
}

exports.collectContentPre = function(name, context){
  // PRETTY SURE NONE OF THIS IS REQUIRED!
  var lineAttributes = context.state.lineAttributes;
  console.log("STEP 1", context);
  console.log("STEP 2 CONTENT", context.cc.getLines());
  console.log("Step 2.1", context.state.lineAttributes);
  if(context.state.lineAttributes && context.state.lineAttributes.imageWidth){
    console.log("STEP 2.2 applying width attr");
    lineAttributes['imageWidth'] = context.state.lineAttributes.imageWidth;
  }
  if(context.state.lineAttributes && context.state.lineAttributes.imageHeight){
    lineAttributes['imageHeight'] = context.state.lineAttributes.imageHeight;
  }
}

exports.collectContentPost = function(name, context){
    context.styl = "width:20px;"
  console.log("STEP 2.2.5", context.state.lineAttributes);
  console.log("STEP 2.3", context);
  console.log("STEP 2.4 CONTENT", context.cc.getLines());
  console.log(" STEP 3 And 4 are never executed for an image! WTF!");
//  if(context.state.lineAttributes.pastedImage) context.cls = context.state.lineAttributes.pastedImage;
}

exports.aceCreateDomLine = function(name, context){
  console.log("STEP 4", context);

}

exports.acePostWriteDomLineHTML = function (name, context){
  console.log("STEP 3", context);
}
exports.aceRegisterBlockElements = function (name, context){
  return ['img'];
}

exports.postAceInit = function(n, context){
}

