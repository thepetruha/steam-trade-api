// import express from "express";
// import Logger from "./utils/logger";

// const app = express();

// app.listen(3000, (err) => {
//     Logger("INFO","Run api server");
//     if (err) console.error(err.message);
// });

import API from "./api";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  await API.init().start();
}
  
main();
