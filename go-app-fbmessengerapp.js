// WARNING: This is a generated file.
//          If you edit it you will be sad.
//          Edit src/app.js instead.

var go = {};
go;

/*jshint -W083 */
var vumigo = require('vumigo_v02');
var moment = require('moment');
var assert = require('assert');
var _ = require('lodash');
var JsonApi = vumigo.http.api.JsonApi;
var Choice = vumigo.states.Choice;
var ChoiceState = vumigo.states.ChoiceState;

go.states = {
    MessengerChoiceState: ChoiceState.extend(function(self, name, opts) {
        /*
        Automatically add the necessary helper metadata for
        ChoiceStates when using the Messenger transport
        */

        opts = _.defaults(opts || {}, {
            helper_metadata: function () {
                // disable for now
                if(true) {
                    return {};
                }

                var i18n = self.im.user.i18n;
                return {
                    messenger: {
                        template_type: 'generic',
                        title: i18n(opts.title),
                        subtitle: i18n(opts.question),
                        image_url: opts.image_url || '',
                        buttons: opts.choices.map(function(choice, index) {
                            return {
                                title: i18n(choice.label),
                                payload: {
                                    content: (index + 1) + '',
                                    in_reply_to: self.im.msg.message_id || null,
                                }
                            };
                        })
                    }
                };
            }
        });

        ChoiceState.call(self, name, opts);

    }),

    "trailing": "comma"
};


// GENERIC UTILS
go.utils = {

  // FB HELPERS

    get_user_profile: function(msg) {
        return msg.helper_metadata.messenger || {};
    },



// FIXTURES HELPERS

    // function checks fixtures used against fixture expected
    // if multiple_possibilities is true, expected_used can be an array of arrays
    // representing possible valid combinations of fixtures
    check_fixtures_used: function(api, expected_used, multiple_possibilities) {
        var fixts = api.http.fixtures.fixtures;
        var fixts_used = [];
        fixts.forEach(function(f, i) {
            f.uses > 0 ? fixts_used.push(i) : null;
        });

        if (multiple_possibilities) {
            for(var i = 0; i < expected_used.length; i++) {
                try {
                    assert.deepEqual(fixts_used, expected_used[i]);
                    break;  // break if used fixtures match any of the valid_fixture_possibilities
                }
                catch(AssertionError) {
                    //console.log(AssertionError.message);
                }
            }
        }
        else {
            assert.deepEqual(fixts_used, expected_used);
        }
    },

// TIMEOUT HELPERS

    timed_out: function(im) {
        return im.msg.session_event === 'new'
            && im.user.state.name
            && im.config.no_timeout_redirects.indexOf(im.user.state.name) === -1;
    },

    timeout_redirect: function(im) {
        return im.config.timeout_redirects.indexOf(im.user.state.name) !== -1;
    },


// SERVICE API CALL HELPERS

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
                    })
                    .then(go.utils.log_service_api_call(service, method, params, payload, endpoint, im));
            case "get":
                return http.get(im.config.services[service].url + endpoint, {
                        params: params
                    })
                    .then(go.utils.log_service_api_call(service, method, params, payload, endpoint, im));
            case "patch":
                return http.patch(im.config.services[service].url + endpoint, {
                        data: payload
                    })
                    .then(go.utils.log_service_api_call(service, method, params, payload, endpoint, im));
            case "put":
                return http.put(im.config.services[service].url + endpoint, {
                    params: params,
                    data: payload
                })
                .then(go.utils.log_service_api_call(service, method, params, payload, endpoint, im));
            case "delete":
                return http
                    .delete(im.config.services[service].url + endpoint)
                    .then(go.utils.log_service_api_call(service, method, params, payload, endpoint, im));
            }
    },

    log_service_api_call: function(service, method, params, payload, endpoint, im) {
        return function (response) {
            return im
                .log([
                    'Request: ' + method + ' ' + im.config.services[service].url + endpoint,
                    'Payload: ' + JSON.stringify(payload),
                    'Params: ' + JSON.stringify(params),
                    'Response: ' + JSON.stringify(response),
                ].join('\n'))
                .then(function () {
                    return response;
                });
        };
    },


// MSISDN HELPERS

    // Check that it's a number and starts with 0 and approximate length
    // TODO: refactor to take length, explicitly deal with '+'
    is_valid_msisdn: function(content) {
        return go.utils.check_valid_number(content)
            && content[0] === '0'
            && content.length >= 10
            && content.length <= 13;
    },

    normalize_msisdn: function(raw, country_code) {
        // don't touch shortcodes
        if (raw.length <= 5) {
            return raw;
        }
        // remove chars that are not numbers or +
        raw = raw.replace(/[^0-9+]/g);
        if (raw.substr(0,2) === '00') {
            return '+' + raw.substr(2);
        }
        if (raw.substr(0,1) === '0') {
            return '+' + country_code + raw.substr(1);
        }
        if (raw.substr(0,1) === '+') {
            return raw;
        }
        if (raw.substr(0, country_code.length) === country_code) {
            return '+' + raw;
        }
        return raw;
    },


// NUMBER HELPERS

    // An attempt to solve the insanity of JavaScript numbers
    check_valid_number: function(content) {
        var numbers_only = new RegExp('^\\d+$');
        return content !== ''
            && numbers_only.test(content)
            && !Number.isNaN(Number(content));
    },

    double_digit_number: function(input) {
        input_numeric = parseInt(input, 10);
        if (parseInt(input, 10) < 10) {
            return "0" + input_numeric.toString();
        } else {
            return input_numeric.toString();
        }
    },


// DATE HELPERS

    get_now: function(config) {
        if (config.testing_today) {
            return new moment(config.testing_today).format('YYYY-MM-DD HH:mm:ss');
        } else {
            return new moment().format('YYYY-MM-DD HH:mm:ss');
        }
    },

    get_today: function(config) {
        if (config.testing_today) {
            return new moment(config.testing_today, 'YYYY-MM-DD');
        } else {
            return new moment();
        }
    },

    get_january: function(config) {
        // returns current year january 1st moment date
        return go.utils.get_today(config).startOf('year');
    },

    is_valid_date: function(date, format) {
        // implements strict validation with 'true' below
        return moment(date, format, true).isValid();
    },

    is_valid_year: function(year, minYear, maxYear) {
        // expects string parameters
        // checks that the number is within the range determined by the
        // minYear & maxYear parameters
        return go.utils.check_valid_number(year)
            && parseInt(year, 10) >= parseInt(minYear, 10)
            && parseInt(year, 10) <= parseInt(maxYear, 10);
    },

    is_valid_day_of_month: function(input) {
        // check that it is a number and between 1 and 31
        return go.utils.check_valid_number(input)
            && parseInt(input, 10) >= 1
            && parseInt(input, 10) <= 31;
    },


// TEXT HELPERS

    check_valid_alpha: function(input) {
        // check that all chars are in standard alphabet
        var alpha_only = new RegExp('^[A-Za-z]+$');
        return input !== '' && alpha_only.test(input);
    },

    is_valid_name: function(input, min, max) {
        // check that the string does not include the characters listed in the
        // regex, and min <= input string length <= max
        var name_check = new RegExp(
            '(^[^±!@£$%^&*_+§¡€#¢§¶•ªº«\\/<>?:;|=.,0123456789]{min,max}$)'
            .replace('min', min.toString())
            .replace('max', max.toString())
        );
        return input !== '' && name_check.test(input);
    },

    get_clean_first_word: function(user_message) {
        return user_message
            .split(" ")[0]          // split off first word
            .replace(/\W/g, '')     // remove non letters
            .toUpperCase();         // capitalise
    },

// CHOICE HELPERS

    make_month_choices: function($, startDate, limit, increment, valueFormat, labelFormat) {
        var choices = [];

        var monthIterator = startDate;
        for (var i=0; i<limit; i++) {
            choices.push(new Choice(monthIterator.format(valueFormat),
                                    monthIterator.format(labelFormat)));
            monthIterator.add(increment, 'months');
        }

        return choices;
    },


// REGISTRATION HELPERS

    create_registration: function(im, reg_info) {
        return go.utils
            .service_api_call("registrations", "post", null, reg_info, "registration/", im)
            .then(function(result) {
                return result.id;
            });
    },


// IDENTITY HELPERS

    get_identity_by_address: function(address, im) {
      // Searches the Identity Store for all identities with the provided address.
      // Returns the first identity object found
      // Address should be an object {address_type: address}, eg.
      // {'msisdn': '0821234444'}, {'email': 'me@example.com'}

        var address_type = Object.keys(address)[0];
        var address_val = address[address_type];
        var params = {};
        var search_string = 'details__addresses__' + address_type;
        params[search_string] = address_val;
        return im
            .log('Getting identity for: ' + JSON.stringify(params))
            .then(function() {
                return go.utils
                    .service_api_call('identities', 'get', params, null, 'identities/search/', im)
                    .then(function(json_get_response) {
                        var identities_found = json_get_response.data.results;
                        // Return the first identity in the list of identities
                        return (identities_found.length > 0)
                        ? identities_found[0]
                        : null;
                    });
            });
    },

    get_identity: function(identity_id, im) {
      // Gets the identity from the Identity Store
      // Returns the identity object
        var endpoint = 'identities/' + identity_id + '/';
        return go.utils
        .service_api_call('identities', 'get', {}, null, endpoint, im)
        .then(function(json_get_response) {
            return json_get_response.data;
        });
    },

    create_identity: function(im, address, communicate_through_id, operator_id) {
      // Create a new identity
      // Returns the identity object

        var payload = {
            "details": {
                "default_addr_type": null,
                "addresses": {}
            }
        };
        // compile base payload
        if (address) {
            var address_type = Object.keys(address)[0];
            var addresses = {};
            addresses[address_type] = {};
            addresses[address_type][address[address_type]] = {};
            payload.details = {
                "default_addr_type": address_type,
                "addresses": addresses
            };
        }

        if (communicate_through_id) {
            payload.communicate_through = communicate_through_id;
        }

        // add operator_id if available
        if (operator_id) {
            payload.operator = operator_id;
        }

        return go.utils
            .service_api_call("identities", "post", null, payload, 'identities/', im)
            .then(function(json_post_response) {
                return json_post_response.data;
            });
    },

    get_or_create_identity: function(address, im, operator_id) {
      // Gets a identity if it exists, otherwise creates a new one

        if (address.msisdn) {
            address.msisdn = go.utils
                .normalize_msisdn(address.msisdn, im.config.country_code);
        }
        return go.utils
            // Get identity id using address
            .get_identity_by_address(address, im)
            .then(function(identity) {
                if (identity !== null) {
                    // If identity exists, return the id
                    return identity;
                } else {
                    // If identity doesn't exist, create it
                    return go.utils
                    .create_identity(im, address, null, operator_id)
                    .then(function(identity) {
                        return identity;
                    });
                }
        });
    },

    update_identity: function(im, identity) {
      // Update an identity by passing in the full updated identity object
      // Removes potentially added fields that auto-complete and should not
      // be submitted
      // Returns the id (which should be the same as the identity's id)

        auto_fields = ["url", "created_at", "updated_at", "created_by", "updated_by", "user"];
        for (var i in auto_fields) {
            field = auto_fields[i];
            if (field in identity) {
                delete identity[field];
            }
        }

        var endpoint = 'identities/' + identity.id + '/';
        return go.utils
            .service_api_call('identities', 'patch', {}, identity, endpoint, im)
            .then(function(response) {
                return response.data.id;
            });
    },


// SUBSCRIPTION HELPERS

    get_subscription: function(im, subscription_id) {
      // Gets the subscription from the Stage-base Store
      // Returns the subscription object

        var endpoint = 'subscriptions/' + subscription_id + '/';
        return go.utils
            .service_api_call('subscriptions', 'get', {}, null, endpoint, im)
            .then(function(response) {
                return response.data;
            });
    },

    get_active_subscriptions_by_identity: function(im, identity_id) {
      // Searches the Stage-base Store for all active subscriptions with the provided identity_id
      // Returns the first subscription object found or null if none are found

        var params = {
            identity: identity_id,
            active: true
        };
        var endpoint = 'subscriptions/';
        return go.utils
            .service_api_call('subscriptions', 'get', params, null, endpoint, im)
            .then(function(response) {
                return response.data.results;
            });
    },

    get_active_subscription_by_identity: function(im, identity_id) {
      // Searches the Stage-base Store for all active subscriptions with the provided identity_id
      // Returns the first subscription object found or null if none are found

        return go.utils
            .get_active_subscriptions_by_identity(im, identity_id)
            .then(function(subscriptions_found) {
                return (subscriptions_found.length > 0)
                    ? subscriptions_found[0]
                    : null;
            });
    },

    has_active_subscription: function(identity_id, im) {
      // Returns whether an identity has an active subscription
      // Returns true / false

        return go.utils
            .get_active_subscriptions_by_identity(im, identity_id)
            .then(function(subscriptions) {
                return subscriptions.length > 0;
            });
    },

    update_subscription: function(im, subscription) {
      // Update a subscription by passing in the full updated subscription object
      // Returns the id (which should be the same as the subscription's id)

        var endpoint = 'subscriptions/' + subscription.id + '/';
        return go.utils
            .service_api_call('subscriptions', 'patch', {}, subscription, endpoint, im)
            .then(function(response) {
                return response.data.id;
            });
    },


// MESSAGESET HELPERS

    get_messageset: function(im, messageset_id) {
      // Gets the messageset from the Stage-base Store
      // Returns the messageset object

        var endpoint = 'messageset/' + messageset_id + '/';
        return go.utils
            .service_api_call('subscriptions', 'get', {}, null, endpoint, im)
            .then(function(response) {
                return response.data;
            });
    },


// MESSAGE_SENDER HELPERS

    save_inbound_message: function(im, from_addr, content) {
      // Saves the inbound messages to seed-message-sender

        var payload = {
            "message_id": im.config.testing_message_id || im.msg.message_id,
            "in_reply_to": null,
            "to_addr": im.config.channel,
            "from_addr": from_addr,
            "content": content,
            "transport_name": im.config.transport_name,
            "transport_type": im.config.transport_type,
            "helper_metadata": {}
        };
        return go.utils
            .service_api_call("message_sender", "post", null, payload, 'inbound/', im)
            .then(function(json_post_response) {
                var inbound_response = json_post_response.data;
                // Return the inbound id
                return inbound_response.id;
            });
    },


// OPTOUT & OPTIN HELPERS

    optout: function(im, identity_id, optout_reason, address_type, address,
                     request_source, requestor_source_id, optout_type, config) {
      // Posts an optout to the identity store optout endpoint

        var optout_info = {
            optout_type: optout_type || 'stop',  // default to 'stop'
            identity: identity_id,
            reason: optout_reason || 'unknown',  // default to 'unknown'
            address_type: address_type || 'msisdn',  // default to 'msisdn'
            address: address,
            request_source: request_source,
            requestor_source_id: requestor_source_id
        };
        return go.utils
            .service_api_call("identities", "post", null, optout_info, "optout/", im)
            .then(function(response) {
                return response;
            });
    },


"commas": "commas"
};

/*jshint -W083 */
var vumigo = require("vumigo_v02");
var Choice = vumigo.states.Choice;

// Project utils library
go.utils_project = {

// REGISTRATION HELPERS

    finish_registration: function(im) {
        return go.utils
            .get_identity(im.user.answers.user_id, im)
            .then(function(identity) {
                identity.details.registered = true;
                identity.details.facility_code = im.user.answers.state_facility_code;
                identity.details.gender = im.user.answers.state_gender;
                identity.details.cadre = im.user.answers.state_cadre;
                identity.details.department = im.user.answers.state_department;
                return go.utils.update_identity(im, identity);
            });
    },

// QUIZ HELPERS

    // returns an array of untaken quizzes
    get_untaken_quizzes: function(im, user_id) {
        var endpoint = "quiz/untaken";
        var params = {
            "identity": user_id
        };
        return go.utils
            .service_api_call("continuous-learning", "get", params, null, endpoint, im)
            .then(function(json_get_response) {
                return json_get_response.data.results;
        });
    },

    get_quiz: function(im, quiz_id) {
        var endpoint = "quiz/"+quiz_id+"/";
        return go.utils
            .service_api_call("continuous-learning", "get", {}, null, endpoint, im)
            .then(function(json_get_response) {
                return json_get_response.data;
        });
    },

    get_quiz_question: function(im, question_id) {
        var endpoint = "question/"+question_id+"/";
        return go.utils
            .service_api_call("continuous-learning", "get", {}, null, endpoint, im)
            .then(function(json_get_response) {
                return json_get_response.data;
        });
    },

    /* parameter to construct_choices function is an array of objects
       e.g. [
                {
                    "value": "mike",
                    "text": "Mike",
                    "correct": false
                },
                {
                    "value": "nicki",
                    "text": "Nicki",
                    "correct": true
                }
            ],
        where value/text to be used accordingly in ChoiceState and 'correct'
        indicates correct quiz answer
     returns an array of Choice objects representing answers for ChoiceState*/
    construct_choices: function(possible_answers) {
        var choices = [];

        for (var i = 0; i < possible_answers.length; i++) {
            choices.push(new Choice(possible_answers[i].value, possible_answers[i].text));
        }
        return choices;
    },

    // takes an array of answer-objects with properties 'value', 'text', 'correct';
    // returns the value of the correct answer
    get_correct_answer: function(possible_answers) {
        for (var i = 0; i < possible_answers.length; i++) {
            if (possible_answers[i].correct) {
                return possible_answers[i].value;
            }
        }
    },

    // returns object to keep track of user's quiz status
    init_quiz_status: function(quiz, questions_array) {
        // to set quiz_status with quiz uuid, an array of outstanding questions
        // to be answered, an array of questions answered, and a flag to indicate
        // whether quiz is completed or not
        return {"quiz": quiz, "questions_remaining": questions_array, "questions_answered": [], "completed": false};
    },

    set_quiz_completed: function(im, user_id, quiz_status) {
        quiz_status.completed = true;

        var endpoint = "completed/";
        var payload = {
            "identity": user_id,
            "quiz": quiz_status.quiz
        };

        return go.utils
            .service_api_call("continuous-learning", "post", {}, payload, endpoint, im)
            .then(function(json_get_response) {
                return json_get_response.data;
        });
    },

    // update the questions and answer part of user's quiz status
    save_quiz_status: function(im) {
        return go.utils
            .get_identity(im.user.answers.user_id, im)
            .then(function(identity) {
                return go.utils.update_identity(im, identity);
            });
    },

    // returns an object; first property represents the number of correct
    // answers, and second the total number of questions asked, and the
    // third the subsequent percentage of correct_answers out of questions asked
    get_quiz_summary: function(questions_answered) {
        var total_questions = questions_answered.length;
        var correct_answers = 0;

        var obj = questions_answered;
        for (var x in obj) {
            if (obj[x].correct) correct_answers++;
        }

        return {
            "correct_answers": correct_answers,
            "total_questions": total_questions,
            "percentage": (correct_answers/total_questions).toFixed(2)*100
        };
    },

    // taking identity_uuid and quiz_uuid, returns tracker_uuid
    init_tracker: function(im, identity_id, quiz_id) {
        var payload = {
            "identity": identity_id,
            "quiz": quiz_id
        };

        return go.utils
            .service_api_call("continuous-learning", "post", null, payload, 'tracker/', im)
            .then(function(json_post_response) {
                return json_post_response.data.tracker_id;
        });
    },

    log_quiz_answer: function(im, quiz_question, answer_value, answer_text, answer_correct, response, tracker_id) {
        var payload = {
            "question": quiz_question.id,
            "question_text": quiz_question.question,
            "answer_value": answer_value,
            "answer_text": answer_text,
            "answer_correct": answer_correct,
            "response_sent": response,
            "tracker": tracker_id
        };

        return go.utils
            .service_api_call("continuous-learning", "post", null, payload, 'answer/', im)
            .then(function(json_post_response) {
                return json_post_response.data;
        });
    },

    close_tracker: function(im, tracker_id) {
        var endpoint = "tracker/"+tracker_id+"/";
        var payload = {
            "complete": true,
            "completed_at": go.utils.get_now(im.config)
        };

        return go.utils
            .service_api_call("continuous-learning", "patch", null, payload, endpoint, im)
            .then(function(json_post_response) {
                return json_post_response.data;
        });
    },

    // SMS HELPERS

    send_completion_text: function(im, user_id, text_to_add) {
        var sms_content = "Your results from today's quiz:"+text_to_add;
        var payload = {
            "identity": user_id,
            "content": sms_content
        };
        return go.utils
        .service_api_call("message_sender", "post", null, payload, 'outbound/', im)
        .then(function(json_post_response) {
            var outbound_response = json_post_response.data;
            // Return the outbound id
            return outbound_response.id;
        });
    },



    "commas": "commas"

};

go.app = function() {
    var vumigo = require("vumigo_v02");
    var App = vumigo.App;
    var Choice = vumigo.states.Choice;
    var EndState = vumigo.states.EndState;
    var FreeText = vumigo.states.FreeText;
    var MessengerChoiceState = go.states.MessengerChoiceState;
    var _ = require('lodash');


    var GoUOPBMOH = App.extend(function(self) {
        App.call(self, "state_start");
        var $ = self.$;

        self.init = function() {};


    // TEXT CONTENT

        var questions = {
            "state_already_registered":
                $("You are already registered for this service. Contact your administrator if you have any queries"),

            "state_facility_code":
                $("Please enter your facility code"),
            "state_gender":
                $("Please enter your gender:"),
            "state_cadre":
                $("Please enter your cadre"),
            "state_department":
                $("Please enter your department name"),
            "state_end_registration":
                $("Thank you for registering. You'll soon be receiving quizzes."),

            "state_end_quiz":
                $("Thank you for completing your quiz. You correctly answered {{correct_answers}} of {{total_questions}} questions. Your score is {{score_percentage}}%"),
            "state_end_quiz_status":
                $("Currently you've got no untaken quizzes."),

            "state_end_thank_you":
                $("Thank you for using our service."),
        };

        // override normal state adding
        self.add = function(name, creator) {
            self.states.add(name, function(name, opts) {
                return creator(name, opts);
            });
        };


    // START STATE

        self.add("state_start", function(name) {
            return self.states.create("state_check_registered");
        });

        // interstitial to check registration status
        self.add("state_check_registered", function(name) {
            return go.utils
                .get_or_create_identity({"facebook_messenger": self.im.user.addr}, self.im, null)
                .then(function(identity) {
                    self.im.user.set_answer("user_id", identity.id);
                    if(identity.details && !identity.details.registered) {
                        return self.states.create("state_facility_code");
                    } else {
                        return self.states.create("state_check_quiz_status");
                    }
                });
        });

        // EndState
        self.add("state_already_registered", function(name) {
            return new EndState(name, {
                text: questions[name],
                next: "state_start"
            });
        });

    // REGISTRATION STATES

        // FreeText st-01
        self.add("state_facility_code", function(name) {
            return new FreeText(name, {
                question: questions[name],
                next: "state_gender"
            });
        });

        // ChoiceState st-02
        self.add("state_gender", function(name) {
            return new MessengerChoiceState(name, {
                title: 'Registration',
                question: questions[name],
                choices: [
                    new Choice("male", $("Male")),
                    new Choice("female", $("Female"))
                ],
                next: "state_cadre"
            });
        });

        // FreeText st-03
        self.add("state_cadre", function(name) {
            return new FreeText(name, {
                question: questions[name],
                next: "state_department"
            });
        });

        // FreeText st-04
        self.add("state_department", function(name) {
            return new FreeText(name, {
                question: questions[name],
                next: function() {
                    return go.utils_project
                        .finish_registration(self.im)
                        .then(function() {
                            return "state_end_registration";
                        });
                }
            });
        });

        // EndState st-05
        self.add("state_end_registration", function(name) {
            return new EndState(name, {
                text: questions[name],
                next: "state_start"
            });
        });

    // QUIZ STATES

        // interstitial
        self.add("state_check_quiz_status", function(name) {
            return go.utils_project
                .get_untaken_quizzes(self.im, self.im.user.answers.user_id)
                .then(function(untaken_quizzes) {
                    if (untaken_quizzes.length > 0) {
                        // get random quiz to take
                        var quiz_to_take = self.im.config.randomize_quizzes
                            ? untaken_quizzes[Math.floor(Math.random() * untaken_quizzes.length)]
                            : untaken_quizzes[0];

                        return go.utils_project
                            .init_tracker(self.im, self.im.user.answers.user_id, quiz_to_take.id)
                            .then(function(tracker_id) {
                                self.im.user.set_answer("tracker", tracker_id);
                                return self.states.create("state_get_quiz_questions", quiz_to_take.id);
                            });
                    } else {
                        return self.states.create("state_end_quiz_status");
                    }
                });

        });

        self.add("state_get_quiz_questions", function(name, quiz_id) {
            return go.utils_project
                .get_quiz(self.im, quiz_id)
                .then(function(quiz) {
                    // creates a random line-up of questions
                    var random_questions = self.im.config.randomize_questions
                        ? _.shuffle(quiz.questions)
                        : quiz.questions;

                    var quiz_status = go.utils_project.init_quiz_status(quiz_id, random_questions);
                    self.im.user.set_answer("quiz_status", quiz_status);
                    self.im.user.set_answer("sms_results_text", "");

                    return self.states.create("state_quiz");
                });
        });

        // ChoiceState
        self.add("state_quiz", function(name) {
            return go.utils_project
                // get first question in the now random line-up
                .get_quiz_question(self.im, self.im.user.answers.quiz_status.questions_remaining[0])
                .then(function(quiz_question) {
                    var correct_answer = go.utils_project.get_correct_answer(quiz_question.answers);

                    return new MessengerChoiceState(name, {
                        question: quiz_question.question,
                        choices: go.utils_project.construct_choices(quiz_question.answers),
                        next: function(choice) {
                                var response_text = "";
                                var correct = choice.value === correct_answer;
                                if (correct) {
                                    response_text = quiz_question.response_correct;
                                    self.im.user.answers.quiz_status.questions_answered.push({"question": quiz_question.question, "correct": true});
                                } else {
                                    response_text = quiz_question.response_incorrect;
                                    self.im.user.answers.quiz_status.questions_answered.push({"question": quiz_question.question, "correct": false});
                                }

                                return go.utils_project
                                    .log_quiz_answer(self.im, quiz_question, choice.value, choice.label, correct, response_text, self.im.user.answers.tracker)
                                    .then(function() {
                                        return {
                                            name: "state_response",
                                            creator_opts: response_text
                                        };
                                    });
                        }
                    });
                });
        });

        // ChoiceState
        self.add("state_response", function(name, response_text) {
            self.im.user.answers.sms_results_text += " "+response_text;
            return new MessengerChoiceState(name, {
                question: response_text,
                choices: [
                    new Choice('continue', 'Continue')
                ],
                next: function(choice) {
                    // remove first item of question array as question has been answered
                    //  -- after removal questions_remaining will contain the
                    //  -- remaining questions of specific quiz to be asked
                    self.im.user.answers.quiz_status.questions_remaining.shift();
                    if (self.im.user.answers.quiz_status.questions_remaining.length !== 0) {
                        return 'state_save_quiz_status';
                    } else {
                        return go.utils_project
                            .set_quiz_completed(self.im, self.im.user.answers.user_id, self.im.user.answers.quiz_status)
                            .then(function() {
                                return 'state_save_quiz_status';
                            });
                    }
                }
            });
        });

        self.add("state_save_quiz_status", function(name) {
            return go.utils_project
                .save_quiz_status(self.im)
                .then(function() {
                    if (self.im.user.answers.quiz_status.completed) {
                        return go.utils_project
                            .close_tracker(self.im, self.im.user.answers.tracker)
                            .then(function() {
                                return self.states.create("state_end_quiz");
                            });
                    } else {
                        return self.states.create("state_quiz");
                    }

                });
        });

        self.add("state_end_quiz", function(name) {
            var quiz_summary = go.utils_project.get_quiz_summary(self.im.user.answers.quiz_status.questions_answered);
            return go.utils_project
                .send_completion_text(self.im, self.im.user.answers.user_id, self.im.user.answers.sms_results_text)
                .then(function() {
                    return new EndState(name, {
                        text: questions[name].context({
                            correct_answers: quiz_summary.correct_answers,
                            total_questions: quiz_summary.total_questions,
                            score_percentage: quiz_summary.percentage}),
                        next: "state_start"
                    });
                });
        });

        self.add("state_end_quiz_status", function(name) {
            return new EndState(name, {
                text: questions[name],
                next: "state_start"
            });
        });

    // GENERAL END STATE

        self.add("state_end_thank_you", function(name) {
            return new EndState(name, {
                text: questions[name],
                next: "state_start"
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
