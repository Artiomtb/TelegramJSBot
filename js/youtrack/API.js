function YouTrackAPI() {

    function sendRequest(path, data, method, success) {
        var sendUrl = "http://artiomtb.myjetbrains.com/youtrack/rest/" + path;
        $.ajax({
            url: sendUrl,
            method: method,
            dataType: 'xml',
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            data: data,
            success: success,
            error: function (xhr, status, err) {
                console.error(sendUrl, status, err.toString());
            }
        });
    }

    this.getIssuesChanges = function (issueId, callback) {
        var url = "issue/{issue}/changes".replace("{issue}", issueId);
        sendRequest(url, {}, "GET", function (data) {
            // console.log("success");
            // console.log(data);
            callback(data);
        });
    };

    this.getIssuesByProject = function (projectId, callback) {
        var url = "issue/byproject/{project}".replace("{project}", projectId);
        sendRequest(url, {max: 1000}, "GET", function (data) {
            callback(data);
        });
    };
}