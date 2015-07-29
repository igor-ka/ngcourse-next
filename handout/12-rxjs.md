# Part 12: Reactive Programming with RxJs.

In chapters 8 and 10, we have seen on how to deal with asynchronicity within your application by using callbacks and promises, this chapter will focus on another concept, Reactive Programming that provides another paradigm for dealing with asyncronous data streams.

## What is Reactive Programming

Reactive programming is programming with asynchronous data streams represented by Observables. The concept here is a mix of Observer and Iterable design patterns. Specifically, observable can be conceptualized as an immutable collection of data ordered in time, and iterated over.

## Creating a Basic Observable

Let's jump into a basic example and illustrate those concepts using some of RxJS API.

```javascript
  let source = Rx.Observable.fromEvent(document, 'click');
  source.forEach((clickEvent) => console.log(clickEvent));
```

The first line in the example above  creates an asynchronous collection (i.e a stream of events) from a series of mouse clicks on our document, ordered in time. This asynchronous collection is what we refer to as an obervable.

We are using the `forEach` method to iterate over this asynchronous collection as if it was a regular array. We also provide a callback, simply logging the event object to our console.

One useful way to visualize observables is to create diagrams like the one  below that illustrate our click events as an asynchronous collection ordered in time.

![alt tag](https://medium2.global.ssl.fastly.net/max/2000/1*FjTqms95LbK_ztsZXiNpoQ.png)

## Using Observables Array Style

In addition to simply iterating over an asynchronous collection, we can perform other operatios such as `filter` or `map` and many more as defined in RxJS API.

https://github.com/Reactive-Extensions/RxJS

Let's expand our example and do something a little more with our stream:

```javascript
  Rx.Observable.fromEvent(document, 'click')
    .filter(
      (clickEvent: MouseEvent) => clickEvent.altKey)
    .forEach(
      (clickEvent: MouseEvent) => console.log(clickEvent));
```

Note the chaining function style, and the optional static typing that comes with TypeScript we have used in this example.

**Most Importantly** functions like `filter` return an observable, as in *observables beget other observables*, similarly to promises.

## Subscribing to an Observable

In the example above, we have provided a callback to capture a value when it was emitted asynchronously, array style. The more flexible approach is to use  `subsribe()` method instead. To begin using it, it is worth looking at its API first.

``` javascript
subscribe(
    onNext?: (value: T) => void, 
    onError?: (exception: any) => void, 
    onCompleted?: () => void)
```

The API defines 3 things that can be emitted from a stream.

1. A value of some type
2. An error
3. Completed signal

Note that all three are optional arguments and the use of `forEach` is basically the same as provding a callback for the `onNext` method only.

We could rewrite the example using subscribe as well:

```javascript
    Rx.Observable.fromEvent(document, 'click')
      .filter(
        (clickEvent: MouseEvent) => clickEvent.altKey)
      .subscribe(
        (clickEvent: MouseEvent) => console.log(clickEvent));
```

But to illustrated this concept in more detail, let use `fromArray` method

```javascript
    Rx.Observable.fromArray([1, 2, 3])
      .subscribe(
        (element) => $log.info(element),
        (error) => $log.info(error),
        () => $log.info('I am done!')
      );
```

In summary, you observables can implement `onCompleted` methods to fully bridge the gap with the Iterator pattern.

## Asynchronous Requests Using Observables

Most of the time the asynchronous nature of our application will surface when dealing with UI events as illustrated in examples above, or making asynchronous server requests. Observables are well equipped to deal with both.

We have already seen the code below in Chapter 6 about REST APIs.

```javascript

  this.$http.get('http://ngcourse.herokuapp.com/api/v1/tasks')
    .then((response) => {
      this.$log.info(response.data);
      this.tasks = response.data;
    })
    .then(null, 
      (error) => this.$log.error(status, error));

```

Let's see how we can make an asynchronous server call using an Observable instead.

```javascript
  let responseStream = Rx.Observable.create((observer) => {
    $http.get('http://ngcourse.herokuapp.com/api/v1/tasks')
      .then((response) => observer.onNext(response))
      .then(null, (error) => observer.onError(error));
  });
  
  responseStream.subscribe(
    (response) => $log.info('Data: ', response),
    (error) => $log.info('Error: ', error)
  );
```

In the code snippet above we are creating a custom response data stream, and notifying the observers of the stream when the data arrived.

The point to take home with this, is that EVERYTHING can be made into a stream using observables. Wrapping promises in observable is such a commont scenario that RxJS library, has kindly provided us with a simple wrapper function for this - `fromPromise`.

```javascript
    let responseStream = Rx.Observable.fromPromise(
      $http.get('http://ngcourse.herokuapp.com/api/v1/tasks'));
      
    responseStream.subscribe(
      (response) => $log.info('Data: ', response),
      (error) => $log.info('Error: ', error)
    );
```

## Combining Stream with `flatMap`

We want to make something a bit more useful and attach our server request to a button click. How can that be done with streams? Let's observe the example below.

```javascript
  let eventStream = 
    Rx.Observable.fromEvent(document.getElementById('refreshBtn'), 'click');
    
  let responseStream = eventStream  
    .flatMap(() => Rx.Observable.fromPromise(
      $http.get('http://ngcourse.herokuapp.com/api/v1/tasks')));

  responseStream.subscribe(
    (response) => $log.info('Async Data: ', response),
    (error) => $log.info('Async Error: ', error)
  );
```

First we create an observable of button click events on some button. Then we use the `flatMap` function to transform our event stream into our response stream.

Note that `flatMap` flattens a metastream, by emitting on the "trunk" stream everything that will be emitted on "branch" streams, as illustrated by diagram below:


| map        | flatMap  |
| ------------- |:-----:|
| ![alt tag](https://camo.githubusercontent.com/2a8a9cc75acd13443f588fd7f386bd7a6dcb271a/687474703a2f2f692e696d6775722e636f6d2f48486e6d6c61632e706e67) | ![alt tag](https://camo.githubusercontent.com/0b0ac4a249e1c15d7520c220957acfece1af3e95/687474703a2f2f692e696d6775722e636f6d2f4869337a4e7a4a2e706e67) | 


Alternativly, if we were to use `map` instead, we would create a meta stream, i.e. a stream of stream.

```javascript
  ...      
  let metaStream = eventStream  
    .map(() => Rx.Observable.fromPromise(
      $http.get('http://ngcourse.herokuapp.com/api/v1/tasks')));

  // We would have to subsribe to each stream received below
  // to achieve the behaviour we want
  metaStream.subscribe(
    (stream) => $log.info('Async Data: ', stream),
    (error) => $log.info('Async Error: ', error)
  );
```

This is not very useful in our current example as we would have to subsribe to an observable recieved from an observable stream. 

## Observable vs Observer


## Summary

RxJS is a flexible set of APIs for composing and transforming asynchronous streams, i.e Observables. It provides multitude of function to create stream from absolutely anything and more to manipulate them. It attempts to simplify the asynchronous aspects of our application, by presenting the streams as iterable collections, similar in syntax to Array Extras from ES5.




