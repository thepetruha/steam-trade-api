import API from "./api";
import RedisClient from "./redis";
import Store from "./store";

async function main() {
  await Store.init().connect();
  await RedisClient.init().connect();
  await API.init().start();
}
  
main();
