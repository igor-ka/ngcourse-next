export function makeAuthenticatedMethod(koast, method) {
  return function() {
    let methodArgs = arguments;
    return koast.user.whenAuthenticated()
      .then(() => method.apply(this, methodArgs));
  };
}
