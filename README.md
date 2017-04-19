# Highly Performant D3-based (from) Typescript-Compiled React-Redux Time Series Chart

Due to relative simplicty, one can also treat this repo as a good React Redux Bootstrap Typescript D3 Starter Kit

This work is influenced by the following: 
- https://github.com/jaysoo/todomvc-redux-react-typescript
- https://github.com/freddyrangel/playing-with-react-and-d3

THIS IS UNDER DEVELOPMENT CURRENTLY (April-May 2017), YET IT WORKS.
 
This is a fairly simple starter kit with the following libraries / "technologies" intermingled and playing well with each other:
* Webpack in "production" (prod) and "development" (dev) modes
* Redux
* React
* Typescript
* React-Bootstrap https://react-bootstrap.github.io/
* D3 adapted for React
* Redux DevTools Extension https://github.com/zalmoxisus/redux-devtools-extension

## Running the server

Requirements:
- NodeJS 4+

```
npm install
npm run dev
```
Visit [http://localhost:8080/webpack-dev-server/client/index.html](http://localhost:8080/webpack-dev-server/client/index.html) in your browser.

Creating a production bundle:
```
npm run prod
```

## Additional notes

Hot reloading does not work, yet Webpack in developement mode recompiles automatically, so it is best to work with old-school manual page refresh.
