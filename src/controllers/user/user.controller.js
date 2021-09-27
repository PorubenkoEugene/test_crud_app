import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../../models';
import { successResponse, errorResponse } from '../../helpers';

export const allUsers = async (req, res) => {
  try {
    const page = req.params.page || 1;
    const limit = 2;
    const users = await User.findAndCountAll({
      order: [['createdAt', 'DESC'], ['firstName', 'ASC']],
      offset: (page - 1) * limit,
      limit,
    });
    return successResponse(req, res, { users });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    if (user) {
      throw new Error('User already exists with same email');
    }

    const reqPass = crypto
      .createHash('md5')
      .update(password)
      .digest('hex');

    const payload = {
      email,
      name,
      password: reqPass,
    };

    const newUser = await User.create(payload);
    delete newUser.dataValues.password;

    return successResponse(req, res, { user: newUser });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const login = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      throw new Error('Incorrect Email Id/Password');
    }
    const reqPass = crypto
      .createHash('md5')
      .update(req.body.password || '')
      .digest('hex');

    if (reqPass !== user.password) {
      throw new Error('Incorrect Email Id/Password');
    }

    const token = jwt.sign(
      {
        user: {
          userId: user.id,
          email: user.email,
          createdAt: new Date(),
        },
      },
      process.env.SECRET,
    );

    delete user.dataValues.password;

    return successResponse(req, res, { user, token });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const profile = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await User.findOne({ where: { id } });

    return successResponse(req, res, { user });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const changePassword = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findOne({
      where: { id },
    });

    const reqPass = crypto
      .createHash('md5')
      .update(req.body.oldPassword)
      .digest('hex');

    if (reqPass !== user.password) {
      throw new Error('Old password is incorrect');
    }

    const newPass = crypto
      .createHash('md5')
      .update(req.body.newPassword)
      .digest('hex');

    await user.update({ password: newPass }, { where: { id: user.id } });
    return successResponse(req, res, {});
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};
