import bcrypt from 'bcrypt';
import db from '../database';
import User from '../types/user.type';
import config from '../config';

const hashPassword = (passord: string) => {
  const salt = parseInt(config.salt as string, 10);
  return bcrypt.hashSync(`${passord}${config.pepper}`, salt);
};
class UserModel {
  // create
  async create(u: User): Promise<User> {
    try {
      // connect to database
      const connection = await db.connect();
      const sql = `INSERT INTO users (email, user_name, first_name, last_name, password) 
      values ($1, $2, $3, $4, $5) returning id, email, user_name, first_name, last_name`;
      // run query
      const result = await connection.query(sql, [
        u.email,
        u.username,
        u.first_name,
        u.last_name,
        hashPassword(u.password),
      ]);
      // release connection
      connection.release();
      // return created user
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Unable to create (${u.username}): ${(error as Error).message}`
      );
    }
  }
  // get all users
  async getAllUsers(): Promise<User[]> {
    try {
      const connection = await db.connect();
      const sql =
        'SELECT id, email, user_name, first_name, last_name FROM users';
      const result = await connection.query(sql);
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Unable to retrieve users ${(error as Error).message}`);
    }
  }
  // ger specific user
  async getUser(id: string): Promise<User> {
    try {
      const connection = await db.connect();
      const sql =
        'SELECT id, email, user_name, first_name, last_name FROM users WHERE id=($1)';
      const result = await connection.query(sql, [id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not find user ${id}, ${(error as Error).message}`);
    }
  }
  // update user
  async updateUser(u: User): Promise<User> {
    try {
      const connection = await db.connect();
      const sql =
        'UPDATE users SET email=$1, user_name=$2, first_name=$3, last_name=$4, password=$5 WHERE id=$6 RETURNING id, email, user_name, first_name, last_name';
      const result = await connection.query(sql, [
        u.email,
        u.username,
        u.first_name,
        u.last_name,
        hashPassword(u.password),
        u.id,
      ]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Could not update user ${u.username}, ${(error as Error).message}`
      );
    }
  }
  // delete user
  async deleteUser(id: string): Promise<User> {
    try {
      const connection = await db.connect();
      const sql =
        'DELETE FROM users WHERE id=($1) RETURNING id, email, user_name, first_name, last_name';
      const result = await connection.query(sql, [id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Could not delete user ${id}, ${(error as Error).message}`
      );
    }
  }
  // authenticate user
}

export default UserModel;
