'use strict';

var binder = require('./util/binder'),
    renderer = require('./renderer'),
    TodosModel = require('./models/todos'),
    TodosView = require('./views/todos'),
    TodosIntent = require('./intents/todos');

window.addEventListener('load', function() {
    binder(TodosModel, TodosView, TodosIntent);
    renderer.init();
    window.app = {
        models: { todos: TodosModel.todos$ }
    };
});
