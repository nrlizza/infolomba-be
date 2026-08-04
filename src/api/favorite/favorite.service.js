import * as model from "./favorite.model.js";

export async function toggleFavorite(id_user, id_lomba) {
  return await model.toggleFavorite(id_user, id_lomba);
}

export async function getFavoriteLomba(id_user) {
  const result = await model.getFavoriteLomba(id_user);
  
  const data = result.data.map(item => {
    const encodedImage = item.image ? encodeURIComponent(item.image) : null;

    return {
      ...item,
      image_url: encodedImage
        ? `${process.env.SUPABASE_URL}/storage/v1/object/public/${process.env.SUPABASE_BUCKET}/poster/${encodedImage}`
        : null
    };
  });

  return {
    ...result,
    data
  };
}

export async function getFavoriteIds(id_user) {
  return await model.getFavoriteIds(id_user);
}
