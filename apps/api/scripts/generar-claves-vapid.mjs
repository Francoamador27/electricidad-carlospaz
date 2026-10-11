// Genera el par de claves VAPID para las notificaciones Web Push del panel.
// Uso: node scripts/generar-claves-vapid.mjs
// Cargá las dos como secretos del Worker (VAPID_PUBLIC_KEY y VAPID_PRIVATE_KEY).
// Si las cambiás, los dispositivos tienen que volver a activar las notificaciones.
const { publicKey, privateKey } = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, [
  "sign",
  "verify",
]);
const b64url = (buf) => Buffer.from(buf).toString("base64url");
const publica = b64url(await crypto.subtle.exportKey("raw", publicKey)); // punto sin comprimir (65 bytes)
const { d } = await crypto.subtle.exportKey("jwk", privateKey);
console.log(`VAPID_PUBLIC_KEY=${publica}`);
console.log(`VAPID_PRIVATE_KEY=${d}`);
console.log("VAPID_SUBJECT=mailto:francohugoamador25@gmail.com");
