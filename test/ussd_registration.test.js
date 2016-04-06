var vumigo = require('vumigo_v02');
var fixtures = require('./fixtures');
var assert = require('assert');
var AppTester = vumigo.AppTester;

describe("UoP TB registration app", function() {
    describe("for ussd use", function() {
        var app;
        var tester;

        beforeEach(function() {
            app = new go.app.GoUOPBMOH();
            tester = new AppTester(app);

            tester
                .setup.char_limit(182)
                .setup.config.app({
                    name: 'ussd-registration-test',
                    country_code: '267',  // botswana
                    channel: '*120*8864*0000#',
                    testing_today: '2016-04-05',
                    services: {
                        identities: {
                            api_token: 'test_token_identities',
                            url: "http://localhost:8001/api/v1/"
                        },
                        registrations: {
                            api_token: 'test_token_registrations',
                            url: "http://localhost:8002/api/v1/"
                        },
                    },
                })
                .setup(function(api) {
                    fixtures().forEach(api.http.fixtures.add);
                })
                ;
        });

        // REGISTRATION

        describe("Registration testing", function() {
            it("to state_already_registered", function() {
                return tester
                    .setup.user.addr("0820000111")
                    .inputs(
                        {session_event: "new"}  // dial in
                    )
                    .check.interaction({
                        state: "state_already_registered",
                        reply: "You are already registered for this service. Contact your administrator if you have any queries"
                    })
                    .check(function(api) {
                        go.utils.check_fixtures_used(api, [0]);
                    })
                    .check.reply.ends_session()
                    .run();
            });
            it("to state_id", function() {
                return tester
                    .setup.user.addr("0820000222")
                    .inputs(
                        {session_event: "new"}  // dial in
                    )
                    .check.interaction({
                        state: "state_id",
                        reply: "Welcome to TB Connect. Please enter your id number"
                    })
                    .check(function(api) {
                        go.utils.check_fixtures_used(api, [1,2]);
                    })
                    .run();
            });
            it("to state_name", function() {
                return tester
                    .setup.user.addr("0820000222")
                    .inputs(
                        {session_event: "new"}  // dial in
                        , "12345"  // state_id
                    )
                    .check.interaction({
                        state: "state_name",
                        reply: "Please enter your name"
                    })
                    .check(function(api) {
                        go.utils.check_fixtures_used(api, [1,2]);
                    })
                    .run();
            });
            it("to state_site", function() {
                return tester
                    .setup.user.addr("0820000222")
                    .inputs(
                        {session_event: "new"}  // dial in
                        , "12345"  // state_id
                        , "John Doe"  // state_name
                    )
                    .check.interaction({
                        state: "state_site",
                        reply: "Which site do you work at?"
                    })
                    .check(function(api) {
                        go.utils.check_fixtures_used(api, [1,2]);
                    })
                    .run();
            });
            it("to state_end_thank_you", function() {
                return tester
                    .setup.user.addr("0820000222")
                    .inputs(
                        {session_event: "new"}  // dial in
                        , "12345"  // state_id
                        , "John Doe"  // state_name
                        , "Gotham"  // state_site
                    )
                    .check.interaction({
                        state: "state_end_thank_you",
                        reply: "Thank you. They will now start receiving messages."
                    })
                    .check(function(api) {
                        go.utils.check_fixtures_used(api, [1,2,3,4,5]);
                    })
                    .check.reply.ends_session()
                    .run();
            });
        });
    });

});
