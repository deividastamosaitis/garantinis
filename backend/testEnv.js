import * as dotenv from "dotenv";
dotenv.config();

console.log("HOST:", process.env.EMAIL_HOST);
console.log("USER:", process.env.EMAIL_USER);
