var path = require('path');
var archive = require('../helpers/archive-helpers');
var http = require('../web/http-helpers');
var fs = require('fs');
var Promise = require('Bluebird');
var fsp = Promise.promisifyAll(require('fs'));
var urlParser = require('url');



// require more modules/folders here!



exports.handleRequest = function (req, res) {
  const {method, url} = req;
  console.log('the method is: ' + method + ' and the url is: ' + url);


  var responder = function (err, data) {
    if (err) {
      res.writeHead(404, http.headers);
      res.end();
    }
    if (data) {
      res.writeHead(200, http.headers);
      res.end(data.toString());
    }
  };

  if (method === 'GET') {
    http.serveAssets(res, url, responder);
  } else if (method === 'POST') {
    let body = [];
    req.on('error', () => {
      console.error('ERROR!');
    });
    req.on('data', (chunk) => {
      body.push(chunk);
    });
    req.on('end', () => {
      body = body.toString();
      let baseUrl = body.substring(4);
      
      archive.isUrlArchivedAsync(baseUrl)
        .then((boolean) => {
          if (boolean) {
            return fsp.readFileAsync(archive.paths.archivedSites + '/' + baseUrl);
          } else {
            return archive.isUrlInListAsync(baseUrl).then((boolean) => {
              if (boolean) {
                return fsp.readFileAsync(archive.paths.siteAssets + '/loading.html');
              } else {
                return archive.addUrlToListAsync(baseUrl).then(() => {
                  return fsp.readFileAsync(archive.paths.siteAssets + '/loading.html');
                });
              }
            });
          }
        }).then((data) => {
          res.writeHead(302, http.headers);
          res.end(data.toString());
        }).catch(err => {
          console.error(err);
          res.end('You have received an error.');
        });
    });
  }
};
