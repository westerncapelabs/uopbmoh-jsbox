/*jshint -W083 */

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

    finish_registration: function(im) {
        var reg_info = go.utils_project.compile_reg_info(im);
        return go.utils
            .create_registration(im, reg_info)
            .then(function() {
                return go.utils
                    .get_identity(im.user.answers.user_id, im)
                    .then(function(identity) {
                        return go.utils.update_identity(im, identity);
                    });
            });
    },

    "commas": "commas"

};
