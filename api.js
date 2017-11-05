const fetch = require('node-fetch');
const withQuery = require('with-query');
const point = 'http://207.154.204.86';

const Api = function(req) {
  this.req = req;
  return this;
};

Api.prototype.request = function(uri, method, data, query) {
  let queryString = {}
  query = query || {};
  let options = method.toUpperCase() !== 'GET' && {
      method: method.toUpperCase(),
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  } || {};

  if (this.req.session.token && !(data && data.token)) Object.assign(queryString, { token: this.req.session.token });
  if (Object.keys(query).length) Object.assign(queryString, query);

  return fetch(withQuery(`${point}${uri}`, queryString), options)
    .then(response => {
      let ct = response.headers.get('content-type');
      if (response.status === 200 && /json/i.test(ct)) {
        return response.json();
      }
      else if (response.status === 200) {
        return response.text();
      }
      else {
        let error = new Error(response.status);
        error.status = response.status;

        return Promise.reject(error);
      }
    });
}

module.exports = function(req) {
  return new Api(req);
};
