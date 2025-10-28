const { sequelize } = require('../src/models');

// Setup test database
beforeAll(async () => {
  await sequelize.sync({ force: true });
});

// Cleanup after tests
afterAll(async () => {
  await sequelize.close();
});

// Global test timeout
jest.setTimeout(30000);
