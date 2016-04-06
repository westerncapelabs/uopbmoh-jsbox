go.init = function() {
    var vumigo = require('vumigo_v02');
    var InteractionMachine = vumigo.InteractionMachine;
    var GoUOPBMOH = go.app.GoUOPBMOH;

    return {
        im: new InteractionMachine(api, new GoUOPBMOH())
    };
}();
