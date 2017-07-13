// desc

'use strict';

var path = require('path');
// var JSON = require('json');
// MIME types supported by this server
// and their corresponding header
const SUPPORTED_TYPE = {
  '.html': {
    'Content-Type': 'text/html; charset = UTF-8'
  },
  '.txt': {
    'Content-Type': 'text/plain; charset = UTF-8'
  },
  '.js': {
    'Content-Type': 'application/javascript; charset = UTF-8'
  },
  '.appcache': {
    'Content-Type': 'text/cache-manifest; charset = UTF-8',
    'Cache-Control': 'no-cache'
  },
  '.css': {
    'Content-Type': 'text/css; charset = UTF-8'
  },
  '.json': {
    'Content-Type': 'application/json; charset = UTF-8'
  },
  '.gif': {
    'Content-Type': 'image/gif'
  }
}

// Default type used for unsupported extensions
const DEFAULT_TYPE = {'Content-Type': 'text/plain; charset = UTF-8'};
const ERROR_TYPE = {'Content-Type': 'text/plain; charset = UTF-8'};

const HOME = '/home.html';

function servePage(request, response) {
  console.log(request.method, request.url);
  var filename = url.parse(request.url).pathname;
  if (filename === '/') {
    // filename = HOME;
    serveAPI('/files', response);
  }

  var extension = path.extname(filename).toLowerCase();

  if (extension) {
    serveFile(filename, response);
  } else {
    serveAPI(filename, response);
  }
}

function serveAPI(path, response) {
  console.log('serving api', path);
  var header = SUPPORTED_TYPE['.html'];
  response.writeHead(200, header);

  if(path == '/files') {
    fs.readdir('../client', function(error, files) {
      // console.log(files);
      // var filesJSON = JSON.stringify(files);
      // console.log(filesJSON);
      for (let file of files) {
        response.write('<a href=\"'+file+'\">'+file+'</a></br>');
        //response.write('<a href=\"fdas\"'filesJSON);
      }

      response.end();
    });
  }
}

function serveFile(filename, response) {
  console.log('serving file', filename)
  filename = '../client' + filename;
  var extension = path.extname(filename).toLowerCase();
  var header = SUPPORTED_TYPE[extension] || DEFAULT_TYPE;
  fs.readFile(filename, function (err, content) {
    if (err) { // If there is an error, set the status code
      response.writeHead(404, ERROR_TYPE);
      response.write(err.message); // Include the error message body
      response.write(' - The page requested is not found.');
      response.end(); // Done
    } else { // Otherwise, the file was read successfully.
      response.writeHead(200, header);
      response.write(content); // Send file contents as response body
      response.end();
    }
  });
}

// load the url module
var url = require('url');
// Load the path module
var path = require('path');
// Load the file system module
var fs = require("fs");
// load the http module
var http = require('http');

// create a server object
var server = http.createServer(servePage);
var port = 80; var hostname = undefined;
server.listen(port, hostname);
console.log(server.address());
console.log('Server running at', server.address().address, ':', server.address().port);
