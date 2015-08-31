# Part 12: Reactive Programming with RxJs.

In chapters 8 and 10, we have seen on how to deal with asynchronicity within your application by using callbacks and promises, this chapter will focus on the concept of Observable that provide a paradigm for dealing with asynchronous data streams.

## What is Reactive Programming

Reactive programming is programming with asynchronous data streams represented by Observables. The concept here is a mix of Observer and Iterable design patterns. Specifically, observable can be conceptualized as an immutable collection of data ordered in time, and iterated over similarly to collections such as arrays or lists.

## Anatomy of a Basic Observable

First let's jump into a basic example to illustrate the concepts behinds RxJS observables.

```javascript
  let source = Rx.Observable.create(observer => {
    setTimeout(() => {
      observer.onNext(42);
      observer.onCompleted();
    }, 2000);
    
    console.log('Starting Observable Sequence!');
  });

  let subscription = source.subscribe(
    value => console.log('Value: ' + value),
    error => console.log(error),
    () => console.log('Completed Observable Sequence!')
  );
```

First, we create an observable sequence `source`. This sequence emits a single value asynchronously using `setTimeout()` and then completes.

The second part of the code subscribes to the observable sequence `source`, and provides an *Observer* represented by the 3 callbacks provided. Those callbacks are:

1. `onNext`: represents a function to be invoked when a new value is emitted onto an observable sequence `source`.
2. `onError`: represents a function to be invoked if an error occurs within an observable sequence.
3. `onComplete`: represents a function to be invoked when the observable sequence completes.

### Handling Errors

So far we created a basic observable example and attached the `onError` callback. Let's see how it can be put to better use.

```javascript
  let source = Rx.Observable.create(observer => {
    setTimeout(() => {
      try {
        //throw 'My Error';
        observer.onNext(42);
        observer.onCompleted();
      } 
      catch (error) {
        observer.onError(error);
      }
    }, 2000);
    
    console.log('Starting Observable Sequence!');
  });

  let subscription = source.subscribe(
    value => console.log('Value: ' + value),
    error => console.log(error),
    () => console.log('Completed Observable Sequence!')
  );
```

Running the above example without the `try...catch` and throwing an error will produce an uncaught error. Adding the try catch and handling the error by using the `onError` method allows us to emit the error via an observable and propogate it properly to the observer end.

### Disposing Subscriptions

One of the great features of observables is that it is possible to cancel them. To understand how to dispose of an observable sequence let's have a look at the API documentation on `Rx.Observable.create` [a here](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/create.md). Specifically, the part describing it's only argument:

>Implementation of the resulting observable sequence's subscribe method, optionally returning a function that will be wrapped in a disposable object

So we can return a function within our observable implementation that will be invoked when we call the `dispose` method on our subscription. Let's modify our example and see how it works out.

```javascript
  let source = Rx.Observable.create(observer => {
    setTimeout(() => {
      try {
        
        console.log('In Timeout!');
        
        observer.onNext(42);
        observer.onCompleted();
      } 
      catch (error) {
        observer.onError(error);
      }
    }, 2000);
    
    console.log('Starting Observable Sequence!');
    
    return () => console.log('Tearing Down an Observable Sequence');
    
  });

  let subscription = source.subscribe(
    value => console.log('Value: ' + value),
    error => console.log(error),
    () => console.log('Completed Observable Sequence!')
  );

  setTimeout(() => subscription.dispose(), 1000);
```

The last line of the code above, calls `dispose` method on our subscription after 1000ms (our observable is supposed to emit after 2000ms). If you run this example you will notice that this observable did not emit any values since we have called `dispose` method.

Note, however that our log statement within `setTimeout` was still called. This is an important fact, that implies that even though our subscription was disposed of the code within the `setTimeout` was still executed, it just did not emit any values onto the observable sequence.

The correct implementation in this case would be to cancel the timeout instead, like so.

```javascript
  let source = Rx.Observable.create(observer => {
    let timeoutId = setTimeout(() => {
      try {
        
        console.log('In Timeout!');
        
        observer.onNext(42);
        observer.onCompleted();
      } 
      catch (error) {
        observer.onError(error);
      }
    }, 2000);
    
    console.log('Starting Observable Sequence!');
    
    return () => {
      console.log('Disposing Observable Sequence');
      clearTimeout(timeoutId);
    };
    
  });

  let subscription = source.subscribe(
    value => console.log('Value: ' + value),
    error => console.log(error),
    () => console.log('Completed Observable Sequence!')
  );

  setTimeout(() => subscription.dispose(), 1000);
```

## Observables vs. Promises

Both promises and observables provide us with abstractions that help us deal with the asynchronous nature of our applications. However, there are important differences between the two. 

1. As can be seen in the example above, observables can define both the setup and teardown aspects of asynchronous behaviour. Observables are cancellable.
2. Moreover, observables can be retried using one of the retry operators provided by the API, such as `retryWhen`. On the other hand in the case of promises, the caller must have access to the original function that returned the promise in order to have retry capability.

## Creating Observable Sequences

Now that we got the anatomy and structure of observables understood, let's look at some of the many other ways to create observables.

### `fromArray`

```javascript
  Rx.Observable.fromArray([1, 2, 3]).subscribe(
    element => console.info(element),
    error => console.info(error),
    () => console.info('I am done!')
  );
```

### `interval` and `take`

```javascript
  Rx.Observable.interval(1000).take(5).subscribe(
    element => console.info(element),
    error => console.info(error),
    () => console.info('I am done!')
  );
```

The observable above will produce a value every 1000ms, only the first 5 values will be emitted due to the use of `take`, otherwise the sequence will emit values indefinitely.

### `fromPromise`

```javascript
  let promise = new Promise((resolve, reject) => resolve(42));

  Rx.Observable.fromPromise(promise)
    .subscribe((value) => console.log(value));
```

### `fromEvent`

```javascript
  Rx.Observable.fromEvent(document, 'click').subscribe(
    clickEvent => console.info(
      clickEvent.clientX + ', ' + clickEvent.clientY
    )
  );
```

The first line in the example above creates an observable of mouse click events on our document, ordered in time. Another way to refer to an observable is to call it an asynchronouse collection.

**The point to take home from this, is that EVERYTHING can be made into a stream using observables.**

## Using Observables Array Style

In addition to simply iterating over an asynchronous collection, we can perform other operations such as `filter` or `map` and many more as defined in RxJS [a API](https://github.com/Reactive-Extensions/RxJS). This is what bridges observable with the Iterable pattern, and lets us conceptualize them as collections.

Let's expand our example and do something a little more with our stream:

```javascript
  Rx.Observable.fromEvent(document, 'click')
    .filter(clickEvent: MouseEvent => clickEvent.altKey)
    .subscribe(clickEvent: MouseEvent => console.info(
      clickEvent.clientX + ', ' + clickEvent.clientY
    )
  );
```

Note the chaining function style, and the optional static typing that comes with TypeScript we have used in this example.

**Most Importantly** functions like `filter` return an observable, as in *observables beget other observables*, similarly to promises.

## Asynchronous Requests Using Observables

A lot of the time the asynchronous nature of our application will surface when dealing with UI events as illustrated in examples above, or making asynchronous server requests. Observables are well equipped to deal with both.

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
  let responseStream = Rx.Observable.create(observer => {
    $http.get('http://ngcourse.herokuapp.com/api/v1/tasks')
      .then(response => observer.onNext(response))
      .then(null, error => observer.onError(error));
  });
  
  responseStream.subscribe(
    (response) => $log.info('Data: ', response),
    (error) => $log.info('Error: ', error)
  );
```

In the code snippet above we are creating a custom response data stream, and notifying the observers of the stream when the data arrived.

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

Note that `flatMap` flattens a stream of observables (i.e observable of observables) to a stream of emitted values (a simple observable), by emitting on the "trunk" stream everything that will be emitted on "branch" streams.

Alternatively, if we were to use `map` instead, we would create a meta stream, i.e. a stream of stream.

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

This is not very useful in our current example as we would have to subscribe to an observable received from an observable stream. 

## Summary

RxJS is a flexible set of APIs for composing and transforming asynchronous streams, i.e Observables. It provides multitude of function to create stream from absolutely anything and more to manipulate them. It attempts to simplify the asynchronous aspects of our application, by presenting the streams as iterable collections, similar in syntax to Array Extras from ES5.
