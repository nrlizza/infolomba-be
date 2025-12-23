import db from '../../config/db.config.js'; 

export async function loginUser(username, password, role) {
  const sql = `
    SELECT 
      a.id_user,
      a.name, 
      a.username,
      a.email,
      a.poin,
      b.role 
    FROM master_user a
    INNER JOIN master_role b ON a.id_role = b.id_role  
    WHERE a.username = $1 AND a.password = $2 and b.role = $3
  `;

  const { rows } = await db.query(sql, [username, password, role]);

  if (rows.length === 0) return null;

  return rows[0];
}

export async function createUser(data) {
  const sql = `
    INSERT INTO master_user 
    (name, username, password, email, nomor_telephone, id_pendidikan, nama_instansi, tanggal_lahir, id_role) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING id_user, name, username, email, id_role
  `;

  const values = [
    data.name,
    data.username,
    data.password,
    data.email,
    data.nomor_telephone,
    data.id_pendidikan,
    data.nama_instansi,
    data.tanggal_lahir,
    data.id_role,
  ];

  const { rows } = await db.query(sql, values);
  return rows[0];
}

export async function getUserProfile(id_user) {
  const sql = `
    SELECT 
      mu.id_user,
      mu.name,
      mu.username,
      mu.email,
      mu.nomor_telephone,
      mu.id_pendidikan,
      mu.nama_instansi,
      mu.tanggal_lahir,
      mu.poin,
      mu.id_role,
      mr.role
    FROM master_user mu
    INNER JOIN master_role mr ON mu.id_role = mr.id_role
    WHERE mu.id_user = $1
  `;

  const { rows } = await db.query(sql, [id_user]);
  return rows[0] || null;
}
