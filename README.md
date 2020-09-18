A simple NodeJS based server allows to serve SPA applications with optional API proxy support and all-routes fallback. Developed to test SPA locally, with selenia based frameworks like [Puppeteer](https://github.com/puppeteer/puppeteer)

## Installation

```sh
npm add -D @kard/spa-server
```


## Usage

```sh
spa-server --proxy=api::http://jsonplaceholder.typicode.com --port=3030 --public=public --fallback=index.html
```

The exemple above will serve static files from `./public` relative path, on port 3030. 

Each file is absent will be replaced with `./public/index.html` one.

All of the requests sent to `/api/*` routes will be redirected to `http://jsonplaceholder.typicode.com` base.


## Command line keys available

`--proxy` - allows to set api requests redirect (no default)

`--port` - allows to set the server port to use (default 3000)

`--public` - allows to set public path (default `./`)

`--fallback` -allows to set fallback file name (default is `index.html`)