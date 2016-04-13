/*jshint -W083 */

// Project utils library
go.utils_project = {

// REGISTRATION HELPERS

    compile_reg_info: function(im) {
        var reg_info = {
            user_id: im.user.answers.user_id,
            data: {
                facility_code: im.user.answers.state_facility_code,
                gender: im.user.answers.state_gender,
                cadre: im.user.answers.state_cadre,
                department: im.user.answers.state_department
            }
        };

        return reg_info;
    },

    finish_registration: function(im) {
        var reg_info = go.utils_project.compile_reg_info(im);
        return go.utils
            .create_registration(im, reg_info)
            .then(function() {
                return go.utils
                    .get_identity(im.user.answers.user_id, im)
                    .then(function(identity) {
                        return go.utils.update_identity(im, identity);
                    });
            });
    },

// QUIZ HELPERS

    // returns an array of untaken quizzes
    get_untaken_quizzes: function(im) {
        var endpoint = "quiz/untaken";
        var params = {
            "identity": im.user.answers.user_id
        };
        return go.utils
            .service_api_call("quizzes", "get", params, null, endpoint, im)
            .then(function(json_get_response) {
                return json_get_response.data.results;
        });
    },

    get_quiz: function(im) {
        var endpoint = "quiz/"+im.user.answers.quiz.id+"/";
        return go.utils
            .service_api_call("quizzes", "get", {}, null, endpoint, im)
            .then(function(json_get_response) {
                return json_get_response.data;
        });
    },

    get_quiz_question: function(im) {
        var endpoint = "question/"+im.user.answers.questions[0]+"/";
        return go.utils
            .service_api_call("questions", "get", {}, null, endpoint, im)
            .then(function(json_get_response) {
                return json_get_response.data;
        });
    },

    /* parameter to construct_Choices function is an array of objects
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
    construct_Choices: function(possible_answers) {
        var vumigo = require("vumigo_v02");
        var Choice = vumigo.states.Choice;
        var choices = [];

        for (var i = 0; i < possible_answers.length; i++) {
            choices.push(new Choice(possible_answers[i].value, possible_answers[i].text));
        }
        return choices;
    },

    shift_quiz_questions: function() {
        // update untaken quizzes

    },

    is_answer_to_question_correct: function(im, answer) {
        return go.utils_project
            .get_quiz_question(im)
            .then(function(quiz_question) {
                console.log("QUESTION: "+quiz_question.question);
                for (var i = 0; i < quiz_question.answers.length; i++) {
                    if ((quiz_question.answers[i].value === answer) && quiz_question.answers[i].correct) {
                        console.log("correct answer -> "+answer);
                        return true;
                    }
                }
                console.log("incorrect answer --> "+answer);
                return false;
            });
    },

    // FIXTURES HELPERS

        // function checks fixtures used against fixture expected
        // if multiple_possibilities is true, expected_used can be an array of arrays
        // representing possible valid combinations of fixtures
    /*    get_question_from_fixtures_used: function(api, expected_used, multiple_possibilities) {
            var fixts = api.http.fixtures.fixtures;
            var fixts_used = [];
            fixts.forEach(function(f, i) {
                f.uses > 0 ? fixts_used.push(i) : null;
            });

            return ...
        },

        get_answers_from_fixtures_used: function(api, expected_used, multiple_possibilities) {
            var fixts = api.http.fixtures.fixtures;
            var fixts_used = [];
            fixts.forEach(function(f, i) {
                f.uses > 0 ? fixts_used.push(i) : null;
            });

            return ...
        },*/

    "commas": "commas"

};
