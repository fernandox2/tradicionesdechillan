import { getFtpClientAndConnect } from '@/lib/ftp';
import { Client } from 'basic-ftp';
import { Readable } from 'stream';
import { v4 as uuidv4 } from 'uuid';

// export const saveImage = async (fileBuffer: Buffer, originalName: string): Promise<string> => {
//     const extension = originalName.split('.').pop() ?? 'jpg';
//     const fileName = `${uuidv4()}.${extension}`;
  
//     const client = new Client();
  
//     try {

//     await client.access({
//         host: "ftp.cecinastradicionesdechillan.cl",
//         port: 21,
//         user: "tradicionesftp@tradicionesdechillan.cl",
//         password: "##*q4hB)AACf",
//         secure: true,

//         secureOptions: {
//             rejectUnauthorized: false,
//           },
//       });

//       const stream = Readable.from(fileBuffer);
//       await client.uploadFrom(stream, fileName);

//       return `https://ntx-05-lon-cp41.netexplora.com/~cecin947/tradicionesdechillan.cl/tradicionesftp/${fileName}`;

//     } catch (error) {
//       console.error("Error uploading image to FTP:", error);
//       throw new Error("FTP upload failed");
//     } finally {
//       client.close();
//     }
//   };

  export const saveImage = async (fileBuffer: Buffer, originalName: string): Promise<string> => {
    const extension = originalName.split('.').pop() ?? 'jpg';
    const fileName = `${uuidv4()}.${extension}`;

    let client: Client | undefined = undefined; // Declaramos 'client' aquí para poder usarlo en 'finally'

    try {
        // 1. Ya NO creas 'new Client()' ni llamas a 'client.access()' directamente aquí.
        //    En su lugar, obtienes el cliente ya conectado desde tu función helper:
        client = await getFtpClientAndConnect();

        // 2. Ahora usas el 'client' que te devolvió la función para subir el archivo.
        //    Este 'client' ya está conectado y autenticado.
        const stream = Readable.from(fileBuffer);
        await client.uploadFrom(stream, fileName); // Sube al directorio raíz del usuario FTP

        console.log(`Imagen "${fileName}" subida exitosamente al servidor FTP.`);

        // 3. Construye la URL pública. Es buena idea hacer esta URL base configurable también.
        const publicFtpBaseUrl = process.env.NEXT_PUBLIC_FTP_IMAGE_BASE_URL || `https://ntx-05-lon-cp41.netexplora.com/~cecin947/tradicionesdechillan.cl/tradicionesftp/`;
        
        if (!publicFtpBaseUrl.endsWith('/')) {
            return `${publicFtpBaseUrl}/${fileName}`;
        }
        return `${publicFtpBaseUrl}${fileName}`;

    } catch (error: any) {
        // Este 'catch' ahora atrapará errores tanto de getFtpClientAndConnect() como de client.uploadFrom()
        console.error(`Error en saveImage al subir "${originalName}" al FTP:`, error);
        throw new Error(`Falló la subida FTP para ${originalName}: ${error.message || String(error)}`);
    } finally {
        // 4. Cierra el cliente si se logró obtener uno y no está ya cerrado.
        if (client && !client.closed) {
            console.log("Cerrando cliente FTP en saveImage.");
            client.close();
        }
    }
};