// Map asset names to 3-bit codes (0-7)
const ASSET_CODES = {
  'BTC': 0,
  'ETH': 1,
  'SOL': 2,
  'USDT': 3,
  'ADA': 4,
  'DOGE': 5,
  'DOT': 6,
  'LINK': 7
};

const CODE_TO_ASSET = ['BTC', 'ETH', 'SOL', 'USDT', 'ADA', 'DOGE', 'DOT', 'LINK'];

// Simple hash to get a byte (0-255) from a wallet address/name
function stringToByteCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash + str.charCodeAt(i)) % 256;
  }
  return hash;
}

export function packTransaction(tx) {
  const { id, asset, amount, sender, receiver } = tx;

  // 1. Convert to simple integer codes
  const txId = Math.min(Math.max(0, parseInt(id) || 0), 65535); // 16 bits
  const assetCode = ASSET_CODES[asset] !== undefined ? ASSET_CODES[asset] : 3; // 3 bits
  const amountCode = Math.min(Math.max(0, Math.round(parseFloat(amount) * 100)), 1048575); // 20 bits (allows amount up to 10485.75)
  const senderCode = stringToByteCode(sender); // 8 bits
  const receiverCode = stringToByteCode(receiver); // 8 bits

  // 2. Build binary strings
  const idBits = txId.toString(2).padStart(16, '0');
  const assetBits = assetCode.toString(2).padStart(3, '0');
  const amountBits = amountCode.toString(2).padStart(20, '0');
  const senderBits = senderCode.toString(2).padStart(8, '0');
  const receiverBits = receiverCode.toString(2).padStart(8, '0');

  const binaryString = idBits + assetBits + amountBits + senderBits + receiverBits; // 55 bits

  // Pad to 56 bits (7 bytes) to form complete bytes
  const paddedBinaryString = binaryString + '0'; 

  // Convert to Hex
  let hexString = '';
  for (let i = 0; i < paddedBinaryString.length; i += 8) {
    const byte = paddedBinaryString.substring(i, i + 8);
    const hex = parseInt(byte, 2).toString(16).padStart(2, '0');
    hexString += hex;
  }

  const rawJson = JSON.stringify(tx);
  const rawSize = rawJson.length; // 1 byte per char
  const packedSize = hexString.length / 2; // 2 hex chars = 1 byte

  const savedMemory = rawSize - packedSize;
  const ratio = (rawSize / packedSize).toFixed(1);
  const percentageSaved = ((savedMemory / rawSize) * 100).toFixed(1);

  return {
    rawJson,
    rawSize,
    packedHex: hexString.toUpperCase(),
    packedSize,
    savedMemory,
    compressionRatio: `${ratio}:1`,
    percentageSaved: `${percentageSaved}%`,
    bitFields: {
      id: { val: txId, bits: idBits },
      asset: { val: asset, code: assetCode, bits: assetBits },
      amount: { val: amount, code: amountCode, bits: amountBits },
      sender: { val: sender, code: senderCode, bits: senderBits },
      receiver: { val: receiver, code: receiverCode, bits: receiverBits }
    },
    fullBinary: paddedBinaryString
  };
}

export function unpackTransaction(packedHex) {
  // Convert hex back to binary string
  let binaryString = '';
  for (let i = 0; i < packedHex.length; i += 2) {
    const hex = packedHex.substring(i, i + 2);
    const byte = parseInt(hex, 16).toString(2).padStart(8, '0');
    binaryString += byte;
  }

  // Extract fields from binary string
  const txId = parseInt(binaryString.substring(0, 16), 2);
  const assetCode = parseInt(binaryString.substring(16, 19), 2);
  const amountCode = parseInt(binaryString.substring(19, 39), 2);
  const senderCode = parseInt(binaryString.substring(39, 47), 2);
  const receiverCode = parseInt(binaryString.substring(47, 55), 2);

  return {
    id: txId,
    asset: CODE_TO_ASSET[assetCode] || 'USDT',
    amount: (amountCode / 100).toFixed(2),
    senderCode: `UserByte#${senderCode}`,
    receiverCode: `UserByte#${receiverCode}`
  };
}
