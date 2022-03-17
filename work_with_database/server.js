const sq = require("sqlite3");
const express = require("express");
const nunjucks = require('nunjucks');
const app = express();

nunjucks.configure('templates', {
    autoescape: true,
    express: app
});

app.use(express.static(__dirname + "/static"));

async function getdata(typeq, dataq, n_tab) {
    let bd = new sq.Database('moloko_bytalaka.db');
    all_types = {
        all: `SELECT * FROM ${n_tab}`,
        search: `SELECT * FROM ${n_tab} WHERE id=?`,
        value2: `SELECT * FROM all_table WHERE Bpak > 0`,
        value1: `SELECT * FROM all_table WHERE Bpak = 0`
    };
    let sqlq = all_types[typeq]
    let prom = new Promise(function (res, rej) {
        bd.all(sqlq, dataq, function (err, rows) {
            if (err) {
                rej(err);
            } else {
                res(rows);
            };
        });
    });
    let data = prom;
    bd.close();
    return data;
};

app.get('/table/:tab', function (req, res) {
    table = req.params.tab;
    getdata('all', [], table).then(function (data) {
        let templatedata = {
            colums: Object.keys(data[0]),
            rows: data
        };
        res.render('index.html', templatedata);
    });
});

app.get('/sort/:brak', function (req, res) {
    brak_n = req.query[req.params.brak];
    getdata(brak_n, [], 'all_table').then(function (data) {
        let templatedata = {
            colums: Object.keys(data[0]),
            rows: data
        };
        res.render('index.html', templatedata);
    });
});

app.get('/kol', function (req, res) {
    getdata('all', [], 'all_table').then(function (data) {
        let templatedata = {
            colums: Object.keys(data[0]),
            rows: data
        };
        templatedata.colums.push('Результат с браками')
        for (i = 0; i < templatedata.rows.length; i++) {
            a = templatedata.rows[i];
            fact = a['План выпуска'] * (1 - (a.Bpak / 100));
            a['Факт'] = fact;
        };
        res.render('index.html', templatedata);
    });
});

app.get('/p_v', function (req, res) {
    getdata('all', [], 'all_table').then(function (data) {
        let templatedata = {
            colums: Object.keys(data[0]),
            rows: data
        };
        templatedata.colums.push('фактический объем')
        for (i = 0; i < templatedata.rows.length; i++) {
            a = templatedata.rows[i];
            if (a['Bpak'] < 5 && a['Bpak'] != 0) {
                n = a['План выпуска'] / (1 - (5 / 100));
                a['план выпуска изделий'] = n;
            } else if (a['Bpak'] > 5 && a['Bpak'] < 15) {
                n = a['План выпуска'] / (1 - (15 / 100));
                a['план выпуска изделий'] = n;
            } else if (a['Bpak'] > 25) {
                n = a['План выпуска'] / (1 - (25 / 100));
                a['план выпуска изделий'] = n;
            } else {
                a['план выпуска изделий'] = a['План выпуска']
            };
        };

        res.render('index.html', templatedata);
    });
});

app.get('/o_p_b', function (req, res) {
    getdata('all', [], 'all_table').then(function (data) {
        let templatedata = {
            colums: Object.keys(data[0]),
            rows: data
        };
        col = {};
        for (i = 0; i < templatedata.rows.length; i++) {
            a = templatedata.rows[i];
            b = a['Код цеха'];
            col[b] = 0;
        };
        for (i = 0; i < templatedata.rows.length; i++) {
            a = templatedata.rows[i];
            b = a['Код цеха'];
            c = a['Bpak'];
            g = col[String(b)] + c;
            col[String(b)] = g;
        };
        templatedata['dopinfa'] = col

        res.render('index.html', templatedata);
    });
});

app.listen(port = 8000, function () {
    console.log('Сервер запущен...');
});