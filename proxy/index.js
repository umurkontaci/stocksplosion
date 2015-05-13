/**
 * Created by umurkontaci on 5/14/15.
 */
var http = require('http');
var request = require('superagent');
var _ = require('lodash');

http.createServer(function (req, res) {
  console.log(req.url);
  request
    .get('http://stocksplosion.apsis.io' + req.url)
    .accept(req.headers.accept)
    .end(function (err, resp) {
      var headers = {};
      var corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET'
      };
      _.extend(headers, resp.headers, corsHeaders);

      res.writeHead(resp.status, headers);
      res.end(resp.text);
    });
}).listen(process.env.PORT || 8001);