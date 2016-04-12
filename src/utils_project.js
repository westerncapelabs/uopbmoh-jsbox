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

    get_quiz_questions: function(im) {
        var endpoint = "quiz/"+im.user.answers.quiz.id+"/";
        return go.utils
            .service_api_call("quizzes", "get", {}, null, endpoint, im)
            .then(function(json_get_response) {
                return json_get_response.data.questions;
        });
    },

    "commas": "commas"

};
