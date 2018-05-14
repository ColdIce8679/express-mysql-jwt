import _ from 'lodash';
import Passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

import config from '../config/passport';

import { Account } from '../models';

class PassportProvidor {
  constructor(expressApp) {
    this.app = expressApp;
  }

  addJwtStrategy = () => {
    // Add JwtStrategy
    const options = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
      ...config.jwt,
    };
    Passport.use(new JwtStrategy(options, async (jwtPayload, done) => {
      const account = await Account.findById(jwtPayload.id);
      return done(null, (_.isNull(account) ? false : account));
    }));
  }

  boot() {
    this.app.use(Passport.initialize());
    this.addJwtStrategy();
  }
}

export default PassportProvidor;
