const request = require('supertest');
const app = require('../server');
const { Admin } = require('../src/models');
const bcrypt = require('bcrypt');

describe('Authentication Endpoints', () => {
  let testAdmin;

  beforeAll(async () => {
    // Create test admin
    const hashedPassword = await bcrypt.hash('testpassword', 12);
    testAdmin = await Admin.create({
      name: 'Test Admin',
      email: 'test@admin.com',
      password: hashedPassword,
      role: 'admin',
      permissions: {
        canVerifyDevices: true,
        canViewUsers: true,
        canViewTransactions: true,
        canManageAdmins: false
      }
    });
  });

  afterAll(async () => {
    // Clean up test data
    await Admin.destroy({ where: { email: 'test@admin.com' } });
  });

  describe('POST /api/admin/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/admin/login')
        .send({
          email: 'test@admin.com',
          password: 'testpassword'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('name', 'Test Admin');
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/admin/login')
        .send({
          email: 'test@admin.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject missing credentials', async () => {
      const response = await request(app)
        .post('/api/admin/login')
        .send({});

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/admin/profile', () => {
    let authToken;

    beforeAll(async () => {
      const loginResponse = await request(app)
        .post('/api/admin/login')
        .send({
          email: 'test@admin.com',
          password: 'testpassword'
        });
      
      authToken = loginResponse.body.data.token;
    });

    it('should get admin profile with valid token', async () => {
      const response = await request(app)
        .get('/api/admin/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('name', 'Test Admin');
    });

    it('should reject request without token', async () => {
      const response = await request(app)
        .get('/api/admin/profile');

      expect(response.status).toBe(401);
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/admin/profile')
        .set('Authorization', 'Bearer invalidtoken');

      expect(response.status).toBe(401);
    });
  });
});
