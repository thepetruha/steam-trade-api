import API from "./api";
import RedisClient from "./redis";
import Store from "./store";
import migrations from './migrations/migrate'

async function main() {
  await Store.init().connect();
  await migrations();

  await RedisClient.init().connect();
  await API.init().start();
}
  
main();
