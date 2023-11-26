
const crypto = require("crypto")
 
const key = "ghostwinter"; // Your desired key
const hashedKey = crypto.createHash("sha256").update(key).digest();
const truncatedKey = hashedKey.slice(0, 32); // Truncate the hashed key to the desired length


const getMeToken = (massage) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc",truncatedKey, iv);
  const token = {
    massage: massage,
  };
  const encryptedToken =
    cipher.update(JSON.stringify(token), "utf8", "hex") + cipher.final("hex");
  const finalEncrypt = encryptedToken + iv.toString("hex");
  return finalEncrypt;
};

const verifyToken = (value) => {
  const iv = Buffer.from(value.slice(-32), "hex");
  const encryptedData = value.slice(0, -32);
  try {
    const decipher = crypto.createDecipheriv("aes-256-cbc",truncatedKey, iv);
    let decrypted =
      decipher.update(encryptedData, "hex", "utf8") + decipher.final("utf8");
    try {
      const tokenHere = JSON.parse(decrypted);
      return tokenHere.massage
console.log(tokenHere.massage)
     } catch {
      return "json error";
    }
  } catch (err) {
    console.error("Error verifying token:", err);
    return "Error";
  }
};

module.exports = {
  encrypt_chat: getMeToken,
  decrypt_chat: verifyToken
};
