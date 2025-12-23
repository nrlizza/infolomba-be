import * as service from './riwayat.user.service.js'; // ✅ PASTIKAN INI BENAR

export async function getRiwayatUser(req, res, next) {
  try {
    // 🔥 UNTUK TESTING - hardcode ID
    const id_user = 2; // Test dengan ID 2
    
    console.log('🔍 Testing with user ID:', id_user);
    
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 5);

    // Pastikan service dipanggil dengan benar
    const result = await service.getRiwayatUser(id_user, page, limit);

    res.status(200).json({
      status: 'success',
      ...result,
    });
  } catch (err) {
    console.error('Error:', err);
    next(err);
  }
}