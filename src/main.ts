import API from "./api";
import RedisClient from "./redis";
import Store from "./store";
import migrations from './migrations/migrate'
import Skinport from "./api/skinport";
import config from "./configs/config";

async function main() {
  await Store.init().connect();
  await migrations();

  Skinport.init(config.skinportHost);

  await RedisClient.init().connect();
  await API.init().start();
}
  
main();
