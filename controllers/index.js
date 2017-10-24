'use strict';

module.exports = function (app) {
    const { Latex } = app.dao;
    let { promise } = new app.views.Json();

    this.post = async function ({ body }, response, next) {
        return promise((async () => ({
            url: await new Latex().process(body),
        }))(), response, next);
    };
};
