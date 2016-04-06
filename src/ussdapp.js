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
            "state_already_registered":
                $("You are already registered for this service. Contact your administrator if you have any queries"),
            "state_id":
                $("Welcome to TB Connect. Please enter your id number"),
            "state_name":
                $("Please enter your name"),
            "state_site":
                $("Which site do you work at?"),

            "state_end_thank_you":
                $("Thank you. They will now start receiving messages."),
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
            return self.states.create('state_check_registered');
        });

        // interstitial to check registration status
        self.add('state_check_registered', function(name) {
            return go.utils
                .get_or_create_identity({'msisdn': self.im.user.addr}, self.im, null)
                .then(function(identity) {
                    if(identity.details && !identity.details.registered) {
                        self.im.user.set_answer('user_id', identity.id);
                        return self.states.create('state_id');
                    } else {
                        return self.states.create('state_already_registered');
                    }
                });
        });

        // EndState
        self.add('state_already_registered', function(name) {
            return new EndState(name, {
                text: questions[name],
                next: 'state_start'
            });
        });

    // REGISTRATION STATES

        // FreeText st-01
        self.add('state_id', function(name) {
            return new FreeText(name, {
                question: questions[name],
                next: function(input) {
                    return 'state_name';
                }
            });
        });

        // FreeText st-02
        self.add('state_name', function(name) {
            return new FreeText(name, {
                question: questions[name],
                next: function(input) {
                    return 'state_site';
                }
            });
        });

        // FreeText st-03
        self.add('state_site', function(name) {
            return new FreeText(name, {
                question: questions[name],
                next: function() {
                    return go.utils_project
                        .finish_registration(self.im)
                        .then(function() {
                            return 'state_end_thank_you';
                        });
                }
            });
        });

        // EndState st-04
        self.add('state_end_thank_you', function(name) {
            return new EndState(name, {
                text: questions[name],
                next: 'state_start'
            });
        });

    });

    return {
        GoUOPBMOH: GoUOPBMOH
    };
}();
