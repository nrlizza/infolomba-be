import db from './src/config/db.config.js';

async function checkSchema() {
  try {
    const res = await db.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'lomba';");
    console.log("LOMBA COLUMNS:");
    console.table(res.rows);
    
    const rolesRes = await db.query("SELECT * FROM master_role;");
    console.log("ROLES:");
    console.table(rolesRes.rows);
  } catch (e) {
    console.error(e);
  } finally {
    process.exit();
  }
}

checkSchema();
