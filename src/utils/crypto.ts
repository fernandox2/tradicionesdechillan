import crypto from 'crypto';
import nacl from 'tweetnacl';
import * as naclUtil from 'tweetnacl-util';

/**
 * Convierte una cadena Base64 en su variante URL-safe.
 * Reemplaza “+” por “-”, “/” por “_” y elimina el padding (“=”).
 * @param b64 La cadena en Base64.
 * @returns La cadena en formato URL-safe.
 */
function base64ToUrlSafe(b64: string): string {
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Convierte una cadena URL-safe en una cadena Base64 estándar.
 * Reemplaza “-” por “+”, “_” por “/” y agrega padding (“=”) si es necesario.
 * @param urlSafe La cadena en formato URL-safe.
 * @returns La cadena en Base64.
 */
function urlSafeToBase64(urlSafe: string): string {
  let b64 = urlSafe.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) {
    b64 += '=';
  }
  return b64;
}

/**
 * Encripta un texto usando TweetNaCl (secretbox con XSalsa20-Poly1305).
 * Se deriva la llave usando SHA‑256 a partir del secreto.
 * @param text El texto a encriptar.
 * @param secret La clave secreta (por ejemplo, process.env.AUTH_SECRET).
 * @returns Un string URL-safe en base64 que contiene el nonce concatenado con el ciphertext.
 */
export function encrypt(text: string, secret: string): string {
  // Derivar una llave de 32 bytes usando SHA-256.
  const keyBuffer = crypto.createHash('sha256').update(secret).digest();
  const keyUint8 = new Uint8Array(
    keyBuffer.buffer,
    keyBuffer.byteOffset,
    keyBuffer.byteLength
  );
  
  // Convertir el texto a Uint8Array (UTF-8).
  const messageUint8 = naclUtil.decodeUTF8(text);
  
  // Generar un nonce de 24 bytes (requerido por secretbox).
  const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
  
  // Encriptar usando secretbox.
  const ciphertext = nacl.secretbox(messageUint8, nonce, keyUint8);
  
  // Concatenar nonce y ciphertext en un solo Uint8Array.
  const fullMessage = new Uint8Array(nonce.length + ciphertext.length);
  fullMessage.set(nonce);
  fullMessage.set(ciphertext, nonce.length);
  
  // Codificar el resultado en Base64.
  const b64 = naclUtil.encodeBase64(fullMessage);
  // Convertir a una variante URL-safe.
  return base64ToUrlSafe(b64);
}

/**
 * Desencripta un texto encriptado con la función encrypt.
 * @param encryptedText El string URL-safe en base64 que contiene el nonce y el ciphertext.
 * @param secret La clave secreta usada para encriptar.
 * @returns El texto original desencriptado.
 */
export function decrypt(encryptedText: string, secret: string): string {
  // Derivar la misma llave a partir del secreto.
  const keyBuffer = crypto.createHash('sha256').update(secret).digest();
  const keyUint8 = new Uint8Array(
    keyBuffer.buffer,
    keyBuffer.byteOffset,
    keyBuffer.byteLength
  );
  
  // Convertir de URL-safe a Base64.
  const b64 = urlSafeToBase64(encryptedText);
  // Decodificar el mensaje completo (nonce + ciphertext) desde Base64.
  const fullMessage = naclUtil.decodeBase64(b64);
  
  // Extraer el nonce (primeros 24 bytes) y el ciphertext (resto).
  const nonce = fullMessage.slice(0, nacl.secretbox.nonceLength);
  const ciphertext = fullMessage.slice(nacl.secretbox.nonceLength);
  
  // Desencriptar con secretbox.open().
  const decrypted = nacl.secretbox.open(ciphertext, nonce, keyUint8);
  if (!decrypted) {
    throw new Error('No se pudo desencriptar el mensaje.');
  }
  
  // Convertir el Uint8Array resultante a string UTF-8.
  return naclUtil.encodeUTF8(decrypted);
}
