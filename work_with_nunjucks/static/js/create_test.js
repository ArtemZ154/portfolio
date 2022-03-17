$('.count-test').on('keyup', function () {
    let count = $('.count-test').val();
    $('.questions').text("")
    for (let i = 0; i < count; i++) {
        $('.questions').append(`<input type="text" placeholder="Введите вопрос теста" class="name_test_${i}" name="quest_name" autocomplete="off">`);
        $('.questions').append(`<input type="text" placeholder="Количество ответов" class="count-answer n-${i}" name="count_answer_test" autocomplete="off"><div class="answers"></div>`);
    };
    let sch = 0;
    $('.count-answer').on('keyup', function () {
        let count = $(this).val();
        var classList = $(this).attr('class').split(/\s+/);
        let gen = classList[1].substring(2)
        $('.' + classList[1]).next().text("");
        
        for (let j = 0; j < count; j++) {
            $(this).next().append(`<label><input type="radio" name="answer_for_question${gen}" value="" class="answer-for-question answer-for-question${gen} sch-${sch}"><input type="text" placeholder="Введите ответы" name="answer_question_input${gen}" class="answer-question-input n-${gen} schi-${sch}" autocomplete="off"></label><br>`);
            sch += 1
        };
        $('.answer-question-input').on('keyup', function () {
            let count = $(this).val();
            var classList = $(this).attr('class').split(/\s+/);
            let gen = 'sch-' + classList[2].substring(5);
            var b = document.querySelector(`.${gen}`);
            b.setAttribute('value', count)
        });
    });
    
})