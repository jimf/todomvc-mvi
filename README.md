# Model-View-Intent TodoMVC Example

> Model-View-Intent (MVI) is a unidirectional data flow architecture with Virtual DOM for rendering, just like React/Flux is.

> _[Reactive MVC and the Virtual DOM](http://futurice.com/blog/reactive-mvc-and-the-virtual-dom/)_


## Learning MVI

Since MVI is more a concept than a framework of sorts,
[Reactive MVC and the Virtual DOM](http://futurice.com/blog/reactive-mvc-and-the-virtual-dom/)
is the best resource for getting started.


## Implementation

This repo is more of a tinkering with the MVI concept than a true contribution
to the TodoMVC project. Parts of the [implementation spec](https://github.com/tastejs/todomvc/blob/master/app-spec.md#functionality)
have been deviated from slightly, and a handful of features, namely, giving
focus to an "editing" todo, persistance, and routing are yet to be implemented,
as I'm still trying to wrap my head around how these tasks should be performed
in the MVI architecture. The code is a bit unpolished as well, as this is the
result of a several-hour hack session.


## Running

    $ npm run-script build
    $ open index.html


## Credit

This TodoMVC application was created by [Jim Fitzpatrick](https://github.com/jimf).
