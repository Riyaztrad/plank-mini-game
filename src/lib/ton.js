// import TonWeb from 'tonweb';

// // Utility function to convert ArrayBuffer to hexadecimal string
// function bufferToHex(buffer) {
//   const byteArray = new Uint8Array(buffer);
//   return Array.from(byteArray)
//     .map((byte) => byte.toString(16).padStart(2, '0'))
//     .join('');
// }

// // Utility function to convert ArrayBuffer to Base64 string
// function bufferToBase64(buffer) {
//   const byteArray = new Uint8Array(buffer);
//   let binaryString = '';
//   for (let i = 0; i < byteArray.length; i++) {
//     binaryString += String.fromCharCode(byteArray[i]);
//   }
//   return btoa(binaryString); // Encode to Base64
// }

// export const getHash = async (boc) => {
//   // Step 1: Convert BOC string from base64 to Uint8Array
//   const bocBuffer = Uint8Array.from(Buffer.from(boc, 'base64'));

//   // Step 2: Deserialize the BOC into a Cell
//   const cell = TonWeb.boc.Cell.oneFromBoc(bocBuffer);

//   // Step 3: Serialize the Cell back to BOC format
//   const serializedBoc = await cell.toBoc(); // This should give you the correct BOC

//   // Step 4: Compute the SHA-256 hash of the serialized BOC
//   const hashBuffer = await TonWeb.utils.sha256(serializedBoc);

//   // Step 5: Convert the hash to hexadecimal and Base64 formats
//   const transactionHashHex = bufferToHex(hashBuffer);
//   const transactionHashBase64 = bufferToBase64(hashBuffer);

//   console.log('Transaction Hash (Hex):', transactionHashHex);
//   console.log('Transaction Hash (Base64):', transactionHashBase64);

//   return {
//     hex: transactionHashHex,
//     base64: transactionHashBase64,
//   };
// };
