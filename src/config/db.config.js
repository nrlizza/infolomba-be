import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // penting buat koneksi ke Neon
  },
  connectionTimeoutMillis: 10000, // 10 detik
  idleTimeoutMillis: 60000, // 60 detik (naik dari 30s)
  max: 20, // maksimal 20 koneksi
  min: 2, // minimal 2 koneksi aktif
  keepAlive: true, // Keep connection alive
  keepAliveInitialDelayMillis: 10000, // Initial delay 10 detik
});

// Log kalau connect sukses (hanya pertama kali)
let isFirstConnect = true;
db.on('connect', (client) => {
  if (isFirstConnect) {
    console.log('✅ Database connected successfully');
    isFirstConnect = false;
  }
  // Set timezone untuk setiap koneksi baru
  client.query('SET timezone = "Asia/Jakarta"').catch(err => {
    console.error('❌ Failed to set timezone:', err);
  });
});

// Log hanya error yang serius
db.on('error', (err, client) => {
  console.error('❌ Unexpected database error:', err.message);
  console.log('🔄 Pool will attempt to reconnect...');
});

// Hapus log removal (ini normal behavior, tidak perlu di-log)
// db.on('remove', () => {
//   console.log('🔌 Client removed from pool');
// });

// Test koneksi dengan retry
const testConnection = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await db.query('SELECT NOW()');
      console.log('✅ Database test query successful:', result.rows[0].now);
      return true;
    } catch (err) {
      console.error(`❌ Database test query failed (attempt ${i + 1}/${retries}):`, err.message);
      if (i < retries - 1) {
        console.log('⏳ Retrying in 2 seconds...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }
  console.error('❌ All connection attempts failed');
  return false;
};

// Jalankan test connection
testConnection();

// Wrapper query dengan error handling dan retry
const originalQuery = db.query.bind(db);
db.query = async function (...args) {
  const maxRetries = 2;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await originalQuery(...args);
    } catch (error) {
      lastError = error;
      
      // Retry hanya untuk connection errors
      if (
        (error.code === 'ECONNRESET' || 
         error.code === 'ECONNREFUSED' || 
         error.code === 'ETIMEDOUT') && 
        attempt < maxRetries
      ) {
        console.log(`🔄 Retrying query (attempt ${attempt + 1}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }
      
      // Throw error jika bukan connection error atau sudah max retry
      throw error;
    }
  }
  
  throw lastError;
};

export default db;
