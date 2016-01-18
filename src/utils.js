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
