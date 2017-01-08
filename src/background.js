// Setup popup page in browserAction.
chrome.browserAction.setPopup({popup: "../popup.html"});

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
        // Do not show page alert here.
        items[msg.url].sec = 0;
        closeTabs(msg.url);
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
      setTimeout(showAlertOnPage, 1000);
    }
  });
});

// Alarm listener on event when timer is up.
chrome.alarms.onAlarm.addListener(function(alarm) {
  closeTabs(alarm.name);
  setTimeout(showAlertOnPage, 1000);
  if(items[alarm.name]){
    items[alarm.name].sec = 0; // Reset to 0 and block this url.
  }
});


/**
 * Close all tabs whose urls match the pattern and show alert page
 * on current active tab.
 * @param  {String} url
 */
function closeTabs(url) {
  var patterns = "*://*." + url + "/*";
  chrome.tabs.query({url: patterns}, function(tabs) {
    tabs.map(function(tab) {
      chrome.tabs.remove(tab.id);
    });
  });
}

/**
 * Show alert on current active tab in the window to Notify
 * user that banned sites are closed. Use delay to ensure close
 * tabs are not considerred as active tab.
 */
function showAlertOnPage() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var tabId = tabs[0].id;
    executeScript(tabId, [
      {file: "dist/vendor.bundle.js"},
      {file: "dist/content.bundle.js"}]
    );
  });
}

/**
 * Execute JavaScript files consequently in chrome.tabs.executeScript().
 * It is implemented in nested callback functions.
 * @param  {Integer} tabId
 * @param  {Array} injectDetailsArray  array of injectDetails object.
 */
function executeScript(tabId, injectDetailsArray) {
  // create callback function that execute another function.
  function createCallback(tabId, injectDetails, innerCallback) {
    return function() {
      chrome.tabs.executeScript(tabId, injectDetails, innerCallback);
    };
  }

  var callback = null;
  for(var i=injectDetailsArray.length-1; i>=0; i--) {
    callback = createCallback(tabId, injectDetailsArray[i], callback);
  }

  if(callback !== null) callback();
}
