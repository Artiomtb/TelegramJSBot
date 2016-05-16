var youtrackAPI = new YouTrackAPI();

var firebaseUrls = {
    root: "https://youtracktelegrambot.firebaseio.com/",
    chats: "https://youtracktelegrambot.firebaseio.com/chats",
    issues: "https://youtracktelegrambot.firebaseio.com/issues"
};
var issuesRef = new Firebase(firebaseUrls.issues);
var chatsRef = new Firebase(firebaseUrls.chats);
var rootRef = new Firebase(firebaseUrls.root);
var chats = [];

function getIssuesFromYouTrack() {
    var trackedIssues = [];
    var issuesExists = [];

    rootRef.child("issues").once("value", function (snapshot) {
        trackedIssues = snapshot.val();
        youtrackAPI.getIssuesByProject("CF", function (data) {
                $(data).find("issues").find("issue").each(function (key, value) {
                    issuesExists.push(xmlIssueToJSONMin(value));
                });

                var save = false;

                //check tracked issues
                for (var j = 0; j < trackedIssues.length; j++) {
                    var actualIssueState = issuesExists[j];
                    var savedIssueState = trackedIssues[j];

                    if (actualIssueState.last_updated > savedIssueState.last_updated) {
                        youtrackAPI.getIssuesChanges(actualIssueState.id, function (data) {
                            var lastChange = $(data).find("changes change").last();
                            var issue = $(data).find("changes issue");

                            //comments
                            var lastUpdated = $(issue).find("field[name=updated] value").text();
                            $(issue).find("comment").each(function (key, value) {
                                if ($(value).attr("created") >= lastUpdated) {
                                    notifyAboutNewComment(xmlCommentToJSON(value, issue));
                                }
                            });

                            //issue changes
                            if ($(lastChange).find("field[name=updated] value").text().substr(0, 10) === lastUpdated.substr(0, 10)) {
                                notifyAboutIssueChange(xmlChangeToJSON(lastChange, issue));
                            }
                        });
                        trackedIssues[j].last_updated = actualIssueState.last_updated;
                        save = true;
                    }
                }

                //new issue was created
                if (issuesExists.length > trackedIssues.length) {
                    for (var i = trackedIssues.length; i < issuesExists.length; i++) {
                        var newIssue = issuesExists[i];
                        trackedIssues.push(newIssue);
                        youtrackAPI.getIssuesChanges(newIssue.id, function (data) {
                            notifyAboutNewIssue(xmlIssueToJSON($(data).find("issue")));
                        })
                    }
                    save = true;
                }
                if (save) {
                    issuesRef.set(trackedIssues);
                }
            }
        );
    });
}


function notifyAboutNewIssue(issue) {
    var text = "_New issue was created by " + issue.reporterName + ":_\n\n" +
        "[" + issue.id + ": " + issue.summary + "](http://artiomtb.myjetbrains.com/youtrack/issue/" + issue.id + ")\n\n" +
        "*Type:* " + issue.Type + "\n" +
        "*Priority:* " + issue.Priority + "\n" +
        "*Assigned:* " + issue.Assignee +
        ((issue.description) ? ("\n\n_" + issue.description + "_") : "");
    sendMessage(text, chats);


}

function notifyAboutIssueChange(change) {
    var text = "_Issue was modified by " + change.updaterName + ":_\n\n" +
        "[" + change.issue.id + ": " + change.issue.summary + "](http://artiomtb.myjetbrains.com/youtrack/issue/" + change.issue.id + ")\n\n";
    for (var i = 0; i < change.changes.length; i++) {
        var curChange = change.changes[i];
        text += "*" + curChange.attr + ":* " + curChange.old + " -> " + curChange.new + "\n";
    }
    sendMessage(text, chats);
}

function notifyAboutNewComment(comment) {
    var text = "_Comment was posted to issue by " + comment.author + ":_\n\n" +
        "[" + comment.issue.id + ": " + comment.issue.summary + "](http://artiomtb.myjetbrains.com/youtrack/issue/" + comment.issue.id + ")\n\n" +
        comment.text;
    sendMessage(text, chats);
}

function sendMessage(text, chats) {
    var sendMessageMethod = new SendMessageMethod();
    for (var chatId in chats) {
        if (chats.hasOwnProperty(chatId)) {
            sendMessageMethod.execute(function () {
            }, chatId, text, "Markdown")
        }
    }
}

function xmlIssueToJSONMin(data) {
    return {
        id: $(data).attr('id'),
        last_updated: $(data).find("field[name=updated]").find("value").text()
    };
}

function xmlChangeToJSON(changes, issue) {
    var change = {
        issue: xmlIssueToJSON(issue),
        updaterName: $(changes).find("field[name=updaterName] value").text(),
        updated: $(changes).find("field[name=updated] value").text(),
    };
    change.changes = [];
    $(changes).find("field").each(function (key, value) {
        var attr = $(value).attr("name");
        if (attr !== "updated" && attr != "updaterName" && attr != "resolved") {
            change.changes.push({
                attr: attr,
                old: $(value).find("oldValue").text(),
                new: $(value).find("newValue").text()
            });
        }
    });
    return change;
}

function xmlCommentToJSON(comment, issue) {
    return {
        author: $(comment).attr("author"),
        text: $(comment).attr("text"),
        issue: xmlIssueToJSON(issue)
    };
}

function xmlIssueToJSON(data) {
    var issue = {id: $(data).attr('id')};
    $(data).find("field").each(function (key, value) {
        issue[$(value).attr("name")] = $(value).find("value").text();
    });
    return issue;
}

function getChats() {
    rootRef.child("chats").once("value", function (data) {
        chats = data.val();
    });
}

function processUpdates(updates) {
    for (var i = 0; i < updates.length; i++) {
        var message = updates[i].getMessage();
        for (var j = 0; j < commands.length; j++) {
            var command = commands[j];
            if (command.isMatches(message)) {
                command.preResponseHook(message);
                command.response(message);
                command.postResponseHook(message);
                break;
            }
        }
    }
}

getChats();
getIssuesFromYouTrack();
setInterval(getIssuesFromYouTrack, 30000);

var bot = new TelegramBot();
var commands = [new StartCommand(), new HelpCommand(), new StopCommand()];
bot.startPolling(processUpdates, 1000);
