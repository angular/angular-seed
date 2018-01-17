const request = require('request');

var accountDefault = {
        "username": "defaultUser",
        "password": "4321",
        "twitter": "@4321"
    }

var github = {
    getOptions: function(username) {
        return {
            url: 'https://api.github.com/users/' + username + '/followers',
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Accept-Charset': 'utf-8',
                'User-Agent': 'my-reddit-client'
            }
        };
    }
}

var appRouter = function(app) {
    app.get("/", function(req, res) {
        res.send(accountDefault);
    });
    app.get("/foo", function(req, res) {
            res.json({"foo": "bar"});
        });
    app.get("/account", function(req, res) {
        var accountMock = {
            "username": "nraboy",
            "password": "1234",
            "twitter": "@nraboy"
        }
        if(!req.query.username) {
            return res.send({"status": "error", "message": "missing username"});
        } else if(req.query.username != accountMock.username) {
            return res.send({"status": "error", "message": "wrong username"});
        } else {
            return res.json(accountMock);
        }
    });
    app.get("/github/followers", function(req, response) {
        response.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');
        response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        response.setHeader('Access-Control-Allow-Credentials', true);
        if(req.query.username) {
            var json;
            request(github.getOptions(req.query.username), function(err, res, body) {
                json = JSON.parse(body);
                return response.json(json);
            });
            }
        });
}

module.exports = appRouter;