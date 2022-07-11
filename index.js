require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const app = express();
const bodyParser = require('body-parser');
let urls = [];

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// Shorturl GET endpoint
app.get('/api/shorturl/:url', function(req, res) {
  const validUrl = /^\d+$/;

  console.log(req.params.url);

  if(!validUrl.test(req.params.url)){
    res.json({ error: "No short URL found for the given input" });
    return;
  }

  res.redirect(urls[req.params.url]);
});

// Shorturl POST endpoint
app.post('/api/shorturl', function(req, res) {
  const url = req.body.url;
  
  const isValid =  dns.resolve4(url, false, (err, records) => {
    if(err || records.length === 0){
      console.log("Invalid URL");
      return;
    }
    console.log("Valid URL", records);
  });

  console.log('> ', isValid);

  if(!isValid) return;

  console.log('Valid url', url);

  urls.push(url);
  res.json({
    "original_url": urls[urls.length - 1],
    "short_url": urls.length - 1
  });
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
