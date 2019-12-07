import dotenv from 'dotenv';
import { ShardingController } from './core/ShardingController';

dotenv.config();

const sharder = new ShardingController();
sharder.start();
