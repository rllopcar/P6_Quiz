'use strict';

module.exports = {
    up(queryInterface, Sequelize) {

        return queryInterface.bulkInsert('quizzes', [
            {
                question: 'Capital of Italy',
                answer: 'Rome',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                question: 'Capital of Portugal',
                answer: 'Lisbon',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                question: 'Capital of Spain',
                answer: 'Madrid',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                question: 'Capital of Germany',
                answer: 'Berlin',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                question: 'Capital of England',
                answer: 'London',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                question: 'Capital of Finland',
                answer: 'Helsinki',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                question: '1 + 1',
                answer: '1',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },

    down(queryInterface, Sequelize) {

        return queryInterface.bulkDelete('quizzes', null, {});
    }
};
