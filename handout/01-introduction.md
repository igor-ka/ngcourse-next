# Part 1: Introduction to AngularJS and ngCourse-Next

AngularJS is the leading open source JavaScript application framework backed by Google. The "1.x" version of AngularJS has been used quite widely. The new "Angular 2" version of the framework is currently available as a preview.

This course ("ngCourse-Next") provides an introduction to AngularJS based on our experience at [rangle.io](http://rangle.io) and with an eye to eventual transition to Angular 2. In other words, we will be learning how to build single page applications using Angular 1.4, but in such a way as to make the eventual transition to Angular 2 as easy as possible.

## AngularJS, the Good Parts

Douglas Crockford's seminal book
_[JavaScript, The Good Parts](http://www.amazon.ca/JavaScript-Good-Parts-Douglas-Crockford/dp/0596517742)_
has this to say about JavaScript:

> Most languages contain good parts and bad parts. I discovered that I could
> be a better programmer by using only the good parts and avoiding the bad
> parts... JavaScript is a language with more than its share of bads parts.

Crockford goes on to point out that JavaScript also has lots of _good_ parts which can make it a great language to use. The key is avoiding the bad parts.

(Crockford's book should be required reading for all JavaScript developers. At
rangle.io, we keep a few extra copies on hand on the off-chance that one of our
developers has not already read this great book.)

What Crockford says about programming languages applies equally well to
frameworks: most have good parts and bad parts. Our approach to AngularJS 1.x
has somewhat resembled Crockford's approach to JavaScript. AngularJS 1.x does not have nearly the same kind of warts as JavaScript, but it does have features that will help you shoot yourself in the foot, even as many of its other features help you build highly scalable software. When we've taught this course, we always tried to highlight "the good parts" and to show how you can use them to your advantage.

The upcoming Angular 2 brings a number of changes. Some of those changes involve removing those parts of Angular that have proved to not work well. Other changes involve borrowing the best ideas from outside the Angular ecosystem. Finally, another large set of changes aims to take advantage of new features that are becoming available in ES6, the new version of JavaScript.

Angular 2 is not yet ready for real-world use, but anyone who is starting to work on an Angular application today should be planning an eventual transition to Angular 2.

This course teaches you to write applications using Angular 1.4 the Angular 2 way.

## MVC and MVVM

AngularJS is often described as an MVC ("Model-View-Controller") framework.
Here is how this is often illustrated:

![Simple MVC](https://raw.githubusercontent.com/rangle/ngcourse-next/master/handout/images/simple-mvc.gif)

This picture, however, is far too simple.

First, only the most trivial applications can be understood as
consisting of a single model, a single view and a single controller. More
commonly, an application will include multiple views, multiple controllers,
and multiple data models. So, it might look more like this:

![Simple MVC](https://raw.githubusercontent.com/rangle/ngcourse-next/master/handout/images/mvvm-initial.gif)

The figure above makes another important substitution, however. "Controllers"
are replaced with "view models". Angular can be better understood as a "MVVM"
("Model-View-ViewModel") framework. In this approach, we have "view models"
mediating between views and (data) models. While this may seem like just a
minor change of terminology, the idea of "view model" helps clarify the path
towards better AngularJS architecture. A view model is a mediating object that
takes data from a data model and presents it to a view in a "digested" form.
Because of that, the view model superficially looks like a model. It should
not be confused with the application's real data models. Misusing the view
model as the model is one of the most common sources of problems in AngularJS.

Now let's see how MVVM model is realized in AngularJS.

## View Synchronization

Most introductions to Angular start with a look at the "front-end" of the
framework. Let's do the same here, even though most of your AngularJS code
should be in the model layer.

![Simple MVC](https://raw.githubusercontent.com/rangle/ngcourse/master/handout/images/mvvm-front-end.gif)

AngularJS views are HTML templates that are extended with custom elements and
attributes called "directives". AngularJS provides you with a lot of
directives and you will also be developing some yourself.

Views are linked with view models that take the form of "controllers" and
custom "directives". In either case we are looking at some code that controls
JavaScript objects (the actual "view model") that are referenced in the
templates. Angular 2 merges "controllers" and "directives" into a single
concept of a "component". In this course we will be building our application
as a collection of components, though we will be practically implementing each
component as a combination of a controller and a directive.

AngularJS automatically synchronizes DOM with view models when the view model changes. It also allows us to associate function handlers with DOM events. Both of those methods are preserved and generalized in Angular 2. Angular 1.x also has a concept of "two-way databinding", where properties of the view model can be automatically changed to reflect changes to DOM properties. This approach is deprecated in Angular 2 and we will avoid it.

Angular's approach to view synchronization makes it very "designer-friendly": designers can modify HTML templates without worrying too much about the code. The reverse is also true: as long as there is a designer on the team, developers are largely freed from worrying about HTML and CSS. Angular 2 preserves this feature.

Angular 1.x allows you to organize your view models into a hierarchy of "scopes" that partly mirrors DOM structure. This approach has proven problematic and we've usually recommended against it. It is being dropped entirely in Angular 2. For this reason, we will avoid it completely in this course. Instead, we will aim to make our components fully isolated. We'll also aim to have them do as little work as possible. Instead, most of the work (in particular, all of the business logic) should be moved to the lower "model" level.

More generally, it is important to understand that view models are a temporary staging area for your data on the way to the view. They should not be used as your primary model.

## Models in Services

AngularJS does provide us with a great way to implement our data models at
arm's length from the views using a mechanism called "services".

![Simple MVC](https://raw.githubusercontent.com/rangle/ngcourse/master/handout/images/mvvm-final.gif)

Services are singleton objects that normally do not concern themselves with
the DOM but instead take care of your data. The bulk of your application's
business logic should belong in services. We'll spend a lot of time talking
about this.

Services get linked together through an approach that AngularJS calls
"dependency injection". This is also how they are exposed to view models
(controllers and custom directives, or "components" going forward).

In the case of Angular, what "dependency injection" practically means is that components do not get to create and define their dependencies. Instead, services are created _first_, before any components are instantiated. Each component's definition specifies what dependencies should be provided to the component.

Angular's dependency injection is one of the best things about the framework.
This approach makes your code more modular, reusable, and easier to test.
Those features are essential when building larger applications.

## ES6 and TypeScript

Angular 2 makes use of a number of features of ES6 and TypeScript. Using Angular 2 with ES5 (the current version of JavaScript) is possible but cumbersome. It is possible, however, to write Angular 1.4 code using TypeScript. So, that's what we will be doing in this course.

## The Summary of Different Approaches

                                      | Old School Angular 1.x | Angular 1.x Best Practices | **Angular Next**             | Angular 2
--------------------------------------|------------------------| ---------------------------|------------------------------|----------------------
Nested scopes ("$scope", watches)     | Used heavily           | Avoided                    | **Avoided**                  | Gone 
Directives vs controllers             | Use as alternatives    | Used together              | **Directives as components** | Component directives
Controller and service implementation | Functions              | Functions                  | **ES6 classes**              | ES6 classes
Module system                         | Angular's modules      | Angular's modules          | **ES6 modules**              | ES6 modules
Requires a transpiler                 | No                     | No                         | **TypeScript**               | TypeScript





