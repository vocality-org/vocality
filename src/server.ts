import { ShardingController } from './core/ShardingController';

import './dashboard-ws/keep-alive';

const sharder = new ShardingController();
sharder.start();
