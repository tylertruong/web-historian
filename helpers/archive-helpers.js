var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');
var Promise = require('Bluebird');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!



exports.readListOfUrlsAsync = function() {
  return new Promise ((resolve, reject) => {
    fs.readFile(exports.paths.list, function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data.toString().split('\n'));
      }
    });
  });
};

exports.isUrlInListAsync = function(url) {
  return new Promise ((resolve, reject) => {
    fs.readFile(exports.paths.list, function(err, data) {
      if (err) {
        return reject(err);
      }
      let array = data.toString().split('\n');
      for (let i = 0; i < array.length; i++ ) {
        if (array[i] === url) {
          return resolve(true);
        }
      }
      return resolve(false);
    });
  });
};

exports.addUrlToListAsync = function(url) {
  return new Promise ((resolve, reject) => {
    fs.appendFile(exports.paths.list, url + '\n', function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

exports.isUrlArchivedAsync = function(url) {
  return new Promise ((resolve, reject) => {
    fs.readFile(exports.paths.archivedSites + '/' + url, function(err, data) {
      if (err) {
        resolve(false);
      } else {
        resolve(true); 
      }
    });
  });
};

//callback version

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, function(err, data) {
    callback(data.toString().split('\n'));
  });
};

exports.isUrlInList = function(url, callback) {
  fs.readFile(exports.paths.list, function(err, data) {
    let array = data.toString().split('\n');
    for (let i = 0; i < array.length; i++ ) {
      if (array[i] === url) {
        return callback(true);
      }
    }
    return callback(false);
  });
};

exports.addUrlToList = function(url, callback) {
  fs.appendFile(exports.paths.list, url + '\n', function(err, data) {
    if (err) {
      console.log('error!');
    }
    callback();
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.readFile(exports.paths.archivedSites + '/' + url, function(err, data) {
    if (err) {
      return callback(false);
    }
    return callback(true); 
  });
};


exports.downloadUrls = function(urls) {
  for (let i = 0; i < urls.length; i++) {
    let filePath = exports.paths.archivedSites + '/' + urls[i];
    request('http://' + urls[i], (error, response, html) => {
      fs.writeFile(filePath, html, (err) =>{
        if (i = urls.length - 1) {
          fs.writeFile(exports.paths.list, '', err => {
            console.log(err);
          });
        }
      });
    });
  }
};

