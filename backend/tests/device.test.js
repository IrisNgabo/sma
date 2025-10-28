const request = require('supertest');
const app = require('../server');
const { User, Admin } = require('../src/models');
const bcrypt = require('bcrypt');

describe('Device Management Endpoints', () => {
  let authToken;
  let testUser;

  beforeAll(async () => {
    // Create test admin and get auth token
    const hashedPassword = await bcrypt.hash('testpassword', 12);
    const testAdmin = await Admin.create({
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

    const loginResponse = await request(app)
      .post('/api/admin/login')
      .send({
        email: 'test@admin.com',
        password: 'testpassword'
      });
    
    authToken = loginResponse.body.data.token;

    // Create test user
    testUser = await User.create({
      name: 'Test User',
      email: 'test@user.com',
      password: 'hashedpassword',
      deviceId: 'test-device-123',
      isVerified: false,
      balance: 0.00
    });
  });

  afterAll(async () => {
    // Clean up test data
    await User.destroy({ where: { email: 'test@user.com' } });
    await Admin.destroy({ where: { email: 'test@admin.com' } });
  });

  describe('GET /api/devices/unverified', () => {
    it('should get unverified devices with valid auth', async () => {
      const response = await request(app)
        .get('/api/devices/unverified')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
    });

    it('should reject request without auth', async () => {
      const response = await request(app)
        .get('/api/devices/unverified');

      expect(response.status).toBe(401);
    });
  });

  describe('PATCH /api/devices/verify/:userId', () => {
    it('should verify device with valid auth', async () => {
      const response = await request(app)
        .patch(`/api/devices/verify/${testUser.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.isVerified).toBe(true);
    });

    it('should reject verification of non-existent user', async () => {
      const response = await request(app)
        .patch('/api/devices/verify/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/devices/stats', () => {
    it('should get device statistics', async () => {
      const response = await request(app)
        .get('/api/devices/stats')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('total');
      expect(response.body.data).toHaveProperty('verified');
      expect(response.body.data).toHaveProperty('unverified');
    });
  });
});
