require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

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

const pairs=[];

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/api/shorturl', function(req, res) {
	const urlString = req.body.url;
	const urlObject = new URL(urlString);
	dns.lookup(urlObject.hostname, function onLookup(err, address, family) { 
		if (err) res.json({ error: 'invalid url' });
		else {
			const alreadyExists = pairs.filter(p=>p.original_url===urlString);
			if (alreadyExists.length>0) res.json(alreadyExists[0]);
			else {
				do {
					let key = Math.floor(Math.random() * 20000);
				} while (pairs.filter(p=>p.short_url===key).length>0);
				const newPair={ original_url : urlString, short_url: key };
				pairs.push(newPair);
				res.json(newPair);
			}
		}
	});
});

app.get('/api/shorturl/:key', function(req, res) {
	const pair=pairs.filter(p=>p.short_url===req.params.key);
	if(pair.length>0) res.redirect(pair[0].original_url); 
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
