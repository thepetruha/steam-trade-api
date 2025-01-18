import API from "./api";
import RedisClient from "./redis";

async function main() {
  await RedisClient.init().start();
  await API.init().start();
}
  
main();
