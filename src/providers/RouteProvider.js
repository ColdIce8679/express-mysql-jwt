import auth from '../routes/auth';

class RouteProvidor {
  constructor(expressApp) {
    this.app = expressApp;
  }

  boot() {
    this.mountRoute();
  }

  mountRoute() {
    this.app.use('/auth', auth);
  }
}

export default RouteProvidor;
