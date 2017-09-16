// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers');

archive.readListOfUrls(baseUrl => {
  request('http://' + baseUrl, function(error, response, html) {
    var fd = fs.open(archive.paths.archivedSites + '/' + baseUrl, 'w', (err, fd) => {
      fs.write(fd, html, () => { return; });
    });
  });
});