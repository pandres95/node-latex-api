'use strict';

module.exports = class {
    constructor (app) {
        this.fs = app.utilities.fs;
        this.handlebars = app.utilities.handlebars;
        this.latex = app.utilities['node-latex'];
        this.path = app.utilities.path;
        this.uuid = app.utilities['uuid/v4'];
    }

    async process ({ varN = 0, p = [], n = [] } = {}) {
        const {
            fs: { readFileSync, createWriteStream },
            handlebars: { compile },
            path: { join },
            latex, uuid
        } = this;

        let documentName = `${uuid()}.pdf`;

        let templatePath = join(PATH, 'template', 'document.tex');
        let templateSource = (await readFileSync(templatePath)).toString();
        let template = compile(templateSource);

        let document = template({
            varN,
            timesN: p.map((v, i) => v ** n[i]).join(' \\times '),
            p: p.join(', '),
            n: n.join(', '),
            sigmaN: `${p
                .map((v, i) => [ v, n[i] ])
                .map(([p, n]) => `\\frac{ ${p}^${n+1} - 1 }{ ${p} - 1 }`)
                .join(' \\times ')
            }`,
            sigmaNDev: `${p
                .map((v, i) => [ v, n[i] ])
                .map(([p, n]) => (p**(n+1) - 1)/(p - 1))
                .join(' \\times ')
            }`,
            sigmaNRes: `${p
                .map((v, i) => [ v, n[i] ])
                .map(([p, n]) => (p**(n+1) - 1)/(p - 1))
                .reduce((a, b) => a * b, 1)
            }`
        });

        let outputPath = join(PATH, 'static', documentName);
        let outputFile = createWriteStream(outputPath);

        await new Promise((resolve, reject) => {
            let buffer = latex(document);
            buffer.on('err', err => reject(err));
            buffer.on('end', () => resolve());

            buffer.pipe(outputFile);
        });

        // entregar la URL
        return `static/${documentName}`;
    }
}
