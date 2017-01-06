/* document.body.innerHTML = "";

var logDiv = document.createElement("div");
logDiv.style.border = "1px dashed black";
document.body.appendChild(document.createElement("br"));
document.body.appendChild(logDiv);

addButton("Set an alert.", function() {
  chrome.runtime.sendMessage({alertIssued: true}, function(response){
    alert("Issue Alert!");
    log(response.confirmMsg);
  });
});

// Deal with messages from chrome.tabs.sendMessage()
chrome.runtime.onMessage.addListener(function(msg, _, sendResponse) {
  log("Got message from background page: " + msg);
});



function log(str) {
  console.log(str);
  logDiv.innerHTML += str + "<br>";
}

function addButton(name, cb) {
  var a = document.createElement("button");
  a.innerText = name;
  a.onclick = cb;
  document.body.appendChild(document.createElement("br"));
  document.body.appendChild(a);
}
*/
