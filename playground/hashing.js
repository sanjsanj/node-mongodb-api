// const { SHA256 } = require("crypto-js");

// const message = "I am user number 1";
// const hash = SHA256(message).toString();

// console.log("message:", message);
// console.log("hash:", hash);

// const data = {
//   id: 4
// };

// const token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + "somesecret").toString()
// };

// const resultHash = SHA256(JSON.stringify(token.data) + "somesecret").toString();

// if (resultHash === token.hash) {
//   console.log("Data was not changed");
// } else {
//   console.log("DATA WAS CHANGED");
// }

const jwt = require("jsonwebtoken");

const data = {
  id: 10
}

const token = jwt.sign(data, "123abc");
console.log("token:", token);
const decoded = jwt.verify(token, "123abc")
console.log("decoded:", decoded);
