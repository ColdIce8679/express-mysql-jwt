export default {
  jwt: {
    secretOrKey: process.env.JWT_SECRET || 'secret',
  },
};
