var path = require('path');
var archive = require('../helpers/archive-helpers');
var http = require('../web/http-helpers');
var fs = require('fs');
var urlParser = require('url');
var request = require('request');


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
      
      //archive.isUrlArchived(baseUrl, boolean => {
      archive.isUrlArchived(baseUrl, boolean => {
        console.log(boolean);
        if (boolean) {
          fs.readFile(archive.paths.archivedSites + '/' + baseUrl, (err, data) => {
            res.writeHead(201, http.headers);
            res.end(data.toString());
          });
        } else {
          archive.addUrlToList(baseUrl, () => { return; });
          res.writeHead(302, http.headers);
          fs.readFile(archive.paths.siteAssets + '/loading.html', function(err, data) {
            res.end(data.toString());
          });
        }
      });
    });
  }
};
