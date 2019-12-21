import dotenv from 'dotenv';
import { ShardingController } from './ShardingController';

dotenv.config();

const sharder = new ShardingController();
sharder.start();
