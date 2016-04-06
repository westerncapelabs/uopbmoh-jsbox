/*jshint -W083 */
var Q = require('q');

// Project utils library
go.utils_project = {

// REGISTRATION HELPERS

    compile_reg_info: function(im) {
        var reg_info = {
            user_id: im.user.answers.user_id,
            data: {
                id_number: im.user.answers.state_id,
                name: im.user.answers.state_name,
                site: im.user.answers.state_site
            }
        };

        return reg_info;
    },

    /*update_identities: function(im) {
        // Saves useful data collected during registration to the relevant identities
        return go.utils
            .get_identity(im.user.answers.user_id, im),
            .then(function(identity) {
                go.utils.update_identity(im, identity),
            })
    },*/

    finish_registration: function(im) {
        var reg_info = go.utils_project.compile_reg_info(im);
        return Q.all([
            go.utils.create_registration(im, reg_info),
            go.utils.update_identity(im, identity)
        ]);
    },

    "commas": "commas"

};
