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
