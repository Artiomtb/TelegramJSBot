function User(id, first_name, last_name, username) {
    var id = id;
    var first_name = first_name;
    var last_name = last_name;
    var username = username;

    this.getId = function () {
        return id;
    };
    this.getFirstName = function () {
        return first_name;
    };
    this.getLastName = function () {
        return last_name;
    };
    this.getUsername = function () {
        return username;
    }
};
User.make = function (data) {
    return new User(data.id, data.first_name, data.last_name, data.username);
};

function Update(update_id, message) {
    var update_id = update_id;
    var message = message;

    this.getUpdateId = function () {
        return update_id;
    };
    this.getMessage = function () {
        return message;
    }
};
Update.make = function (data) {
    return new Update(
        data.update_id,
        Message.make(data.message)
    );
};

function Chat(id, type, title, username, first_name, last_name) {
    var id = id;
    var type = type;
    var title = title;
    var username = username;
    var first_name = first_name;
    var last_name = last_name;

    this.getId = function () {
        return id;
    };
    this.getType = function () {
        return type;
    };
    this.getTitle = function () {
        return title;
    };
    this.getUsername = function () {
        return title;
    };
    this.getFirstName = function () {
        return first_name;
    };
    this.getLastName = function () {
        return last_name;
    }
};
Chat.make = function (data) {
    return new Chat(data.id, data.type, data.title, data.username, data.first_name, data.last_name);
};

function Message(message_id, from, date, chat, reply_to_message, text) {
    var message_id = message_id;
    var from = from;
    var date = date;
    var chat = chat;
    var reply_to_message = reply_to_message;
    var text = text;

    this.getMessageId = function () {
        return id;
    };
    this.getFrom = function () {
        return from;
    };
    this.getDate = function () {
        return date;
    };
    this.getChat = function () {
        return chat;
    };
    this.getReplyMessage = function () {
        return reply_to_message;
    };
    this.getText = function () {
        return text;
    }
};
Message.make = function (data) {
    return new Message(
        data.message_id,
        User.make(data.from),
        data.date,
        Chat.make(data.chat),
        data.reply_to_message_id,
        data.text
    )
};

