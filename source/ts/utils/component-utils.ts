export function Inject(injectable) {
  return (prototype, method, argumentPosition) => {
    prototype.$inject = prototype.$inject || [];
    prototype.$inject[argumentPosition] = injectable;
  };
}

export function makeDirective(component) {
  return () => {

    let ddo = {
      restrict: 'E',
      scope: {},
      controllerAs: 'ctrl',
      bindToController: true,
      controller: component
    };

    if (component.template) {
      angular.extend(ddo, {
        template: component.template
      });
    }

    if (component.templateUrl) {
      angular.extend(ddo, {
        templateUrl: component.templateUrl
      });
    }
    
    if (component.options) {
      angular.extend(ddo, component.options);
    }
    
    return ddo;
  };
}

export function makeSelector(component) {
  return component.selector.replace(
    /-([a-z])/g,
    (g) => g[1].toUpperCase()
  );
}