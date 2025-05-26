'use server'

import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const uploadArticleImage = async (files: File[]) => {
  try {
    const uploadPromises = files.map(async (file) => {
      const bytes = await file.arrayBuffer();
      const buffer = new Uint8Array(bytes);

      const extension = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${extension}`;
      const savePath = path.join(process.cwd(), 'public/imgs/blog', fileName);

      await writeFile(savePath, buffer);

      return `/imgs/blog/${fileName}`;
    });

    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;

  } catch (error) {
    console.error("Error al guardar imágenes:", error);
    return null;
  }
};
