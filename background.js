chrome.browserAction.setPopup({popup: "popup.html"});

// Click listener is disabled after popup is set up.
/*chrome.browserAction.onClicked.addListener(function(tab) {
  // console.log(tab);
  chrome.tabs.create({url: "http://google.com"}, function(tab){
    chrome.tabs.executeScript(tab.id, {file: "content.js"}, function() {
      chrome.tabs.sendMessage(tab.id, "Background page started.");
    });
  });
})*/

chrome.runtime.onMessage.addListener(function(msg, _, sendResponse) {
  if(msg.alertIssued) {
    sendResponse({confirmMsg: "Ok, I know you issued the alert."});
  }
});

// Send message to current window.
var lastTabId = -1;
function sendMessage() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    lastTabId = tabs[0].id;
    chrome.tabs.sendMessage(lastTabId, "Background page started.");
  });
}
