export function getService(serviceName) {
  let injectedService;
  angular.mock.inject([serviceName, function(serviceInstance) {
    injectedService = serviceInstance;
  }]);
  return injectedService;
}
