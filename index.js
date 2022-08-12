require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const bodyParser = require('body-parser');
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const keyValuePairs=[];
let key=0;

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/api/shorturl', function(req, res) {
	const urlString = req.body.url;
	const urlObject = new URL(urlString);
	dns.lookup(urlObject.hostname, function onLookup(err, address, family) { 
		if (err) res.json({ error: 'invalid url' });
		else {
			const alreadyExists = keyValuePairs.filter(p=>p.original_url===urlString);
			if (alreadyExists.length>0) res.json(alreadyExists[0]);
			else {
				const newPair={ original_url : urlString, short_url: ++key };
				keyValuePairs.push(newPair);
				res.json(newPair);
			}
		}
	});
});

app.get('/api/shorturl/:key', function(req, res) {
	const pair=keyValuePairs.filter(p=>p.short_url==req.params.key);
	if(pair.length>0) res.redirect(pair[0].original_url); 
  else res.json({ error: 'invalid short url' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
