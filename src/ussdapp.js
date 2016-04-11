go.app = function() {
    var vumigo = require("vumigo_v02");
    var App = vumigo.App;
    var Choice = vumigo.states.Choice;
    var ChoiceState = vumigo.states.ChoiceState;
    var EndState = vumigo.states.EndState;
    var FreeText = vumigo.states.FreeText;


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
                $("Thank you for registering.  You'll soon be receiving quizzes."),

            "state_end_quiz":
                $("Thank you for completing your quiz."),
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
            // Reset user answers when restarting the app
            self.im.user.answers = {};
            return self.states.create("state_check_registered");
        });

        // interstitial to check registration status
        self.add("state_check_registered", function(name) {
            return go.utils
                .get_or_create_identity({"msisdn": self.im.user.addr}, self.im, null)
                .then(function(identity) {
                    if(identity.details && !identity.details.registered) {
                        self.im.user.set_answer("user_id", identity.id);
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
                next: function(input) {
                    return "state_gender";
                }
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
                next: function(input) {
                    return "state_cadre";
                }
            });
        });

        // FreeText st-03
        self.add("state_cadre", function(name) {
            return new FreeText(name, {
                question: questions[name],
                next: function(input) {
                    return "state_department";
                }
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
            if (go.utils_project.has_untaken_quizzes()) {
                return self.states.create("state_start_quiz");
            } else {
                return self.states.create("state_end_quiz_status");
            }
        });

        self.add("state_start_quiz", function(name) {
            return self.states.create("state_end_quiz");
        });

        self.add("state_end_quiz", function(name) {
            return new EndState(name, {
                text: questions[name],
                next: "state_start"
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
