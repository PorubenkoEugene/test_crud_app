import { errorResponse } from '../helpers';
import { User } from '../models';

const jwt = require('jsonwebtoken');

const apiAuth = async (req, res, next) => {
  if (!(req.headers && req.headers['authorization'])) {
    return errorResponse(req, res, 'Token is not provided', 401);
  }
  const token = req.headers['authorization'];
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded.user;
    const user = await User.findOne({
      where: { email: req.user.email },
    });
    if (!user) {
      return errorResponse(req, res, 'User is not found in system', 401);
    }
    req.user = { ...user.get() };
    return next();
  } catch (error) {
    return errorResponse(
      req,
      res,
      'Incorrect token is provided, try re-login',
      401,
    );
  }
};

export default apiAuth;
