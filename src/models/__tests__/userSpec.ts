import UserModel from '../user.model';
import db from '../../database';
import User from '../../types/user.type';

const userModel = new UserModel();

describe('User Model', () => {
  describe('Test methods exists', () => {
    it('It should have a get all users method', () => {
      expect(userModel.getAllUsers).toBeDefined();
    });

    it('It should have a get user method', () => {
      expect(userModel.getUser).toBeDefined();
    });

    it('It should have a create user method', () => {
      expect(userModel.create).toBeDefined();
    });

    it('It should have a update user method', () => {
      expect(userModel.updateUser).toBeDefined();
    });

    it('It should have a delete user method', () => {
      expect(userModel.deleteUser).toBeDefined();
    });

    it('It should have an authenticate user method', () => {
      expect(userModel.authenticateUser).toBeDefined();
    });
  });

  describe('Test User Model logic', () => {
    const user = {
      email: 'test@test.com',
      user_name: 'testUser',
      first_name: 'Test',
      last_name: 'User',
      password: 'test123',
    } as User;

    beforeAll(async () => {
      const createdUser = await userModel.create(user);
      user.id = createdUser.id;
    });

    afterAll(async () => {
      const connection = await db.connect();
      const sql = 'DELETE FROM users';
      await connection.query(sql);
      connection.release();
    });

    it('Create method should return a new user', async () => {
      const createdUser = await userModel.create({
        email: 'test2@test.com',
        user_name: 'test2User',
        first_name: 'Test',
        last_name: 'User',
        password: 'test123',
      } as User);

      expect(createdUser).toEqual({
        id: createdUser.id,
        email: 'test2@test.com',
        user_name: 'test2User',
        first_name: 'Test',
        last_name: 'User',
      } as User);
    });

    it('Get all method should return all available users', async () => {
      const users = await userModel.getAllUsers();
      expect(users.length).toBe(2);
    });

    it('Get user method should return testUser when called with ID', async () => {
      const returnedUser = await userModel.getUser(user.id as string);
      expect(returnedUser.id).toBe(user.id);
      expect(returnedUser.email).toBe(user.email);
      expect(returnedUser.user_name).toBe(user.user_name);
      expect(returnedUser.first_name).toBe(user.first_name);
      expect(returnedUser.last_name).toBe(user.last_name);
    });

    it('Update user method should return user with edited attrs', async () => {
      const updatedUser = await userModel.updateUser({
        ...user,
        user_name: 'testUser Updated',
        first_name: 'Marwan',
        last_name: 'Mostafa',
      });
      expect(updatedUser.id).toBe(user.id);
      expect(updatedUser.email).toBe(user.email);
      expect(updatedUser.user_name).toBe('testUser Updated');
      expect(updatedUser.first_name).toBe('Marwan');
      expect(updatedUser.last_name).toBe('Mostafa');
    });

    it('Delete user method should delete user from DB', async () => {
      const deleteUser = await userModel.deleteUser(user.id as string);
      expect(deleteUser.id).toBe(user.id);
    });
  });
});
