'use strict';

module.exports = function (app) {
    let index = new app.controllers.Index();
    let serve = app.utilities['serve-static'];

    return [
        {
            url: '/static',
            method: 'use',
            action: serve('static'),
            cors: true
        },
        {
            url: '/html',
            method: 'use',
            action: serve('html'),
            cors: true,
        },
        {
            url: '/',
            method: 'post',
            action: index.post,
            cors: true
        }
    ]
};
