import * as model from "./lomba.model.js";
import { uploadFileToSupabase } from "../../middleware/upload.middleware.js";

export async function insertLomba(data, files) {
  let imageFileName = null;
  let uploadStatus = "NO_FILE";

  try {
    if (files && Object.keys(files).length > 0) {
      for (const key in files) {
        const fileList = files[key];
        for (let i = 0; i < fileList.length; i++) {
          const file = fileList[i];
          const result = await uploadFileToSupabase(file, "test");

          if (!result || !result.fileName) {
            uploadStatus = "UPLOAD_FAILED";
            throw new Error("Upload file gagal!");
          }

          uploadStatus = "SUCCESS";
          imageFileName = result.fileName; // Bisa simpan publicUrl juga kalau diperlukan
        }
      }
    }

    const payload = { ...data, image: imageFileName };
    const insertResult = await model.insertLomba(payload);

    return {
      success: insertResult.success,
      message: insertResult.message,
      insertedId: insertResult.insertedId,
      imageStatus: uploadStatus,
      image: imageFileName
    };

  } catch (error) {
    console.error("Service Error:", error);

    return {
      success: false,
      error: error.message,
      imageStatus: uploadStatus
    };
  }
};

export async function getAllLomba(page = 1, limit = 9, filters = {}) {
  const result = await model.getAllLomba(page, limit, filters);

  const data = result.data.map(item => {
    const encodedImage = item.image ? encodeURIComponent(item.image) : null;

    return {
      ...item,
      image_url: encodedImage
        ? `${process.env.SUPABASE_URL}/storage/v1/object/public/${process.env.SUPABASE_BUCKET}/test/${encodedImage}`
        : null
    };
  });

  return {
    data,
    pagination: result.pagination
  };
};


export async function getLombaById(id_lomba) {
  const result = await model.getLombaById(id_lomba);

  if (result.data) {
    // Add image URL if image exists
    if (result.data.image) {
      const encodedImage = encodeURIComponent(result.data.image);
      result.data.image_url = `${process.env.SUPABASE_URL}/storage/v1/object/public/${process.env.SUPABASE_BUCKET}/test/${encodedImage}`;
    }

    // Ensure numeric values are numbers
    result.data.id_kategori = result.data.id_kategori ? Number(result.data.id_kategori) : null;
    result.data.id_pendidikan = result.data.id_pendidikan ? Number(result.data.id_pendidikan) : null;
    result.data.id_jenis = result.data.id_jenis ? Number(result.data.id_jenis) : null;
    result.data.id_provinsi = result.data.id_provinsi ? Number(result.data.id_provinsi) : null;
    result.data.id_kabupaten = result.data.id_kabupaten ? Number(result.data.id_kabupaten) : null;
    result.data.id_status_pembayaran = result.data.id_status_pembayaran ? Number(result.data.id_status_pembayaran) : 1;
    result.data.harga = result.data.harga ? Number(result.data.harga) : 0;
  }

  return result;
}

export async function getLombaByIdUser(page = 1, limit = 10,id_user) {
  const result = await model.getLombaByIdUser(page, limit, id_user);
  return result;
}

export async function updateLomba(id_lomba, data, files, id_user) {
  let imageFileName = null;
  let uploadStatus = "NO_FILE";

  try {
    // 1. Cek kepemilikan lomba
    const lomba = await model.checkLombaOwnership(id_lomba, id_user);
    
    if (!lomba.success) {
      return {
        updated: false,
        message: lomba.message || 'Lomba tidak ditemukan'
      };
    }

    if (!lomba.isOwner) {
      return {
        updated: false,
        message: 'Anda tidak memiliki akses untuk mengupdate lomba ini'
      };
    }

    // 2. Upload file jika ada file baru
    if (files && Object.keys(files).length > 0) {
      for (const key in files) {
        const fileList = files[key];
        for (let i = 0; i < fileList.length; i++) {
          const file = fileList[i];
          const result = await uploadFileToSupabase(file, "test");

          if (!result || !result.fileName) {
            uploadStatus = "UPLOAD_FAILED";
            throw new Error("Upload file gagal!");
          }

          uploadStatus = "SUCCESS";
          imageFileName = result.fileName;
        }
      }
    } else {
      // Jika tidak ada file baru, gunakan image yang lama
      imageFileName = data.existing_image || null;
    }

    // 3. Update data lomba
    const payload = { ...data, image: imageFileName };
    const updateResult = await model.updateLomba(id_lomba, payload);

    return {
      updated: updateResult.updated,
      message: updateResult.message,
      imageStatus: uploadStatus,
      image: imageFileName
    };

  } catch (error) {
    console.error("Service Error updateLomba:", error);

    return {
      updated: false,
      message: error.message,
      imageStatus: uploadStatus
    };
  }
}

export async function deleteLomba(id_lomba, id_user) {
  try {
    // 1. Cek apakah lomba ada
    const lomba = await model.checkLombaOwnership(id_lomba, id_user);
    
    if (!lomba.success) {
      // Return format untuk handleResult (deleted: false)
      return {
        deleted: false,
        message: lomba.message || 'Lomba tidak ditemukan'
      };
    }

    // 2. Cek kepemilikan
    if (!lomba.isOwner) {
      return {
        deleted: false,
        message: 'Anda tidak memiliki akses untuk menghapus lomba ini'
      };
    }

    // 3. Hapus lomba
    const result = await model.deleteLomba(id_lomba);
    return result;

  } catch (error) {
    console.error('❌ Service Error deleteLomba:', error);
    return {
      deleted: false,
      message: error.message || 'Terjadi kesalahan saat menghapus lomba'
    };
  }
}
