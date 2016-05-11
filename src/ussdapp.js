go.app = function() {
    var vumigo = require("vumigo_v02");
    var App = vumigo.App;
    var Choice = vumigo.states.Choice;
    var ChoiceState = vumigo.states.ChoiceState;
    var EndState = vumigo.states.EndState;
    var FreeText = vumigo.states.FreeText;
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
                .get_or_create_identity({"msisdn": self.im.user.addr}, self.im, null)
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
            return new ChoiceState(name, {
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

                    return new ChoiceState(name, {
                        question: quiz_question.question,
                        choices: go.utils_project.construct_choices(quiz_question.answers),
                        next: function(choice) {
                                var response_text = "";
                                var correct = choice.value === correct_answer;
                                if (correct) {
                                    response_text = quiz_question.response_correct;
                                    self.im.user.answers.quiz_status.questions_answered.push({"question": quiz_question.id, "correct": true});
                                } else {
                                    response_text = quiz_question.response_incorrect;
                                    self.im.user.answers.quiz_status.questions_answered.push({"question": quiz_question.id, "correct": false});
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
            return new ChoiceState(name, {
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
