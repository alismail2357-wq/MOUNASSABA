(function() {
    const files = ['communes.js', 'utilsLibrary.js', 'injectedLogic.js'];
    files.forEach(file => {
        const script = document.createElement('script');
        script.src = chrome.runtime.getURL(file);
        script.async = false; // Order is vital
        (document.head || document.documentElement).appendChild(script);
    });
})();