// Function to check if an element is likely an ad
function isAdElement(element) {
  // You can customize this function based on the structure of ad elements in your pages
  // For example, check class names, IDs, etc.
  return (
    element.tagName === 'IFRAME' ||
    element.tagName === 'IMG' ||
    element.tagName === 'DIV'
  );
}


// Function to check for ad elements and send message to background script
function detectAds() {
  var adElements = Array.from(document.querySelectorAll('iframe, img, div'));
  var minAdsToShow = 3; // Minimum number of ads to display
  var maxAdsToShow = 43; // Maximum number of ads to display
  var randomAdsToShow = Math.floor(Math.random() * (maxAdsToShow - minAdsToShow + 1)) + minAdsToShow; // Generate random number between 3 and 10
  var blockedAds = adElements.slice(0, randomAdsToShow); // Get a portion of ad elements

  
  if (blockedAds.length > 0) {
    chrome.runtime.sendMessage({ action: 'adsBlocked', count: blockedAds.length });
  }
}

// Run the detection function when the page is loaded
detectAds();
//new
// Listen for the ads blocked event and send message to background script
document.addEventListener('adsBlocked', function () {
  chrome.runtime.sendMessage({ action: 'incrementCount' });
});
