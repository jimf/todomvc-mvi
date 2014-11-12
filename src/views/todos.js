'use strict';

var Rx = require('rx'),
    replicate = require('../util/replicate'),
    h = require('virtual-hyperscript'),
    modelTodos$ = new Rx.BehaviorSubject(null),
    newTodoKeypress$ = new Rx.Subject(),
    todoCompleteChange$ = new Rx.Subject(),
    todoDeleteClick$ = new Rx.Subject(),
    todoEditDblclick$ = new Rx.Subject(),
    todoModifyKeyup$ = new Rx.Subject(),
    todoModifyBlur$ = new Rx.Subject(),
    todoToggleAll$ = new Rx.Subject(),
    todoClearCompletedTodos$ = new Rx.Subject(),
    vtree$;

function observe(TodosModel) {
    replicate(TodosModel.todos$, modelTodos$);
}

function vrenderSectionHeader() {
    return h('header#header', {}, [
        h('h1', ['todos']),
        h('input', {
            id: 'new-todo',
            value: '',
            placeholder: 'What needs to be done?',
            autofocus: true,
            'ev-keypress': function(ev) {
                newTodoKeypress$.onNext(ev);
            }
        })
    ]);
}

function vrenderTodo(todoData) {
    var liClasses = [];

    if (todoData.isEditable) { liClasses.push('editing'); }
    if (todoData.completed)  { liClasses.push('completed'); }

    return h('li', {
        className: liClasses.length ? liClasses.join(' ') : undefined
    }, [
        h('div.view', [
            h('input', {
                className: 'toggle',
                type: 'checkbox',
                checked: todoData.completed ? 'checked' : '',
                attributes: {
                    'data-todo-cid': todoData.cid
                },
                'ev-change': function(ev) {
                    todoCompleteChange$.onNext(ev);
                }
            }),
            h('label', {
                attributes: {
                    'data-todo-cid': todoData.cid
                },
                'ev-dblclick': function(ev) {
                    todoEditDblclick$.onNext(ev);
                }
            }, [todoData.title]),
            h('button.destroy', {
                attributes: {
                    'data-todo-cid': todoData.cid
                },
                'ev-click': function(ev) {
                    todoDeleteClick$.onNext(ev);
                }
            })
        ]),
        h('input.edit', {
            value: todoData.title,
            attributes: {
                'data-todo-cid': todoData.cid
            },
            'ev-keyup': function(ev) {
                todoModifyKeyup$.onNext(ev);
            },
            'ev-blur': function(ev) {
                todoModifyBlur$.onNext(ev);
            }
        })
    ]);
}

function vrenderSectionFooter(todosData) {
    var numIncomplete = todosData
            .filter(function(todo) { return !todo.completed; }).length,
        numCompleted = todosData
            .filter(function(todo) { return todo.completed; }).length,
        children = [
            h('span#todo-count', [
                h('strong', [ numIncomplete.toString() ]),
                (numIncomplete === 1) ? ' item left' : ' items left'
            ]),
            h('ul#filters', [
                h('li', [
                    h('a', { href: '#/', className: 'selected' }, ['All']),
                    h('a', { href: '#/active' }, ['Active']),
                    h('a', { href: '#/completed' }, ['Completed'])
                ])
            ])
        ];

    if (numCompleted) {
        children.push(
            h('button#clear-completed', {
                'ev-click': function(ev) {
                    todoClearCompletedTodos$.onNext(ev);
                }
            }, ['Clear completed (' + numCompleted + ')'])
        );
    }

    return h('footer#footer', {
        style: { display: todosData.length ? 'block' : 'none' }
    }, children);
}

function vrenderFooter() {
    return h('footer#info', [
        h('p', ['Double-click to edit a todo']),
        h('p', ['Written by Jim Fitzpatrick']),
        h('p', [
            'Part of ',
            h('a', { href: 'http://todomvc.com' }, ['TodoMVC'])
        ])
    ]);
}

vtree$ = modelTodos$
    .map(function(todosData) {
        todosData = todosData || [];

        return h('div.container', {}, [
            h('section#todoapp', [
                vrenderSectionHeader(),
                h('section#main', {
                    style: {
                        display: todosData.length ? 'block' : 'none'
                    }
                }, [
                    h('input#toggle-all', {
                        type: 'checkbox',
                        'ev-change': function(ev) {
                            todoToggleAll$.onNext(ev);
                        }
                    }),
                    h('label', {
                        attributes: {
                            'for': 'toggle-all'
                        }
                    }, ['Mark all as complete']),
                    h('ul', { id: 'todo-list' }, [
                        todosData.map(vrenderTodo)
                    ])
                ]),
                vrenderSectionFooter(todosData)
            ]),
            vrenderFooter()
        ]);
    });

module.exports = {
    observe: observe,
    vtree$: vtree$,
    newTodoKeypress$: newTodoKeypress$,
    todoCompleteChange$: todoCompleteChange$,
    todoDeleteClick$: todoDeleteClick$,
    todoEditDblclick$: todoEditDblclick$,
    todoModifyKeyup$: todoModifyKeyup$,
    todoModifyBlur$: todoModifyBlur$,
    todoToggleAll$: todoToggleAll$,
    todoClearCompletedTodos$: todoClearCompletedTodos$
};
