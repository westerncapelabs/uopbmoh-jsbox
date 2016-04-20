/*jshint -W083 */
var vumigo = require("vumigo_v02");
var Choice = vumigo.states.Choice;

// Project utils library
go.utils_project = {

// REGISTRATION HELPERS

    create_registration: function(im, reg_info) {
        return go.utils
            .service_api_call("hub", "post", null, reg_info, "registration/", im)
            .then(function(result) {
                return result.id;
            });
    },

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
        return go.utils_project
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

    // initializes object of arrays necessary to keep track of user's quiz status
    init_quiz_status: function(im, quiz, questions_array) {
        // set quiz_status with quiz uuid, an array of outstanding questions to
        // be answered, an array of questions answered, and a flag to indicate
        // whether quiz is completed or not
        im.user.set_answer("quiz_status", {"quiz": quiz, "questions_remaining": questions_array, "questions_answered": [], "completed": false});
    },

    // returns object to update the questions and answer part of user's quiz status
    //  -- questions_answered will contain the question id against true/false
    //  -- depending on whether that specific answer was correct/incorrect
    update_quiz_status: function(question, correct) {
        return {"question": question, "correct": correct};
    },

    is_quiz_completed: function(im) {
        return im.user.answers.quiz_status.completed;
    },

    set_quiz_completed: function(im) {
        im.user.answers.quiz_status.completed = true;

        var endpoint = "completed/";
        var payload = {
            "identity": im.user.answers.user_id,
            "quiz": im.user.answers.quiz_status.quiz
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

    "commas": "commas"

};
