import { Children, CreditCard, User } from '../../models';
import { successResponse, errorResponse } from '../../helpers';

export const getChildrenList = async (req, res) => {
  try {
    const { id } = req.user;

    const page = req.params.page || 1;
    const limit = 2;

    const childrenList = await Children.findAndCountAll({
      where: { parentId: id },
      order: [['createdAt', 'DESC'], ['name', 'ASC']],
      offset: (page - 1) * limit,
      limit,
      include: [
        {
          model: CreditCard,
          as: 'creditCards',
          attributes: {
            exclude: ['expDate', 'securityCode'],
          },
        },
      ],
    });

    return successResponse(req, res, { childrens: childrenList });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const getChildren = async (req, res) => {
  try {
    const { id: parentId } = req.user;
    const { id: childrenId } = req.params;

    const children = await Children.findOne({
      where: { id: childrenId, parentId },
      include: [
        {
          model: CreditCard,
          as: 'creditCards',
          attributes: {
            exclude: ['expDate', 'securityCode'],
          },
        },
      ],
    });

    return successResponse(req, res, { children });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const addChildren = async (req, res) => {
  try {
    const { id } = req.user;
    const { name, birthDate } = req.body;

    const children = await Children.findOne({ where: { name, birthDate, parentId: id } });
    if (children) {
      throw new Error('Children already exists');
    }

    const parentExist = await User.findOne({ where: { id } });
    if (!parentExist) {
      throw new Error('Parent does not exist');
    }

    const payload = {
      parentId: id,
      name,
      birthDate,
    };

    const newChildren = await Children.create(payload);
    return successResponse(req, res, { ...newChildren.get() });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const updateChildren = async (req, res) => {
  try {
    const { id } = req.user;

    const children = await Children.findOne({ where: { id: req.params.id, parentId: id } });
    if (!children) {
      throw new Error('Children not found');
    }

    const updatedChildren = await children.update({ ...req.body });

    return successResponse(req, res, { ...updatedChildren.get() });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const deleteChildren = async (req, res) => {
  try {
    const { id } = req.user;

    const children = await Children.findOne({ where: { id: req.params.id, parentId: id } });
    if (!children) {
      throw new Error('Children not found');
    }

    const deletedChildren = await children.destroy();

    return successResponse(req, res, { });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};
