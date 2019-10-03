import { ShardingController } from './core/ShardingController';
import './dashboard-ws/keep-alive.ts';

const sharder = new ShardingController();
sharder.start();
