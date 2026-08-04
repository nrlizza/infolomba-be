import db from './src/config/db.config.js';

async function seedAdmin() {
  try {
    console.log("Checking for admin user...");
    const res = await db.query(`SELECT * FROM master_user WHERE username = 'admin.edvent@gmail.com' OR email = 'admin.edvent@gmail.com'`);
    if (res.rows.length > 0) {
      console.log("Admin user already exists. Updating password to admin123...");
      await db.query(`UPDATE master_user SET password = 'admin123', id_role = 1 WHERE id_user = $1`, [res.rows[0].id_user]);
    } else {
      console.log("Creating admin user...");
      await db.query(`
        INSERT INTO master_user (name, username, password, email, id_role)
        VALUES ('Admin Edvent', 'admin.edvent@gmail.com', 'admin123', 'admin.edvent@gmail.com', 1)
      `);
    }
    console.log("Done!");
  } catch (error) {
    console.error("Failed:", error);
  } finally {
    process.exit();
  }
}

seedAdmin();
