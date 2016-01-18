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
    var MetricsHelper = require('go-jsbox-metrics-helper');
    var App = vumigo.App;
    var EndState = vumigo.states.EndState;


    var GoUOPBOH = App.extend(function(self) {
        App.call(self, 'state_start');
        var $ = self.$;

        self.init = function() {

            // Use the metrics helper to add some metrics
            mh = new MetricsHelper(self.im);
            mh
                // Total unique users
                .add.total_unique_users('total.sms.unique_users')

                // Total opt-outs
                .add.total_state_actions(
                    {
                        state: 'state_opt_out',
                        action: 'enter'
                    },
                    'total.optouts'
                )

                // Total opt-ins
                .add.total_state_actions(
                    {
                        state: 'state_opt_in',
                        action: 'enter'
                    },
                    'total.optins'
                )

                // Total opt-ins
                .add.total_state_actions(
                    {
                        state: 'state_unrecognised',
                        action: 'enter'
                    },
                    'total.unrecognised_sms'
                );

            // Load self.contact
            return self.im.contacts
                .for_user()
                .then(function(user_contact) {
                   self.contact = user_contact;
                });
        };


        self.states.add('state_start', function() {
            var user_first_word = go.utils.get_clean_first_word(self.im.msg.content);
            switch (user_first_word) {
                case "STOP":
                    return self.states.create("state_stop");
                case "HELP":
                    return self.states.create("state_help");
                default:
                    return self.states.create("state_unrecognised");
            }
        });


        self.states.add('state_stop', function(name) {
            return self.states.create('state_stop_completed');
        });

        self.states.add('state_stop_completed', function(name, creator_opts) {
            return new EndState(name, {
                text: $('Removed! You will no longer recieve messages from us.'),
                next: 'state_start'
            });
        });


        // HELP
        self.states.add('state_help', function(name) {
            return new EndState(name, {
                text: $(["You can send me the following commands:",
                         "stop"
                        ].join('\n')),
                next: 'state_start'
            });
        });

        // UNRECOGNISED
        self.states.add('state_unrecognised', function(name) {
            return new EndState(name, {
                text: $('Oh no! We did not recognise the command you sent us. Reply "help" to get a list.'),
                next: 'state_start'
            });
        });

        // ERROR
        self.states.add('state_error', function(name) {
            return new EndState(name, {
                text: $('Ooops! Something went wrong with your request. Try sending it again in a moment please.'),
                next: 'state_start'
            });
        });


    });

    return {
        GoUOPBOH: GoUOPBOH
    };
}();

go.init = function() {
    var vumigo = require('vumigo_v02');
    var InteractionMachine = vumigo.InteractionMachine;
    var GoUOPBOH = go.app.GoUOPBOH;

    return {
        im: new InteractionMachine(api, new GoUOPBOH())
    };
}();
