const bcrypt = require('bcrypt');
const { Admin } = require('../models');

/**
 * Create initial admin user
 */
const seedAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      where: { email: process.env.ADMIN_EMAIL || 'admin@creditjambo.com' }
    });

    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD || 'admin123', 
      12
    );

    // Create admin user
    const admin = await Admin.create({
      name: 'System Administrator',
      email: process.env.ADMIN_EMAIL || 'admin@creditjambo.com',
      password: hashedPassword,
      role: 'super_admin',
      permissions: {
        canVerifyDevices: true,
        canViewUsers: true,
        canViewTransactions: true,
        canManageAdmins: true
      }
    });

    console.log(' Admin user created successfully');
    console.log(` Email: ${admin.email}`);
    console.log(` Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    
  } catch (error) {
    console.error(' Error creating admin user:', error);
  }
};

module.exports = seedAdmin;
