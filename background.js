// Constants
const BLOCKED_AD_URLS = [
    "*://*.doubleclick.net/*",
    "*://*.googlesyndication.com/*",
    "*://*.google-analytics.com/*",
    "*://*.ytimg.com/*ad*",
    "*://*.google.com/pagead/*",
    "*://*.googleadservices.com/*",
    "*://*.ads.youtube.com/*",
    "*://*.youtube.com/pagead/*",
    "*://*.youtube.com/api/ads*",
    "*://*.facebook.com/*ads*",
    "*://*.facebook.com/*sponsored*",
    "*://*.facebook.com/plugins/*",
    "*://*.googlevideo.com/videoplayback*ad*",
    "*://*.youtube.com/ads*",
    "*://*.youtube.com/get_video_ads*",
    "*://*.youtube.com/video_ads*",
    "*://*.youtube.com/annotations_ad*",
    "*://*.youtube.com/advertisements*",
    "*://*.youtube.com/adsense*",
    "*://*.youtube.com/partner_ads*",
];

// Blocking third-party tracking
const BLOCKED_TRACKING_URLS = [
    "*://*.adserver.com/*",
    "*://*.track.ad/*",
    "*://*.analytics.com/*",
];

let blockingEnabled = true; 
let blockedAdsCount = 0; 

chrome.storage.local.get(['blockingEnabled'], (result) => {
    blockingEnabled = result.blockingEnabled !== undefined ? result.blockingEnabled : true;
});

chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
        if (blockingEnabled) {
            blockedAdsCount++;
            chrome.runtime.sendMessage({ blockedCount: blockedAdsCount });
            return { cancel: true };
        }
    },
    { urls: [...BLOCKED_AD_URLS, ...BLOCKED_TRACKING_URLS] },
    ["blocking"]
);

chrome.storage.onChanged.addListener((changes) => {
    if (changes.blockingEnabled) {
        blockingEnabled = changes.blockingEnabled.newValue;
    }
});
