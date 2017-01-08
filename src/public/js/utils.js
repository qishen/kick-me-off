
function isValidURL(url){
  var regexp = /^([-A-Za-z0-9_]+\.)+([A-Za-z]+)$/;
  return regexp.test(url);
}

function secondToString(sec) {
  if(sec <= 0) return "Blocked!";
  var h = Math.floor(sec / 3600);
  var m = Math.floor(sec % 3600 / 60);
  var s = sec % 3600 % 60;
  return h + ':' + m + ':' + s;
}

module.exports = {
  isValidURL: isValidURL,
  secondToString: secondToString
}
