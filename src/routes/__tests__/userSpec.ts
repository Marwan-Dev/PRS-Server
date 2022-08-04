import supertest from 'supertest';
import UserModel from '../../models/user.model';
import db from '../../database';
import User from '../../types/user.type';
import app from '../../index';

const userModel = new UserModel();
const request = supertest(app);
let token = '';

describe('User API Endpoints', () => {
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

  describe('Test Authenticate methods', () => {
    it('Should be able to authenticate to get token', async () => {
      const res = await request
        .post('/api/users/auth')
        .set('Content-type', 'application/json')
        .send({
          email: 'test@test.com',
          password: 'test123',
        });
      expect(res.status).toBe(200);
      const { id, email, token: userToken } = res.body.data;
      expect(id).toBe(user.id);
      expect(email).toBe('test@test.com');
      token = userToken;
    });

    it('Should be failed to authenticate with wrong email', async () => {
      const res = await request
        .post('/api/users/auth')
        .set('Content-type', 'application/json')
        .send({
          email: 'wrong@test.com',
          password: 'test123',
        });
      expect(res.status).toBe(401);
    });
  });

  describe('Test CRUD API methods', () => {
    it('It should create new user', async () => {
      const res = await request
        .post('/api/users/')
        .set('Content-type', 'application/json')
        .send({
          email: 'test2@test2.com',
          user_name: 'test2User2',
          first_name: 'User 2',
          last_name: 'Test 2',
          password: 'test123',
        } as User);
      expect(res.status).toBe(200);
      const { email, user_name, first_name, last_name } = res.body.data;
      expect(email).toBe('test2@test2.com');
      expect(user_name).toBe('test2User2');
      expect(first_name).toBe('User 2');
      expect(last_name).toBe('Test 2');
    });

    it('It should list all users', async () => {
      const res = await request
        .get('/api/users/')
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2);
    });

    it('It should get user info', async () => {
      const res = await request
        .get(`/api/users/${user.id}`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.user_name).toBe('testUser');
      expect(res.body.data.email).toBe('test@test.com');
    });

    it('It should update user info', async () => {
      const res = await request
        .patch(`/api/users/${user.id}`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...user,
          user_name: 'MarwanMostafa',
          first_name: 'Marwan',
          last_name: 'Mostafa',
        });
      expect(res.status).toBe(200);
      const { id, email, user_name, first_name, last_name } = res.body.data;
      expect(id).toBe(user.id);
      expect(email).toBe(user.email);
      expect(user_name).toBe('MarwanMostafa');
      expect(first_name).toBe('Marwan');
      expect(last_name).toBe('Mostafa');
    });

    it('It should delete user', async () => {
      const res = await request
        .delete(`/api/users/${user.id}`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(user.id);
      expect(res.body.data.user_name).toBe('MarwanMostafa');
    });
  });
});
