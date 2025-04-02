document.addEventListener('DOMContentLoaded', function () {
    let switchInput = document.querySelector('.switch-input');

    // Retrieve the extension state from browser storage
    let extensionEnabled = localStorage.getItem('extensionEnabled') === 'true';

    // Set the initial state of the switch based on the retrieved state
    switchInput.checked = extensionEnabled;

    // If the extension was previously enabled, call the enableExtension function
    if (extensionEnabled) {
        enableExtension();
    }

    switchInput.addEventListener('change', function () {
        if (this.checked) {
            enableExtension();
            // Update the extension state in browser storage
            localStorage.setItem('extensionEnabled', 'true');
        } else {
            disableExtension();
            // Update the extension state in browser storage
            localStorage.setItem('extensionEnabled', 'false');
        }
    });

    function enableExtension() {
    // Send a message to the background script to enable the extension
    chrome.runtime.sendMessage({ action: 'enableExtension' });
     }

    function disableExtension() {
    // Send a message to the background script to disable the extension
    chrome.runtime.sendMessage({ action: 'disableExtension' });
}

});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'enableExtension') {
        // Add your logic to enable the extension here
        // For example, store the enabled state in localStorage
        localStorage.setItem('extensionEnabled', true);
        
        // Or execute other enabling logic
        
        // If needed, send a response back to the content script
        sendResponse({ success: true });
    }
});
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'disableExtension') {
        // Add your logic to disable the extension here
        // For example, remove the enabled state from localStorage
        localStorage.removeItem('extensionEnabled');
        
        // Or execute other disabling logic
        
        // If needed, send a response back to the content script
        sendResponse({ success: true });
    }
});


function toggleExtension(enabled) {
    chrome.runtime.sendMessage({ action: 'toggleExtension', enabled: enabled });
}

// Example conditional logic
if (condition) {
    toggleExtension(true); // Enable the extension
} else {
    toggleExtension(false); // Disable the extension
}


// popup.js
document.addEventListener('DOMContentLoaded', function () {
    // Retrieve statistics from local storage or chrome.storage
    chrome.storage.local.get(['adsBlocked', 'dataSaved'], function (result) {
        const adsBlocked = result.adsBlocked || 0;
        const dataSaved = result.dataSaved || 0;

        // Update the popup with the retrieved statistics
        document.getElementById('adsBlocked').textContent = adsBlocked;
        document.getElementById('dataSaved').textContent = formatBytes(dataSaved);
    });
});

// Function to format bytes into a more human-readable format (KB, MB, GB, etc.)
function formatBytes(bytes) {
    // Implementation of formatting logic (e.g., converting bytes to KB, MB, GB)
    // Example implementation: return (bytes / 1024).toFixed(2) + ' KB';
}
