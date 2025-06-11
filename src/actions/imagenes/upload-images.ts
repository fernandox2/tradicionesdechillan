import { getFtpClientAndConnect } from "@/lib/ftp";
import { Client } from "basic-ftp";
import { Readable } from "stream";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";

export const saveImage = async (
  fileBuffer: Buffer,
  originalName: string
): Promise<string> => {
  const extension = originalName.split(".").pop()?.toLowerCase() ?? "jpg";
  const fileName = `${uuidv4()}.${extension}`;

  let client: Client | undefined = undefined;
  let compressedBuffer: Buffer;

  try {
    switch (extension) {
      case "jpeg":
      case "jpg":
        compressedBuffer = await sharp(fileBuffer)
          .jpeg({ quality: 80, progressive: true })
          .toBuffer();
        break;
      case "png":
        compressedBuffer = await sharp(fileBuffer)
          .png({ compressionLevel: 9, quality: 80 })
          .toBuffer();
        break;
      case "webp":
        compressedBuffer = await sharp(fileBuffer)
          .webp({ quality: 80 })
          .toBuffer();
        break;
      default:
        console.warn(
          `Extensión de imagen no manejada para compresión: ${extension}. Se usará el buffer original.`
        );
        compressedBuffer = fileBuffer;
        break;
    }

    client = await getFtpClientAndConnect();
    const stream = Readable.from(compressedBuffer);
    await client.uploadFrom(stream, fileName);

    console.log(`Imagen "${fileName}" subida exitosamente al servidor FTP.`);

    const publicFtpBaseUrl =
      process.env.NEXT_PUBLIC_FTP_IMAGE_BASE_URL ||
      `https://ntx-05-lon-cp41.netexplora.com/~cecin947/tradicionesdechillan.cl/tradicionesftp/`;

    if (!publicFtpBaseUrl.endsWith("/")) {
      return `${publicFtpBaseUrl}/${fileName}`;
    }
    return `${publicFtpBaseUrl}${fileName}`;
  } catch (error: any) {
    console.error(
      `Error en saveImage al subir "${originalName}" al FTP:`,
      error
    );
    throw new Error(
      `Falló la subida FTP para ${originalName}: ${
        error.message || String(error)
      }`
    );
  } finally {
    if (client && !client.closed) {
      console.log("Cerrando cliente FTP en saveImage.");
      client.close();
    }
  }
};
