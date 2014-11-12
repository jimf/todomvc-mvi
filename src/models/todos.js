'use strict';

var Rx = require('rx'),
    _ = require('underscore'),
    replicate = require('../util/replicate'),
    intentAddTodo$ = new Rx.Subject(),
    intentToggleTodo$ = new Rx.Subject(),
    intentDeleteTodo$ = new Rx.Subject(),
    intentEditTodo$ = new Rx.Subject(),
    intentModifyTodo$ = new Rx.Subject(),
    intentCancelModifyTodo$ = new Rx.Subject(),
    intentToggleAllTodos$ = new Rx.Subject(),
    intentClearCompleted$ = new Rx.Subject(),
    addTodoMod$,
    toggleTodoMod$,
    deleteTodoMod$,
    editTodoMod$,
    modifyTodoMod$,
    cancelModifyTodoMod$,
    todoModifications,
    toggleAllTodosMod$,
    clearCompletedMod$,
    todos$;

function observe(TodosIntent) {
    replicate(TodosIntent.addTodo$, intentAddTodo$);
    replicate(TodosIntent.toggleTodo$, intentToggleTodo$);
    replicate(TodosIntent.deleteTodo$, intentDeleteTodo$);
    replicate(TodosIntent.editTodo$, intentEditTodo$);
    replicate(TodosIntent.modifyTodo$, intentModifyTodo$);
    replicate(TodosIntent.cancelModifyTodo$, intentCancelModifyTodo$);
    replicate(TodosIntent.toggleAllTodos$, intentToggleAllTodos$);
    replicate(TodosIntent.clearCompletedTodos$, intentClearCompleted$);
}

addTodoMod$ = intentAddTodo$.map(function(todo) {
    return function(todoItems) {
        return todoItems.concat([_.defaults(todo, {
            cid: _.uniqueId('model'),
            isEditable: false,
            completed: false
        })]);
    };
});

toggleTodoMod$ = intentToggleTodo$.map(function(todo) {
    return function(todoItems) {
        todoItems.some(function(todoItem) {
            if (todoItem.cid === todo.cid) {
                todoItem.completed = todo.completed;
                return true;
            }
            return false;
        });
        return todoItems;
    };
});

deleteTodoMod$ = intentDeleteTodo$.map(function(todo) {
    return function(todoItems) {
        return todoItems.filter(function(todoItem) {
            return todoItem.cid !== todo.cid;
        });
    };
});

editTodoMod$ = intentEditTodo$.map(function(todo) {
    return function(todoItems) {
        todoItems.some(function(todoItem) {
            if (todoItem.cid === todo.cid) {
                todoItem.isEditable = true;
                return true;
            }
            return false;
        });
        return todoItems;
    };
});

modifyTodoMod$ = intentModifyTodo$.map(function(todo) {
    return function(todoItems) {
        todoItems.some(function(todoItem) {
            if (todoItem.cid === todo.cid) {
                _.extend(todoItem, todo);
                return true;
            }
            return false;
        });
        return todoItems;
    };
});

cancelModifyTodoMod$ = intentCancelModifyTodo$.map(function(todo) {
    return function(todoItems) {
        todoItems.some(function(todoItem) {
            if (todoItem.cid === todo.cid) {
                _.extend(todoItem, todo);
                return true;
            }
            return false;
        });
        return todoItems;
    };
});

toggleAllTodosMod$ = intentToggleAllTodos$.map(function(todo) {
    return function(todoItems) {
        todoItems.forEach(function(todoItem) {
            todoItem.completed = todo.completed;
        });
        return todoItems;
    };
});

clearCompletedMod$ = intentClearCompleted$.map(function() {
    return function(todoItems) {
        return todoItems.filter(function(todoItem) {
            return !todoItem.completed;
        });
    };
});

todoModifications = addTodoMod$
    .merge(toggleTodoMod$)
    .merge(deleteTodoMod$)
    .merge(editTodoMod$)
    .merge(modifyTodoMod$)
    .merge(cancelModifyTodoMod$)
    .merge(toggleAllTodosMod$)
    .merge(clearCompletedMod$);

todos$ = todoModifications
    .startWith([])
    .scan(function(todoItems, modification) {
        return modification(todoItems);
    });

module.exports = {
    observe: observe,
    todos$: todos$
};
