function AbstractTelegramMethod() {

    var token = "171121786:AAHjBiBIPIcryuueYsEI1DyYeMCCHURN1mA";

    this.telegramAjaxRequest = function (urlMethod, httpMethod, data, successCallback) {
        var sendUrl = "https://api.telegram.org/bot" + token + "/" + urlMethod;
        $.ajax({
            url: sendUrl,
            method: httpMethod,
            data: data,
            success: function (data) {
                if (data.ok) {
                    successCallback(data.result);
                }
            },
            error: function (xhr, status, err) {
                console.error(sendUrl, status, err.toString());
            }
        });
    }
}

function GetMeMethod() {
    var urlMethod = "getMe";
    var httpMethod = "GET";

    this.execute = function (callback) {
        this.telegramAjaxRequest(urlMethod, httpMethod, null, function (result) {
            callback(User.make(result));
        });
    }
}
GetMeMethod.prototype = new AbstractTelegramMethod();

function GetUpdatesMethod() {
    var urlMethod = "getUpdates";
    var httpMethod = "GET";

    this.execute = function (callback, offset, limit, timeout) {
        this.telegramAjaxRequest(urlMethod, httpMethod, {offset: offset, limit: limit, timeout: timeout}, function (result) {
            updates = [];
            for (var i = 0; i < result.length; i++) {
                updates.push(Update.make(result[i]));
            }
            callback(updates);
        });
    }
}
GetUpdatesMethod.prototype = new AbstractTelegramMethod();

function SendMessageMethod() {
    var urlMethod = "sendMessage";
    var httpMethod = "POST";

    this.execute = function (callback, chat_id, text, parse_mode, disable_web_page_preview, disable_notification, reply_to_message_id) {
        var data = {
            chat_id: chat_id,
            text: text,
            parse_mode: parse_mode,
            disable_web_page_preview: disable_web_page_preview,
            disable_notification: disable_notification,
            reply_to_message_id: reply_to_message_id
        };
        this.telegramAjaxRequest(urlMethod, httpMethod, data, function (result) {
            callback(Message.make(result));
        });
    }
}
SendMessageMethod.prototype = new AbstractTelegramMethod();