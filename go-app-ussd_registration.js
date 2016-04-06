// WARNING: This is a generated file.
//          If you edit it you will be sad.
//          Edit src/app.js instead.

var go = {};
go;

/*jshint -W083 */
var _ = require('lodash');
// var Q = require('q');
var moment = require('moment');
var vumigo = require('vumigo_v02');
// var Choice = vumigo.states.Choice;
var JsonApi = vumigo.http.api.JsonApi;


// Shared utils lib
go.utils = {

    check_is_registered: function(contact) {
        return !_.isUndefined(contact.extra.registration_id);
    },

    check_valid_number: function(input) {
        // an attempt to solve the insanity of JavaScript numbers
        var numbers_only = new RegExp('^\\d+$');
        return input !== '' && numbers_only.test(input) && !Number.isNaN(Number(input));
    },

    check_valid_alpha: function(input) {
        var alpha_only = new RegExp('^[A-Za-z]+$');
        return input !== '' && alpha_only.test(input);
    },

    get_today: function(config) {
        var today;
        if (config.testing_today) {
            today = new moment(config.testing_today);
        } else {
            today = new moment();
        }
        return today;
    },

    get_clean_first_word: function(user_message) {
        return user_message
            .split(" ")[0]          // split off first word
            .replace(/\W/g, '')     // remove non letters
            .toUpperCase();         // capitalise
    },

    get_extra_words: function(user_message) {
        if (user_message.trim().split(" ").length === 1) {
            // no extra words
            return null;
        } else {
            return user_message
                .substr(user_message.indexOf(" ") + 1) // remove first word
                .trim();     // remove whitespace at end
        }
    },

    service_api_call: function (service, method, params, payload, endpoint, im) {
        var http = new JsonApi(im, {
            headers: {
                'Authorization': ['Token ' + im.config.services[service].api_token]
            }
        });
        switch (method) {
            case "post":
                return http.post(im.config.services[service].url + endpoint, {
                    data: payload
                });
            case "get":
                return http.get(im.config.services[service].url + endpoint, {
                    params: params
                });
            case "patch":
                return http.patch(im.config.services[service].url + endpoint, {
                    data: payload
                });
            case "put":
                return http.put(im.config.services[service].url + endpoint, {
                    params: params,
                  data: payload
                });
            case "delete":
                return http.delete(im.config.services[service].url + endpoint);
            }
    },

    "commas": "commas"
};

go.app = function() {
    var vumigo = require('vumigo_v02');
    var App = vumigo.App;
    //var Choice = vumigo.states.Choice;
    //var ChoiceState = vumigo.states.ChoiceState;
    var EndState = vumigo.states.EndState;
    var FreeText = vumigo.states.FreeText;


    var GoUOPBMOH = App.extend(function(self) {
        App.call(self, 'state_start');
        var $ = self.$;

        self.init = function() {};


    // TEXT CONTENT

        var questions = {
            "state_id":
                "Welcome to TB Connect. Please enter your id number",
            "state_name":
                "Please enter your name",
            "state_site":
                "Which site do you work at?",

            "state_end_thank_you":
                "Thank you. They will now start receiving messages.",
        };

        var errors = {
            "state_auth_code":
                "That code is not recognised. Please enter your 5 digit personnel code.",
        };

        get_error_text = function(name) {
            return errors[name] || "Sorry not a valid input. " + questions[name];
        };

        // override normal state adding
        self.add = function(name, creator) {
            self.states.add(name, function(name, opts) {
                return creator(name, opts);
            });
        };


    // START STATE

        self.add('state_start', function(name) {
            // Reset user answers when restarting the app
            self.im.user.answers = {};
            return self.states.create('state_id');
        });

    // REGISTRATION STATES

        // FreeText st-01
        self.add('state_id', function(name) {
            return new FreeText(name, {
                question: $(questions[name]),
                next: function(input) {
                    return 'state_name';
                }
            });
        });

        // FreeText st-02
        self.add('state_name', function(name) {
            return new FreeText(name, {
                question: $(questions[name]),
                next: function(input) {
                    return 'state_site';
                }
            });
        });

        // FreeText st-03
        self.add('state_site', function(name) {
            return new FreeText(name, {
                question: $(questions[name]),
                next: function(input) {
                    return 'state_end_thank_you';
                }
            });
        });

        // EndState st-04
        self.add('state_end_thank_you', function(name) {
            return new EndState(name, {
                text: $(questions[name]),
                next: 'state_start'
            });
        });

    });

    return {
        GoUOPBMOH: GoUOPBMOH
    };
}();

go.init = function() {
    var vumigo = require('vumigo_v02');
    var InteractionMachine = vumigo.InteractionMachine;
    var GoUOPBMOH = go.app.GoUOPBMOH;

    return {
        im: new InteractionMachine(api, new GoUOPBMOH())
    };
}();
