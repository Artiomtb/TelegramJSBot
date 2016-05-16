function Command() {
    this.isMatches = function (message) {
        return false;
    };

    this.preResponseHook = function (message) {
    };

    this.response = function (message) {
    };

    this.postResponseHook = function (message) {
    };
}

function StartCommand() {
    this.isMatches = function (message) {
        return message.getText().startsWith("/start");
    };

    this.response = function (message) {
        var sendAnswer = new SendMessageMethod();
        var answerText = "Hello and welcome, " +
            (
                (message.getChat().getType() === "private") ?
                    (message.getFrom().getFirstName() + " " + message.getFrom().getLastName()) :
                    (message.getChat().getTitle() + " chat")
            ) + "!";
        sendAnswer.execute(function () {
        }, message.getChat().getId(), answerText);
    };

    this.postResponseHook = function (message) {
        var chat = message.getChat();
        var postData = {id: chat.getId(), type: chat.getType(), settings: {}};
        chatsRef.child(chat.getId()).transaction(function (data) {
                if (data === null) {
                    return postData;
                }
            }
        );
        getChats();
    };
}
StartCommand.prototype = new Command();

function HelpCommand() {
    this.isMatches = function (message) {
        return message.getText().startsWith("/help");
    };

    this.response = function (message) {
        var sendAnswer = new SendMessageMethod();
        sendAnswer.execute(function () {
        }, message.getChat().getId(), "This is help for bot");
    }
}
HelpCommand.prototype = new Command();

function StopCommand() {
    this.isMatches = function (message) {
        return message.getText().startsWith("/stop");
    };

    this.response = function (message) {
        var sendAnswer = new SendMessageMethod();
        sendAnswer.execute(function () {
        }, message.getChat().getId(), "Bot posting to this chat was disabled. Execute /start command again to enable");
    };

    this.postResponseHook = function (message) {
        var chatId = message.getChat().getId();
        console.log(chats);
        delete chats[chatId];
        console.log(chats);
        rootRef.child("chats").set(chats);
        getChats();
    }
}
StopCommand.prototype = new Command();