// lib/ftp.ts
import { Client } from 'basic-ftp';
import type { TLSSocketOptions } from 'tls';

export async function getFtpClient() {
  const client = new Client();

  await client.access({
    host: process.env.FTP_HOST!,
    user: process.env.FTP_USER!,
    password: process.env.FTP_PASSWORD!,
    secure: process.env.FTP_SECURE === 'true',
    secureOptions:
      process.env.FTP_SECURE === 'true' &&
      process.env.FTP_REJECT_UNAUTHORIZED === 'false'
        ? { rejectUnauthorized: false }
        : undefined,
  });

  return client;
}

export async function getFtpClientAndConnect(): Promise<Client> {
    const client = new Client();

    const host = process.env.FTP_HOST;
    const port = parseInt(process.env.FTP_PORT || "21", 10);
    const user = process.env.FTP_USER;
    const password = process.env.FTP_PASSWORD;
    const secure = process.env.FTP_SECURE === 'true';

    if (!host || !user || !password) {
        console.error("Error: Faltan variables de entorno FTP (FTP_HOST, FTP_USER, FTP_PASSWORD).");
        throw new Error("Configuración FTP incompleta en variables de entorno.");
    }

    let ftpSecureOptions: TLSSocketOptions | undefined = undefined;

    if (secure) {
        if (process.env.FTP_REJECT_UNAUTHORIZED === 'false') {
            ftpSecureOptions = { rejectUnauthorized: false };
        }
    }

    try {
        await client.access({
            host,
            port,
            user,
            password,
            secure,
            secureOptions: ftpSecureOptions,
        });
        return client;
    } catch (err) {
        console.error("Falló la conexión con el servidor FTP:", err);
        if (!client.closed) {
            client.close();
        }
        throw new Error(`Falló la conexión FTP: ${err instanceof Error ? err.message : String(err)}`);
    }
}