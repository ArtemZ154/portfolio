const express = require('express');
const bodyParser = require('body-parser');
const { data } = require('jquery');
var nunjucks = require('nunjucks') ;
const app = express();
var nunjucks = require('nunjucks') ;
const { response } = require('express');

nunjucks.configure('templates', {
    autoescape: true,
    express: app
});

app.use(express.static('templates'));
app.use(express.static('static'));

const urlencodedParser = express.urlencoded({extended: false});

let data_create_test = {
    '0':{
        name: 'dvxz',
        description: 'zcxvcx',
        questions: { 'Знаешь физику?': [ 'да', 'нет', 'возможно' ], 'Знаешь алгебру?': [ 'да', 'нет', 'возможно' ], 'Знаешь геометрию?': [ 'да', 'нет', 'возможно' ] },
        true_answers: { '0': 'нет', '1': 'да', '2': 'возможно' },
        number_test: 0
      }
};

app.get('/', function(request, response) {
    let data = {};
    response.render('main.njk', data);
});

app.get('/create_info', function(request, response){
    let data = {};
    response.render('create_test.njk', data);
});

app.get('/viewer_test/:numtest', function(request, response){
    let num_test = request.params.numtest;
    let data = {};
    data = data_create_test[num_test];
    console.log(data)
    response.render('viewer_test.njk', data);
});

app.post('/info_test', urlencodedParser, function(req, res){
    que = {

    };
    let count = 0;
    for (let key in data_create_test) {
        count++;
    };
    let data = req.body;
    data_create_test[count] = {};
    data_create_test[count]['name'] = data.name;
    data_create_test[count]['description'] = data['description_test'];
    all_aq = ((Object.keys(data)).length - 5) / 2;
    data_create_test[count]['questions'] = {};
    all_que_for_ans = []
    all_que_for_con = {}
    for (let i = 0; i < data['quest_name'].length; i++) {
        quest = data['quest_name'];
        a = quest[i];
        que[i] = a;
        if (a in all_que_for_con) {
            all_que_for_con[a] += 1
            b = a + `(${all_que_for_con[a]})`;
            data_create_test[count]['questions'][b]= '';
            all_que_for_ans.push(b);
        } else {
            all_que_for_con[a] = 1;
            data_create_test[count]['questions'][a]= '';
            all_que_for_ans.push(a);
        }
    };
    for (let i = 0; i < all_que_for_ans.length; i++) {
        a = all_que_for_ans[i];
        data_create_test[count]['questions'][a] = data[`answer_question_input${i}`];
    };
    all_a_t = {

    };
    for (let i = 0; i < all_que_for_ans.length; i++) {
        a = data[`answer_for_question${i}`];
        all_a_t[i] = a;
    };
    data_create_test[count]['true_answers'] = all_a_t;
    data_create_test[count]['number_test'] = count
    res.redirect('/')
});

app.post("/result_test", urlencodedParser, function(req, res) {
    let result_test_con = {}
    let result_test_con_res = {}
    let orachenie = []
    let data = req.body;
    let c = data_create_test[data.numbertest].questions;
    c = Object.keys(c);
    result_test = {}
    for (let i = 0; i < (Object.keys(c)).length; i++) {
        result_test_con[c[i]] = data[`answer-${c[i]}`]
        orachenie.push(c[i])
    };
    for (let i = 0; i < (Object.keys(result_test_con)).length; i++) {
        ans = result_test_con[orachenie[i]];
        true_ans = data_create_test[data.numbertest]['true_answers'][i];
        if (true_ans == ans) {
            result_test_con_res[orachenie[i]] = 1
        } else {
            result_test_con_res[orachenie[i]] = 0
        }
    }
    console.log(result_test_con_res)
    res.redirect('/viewer_test_result')
});

app.get('/viewer_test_result', function(req, res){
    
})

app.listen(port=8000, function () {
    console.log('Сервер запущен...');
});