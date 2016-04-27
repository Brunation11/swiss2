// Raw html for bookmarks content
var fs = require('fs');
var striptags = require('striptags');
var request = require('request');

// request(url, function(err, res, body) {
//   if (err) {
//     console.log(err);
//   }
//   tagless = striptags(body);
//   spaceless = tagless.replace(/\s+/g, ' ');
//   self.content = spaceless;
// });

// fs.exists(bookmarkFile, function(exists) {
//   if (exists) {
//     fs.stat(bookmarkFile, function(err, stats) {
//       fs.open(bookmarkFile, 'r', function(err, fd) {
//         var buffer = new Buffer(stats.size);

//         fs.read(fd, buffer, 0, buffer.length, null, function(err, bytesRead, buffer) {
//           var data = buffer.toString("utf8", 0, buffer.length);
//           tagless = striptags(data);
//           spaceless = tagless.replace(/\s+/g, ' ');
//           console.log(spaceless);
//           fs.close(fd);
//         })
//       })
//     })
//   }
// })