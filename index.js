exports.eejsBlock_styles = function (hook_name, args, cb) {
  args.content = args.content + "<link href='../static/plugins/ep_copy_paste_images/static/css/ace.css' rel='stylesheet'>";
  return cb();
}
