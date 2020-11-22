exports.eejsBlock_styles = function (hook_name, args, cb) {
  args.content += "<link href='../static/plugins/ep_copy_paste_images/static/css/ace.css' rel='stylesheet'>";
  return cb();
};

exports.eejsBlock_timesliderStyles = function (hook_name, args, cb) {
  args.content += "<link href='../../static/plugins/ep_copy_paste_images/static/css/ace.css' rel='stylesheet'>";
  args.content += '<style>.control{display:none}</style>';
  return cb();
};
