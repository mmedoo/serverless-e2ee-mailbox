const CryptoJS = require('crypto-js');

function encryptMessage(plaintext, key) {
    // Generate a secure random IV (Initialization Vector)
    const iv = CryptoJS.lib.WordArray.random(16);

    // Derive a key from the provided key, supporting variable length
    const derivedKey = CryptoJS.PBKDF2(key, iv, {
        keySize: 256 / 32, // 256-bit key
        iterations: 1000
    });

    // Encrypt the plaintext using AES in CBC mode
    const encrypted = CryptoJS.AES.encrypt(plaintext, derivedKey, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    // Convert encrypted message to Base64
    const ciphertext = encrypted.ciphertext.toString(CryptoJS.enc.Base64);

    // Generate HMAC for authenticity and integrity
    const hmac = CryptoJS.HmacSHA256(ciphertext, derivedKey).toString(CryptoJS.enc.Base64);

    // Return the IV, HMAC, and ciphertext concatenated together, all Base64-encoded
    return iv.toString(CryptoJS.enc.Base64) + ':' + hmac + ':' + ciphertext;
}

function decryptMessage(encryptedText, key) {
    // Split the encrypted text into its components: IV, HMAC, and ciphertext
    const components = encryptedText.split(':');
    if (components.length !== 3) {
        throw new Error('Invalid encrypted message format.');
    }

    const iv = CryptoJS.enc.Base64.parse(components[0]);
    const hmac = components[1];
    const ciphertext = components[2];

    // Derive the same key as used in encryption
    const derivedKey = CryptoJS.PBKDF2(key, iv, {
        keySize: 256 / 32, // 256-bit key
        iterations: 1000
    });

    // Verify the HMAC to ensure integrity and authenticity
    const calculatedHmac = CryptoJS.HmacSHA256(ciphertext, derivedKey).toString(CryptoJS.enc.Base64);
    if (calculatedHmac !== hmac) {
        throw new Error('HMAC verification failed. The message may have been tampered with.');
    }

    // Decrypt the ciphertext using AES in CBC mode
    const decrypted = CryptoJS.AES.decrypt(
        {
            ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
        },
        derivedKey,
        {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }
    );

    // Convert the decrypted message back to a string
    const plaintext = decrypted.toString(CryptoJS.enc.Utf8);

    // Return the plaintext message
    return plaintext;
}

function hashLocation(loc, secret) {
	return CryptoJS.HmacSHA256(loc, secret).toString(CryptoJS.enc.Hex);
}


export { encryptMessage, decryptMessage, hashLocation };