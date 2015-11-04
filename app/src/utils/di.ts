export function getServices(annottee, args) {
  let services = {};
  annottee.$inject.forEach(function(key, index) {
    services[key] = args[index];
  });
  return services;
}

export function InjectIntoClass(injectables: any) {
  return function(target: any) {
    target.$inject = injectables;
  };
}

export function Inject(injectable) {
  return function(prototype, method, argumentPosition) {
    prototype.$inject = prototype.$inject || [];
    prototype.$inject[argumentPosition] = injectable;
  };
}
