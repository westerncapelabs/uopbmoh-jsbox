go.init = function() {
    var vumigo = require('vumigo_v02');
    var InteractionMachine = vumigo.InteractionMachine;
    var GoUOPBOH = go.app.GoUOPBOH;

    return {
        im: new InteractionMachine(api, new GoUOPBOH())
    };
}();
