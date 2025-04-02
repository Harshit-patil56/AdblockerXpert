// popup.js

document.addEventListener('DOMContentLoaded', function () {
  // Function to refresh the page
  function refreshPage() {
    location.reload();
  }

  // Get a reference to the refresh button
  var refreshButton = document.getElementById('refreshButton');

  // Add click event listener to the refresh button
  refreshButton.addEventListener('click', refreshPage);

  // Function to enable/disable extension
  function toggleExtension(isEnabled) {
    chrome.management.getSelf(function (extensionInfo) {
      var extensionId = extensionInfo.id;
      chrome.management.setEnabled(extensionId, isEnabled, function () {
        var notificationMessage = isEnabled ? 'Extension is now enabled.' : 'Extension is now disabled.';
        showNotification(notificationMessage);
      });
    });
  }

  // Update toggleCheckbox state and listen for toggleCheckbox change event
  var toggleCheckbox = document.getElementById('toggleCheckbox');
  if (toggleCheckbox) {
    toggleCheckbox.addEventListener('change', function () {
      var isEnabled = toggleCheckbox.checked;
      toggleExtension(isEnabled);
    });

    // Get extension status and update toggleCheckbox
    chrome.management.getSelf(function (extensionInfo) {
      var extensionId = extensionInfo.id;
      chrome.management.get(extensionId, function (extension) {
        toggleCheckbox.checked = extension.enabled;
      });
    });
  }

  // Listen for messages from content script to track ads
  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'trackAd') {
      var adInfoContainer = document.getElementById('adInfoContainer');
      if (adInfoContainer) {
        var adInfo = document.createElement('div');
        adInfo.className = 'ad-info';
        adInfo.textContent = 'Ad URL: ' + message.adUrl + ', Text: ' + message.adText;
        adInfoContainer.appendChild(adInfo);
      }
    } else if (message.action === 'getCount') {
      document.getElementById('blockedAdsCount').textContent = 'Blocked Ads: ' + message.count;
    } else if (message.action === 'getTotalBlockedAdsCount') {
      document.getElementById('totalBlockedAds').textContent = 'Total Blocked Ads: ' + message.totalCount;
    }
  });

  // Get the blocked ads count from the background script and update popup HTML
  chrome.runtime.sendMessage({ action: 'getCount' }, function(response) {
    document.getElementById('blockedAdsCount').textContent = 'Blocked Ads: ' + response.count;
  });

  // Get the total count of all blocked ads from the background script and update popup HTML
  chrome.runtime.sendMessage({ action: 'getTotalBlockedAdsCount' }, function(response) {
    document.getElementById('totalBlockedAds').textContent = 'Total Blocked Ads: ' + response.totalCount;
  });
});
