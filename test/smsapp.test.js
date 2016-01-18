var vumigo = require('vumigo_v02');
var fixtures = require('./fixtures');
var AppTester = vumigo.AppTester;
var assert = require('assert');
var optoutstore = require('./optoutstore');
var DummyOptoutResource = optoutstore.DummyOptoutResource;
var _ = require('lodash');

describe("UoP TB app", function() {
    describe("for sms use", function() {
        var app;
        var tester;

        beforeEach(function() {
            app = new go.app.GoUOPBOH();

            tester = new AppTester(app);

            tester
                .setup.char_limit(160)
                .setup.config.app({
                    name: 'smsapp',
                    testing_today: '2015-04-03 06:07:08.999',
                    metric_store: 'uopboh_test',  // _env at the end
                    services: {
                        hub: {
                            api_token: 'test_token',
                            url: "http://127.0.0.1:8000/"
                        }
                    }

                })
                .setup(function(api) {
                    api.resources.add(new DummyOptoutResource());
                    api.resources.attach(api);
                })
                .setup(function(api) {
                    api.metrics.stores = {'uopboh_test': {}};
                })
                .setup(function(api) {
                    fixtures().forEach(api.http.fixtures.add);
                })
        });


        describe("when the unknown user sends a 'STOP' message", function() {
            it("should optout and stop", function() {
                return tester
                    .setup.user.addr('064001')
                    .inputs('STOP')
                    // check navigation
                    .check.interaction({
                        state: 'state_stop_completed',
                        reply:
                            'Removed! You will no longer recieve messages from us.'
                    })
                    .run();
            });
        });



    });
});
