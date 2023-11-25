import dotenv from "dotenv";

dotenv.config();

export const connectionString = `Driver=${process.env.DRIVER};Server=${process.env.SERVER};Database=${process.env.DATABASE};Uid=${process.env.UID};Pwd=${process.env.PASSWORD};Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;`;
