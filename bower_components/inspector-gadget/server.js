'use strict';

var fs =require('fs');		//for image upload file handling

var express = require('express');
var app = express();

var port =3000;
var host ='localhost';
var serverPath ='/';
var staticPath ='/';

var staticFilePath = __dirname + serverPath;
// remove trailing slash if present
if(staticFilePath.substr(-1) === '/'){
	staticFilePath = staticFilePath.substr(0, staticFilePath.length - 1);
}

app.configure(function(){
	// compress static content
	app.use(express.compress());
	app.use(serverPath, express.static(staticFilePath));		//serve static files
	
	app.use(express.bodyParser());		//for post content / files - not sure if this is actually necessary?
});

//catch all route to serve index.html (main frontend app)
app.get('*', function(req, res){
	res.sendfile(staticFilePath + staticPath+ 'index.html');
});

app.listen(port);

console.log('Server running at http://'+host+':'+port.toString()+'/');