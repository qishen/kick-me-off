// Setup popup page in browserAction.
chrome.browserAction.setPopup({popup: "popup.html"});

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
    else if(msg.name == 'query') {
      port.postMessage({items: items});
    }
    else if (msg.name == 'add') {
      // Record timestamp to calculate elapsed time later.
      items[msg.url] = {sec: msg.sec, timestamp: Date.now()};
      chrome.alarms.create(msg.url, {delayInMinutes: Math.floor(msg.sec / 60)});
      port.postMessage({items: items});
    }
  });
});

// Alarm listener on event when timer is up.
chrome.alarms.onAlarm.addListener(function(alarm) {
  closeTabs(alarm.name);
  showAlertOnPage();
});
