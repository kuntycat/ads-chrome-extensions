const AD_SELECTORS = [
    'ytd-display-ad-renderer',
    'ytd-promoted-sparkles-web-renderer',
    'ytd-player-legacy-desktop-watch-ads-renderer',
    'div[class*="ad"]',
    'span[class*="ad"]',
    'iframe[src*="googleadservices"]',
    'video[src*="googleads"], video[src*="doubleclick"]', 
    'div[class*="sponsored"]',
    'div[class*="banner"]',
    'div[class*="popup"]',
];

let adCount = 0;
let blockingEnabled = true;

function hideAndSkipAds() {
    if (!blockingEnabled) return; 

    console.log('hideAndSkipAds called');
    AD_SELECTORS.forEach(selector => {
        const ads = document.querySelectorAll(selector);
        ads.forEach(ad => {
            ad.style.display = 'none'; 
            adCount++;
            console.log(`Ad hidden: ${ad.outerHTML}`);
        });
    });

    const videoAds = document.querySelectorAll('video');
    videoAds.forEach(video => {
        if (video.src.includes('googleads') || video.src.includes('doubleclick')) {
            video.addEventListener('playing', () => {
                setTimeout(() => {
                    video.currentTime = video.duration; 
                    console.log('Video ad skipped');
                }, 50); 
            });

            video.addEventListener('loadedmetadata', () => {
                if (video.duration > 0) {
                    setTimeout(() => {
                        video.currentTime = video.duration; 
                        console.log('Video ad skipped (unskippable)');
                    }, Math.min(video.duration * 1000, 5000)); 
                }
            });
        }
    });

    chrome.runtime.sendMessage({ blockedCount: adCount }); 
    console.log(`Ads hidden: ${adCount}`);
}

const observer = new MutationObserver(hideAndSkipAds);
observer.observe(document.body, { childList: true, subtree: true });

chrome.storage.local.get(['blockingEnabled'], (result) => {
    blockingEnabled = result.blockingEnabled !== undefined ? result.blockingEnabled : true;
    if (blockingEnabled) {
        hideAndSkipAds();
    } else {
        observer.disconnect(); 
    }
});
