ClonerLog || (ClonerLog = console.log);
// window.CrazyGames.SDK.game.gameplayStart();
// window.CrazyGames.SDK.game.gameplayStop();
// window.CrazyGames.SDK.ad.requestAd("midgame", callbacks);


CrazyGames= new function() {
    this.CrazySDK= function() {
        this.getInstance= function() {
            ClonerLog("CrazyGames.CrazySDK.getInstance");

            this.requestAd=  async function(type = "midgame") {
                setTimeout(() => {
                    this.callListeners && this.callListeners("adFinished", { adType: type });
                }, 100);
                ClonerLog("CrazyGames.CrazySDK.getInstance.requestAd");
                return Promise.resolve();
            };

            this.requestBanner = async function() {
                ClonerLog("CrazyGames.CrazySDK.getInstance.requestBanner");
                return Promise.resolve();
            };

            this.postMessage = function(type, data) {
                ClonerLog("CrazyGames.CrazySDK.getInstance.postMessage", type, data);
                this.callListeners?.("adFinished", { adType: data?.adType });
                return;
            }
        }
    }
    this.SDK= new function() {
        this.game= {
            gameplayStart: function() {
                ClonerLog("CrazyGames.SDK.game.gameplayStart");
            },
            gameplayStop: function() {
                ClonerLog("CrazyGames.SDK.game.gameplayStop");
            }
        },
        this.ad= {
            requestAd: function(type, callbacks) {
                ClonerLog("CrazyGames.SDK.ad.requestAd", type, callbacks);
                const adFinished= callbacks?.["adFinished"];
                // const adError= callbacks?.["adError"];
                const adStarted= callbacks?.["adStarted"];
                adStarted && adStarted();
                return ClonerAd(adFinished);
                // adFinished && adFinished();
            }
        }
    }
}