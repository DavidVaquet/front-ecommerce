export const uploadImagesToCloudinary = async (images) => {
  const cloudName = import.meta.env.VITE_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_UPLOAD_PRESET;

  const uploadedUrls = [];

  for (const image of images) {
    console.log("Archivo que se intenta subir:", image);
    const formData = new FormData();
    formData.append('file', image.file);
    formData.append('upload_preset', uploadPreset);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (!data.secure_url) {
        throw new Error('No se pudo subir la imagen');
      }

      uploadedUrls.push(data.secure_url);
    } catch (err) {
      console.error('Error al subir una imagen:', err.message);
      throw err;
    }
  }

  return uploadedUrls;
};