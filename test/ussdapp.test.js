var vumigo = require('vumigo_v02');
var fixtures = require('./fixtures');
var assert = require('assert');
var AppTester = vumigo.AppTester;

describe("UoP TB registration/quiz app", function() {
    describe("for ussd use", function() {
        var app;
        var tester;

        beforeEach(function() {
            app = new go.app.GoUOPBMOH();
            tester = new AppTester(app);

            tester
                .setup.char_limit(182)
                .setup.config.app({
                    name: 'ussd-app-test',
                    country_code: '267',  // botswana
                    channel: '*120*8864*0000#',
                    testing_today: '2016-04-05 15:30:02',
                    randomize_quizzes: false,
                    randomize_questions: false,
                    services: {
                        "identities": {
                            api_token: 'test_token_identities',
                            url: "http://localhost:8001/api/v1/"
                        },
                        "hub": {
                            api_token: 'test_token_registrations',
                            url: "http://localhost:8002/api/v1/"
                        },
                        "continuous-learning": {
                            api_token: 'test_token_quizzes',
                            url: "http://localhost:8003/api/v1/"
                        },
                        "message_sender": {
                            api_token: 'test_token_message_sender',
                            url: "http://localhost:8004/api/v1/"
                        }
                    },
                })
                .setup(function(api) {
                    fixtures().forEach(api.http.fixtures.add);
                })
                ;
        });

        // REGISTRATION TESTING

        describe("Registration testing", function() {
            it("to state_facility_code", function() {
                return tester
                    .setup.user.addr("0820000222")
                    .inputs(
                        {session_event: "new"}  // dial in
                    )
                    .check.interaction({
                        state: "state_facility_code",
                        reply: "Please enter your facility code"
                    })
                    .check(function(api) {
                        go.utils.check_fixtures_used(api, [1,2]);
                    })
                    .run();
            });
            it("to state_gender", function() {
                return tester
                    .setup.user.addr("0820000222")
                    .inputs(
                        {session_event: "new"}  // dial in
                        , "12345"  // state_facility_code
                    )
                    .check.interaction({
                        state: "state_gender",
                        reply: [
                            "Please enter your gender:",
                            "1. Male",
                            "2. Female"
                        ].join('\n')
                    })
                    .check(function(api) {
                        go.utils.check_fixtures_used(api, [1,2]);
                    })
                    .run();
            });
            it("to state_cadre", function() {
                return tester
                    .setup.user.addr("0820000222")
                    .inputs(
                        {session_event: "new"}  // dial in
                        , "12345"  // state_facility_code
                        , "1"  // state_gender - male
                    )
                    .check.interaction({
                        state: "state_cadre",
                        reply: "Please enter your cadre"
                    })
                    .check(function(api) {
                        go.utils.check_fixtures_used(api, [1,2]);
                    })
                    .run();
            });
            it("to state_department", function() {
                return tester
                    .setup.user.addr("0820000222")
                    .inputs(
                        {session_event: "new"}  // dial in
                        , "12345"  // state_facility_code
                        , "1"  // state_gender - male
                        , "Xpress"  // state_cadre
                    )
                    .check.interaction({
                        state: "state_department",
                        reply: "Please enter your department name"
                    })
                    .check(function(api) {
                        go.utils.check_fixtures_used(api, [1,2]);
                    })
                    .run();
            });
            it("to state_end_registration", function() {
                return tester
                    .setup.user.addr("0820000222")
                    .inputs(
                        {session_event: "new"}  // dial in
                        , "12345"  // state_facility_code
                        , "1"  // state_gender
                        , "Xpress"  // state_cadre
                        , "Back-office"  // state_department
                    )
                    .check.interaction({
                        state: "state_end_registration",
                        reply: "Thank you for registering. You'll soon be receiving quizzes."
                    })
                    .check(function(api) {
                        go.utils.check_fixtures_used(api, [1,2,3,4,5]);
                    })
                    .check.reply.ends_session()
                    .run();
            });
        });

        // QUIZ TESTING

        describe("Quiz testing", function() {
            it("to state_quiz", function() {
                return tester
                    .setup.user.addr("0820000111")
                    .inputs(
                        {session_event: "new"}  // dial in
                    )
                    .check.interaction({
                        state: "state_quiz",
                        reply: [
                            "Who is tallest?",
                            "1. Mike",
                            "2. Nicki",
                            "3. George"
                        ].join('\n')
                    })
                    .check(function(api) {
                        go.utils.check_fixtures_used(api,[0,6,9,13,31]);
                    })
                    .run();
            });
            // intentional skip of next test
            it.skip("to state_quiz (after closed session)", function() {
                return tester
                    .setup.user.addr("0820000111")
                    .inputs(
                        {session_event: "new"}  // dial in
                        , "1"  // state_quiz
                        , {session_event: "close"}
                        , {session_event: "new"}
                    )
                    .check.interaction({
                        state: "state_quiz",
                        reply: "Thank you for completing your quiz."
                    })
                    .check(function(api) {
                        go.utils.check_fixtures_used(api,[0,6,9,13]);
                    })
                    .run();
            });
            it("to state_response (after having answered one question)", function() {
                return tester
                    .setup.user.addr("0820000111")
                    .inputs(
                        {session_event: "new"}  // dial in
                        , "2"  // state_quiz - right answer
                    )
                    .check.interaction({
                        state: "state_response",
                        reply: [
                            "Correct! That's why only he bangs his head on the lamp!",
                            "1. Continue"
                        ].join('\n')
                    })
                    .check(function(api) {
                        go.utils.check_fixtures_used(api,[0,6,9,13,31,32]);
                    })
                    .run();
            });
            it("to state_quiz (after having answered one question)", function() {
                return tester
                    .setup.user.addr("0820000111")
                    .inputs(
                        {session_event: "new"}  // dial in
                        , "2"  // state_quiz
                        , "1"  // state_response - continue
                    )
                    .check.interaction({
                        state: "state_quiz",
                        reply: [
                            "Who is fittest?",
                            "1. Mike",
                            "2. Nicki",
                            "3. George"
                        ].join('\n')
                    })
                    .check(function(api) {
                        go.utils.check_fixtures_used(api,[0,6,9,13,14,25,26,31,32]);
                    })
                    .run();
            });
            it("to state_response (after having answered two questions)", function() {
                return tester
                    .setup.user.addr("0820000111")
                    .inputs(
                        {session_event: "new"}  // dial in
                        , "2"  // state_quiz - right answer
                        , "1"  // state_response - continue
                        , "3"  // state_quiz
                    )
                    .check.interaction({
                        state: "state_response",
                        reply: [
                            "Correct! He goes to the gym often!",
                            "1. Continue"
                        ].join('\n')
                    })
                    .check(function(api) {
                        go.utils.check_fixtures_used(api,[0,6,9,13,14,25,26,31,32,34]);
                    })
                    .run();
            });
            it("to state_quiz (after having answered two questions)", function() {
                return tester
                    .setup.user.addr("0820000111")
                    .inputs(
                        {session_event: "new"}  // dial in
                        , "2"  // state_quiz
                        , "1"  // state_response - continue
                        , "3"  // state_quiz
                        , "1"  // state_response - continue
                    )
                    .check.interaction({
                        state: "state_quiz",
                        reply: [
                            "Who is the boss?",
                            "1. Mike",
                            "2. Nicki",
                            "3. George"
                        ].join('\n')
                    })
                    .check(function(api) {
                        go.utils.check_fixtures_used(api,[0,6,9,13,14,15,25,26,31,32,34]);
                    })
                    .run();
            });
            it("to state_response (after having answered three questions)", function() {
                return tester
                    .setup.user.addr("0820000111")
                    .inputs(
                        {session_event: "new"}  // dial in
                        , "2"  // state_quiz
                        , "1"  // state_response - continue
                        , "3"  // state_quiz
                        , "1"  // state_response - continue
                        , "1"  // state_quiz
                    )
                    .check.interaction({
                        state: "state_response",
                        reply: [
                            "Correct! That's why he's got the final say!",
                            "1. Continue"
                        ].join('\n')
                    })
                    .check(function(api) {
                        go.utils.check_fixtures_used(api,[0,6,9,13,14,15,25,26,31,32,34,36]);
                    })
                    .run();
            });
            it("to state_quiz (after having answered three questions)", function() {
                return tester
                    .setup.user.addr("0820000111")
                    .inputs(
                        {session_event: "new"}  // dial in
                        , "2"  // state_quiz
                        , "1"  // state_response - continue
                        , "3"  // state_quiz
                        , "1"  // state_response - continue
                        , "1"  // state_quiz
                        , "1"  // state_response - continue
                    )
                    .check.interaction({
                        state: "state_end_quiz",
                        reply: "Thank you for completing your quiz. You correctly answered 3 of 3 questions. Your score is 100%"
                    })
                    .check(function(api) {
                        go.utils.check_fixtures_used(api,[0,6,9,13,14,15,25,26,27,28,31,32,34,36,38]);
                    })
                    .run();
            });
            it("to state_end_quiz_status", function() {
                return tester
                    .setup.user.addr("0820000333")
                    .inputs(
                        {session_event: "new"}  // dial in
                    )
                    .check.interaction({
                        state: "state_end_quiz_status",
                        reply: "Currently you've got no untaken quizzes."
                    })
                    .check(function(api) {
                        go.utils.check_fixtures_used(api, [7,8]);
                    })
                    .check.reply.ends_session()
                    .run();
            });
        });

        describe("Complete flows - more combinations", function() {
            it(" incorrect, correct, incorrect", function() {
                return tester
                    .setup.user.addr("0820000111")
                    .inputs(
                        {session_event: "new"}  // dial in
                        , "1"  // state_quiz - incorrect
                        , "1"  // state_response - continue
                        , "3"  // state_quiz - correct
                        , "1"  // state_response - continue
                        , "2"  // state_quiz - incorrect
                        , "1"  // state_response - continue
                    )
                    .check.interaction({
                        state: "state_end_quiz",
                        reply: "Thank you for completing your quiz. You correctly answered 1 of 3 questions. Your score is 33%"
                    })
                    .check(function(api) {
                        go.utils.check_fixtures_used(api,[0,6,9,13,14,15,25,26,27,29,31,33,34,37,38]);
                    })
                    .run();
            });
            it(" incorrect, incorrect, correct", function() {
                return tester
                    .setup.user.addr("0820000111")
                    .inputs(
                        {session_event: "new"}  // dial in
                        , "1"  // state_quiz - incorrect
                        , "1"  // state_response - continue
                        , "2"  // state_quiz - incorrect
                        , "1"  // state_response - continue
                        , "1"  // state_quiz - correct
                        , "1"  // state_response - continue
                    )
                    .check.interaction({
                        state: "state_end_quiz",
                        reply: "Thank you for completing your quiz. You correctly answered 1 of 3 questions. Your score is 33%"
                    })
                    .check(function(api) {
                        go.utils.check_fixtures_used(api,[0,6,9,13,14,15,25,26,27,30,31,33,35,36,38]);
                    })
                    .run();
            });
        });

        /*describe("Utils functions testing", function() {

        });*/

    });

});
