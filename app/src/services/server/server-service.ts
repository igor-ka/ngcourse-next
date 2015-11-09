export class ServerService {

  static $inject = [
    '$http'
  ];

  private BASE_URL = 'http://ngcourse.herokuapp.com';
  
  constructor(
    private $http: angular.IHttpService
  ) { }

  public get(path, id?) {
    return this.$http.get(this.BASE_URL + path)
      .then(response => response.data);
  }

  public post(path, data) {
    return this.$http.post(this.BASE_URL + path, data);
  }

  public put(path, id, data) {
    return this.$http.put(this.BASE_URL + path + '/' + id, data);
  }
  
  public delete(path, id) {
    return this.$http.delete(this.BASE_URL + path + '/' + id);
  }
}
