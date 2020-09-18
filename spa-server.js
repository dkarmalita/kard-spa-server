#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const express = require('express');
const proxy = require('express-http-proxy');
const url = require('url');

const app = express();

const getCliValue = key => (process.argv.filter(el => el.indexOf(key) === 0)[0] || '').substring(key.length);

const fileExistsSync = (xpath) => fs.existsSync(xpath) && fs.lstatSync(xpath).isFile()

const cliValueToProxyConfig = val => ({
  apiBase: val.substr(0, val.indexOf('::')),
  proxyBase: val.substring(val.indexOf('::') + 2),
});
const proxyCfg = cliValueToProxyConfig(getCliValue('--proxy='));

let handleProxy

if (proxyCfg.proxyBase) {
  handleProxy = proxy(proxyCfg.proxyBase, {
    proxyReqPathResolver: req => req.originalUrl.substring(`/${proxyCfg.apiBase}`.length),
  })

  app.get(`/${proxyCfg.apiBase}/*`, handleProxy);
  console.log('[spa-server] api proxy used:', proxyCfg);
}

const publicPath = getCliValue('--public=') || './';
const fullBasePath = path.join(process.cwd(), publicPath);
console.log('[spa-server] public path:', fullBasePath);
const fallback = getCliValue('--fallback=') || 'index.html';
console.log('[spa-server] fallback used:', fallback);
const fallbackExists = fileExistsSync(path.join(fullBasePath, fallback));

const route = getCliValue('--route=') || '';
console.log('[spa-server] base roure used:', route);

const sendFile = (req, res) => {

  const subroute = `/${route}`;
  let filePath = url.parse(req.originalUrl).pathname;
  if(route && filePath.indexOf(subroute) === 0){
    filePath = filePath.substring(subroute.length);
  }

  const options = {
    root: fullBasePath,
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true,
    },
  };

  const fullPath = path.join(options.root, filePath || '');
  const fileExists = fileExistsSync(fullPath);

  if(!fileExists && !fallbackExists){
    return res.status(404).send(`Fallback not found`);
  }

  const fileName = fileExists ? filePath : fallback;
  res.sendFile(fileName , options, (err) => {
    if (err) {
      next(err);
    } else {
      console.log('Sent:', fileName, ' as ', filePath);
    }
  });
}

app.get('/:filePath', sendFile);

app.get('/', sendFile);

app.use(sendFile);

const port = getCliValue('--port=') || 3000;
app.listen(port, () => console.log(`[spa-server] listening on port ${port}!`));
