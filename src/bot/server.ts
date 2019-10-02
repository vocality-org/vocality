import { ShardingController } from "./classes/ShardingController";
import './testclient.ts';
const sharder = new ShardingController();
sharder.start();
