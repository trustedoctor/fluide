const util = require('hexo-util');
const escapeHTML = util.escapeHTML;
const highlight = util.highlight;

hexo.extend.tag.register('code', function (args, content) {
  var lang = args[0] ? args[0] : 'html'
  return '<div class="code ' + lang + '">' +
    '' + highlight(content, {
      lang: lang
    }) +
    '<div class="preview">' + content + '</div>' + 
  '</div>';
}, { ends: true });