'use strict';

var Rx = require('rx'),
    replicate = require('../util/replicate'),
    ENTER_KEY = 13,
    ESCAPE_KEY = 27,
    inputNewTodoKeypress$ = new Rx.Subject(),
    checkboxTodoChange$ = new Rx.Subject(),
    buttonDeleteTodoKeypress$ = new Rx.Subject(),
    labelTodoDblclick$ = new Rx.Subject(),
    inputModifyTodoKeyup$ = new Rx.Subject(),
    inputCancelModifyTodo$ = new Rx.Subject(),
    checkboxToggleAllTodos$ = new Rx.Subject(),
    buttonClearCompletedTodos$ = new Rx.Subject(),
    addTodo$,
    toggleTodo$,
    deleteTodo$,
    editTodo$,
    modifyTodo$,
    cancelModifyTodo$,
    toggleAllTodos$,
    clearCompletedTodos$;

function observe(TodosView) {
    replicate(TodosView.newTodoKeypress$, inputNewTodoKeypress$);
    replicate(TodosView.todoCompleteChange$, checkboxTodoChange$);
    replicate(TodosView.todoDeleteClick$, buttonDeleteTodoKeypress$);
    replicate(TodosView.todoEditDblclick$, labelTodoDblclick$);
    replicate(TodosView.todoModifyKeyup$, inputModifyTodoKeyup$);
    replicate(TodosView.todoModifyKeyup$, inputCancelModifyTodo$);
    replicate(TodosView.todoModifyBlur$, inputCancelModifyTodo$);
    replicate(TodosView.todoToggleAll$, checkboxToggleAllTodos$);
    replicate(TodosView.todoClearCompletedTodos$, buttonClearCompletedTodos$);
}

function getTodoEventCid(event) {
    /*global console*/
    var cid = event.currentTarget.getAttribute('data-todo-cid');
    if (!cid) {
        console.warn('cannot find cid for event target');
    }
    return cid;
}

addTodo$ = inputNewTodoKeypress$
    .filter(function(keypressEvent) {
        return keypressEvent.keyCode === ENTER_KEY;
    })
    .filter(function(keypressEvent) {
        return Boolean(keypressEvent.currentTarget.value.trim());
    })
    .map(function(keypressEvent) {
        var target = keypressEvent.currentTarget;
        return { title: target.value.trim() };
    });

toggleTodo$ = checkboxTodoChange$
    .map(function(changeEvent) {
        var target = changeEvent.currentTarget;
        return {
            cid: target.getAttribute('data-todo-cid'),
            completed: changeEvent.currentTarget.checked
        };
    });

deleteTodo$ = buttonDeleteTodoKeypress$
    .map(function(clickEvent) {
        return { cid: getTodoEventCid(clickEvent) };
    });

editTodo$ = labelTodoDblclick$
    .map(function(dblclickEvent) {
        return { cid: getTodoEventCid(dblclickEvent) };
    });

modifyTodo$ = inputModifyTodoKeyup$
    .filter(function(keyupEvent) {
        return keyupEvent.keyCode === ENTER_KEY;
    })
    .map(function(keyupEvent) {
        var retval = {
            cid: getTodoEventCid(keyupEvent),
            isEditable: false,
            title: keyupEvent.currentTarget.value
        };
        return retval;
    });

cancelModifyTodo$ = inputCancelModifyTodo$
    .filter(function(event) {
        return (event.type === 'keyup' && event.keyCode === ESCAPE_KEY) ||
            event.type === 'blur';
    })
    .map(function(event) {
        return {
            cid: getTodoEventCid(event),
            isEditable: false
        };
    });

toggleAllTodos$ = checkboxToggleAllTodos$
    .map(function(changeEvent) {
        return { completed: changeEvent.currentTarget.checked };
    });

clearCompletedTodos$ = buttonClearCompletedTodos$
    .map(function() {
        return { clearCompleted: true };
    });

module.exports = {
    observe: observe,
    addTodo$: addTodo$,
    toggleTodo$: toggleTodo$,
    deleteTodo$: deleteTodo$,
    editTodo$: editTodo$,
    modifyTodo$: modifyTodo$,
    cancelModifyTodo$: cancelModifyTodo$,
    toggleAllTodos$: toggleAllTodos$,
    clearCompletedTodos$: clearCompletedTodos$
};
