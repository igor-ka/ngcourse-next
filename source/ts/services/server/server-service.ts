import {Inject} from '../../utils/di';

export class ServerService {

  constructor(
    @Inject('$http') 
      private $http: angular.IHttpService, 
    @Inject('API_BASE_URL') 
      private API_BASE_URL
  ) {}

  public get(path) {
    return this.$http.get(this.API_BASE_URL + path)
      .then(response => response.data);
  }

  public post(path, data) {
    return this.$http.post(this.API_BASE_URL + path, data)
      .then(response => response.data);
  }

  public put(path, id, data) {
    return this.$http.post(this.API_BASE_URL + path + '/' + id, data)
      .then(response => response.data);
  }
}
