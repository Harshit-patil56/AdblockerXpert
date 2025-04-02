// background.js

// Function to reload the active tab
function refreshTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    // Reload the active tab
    chrome.tabs.reload(tabs[0].id);
  });
}

// Listen for clicks on the browser action icon
chrome.browserAction.onClicked.addListener(function (tab) {
  refreshTab();
});

// Initialize count of blocked ads and total count of all blocked ads
let blockedAdsCount = 0;
let totalBlockedAdsCount = 0;

// Listen for messages from the content script to update the count
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'adsBlocked') {
    blockedAdsCount += message.count;
    totalBlockedAdsCount += message.count;
  }
});

// Listen for messages from the popup to get the count
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'getCount') {
    sendResponse({ count: blockedAdsCount });
  } else if (message.action === 'getTotalBlockedAdsCount') {
    sendResponse({ totalCount: totalBlockedAdsCount });
  }
});

// Listen for messages from content script to increment count
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'incrementCount') {
    blockedAdsCount++;
    totalBlockedAdsCount++;
  }
});

// Listen for page change event and reset the count
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    blockedAdsCount = 0; // Reset the count when the page is fully loaded
  }
});


let resetTimeout = null;

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    blockedAdsCount = 0; // Reset the count when the page is fully loaded
    clearTimeout(resetTimeout);
    resetTimeout = setTimeout(resetBlockedAdsCount, 30000); // Reset the count after 30 seconds
  }
});

function resetBlockedAdsCount() {
  blockedAdsCount = 0;
}