import { NextFunction, Request, Response } from 'express';
import UserModel from '../models/user.model';
import jwt from 'jsonwebtoken';
import config from '../config';

const userModel = new UserModel();

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userModel.create(req.body);
    res.json({
      status: 'success',
      data: { ...user },
      message: 'User has been created successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await userModel.getAllUsers();
    res.json({
      status: 'success',
      data: users,
      message: 'Users retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userModel.getUser(req.params.id as unknown as string);
    res.json({
      status: 'success',
      data: user,
      message: 'User retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userModel.updateUser(req.body);
    res.json({
      status: 'success',
      data: user,
      message: 'User updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userModel.deleteUser(req.params.id as unknown as string);
    res.json({
      status: 'success',
      data: user,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const authinticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.authenticateUser(email, password);
    const token = jwt.sign({ user }, config.tokenSecret as unknown as string);
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Username and password do not match please try again',
      });
    }
    return res.json({
      status: 'success',
      data: { ...user, token },
      message: 'User authenticated successfully',
    });
  } catch (error) {
    next(error);
  }
};
