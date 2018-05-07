const Sequelize = require("sequelize");
const {models} = require("../models");

// Autoload the quiz with id equals to :quizId
exports.load = (req, res, next, quizId) => {

    models.quiz.findById(quizId)
    .then(quiz => {
        if (quiz) {
            req.quiz = quiz;
            next();
        } else {
            throw new Error('There is no quiz with id=' + quizId);
        }
    })
    .catch(error => next(error));
};


// GET /quizzes
exports.index = (req, res, next) => {

    models.quiz.findAll()
    .then(quizzes => {
        res.render('quizzes/index.ejs', {quizzes});
    })
    .catch(error => next(error));
};


// GET /quizzes/:quizId
exports.show = (req, res, next) => {

    const {quiz} = req;

    res.render('quizzes/show', {quiz});
};


// GET /quizzes/new
exports.new = (req, res, next) => {

    const quiz = {
        question: "", 
        answer: ""
    };

    res.render('quizzes/new', {quiz});
};

// POST /quizzes/create
exports.create = (req, res, next) => {

    const {question, answer} = req.body;

    const quiz = models.quiz.build({
        question,
        answer
    });

    // Saves only the fields question and answer into the DDBB
    quiz.save({fields: ["question", "answer"]})
    .then(quiz => {
        req.flash('success', 'Quiz created successfully.');
        res.redirect('/quizzes/' + quiz.id);
    })
    .catch(Sequelize.ValidationError, error => {
        req.flash('error', 'There are errors in the form:');
        error.errors.forEach(({message}) => req.flash('error', message));
        res.render('quizzes/new', {quiz});
    })
    .catch(error => {
        req.flash('error', 'Error creating a new Quiz: ' + error.message);
        next(error);
    });
};


// GET /quizzes/:quizId/edit
exports.edit = (req, res, next) => {

    const {quiz} = req;

    res.render('quizzes/edit', {quiz});
};


// PUT /quizzes/:quizId
exports.update = (req, res, next) => {

    const {quiz, body} = req;

    quiz.question = body.question;
    quiz.answer = body.answer;

    quiz.save({fields: ["question", "answer"]})
    .then(quiz => {
        req.flash('success', 'Quiz edited successfully.');
        res.redirect('/quizzes/' + quiz.id);
    })
    .catch(Sequelize.ValidationError, error => {
        req.flash('error', 'There are errors in the form:');
        error.errors.forEach(({message}) => req.flash('error', message));
        res.render('quizzes/edit', {quiz});
    })
    .catch(error => {
        req.flash('error', 'Error editing the Quiz: ' + error.message);
        next(error);
    });
};


// DELETE /quizzes/:quizId
exports.destroy = (req, res, next) => {

    req.quiz.destroy()
    .then(() => {
        req.flash('success', 'Quiz deleted successfully.');
        res.redirect('/quizzes');
    })
    .catch(error => {
        req.flash('error', 'Error deleting the Quiz: ' + error.message);
        next(error);
    });
};


// GET /quizzes/:quizId/play
exports.play = (req, res, next) => {

    const {quiz, query} = req;

    const answer = query.answer || '';

    res.render('quizzes/play', {
        quiz,
        answer
    });
};


// GET /quizzes/:quizId/check
exports.check = (req, res, next) => {

    const {quiz, query} = req;

    const answer = query.answer || "";
    const result = answer.toLowerCase().trim() === quiz.answer.toLowerCase().trim();

    res.render('quizzes/result', {
        quiz,
        result,
        answer
    })
};

// GET /quizzes/randomplay
exports.randomplay = (req, res, next) => {
    quizzes = ""
    
    models.quiz.findAll().then(resp => {
        req.session.total = resp.length
        var score = 0
        var aux = []
        if (req.session.arrayIdContestadas.length > 0){
            score = req.session.arrayIdContestadas.length
        } else {
            req.session.arrayIdContestadas = []
            var i;
            for (i = 0; i<resp.length; i++){
                    aux.push(resp[i])
            }
        }
        console.log('JFJFJAFVFVFEGTBVJJJJJJAAJAJAJAJAAJJAJ',JSON.stringify(aux))
        var i = 0
        if (resp) {
            for (i = 0; i<resp.length; i++){
                var j
                for (j = 0; j<req.session.arrayIdContestadas.length; j++){
                    if(req.session.arrayIdContestadas[j] !== resp[i].id){
                        // aqui guardamos los quizzes que no se han contestado
                        aux.push(resp[i])
                    }
                }
            }
            let rand = parseInt(Math.random() * aux.length)
            var quiz =  aux[rand]
            score = req.session.arrayIdContestadas.length
            res.render('random_play',{
                score,
                quiz
            });
        } else {
            throw new Error('There is no quizzes in de tha database');
        }
    })
};

// GET /quizzes/randomcheck/:quizId?answer=respuesta
exports.randomcheck = (req, res, next) => {
    
    var quiz = models.quiz.find
    var quizId = req.params.quizId
    var answer = req.query.answer

    models.quiz.findById(quizId)
    .then(quiz => {
        score = req.session.arrayIdContestadas.length
        let result = true
        if (quiz.answer == answer) {
            //guardo el id de la pregunta para que no se repita
            req.session.arrayIdContestadas.push(quiz.id)
            score = req.session.arrayId.length
            if (score == req.session.total) {
                req.session.arrayIdContestadas = []
                res.render('random_nomore',{
                    score
                })
            } else {
                res.render('random_result', {
                    score,
                    answer,
                    result
                })
            }
        } else {
            // Borro los datos de session para poder volver a jugar
            req.session.arrayIdContestadas = []
            result = false
            res.render('random_result',{
               score,
               answer,
               result
            })
        }
    })
    .catch(error => next(error));
}

