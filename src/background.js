// Setup popup page in browserAction.
chrome.browserAction.setPopup({popup: "../popup.html"});

function closeTabs(url) {
  var patterns = "*://*." + url + "/*";
  chrome.tabs.query({url: patterns}, function(tabs) {
    tabs.map(function(tab) {
      chrome.tabs.remove(tab.id);
    });
  });
}

function showAlertOnPage() {}

var items = {};

// Event listener for messages from popup page
chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
    console.log(msg);
    if(msg.name == 'delete') {
      delete items[msg.url];
      chrome.alarms.clear(msg.url);
      port.postMessage({items: items});
    }
    else if (msg.name == 'add') {
      // Record timestamp to calculate elapsed time later.
      items[msg.url] = {sec: msg.sec, timestamp: Date.now()};
      if(msg.sec >= 60) {
        chrome.alarms.create(msg.url, {delayInMinutes: Math.floor(msg.sec / 60)});
      }
      else {
        items[msg.url].sec = 0;
        closeTabs(msg.url);
        showAlertOnPage();
      }
      port.postMessage({items: items});
    }
    else if(msg.name == 'query') {
      port.postMessage({items: items});
    }
  });
});

// Close blocked websites when a new tab is created.
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  console.log(changeInfo);
  // Check if changeInfo.url contains a substring url.
  Object.keys(items).map(function(itemKey) {
    if(changeInfo.url && changeInfo.url.indexOf(itemKey)  > -1 &&
       items[itemKey].sec === 0) {
      closeTabs(itemKey);
    }
  });
});

// Alarm listener on event when timer is up.
chrome.alarms.onAlarm.addListener(function(alarm) {
  closeTabs(alarm.name);
  showAlertOnPage();
  if(items[alarm.name]){
    items[alarm.name].sec = 0; // Reset to 0 and block this url.
  }
});
