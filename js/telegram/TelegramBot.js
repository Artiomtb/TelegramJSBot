/**
 * Class to process async polling to telegram api
 * @constructor
 */
function TelegramBot() {

    var updateOffset = undefined;
    var getUpdatesMethod = new GetUpdatesMethod();

    function processUpdates(updates) {
        if (updates.length) {
            updateOffset = updates[updates.length - 1].getUpdateId() + 1;
        }

        return updates;
    }

    /**
     * Call this method to start getUpdates polling from telegram API
     * @param callback 
     * @param interval
     */
    this.startPolling = function (callback, interval) {
        if (interval === undefined) {
            interval = 5000;
        }
        setInterval(function () {
                getUpdatesMethod.execute(function(updates) {
                    if (updates.length) {
                        updateOffset = updates[updates.length - 1].getUpdateId() + 1;
                    }
                    callback(updates);
                }, updateOffset, undefined, undefined)
            }, interval
        );
    }
}