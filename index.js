'use strict';

const Bool = require('bool.js');

module.exports = new Bool('me.agentowl.p95.nodelatex', [
    'serve-static', 'node-latex', 'uuid/v4', 'handlebars', 'fs', 'path'
]).run();
