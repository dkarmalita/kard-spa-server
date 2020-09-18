#!/usr/bin/env node

// spa-server --proxy=api::http://jsonplaceholder.typicode.com --port=3000 --public=./ --fallback=index.html

const fs = require('fs');
const path = require('path');
const express = require('express');
const proxy = require('express-http-proxy');

const app = express();

const getCliValue = key => (process.argv.filter(el => el.indexOf(key) === 0)[0] || '').substring(key.length);

const cliValueToProxyConfig = val => ({
  apiBase: val.substr(0, val.indexOf('::')),
  proxyBase: val.substring(val.indexOf('::') + 2),
});
const proxyCfg = cliValueToProxyConfig(getCliValue('--proxy='));

if (proxyCfg.proxyBase) {
  app.get(`/${proxyCfg.apiBase}/*`, proxy(proxyCfg.proxyBase, {
    proxyReqPathResolver: req => req.originalUrl.substring('/api'.length),
  }));
  console.log('[spa-server] api proxy used:', proxyCfg);
}

const publicPath = getCliValue('--public=') || './';
const fullBasePath = path.join(process.cwd(), publicPath);
console.log('[spa-server] public path:', fullBasePath);
const fallback = getCliValue('--fallback=') || 'index.html';
console.log('[spa-server] fallback used:', fallback);
const fallbackExists = fs.existsSync(path.join(fullBasePath, fallback));

app.get('/:filePath', (req, res) => {
  if(!fallbackExists){ return res.type('txt').send('Not found') }
  const options = {
    root: fullBasePath,
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true,
    },
  };

  const fullPath = path.join(options.root, req.params.filePath);
  const fileExists = fs.existsSync(fullPath);

  const fileName = fileExists ? req.params.filePath : 'index.html';
  res.sendFile(fileName, options, (err) => {
    if (err) {
      next(err);
    } else {
      console.log('Sent:', fileName);
    }
  });
});

app.use(function(req, res, next){
  res.type('txt').send('Not found');
});

const port = getCliValue('--port=') || 3000;
app.listen(port, () => console.log(`[spa-server] listening on port ${port}!`));
