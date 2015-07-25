/// <reference path="../../../typings/tsd.d.ts" />
import {Inject} from 'utils/di';

export class ServerService {

  constructor(
    @Inject('$http') private $http, 
    @Inject('API_BASE_URL') private API_BASE_URL
  ) {
    // L&L destructuring can be used here instead  
  }

  public get(path) {
    return this.$http.get(this.API_BASE_URL + path)
      .then(function(response) {
        return response.data;
      });
  }

  public post(path, data) {
    return this.$http.post(this.API_BASE_URL + path, data)
      .then(function(response) {
        return response.data;
      });
  }

  public put(path, id, data) {
    return this.$http.post(this.API_BASE_URL + path + '/' + id, data)
      .then(function(response) {
        return response.data;
      });
  }
  
}