A simple NodeJS based server allows serving SPA applications with optional API proxy support and all-routes fallback. Developed to test SPA locally, with Selenium-based frameworks like [Puppeteer](https://github.com/puppeteer/puppeteer)

## Installation

```sh
npm add -D @kard/spa-server
```


## Usage

```sh
spa-server --proxy=api::http://jsonplaceholder.typicode.com --port=3030 --public=public --fallback=index.html
```

The example above : 
* Will serve static files from `./public` relative path, on port 3030. 
* Each file is absent will be replaced with `./public/index.html` one.
* All of the requests sent to `/api/*` routes will be redirected to `http://jsonplaceholder.typicode.com` base.


## Command-line keys available

`--proxy` - allows setting API requests redirect (no default)

`--port` - allows setting the server port to use (default 3000)

`--public` - allows setting public path (default `./`)

`--fallback` - allows setting fallback file name (default is `index.html`)

`--route` - allows setting base route of the app (default is none)
