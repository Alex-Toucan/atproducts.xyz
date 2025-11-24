(function() {
    // Helper to get URL parameters
    function getURLParam(name) {
        const match = RegExp("[?&]" + name + "=([^&]*)").exec(window.location.search);
        return match ? decodeURIComponent(match[1].replace(/\+/g, " ")) : "";
    }

    function UniversalPokiSDK() {
        const self = this;

        // Queue placeholder for future use
        this.queue = [];

        // --- Core Methods ---
        this.init = function(options = {}) {
            return new Promise(resolve => {
                console.log("PokiSDK.init called (stub)", options);
                resolve(true);
            });
        };

        this.rewardedBreak = function() {
            return new Promise(resolve => {
                console.log("PokiSDK.rewardedBreak called → opening fallback URL");
                const promoUrl = "https://632.mark.qureka.com/intro/question";
                const newTab = window.open(promoUrl, "_blank");
                if (!newTab) window.location.href = promoUrl;
                resolve(true);
            });
        };

        this.commercialBreak = function() {
            return new Promise(resolve => {
                console.log("PokiSDK.commercialBreak called (stub)");
                resolve(true);
            });
        };

        this.customEvent = function(...args) { console.log("PokiSDK.customEvent called (stub)", args); };
        this.displayAd = function(...args) { console.log("PokiSDK.displayAd called (stub)", args); };
        this.destroyAd = function(...args) { console.log("PokiSDK.destroyAd called (stub)", args); };
        this.getLeaderboard = function() { return new Promise(resolve => { console.log("PokiSDK.getLeaderboard called (stub)"); resolve([]); }); };
        this.getSharableURL = function() { return new Promise((_, reject) => reject()); };
        this.getURLParam = function(param) { return getURLParam("gd" + param) || getURLParam(param) || ""; };

        // --- Gameplay / Game State ---
        this.gameLoadingStart = function() { console.log("PokiSDK.gameLoadingStart called (stub)"); };
        this.gameLoadingFinished = function() { console.log("PokiSDK.gameLoadingFinished called (stub)"); };
        this.gameplayStart = function() { console.log("PokiSDK.gameplayStart called (stub)"); };
        this.gameplayStop = function() { console.log("PokiSDK.gameplayStop called (stub)"); };
        this.setDebug = function(flag) { console.log("PokiSDK.setDebug called (stub)", flag); };

        // --- Original Poki SDK functions ---
        const noArgFuncs = [
            "disableProgrammatic", "gameInteractive", "roundStart",
            "roundEnd", "muteAd"
        ];
        const oneArgFuncs = [
            "setDebug", "gameplayStart", "gameplayStop", "gameLoadingProgress",
            "happyTime", "setPlayerAge", "togglePlayerAdvertisingConsent",
            "logError", "sendHighscore", "setDebugTouchOverlayController"
        ];

        noArgFuncs.forEach(fn => { self[fn] = () => console.log(`PokiSDK.${fn} called (stub)`); });
        oneArgFuncs.forEach(fn => { self[fn] = (arg) => console.log(`PokiSDK.${fn} called (stub)`, arg); });

        // --- Analytics / Error / Internal Functions ---
        this.measure = function(...args) { console.log("PokiSDK.measure called (stub)", args); };
        this.captureError = function(...args) { console.log("PokiSDK.captureError called (stub)", args); };
        this.sendAnalyticsEvent = function(...args) { console.log("PokiSDK.sendAnalyticsEvent called (stub)", args); };

        // --- Additional safety stubs for future calls ---
        this.happyTime = function(...args) { console.log("PokiSDK.happyTime called (stub)", args); };
    }

    // Singleton instance
    const sdkInstance = new UniversalPokiSDK();
    window.PokiSDK = sdkInstance;
    window.pokiSDK = sdkInstance;

})();
