import UserModel from '../user.model';
import db from '../../database';
import User from '../../types/user.type';

const userModel = new UserModel();

describe('Authentication Module', () => {
  describe('Test methods exists', () => {
    it('It should have an authenticate user method', () => {
      expect(userModel.authenticateUser).toBeDefined();
    });
  });
});

describe('Test authentication logic', () => {
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

  it('Authenticate method shoud return authenticated user', async () => {
    const authenticatedUser = await userModel.authenticateUser(
      user.email,
      user.password as string
    );
    expect(authenticatedUser?.email).toBe(user.email);
    expect(authenticatedUser?.user_name).toBe(user.user_name);
    expect(authenticatedUser?.first_name).toBe(user.first_name);
    expect(authenticatedUser?.last_name).toBe(user.last_name);
  });

  it('Authenticate method should return null for wrong credentials', async () => {
    const authenticatedUser = await userModel.authenticateUser(
      'marwan@marwan.com',
      'fake-password'
    );
    expect(authenticatedUser).toBe(null);
  });
});
