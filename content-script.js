var injectScript;
injectScript = function(file, node){
  var s, th;
  th = document.getElementsByTagName(node)[0];
  s = document.createElement('script');
  s.setAttribute('type', 'text/javascript');
  s.setAttribute('src', file);
  return document.body.appendChild(s);
};
injectScript(chrome.extension.getURL('/jquery-2.1.4.min.js'),'body');
//injectScript(chrome.extension.getURL('/embeded-script.js'),'body');
