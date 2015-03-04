/**
 * Created by tudor on 28/01/15.
 */


JIRAConnector = (function JIRAConnector() {

    var private = {};

    private.privateKeyData = Npm.require("fs").readFileSync(process.env.PWD + "/server/connectors/jira/config/rsa.pem", "utf8");
    private.oAuthModule = Meteor.npmRequire("oauth").OAuth;
    private.oAuth = new private.oAuthModule(
        "http://localhost:8080/plugins/servlet/oauth/request-token",
        "http://localhost:8080/plugins/servlet/oauth/access-token",
        "scrumhub",
        private.privateKeyData,
        "1.0",
        "http://localhost:3000/oauth_callback",
        "RSA-SHA1",
        null);
    private.getProviderData = function getProviderData() {
        return Providers.findOne({user: Meteor.userId(), name: "jira"});
    };
    private.getURLFor = function getURLFor(resource) {
        return JIRAConnectorConfig.URL_BASE + JIRAConnectorConfig[resource];
    };


    /**
     * Overrode the method from the npm package as there is a bug in which the
     * header Content-Type is implicitly set to application/x-www-form-urlencoded for GET
     * requests. This is causing a problem with JIRA REST API which is returning a 415 response.
     * I've set it here to application/json, as this is what JIRA expects.
     * @param url
     * @param oauth_token
     * @param oauth_token_secret
     * @param callback
     * @returns {*}
     */
    private.oAuth.get = function(url, oauth_token, oauth_token_secret, content_type, callback) {
        //return this._performSecureRequest( oauth_token, oauth_token_secret, "GET", url, null, "", "application/json", callback );

        // The content_type parameter has been added.
        // Older versions of the library had the callback in the place of content_type, so less parameters.
        // To keep the coding style similar, i did not add the content_type as the last parameter. This could cause problems with backward compatibility.
        // So I'm trying to find out if the content_type is really a string or if it is the callback.
        // This makes content_type optional.
        var requestCallback,
            requestContentType;
        if (callback === undefined) {
            requestCallback = content_type;
            requestContentType = null;
        } else {
            requestCallback = callback;
            requestContentType = content_type;
        }

        return this._performSecureRequest( oauth_token, oauth_token_secret, "GET", url, null, "", requestContentType, requestCallback );

    };

    var module = {
        getOAuthRequestToken: function getOAuthRequestToken() {
            var oauth = Async.runSync(function(done) {
                private.oAuth.getOAuthRequestToken(
                    function(error, oauthToken, oauthTokenSecret) {
                        if (error) {
                            done(null, {success: false});
                        } else {
                            done(null, {success: true, token: oauthToken, secret: oauthTokenSecret});
                        }
                    }
                );
            });
            if (oauth.result.success === true) {
                var jiraProvider = private.getProviderData();
                if (jiraProvider) {
                    Providers.update(jiraProvider._id, {requestToken: oauth.result.token});
                } else {
                    var provider = {
                        name: "jira",
                        user: Meteor.userId(),
                        requestToken: oauth.result.token,
                        accessToken: "",
                        accessTokenVerifier: "",
                        secret: oauth.result.secret
                    };
                    Providers.insert(provider);
                }
            }

            return oauth.result;
        },
        getOAuthAccessToken: function getOAuthAccessToken(verifier) {
            if (!verifier) {
                throw "The verifier parameter needs to be set";
            }
            var jiraProvider = private.getProviderData();
            if (!jiraProvider) {
                throw "The JIRA provider could not be found in the DB";
            }
            var oauth = Async.runSync(function(done) {
                private.oAuth.getOAuthAccessToken(
                    jiraProvider.requestToken,
                    jiraProvider.secret,
                    verifier,
                    function(error, token, secret) {
                        if (error) {
                            done(null, {success: false});
                        } else {
                            done(null, {success: true, token: token, secret:secret});
                        }
                    }
                )
            });

            if (oauth.result.success === true) {
                Providers.update(jiraProvider._id, {
                    $set: {
                        accessToken: oauth.result.token,
                        secret: oauth.result.secret
                    }
                });
            }
            return oauth.result;
        },

        searchForUsers: function searchForUsers(username) {
            var jiraProvider = private.getProviderData();
            if (jiraProvider.accessToken !== "") {
                var runMethod = Async.runSync(function (done) {
                    private.oAuth.get(
                        private.getURLFor("URL_USER_SEARCH") + "?username=" + encodeURIComponent(username) + "&startAt=0&maxResults=10",
                        jiraProvider.accessToken,
                        jiraProvider.secret,
                        "application/json",
                        function (error, data) {
                            if (error) {
                                done(null, {success: false});
                            } else {
                                done(null, {success: true, data: JSON.parse(data)});
                            }
                        }
                    )
                });
                return runMethod.result;
            } else {
                return {
                    success: false
                }
            }
        },

        getUserFilters: function getUserFilters() {
            var jiraProvider = private.getProviderData();
            if (jiraProvider.accessToken !== "") {
                var runMethod = Async.runSync(function (done) {
                    private.oAuth.get(
                        private.getURLFor("URL_FILTERS_FAVOURITE"),
                        jiraProvider.accessToken,
                        jiraProvider.secret,
                        "application/json",
                        function (error, data) {
                            if (error) {
                                done(null, {success: false});
                            } else {
                                done(null, {success: true, data: JSON.parse(data)});
                            }
                        }
                    )
                });
                return runMethod.result;
            } else {
                return {
                    success: false
                }
            }
        },

        getInfoAboutMyself: function getInfoAboutMyself() {
            var jiraProvider = private.getProviderData();
            if (jiraProvider.accessToken !== "") {
                var runMethod = Async.runSync(function (done) {
                    private.oAuth.get(
                        private.getURLFor("URL_MYSELF"),
                        jiraProvider.accessToken,
                        jiraProvider.secret,
                        "application/json",
                        function (error, data) {
                            if (error) {
                                done(null, {success: false});
                            } else {
                                done(null, {success: true, data: JSON.parse(data)});
                            }
                        }
                    )
                });
                return runMethod.result;
            } else {
                return {
                    success: false
                }
            }
        }
    };


    return module;
})();