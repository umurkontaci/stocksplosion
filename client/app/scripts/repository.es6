import request from 'superagent'
import _ from 'lodash'

function getUrl(url) {
  return new Promise(function (resolve, reject) {
    request
      .get(url)
      .accept('application/json')
      .end(function (err, resp) {
      if (!err && resp.status === 200) {
        try {
          resolve(resp.body); // superagent parses json
        } catch (e) {
          reject(e);
        }
      } else {
        reject(err);
      }
    });
  });
}
let config = {
  rootUrl: ''
};

export default {
  configure(cfg) {
    _.extend(config, cfg);
  },
  getAll() {
    return getUrl(`${config.rootUrl}/api/company`);
  },
  getDetail(companySymbol, startDate, endDate) {
    return getUrl(`${config.rootUrl}/api/${companySymbol}/symbol?startdate=${startDate}&enddate=${endDate}`);
  }
}