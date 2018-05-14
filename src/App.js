import path from 'path';

import _ from 'lodash';

import express from 'express';
import morgan from 'morgan';
import createError from 'http-errors';
import cookieParser from 'cookie-parser';

// import auth from './routes/auth';

import PassportProvider from './providers/PassportProvider';
import RouteProvider from './providers/RouteProvider';

class App {
  /**
   * These Setting will call expressApp.set to mount
   */
  globalSettings = {
    views: path.join(__dirname, '../views'),
    'view engine': 'pug',
  };

  /**
   * These Middlewares will call expressApp.use to mount
   */
  globalMiddlewares = [
    morgan('dev'),
    express.json(),
    express.urlencoded({ extended: false }),
    cookieParser(),
    express.static(path.join(__dirname, '../public')),
  ];

  /**
   * Providers will boot after mount global Middlewares
   */
  providers = [
    PassportProvider,
    RouteProvider,
  ];

  // catch 404 and forward to error handler
  notFoundHandler = (req, res, next) => {
    next(createError(404));
  }

  // error handler
  errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  };

  constructor() {
    this.app = express();
    this.configExpressApp();
  }

  getExpressApp() {
    return this.app;
  }

  configExpressApp() {
    // mount globalSettings
    _.each(this.globalSettings, (value, key) => {
      this.app.set(key, value);
    });
    // mount globalMiddlewares
    _.each(this.globalMiddlewares, (middleware) => {
      if (_.isArray(middleware)) {
        this.app.use(middleware[0], middleware[1]);
        return;
      }
      this.app.use(middleware);
    });
    // boot and mount provider
    _.each(this.providers, (providerClass) => {
      const provider = new providerClass(this.app); // eslint-disable-line new-cap
      _.invoke(provider, 'boot');
    });
    this.app.use(this.notFoundHandler);
    this.app.use(this.errorHandler);
  }
}

export default App;
