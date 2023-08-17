function userAuthMidleware(req, res, next) {
  req.user = {
    _id: '64db4aee6b8e063717eaeab2',
  };
  next();
}

module.exports = userAuthMidleware;
