$(document).ready(function(){
    $("#theform").submit(async function (e) {
        'use strict';

        e.preventDefault();

        let varN = Number($("#txtUno").val());
        let num = varN;
        let [
            exp2, exp3, exp5, exp7, exp11, exp13, exp17, exp19,
            exp23, exp29, exp31, exp37, exp43, exp53, exp59, exp61,
            exp71, exp73, exp79, exp83, exp89, exp97, exp101
        ] = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ];

        let [ r, n ] = [ 0, 1 ];
        let [ divisores, exponentes ] = [ [], [] ];

        while (num % 2 === 0) {
            // Es divisible entre dos
            num = num / 2;
            exp2 = exp2 + 1;
        }

        while (num % 3 === 0) {
            // Es divisible entre tres
            num = num/3
            exp3=exp3+1;
        }

        while (num % 5 === 0) {
            // Es divisible entre cinco
            num = num / 5;
            exp5 = exp5 + 1;
        }

        while (num % 7 === 0) {
            // Es divisible entre siete
            num = num / 7;
            exp5 = exp5 + 1;
        }

        if (exp2 !== 0) {
            exponentes.push(exp2);
            divisores.push(2);
        }

        if(exp3 !== 0) {
            exponentes.push(exp3);
            divisores.push(3);
        }

        if (exp5 !== 0) {
            exponentes.push(exp5);
            divisores.push(5);
        }

        if (exp7 !== 0) {
            exponentes.push(exp7);
            divisores.push(7);
        }

        for (let i = 0; i < exponentes.length; i++) {
            n = n * (
                (divisores[i] ** (exponentes[i] + 1) - 1) /
                (divisores[i] - 1)
            );
        }

        for (let j = 0; j < divisores.length; j++) {
            if (divisores[j] === 0) {
                divisores.splice(j, 1);
                j = 0;
            }
        }

        for (let j = 0; j < exponentes.length; j++) {
            if (exponentes[j] === 0) {
                exponentes.splice(j, 1);
                j=0;
            }
        }

        let data = await fetch('/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                varN: varN,
                p: divisores,
                n: exponentes
            })
        }).then(res => res.json()).then(body => body.data.url);

    	let url = `/${data}`;

        let pdf = await PDFJS.getDocument(url);
        let page = await pdf.getPage(1);

        let desiredWidth = 1000;

        let viewport = page.getViewport(1);
        let scale = desiredWidth / viewport.width;
        let scaledViewport = page.getViewport(scale);

        let canvas = document.getElementById('pdf-canvas');
        let context = canvas.getContext('2d');

        canvas.height = scaledViewport.height;
        canvas.width = scaledViewport.width;

        let renderContext = {
            canvasContext: context,
            viewport: scaledViewport
        };

        page.render(renderContext);
    });
});
