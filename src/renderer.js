'use strict';

/*
 * Renderer component.
 * Subscribes to vtree observables of all view components
 * and renders them as real DOM elements to the browser.
 */
var h = require('virtual-hyperscript'),
    VDOM = {
        createElement: require('virtual-dom/create-element'),
        diff: require('virtual-dom/diff'),
        patch: require('virtual-dom/patch')
    },
    DOMDelegator = require('dom-delegator'),
    TodosView = require('./views/todos'),
    delegator;

function renderVTreeStream(vtree$, containerSelector) {
    /*global console*/
    // Find and prepare the container
    var container = window.document.querySelector(containerSelector),
        rootNode = window.document.createElement('div');

    if (container === null) {
        console.error(
            'Couldn\'t render into unknown \'' + containerSelector + '\''
        );
        return false;
    }
    container.innerHTML = '';

    // Make the DOM node bound to the VDOM node
    container.appendChild(rootNode);
    vtree$.startWith(h())
        .bufferWithCount(2, 1)
        .subscribe(function(buffer) {
            try {
                var oldVTree = buffer[0],
                    newVTree = buffer[1];
                rootNode = VDOM.patch(rootNode, VDOM.diff(oldVTree, newVTree));
            } catch (err) {
                console.error(err);
            }
        });
    return true;
}

function init() {
    delegator = new DOMDelegator();
    renderVTreeStream(TodosView.vtree$, '.js-container');
}

module.exports = {
    init: init
};
