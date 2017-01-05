function isValidURL(url){
  var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
  return regexp.test(url);
}

function secondToString(sec) {
  if(sec <= 0) return "Site is blocked";
  var h = Math.floor(sec / 3600);
  var m = Math.floor(sec % 3600 / 60);
  var s = sec % 3600 % 60;
  return h + ':' + m + ':' + s;
}

module.exports = {
  isValidURL: isValidURL,
  secondToString: secondToString
}
