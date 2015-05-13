import request from 'superagent'

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

export default {
  getAll() {
    return getUrl('http://localhost:8001/api/company');
  },
  getDetail(companySymbol, startDate, endDate) {
    return getUrl(`http://localhost:8001/api/${companySymbol}/symbol?startdate=${startDate}&enddate=${endDate}`);
  }
}