import _ from 'lodash';
import express from 'express';

import crypto from 'crypto';
import pbkdf2 from 'pbkdf2';
import jwt from 'jsonwebtoken';
// import passport from 'passport';

import { Account } from '../models';

import configPassport from '../config/passport';

const router = express.Router();
// const requireAuth = passport.authenticate('jwt', { session: false });

function hash(password) {
  const bufferByte = crypto.randomBytes(16);
  const bufferStr = bufferByte.toString('hex');
  const hashRaw = pbkdf2.pbkdf2Sync(password, bufferStr, 1, 32, 'sha512');
  const credentials = Buffer.from(hashRaw, 'binary').toString('hex');
  return `${credentials}.${bufferStr}`;
}

function verify(password, hashStr) {
  const [credentials, bufferStr] = hashStr.split('.');
  const checkHashRaw = pbkdf2.pbkdf2Sync(password, bufferStr, 1, 32, 'sha512');
  const checkCredentials = Buffer.from(checkHashRaw, 'binary').toString('hex');
  return checkCredentials === credentials;
}

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const data = await Account.findOne({
    where: {
      email,
    },
  });
  if (_.isNull(data)) {
    res.status(404).json({});
    return;
  }
  if (!verify(password, data.password)) {
    res.status(401).json({});
    return;
  }
  const token = jwt.sign({
    iss: data.id,
    email,
  }, configPassport.jwt.secretOrKey, { expiresIn: '1h' });
  res.status(200).json({
    token,
  });
});

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const checkData = await Account.findOne({
    where: {
      email,
    },
  });
  if (!_.isNull(checkData)) {
    res.status(409).json({});
    return;
  }
  const hashPassword = await hash(password);
  await Account.create({
    email,
    name,
    password: hashPassword,
  });
  res.status(200).json({});
});

export default router;
