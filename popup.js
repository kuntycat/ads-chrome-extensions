document.addEventListener('DOMContentLoaded', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const fullUrl = tabs[0].url; 
        try {
            const domain = new URL(fullUrl).hostname; 
            document.getElementById('current-domain').innerText = domain.replace(/^www\./, ''); 
        } catch (error) {
            console.error('Error parsing URL:', error);
            document.getElementById('current-domain').innerText = 'Invalid URL';
        }
    });

    chrome.storage.local.get(['blockingEnabled', 'adCount', 'cookieBlockingEnabled'], (result) => {
        const blockingEnabled = result.blockingEnabled !== undefined ? result.blockingEnabled : true;
        const statusText = blockingEnabled ? "Blocking enabled." : "Blocking disabled.";
        document.getElementById('status').innerText = statusText;

        document.getElementById('ad-count').innerText = result.adCount || 0; 

        const cookieBlockingEnabled = result.cookieBlockingEnabled !== undefined ? result.cookieBlockingEnabled : true;
        const cookieStatusText = cookieBlockingEnabled ? "Cookie blocking enabled." : "Cookie blocking disabled.";
        document.getElementById('cookie-status').innerText = cookieStatusText;
    });

    document.getElementById('toggle-blocking').addEventListener('click', () => {
        chrome.storage.local.get(['blockingEnabled'], (result) => {
            const newBlockingState = !result.blockingEnabled;
            chrome.storage.local.set({ blockingEnabled: newBlockingState });

            const statusText = newBlockingState ? "Blocking enabled." : "Blocking disabled.";
            document.getElementById('status').innerText = statusText;
        });
    });

    document.getElementById('toggle-cookies').addEventListener('click', () => {
        chrome.storage.local.get(['cookieBlockingEnabled'], (result) => {
            const newCookieBlockingState = !result.cookieBlockingEnabled;
            chrome.storage.local.set({ cookieBlockingEnabled: newCookieBlockingState });

            const cookieStatusText = newCookieBlockingState ? "Cookie blocking enabled." : "Cookie blocking disabled.";
            document.getElementById('cookie-status').innerText = cookieStatusText;
        });
    });

    chrome.runtime.onMessage.addListener((message) => {
        if (message.blockedCount !== undefined) {
            document.getElementById('ad-count').innerText = `Ads Blocked: ${message.blockedCount}`;
        }
    });
});
