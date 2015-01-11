/**
 * Created by tudor on 07/01/15.
 */

var OAuth = Meteor.npmRequire("mashape-oauth").OAuth;
var fs = Npm.require("fs");
var base = process.env.PWD;
var privateKeyData = fs.readFileSync(base + "/server/config/rsa.pem", "utf8");

var consumer = new OAuth({
    requestUrl: "http://localhost:8080/plugins/servlet/oauth/request-token",
    accessUrl: "http://localhost:8080/plugins/servlet/oauth/access-token",
    callback:"http://localhost:3000/oauth_callback",
    consumerKey: "scrumhub",
    consumerSecret: privateKeyData,
    version: "1.0",
    signatureMethod: "RSA-SHA1"
});

Meteor.methods({
    startOAuth: function (user) {
        var startOAuth = Async.runSync(function(done) {
            consumer.getOAuthRequestToken(
                function(error, oauthToken, oauthTokenSecret, results) {
                    if (error) {
                        done(null, {success: false});
                    }
                    else {
                        done(null, {success: true, token: oauthToken});
                    }
                }
            )
        });
        if (startOAuth.result.success === true) {
            var jiraProvider = Providers.findOne({user: Meteor.userId(), name: "jira"});
            if (jiraProvider) {
                Providers.update(jiraProvider._id, {requestToken: startOAuth.result.token});
            }
            else {
                var provider = {
                    name: "jira",
                    user: Meteor.userId(),
                    requestToken: startOAuth.result.token,
                    accessToken: "",
                    accessTokenVerifier: ""
                };
                Providers.insert(provider);
            }
        }
        return startOAuth.result;
    },

    finishOauth: function(oauthToken, oauthVerifier) {
        var finishOAuth = Async.runSync(function(done) {
            consumer.getOAuthAccessToken({
                oauth_verifier: oauthVerifier,
                oauth_token: oauthToken
            }, function(error, token, secret, result) {
                var result = {success: false, error: ""};
                if (error) {
                    result.error = "There was a problem in establishing a connection to JIRA";
                }
                else {
                    result = {
                        success: true,
                        token: token,
                        secret: secret
                    };
                }
                done(null, result);
            });
        });
        if (finishOAuth.result.success === true) {
            var jiraProvider = Providers.findOne({user: Meteor.userId(), name: "jira"});
            if (jiraProvider) {
                return !!Providers.update(
                    jiraProvider._id,
                    {
                        $set: {
                            accessToken: finishOAuth.result.token,
                            secret: finishOAuth.result.secret
                        }
                    });

            }
            return false;
        }
        return false;
    }
});