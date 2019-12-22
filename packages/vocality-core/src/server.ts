import * as dotenv from 'dotenv';
import { ShardingController } from './controllers/ShardingController';

dotenv.config();

const sharder = new ShardingController();
sharder.start();
