import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import os from 'os';
import cluster from 'node:cluster';
import * as dotenv from 'dotenv';
import routes from './routes';
import { handleError } from './middlewares';

dotenv.config();

// get environment variables
const { NC_PORT, NC_DB_HOST, NC_DB_PORT, NC_DB_NAME } = process.env;

const app = express();

// allow cors
app.use(cors());

// parse application/x-www-form-urlencoded / application/json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// register routes
app.use(routes);

// handle errors
app.use(handleError);

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;

  // fork clusters as many as cpus
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('online', (worker) => {
    console.log(`Worker ${worker.process.pid} up`);
  });

  cluster.on('exit', (worker, exitCode) => {
    console.log(
      `Worker ${worker.process.id} down (${exitCode}), creates new Worker.`
    );
    cluster.fork(); // re-fork when worker one is down.
  });
} else {
  app.listen(NC_PORT, async () => {
    // connect database
    try {
      await mongoose.connect(
        `mongodb://${NC_DB_HOST}:${NC_DB_PORT}/${NC_DB_NAME}`,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
          useFindAndModify: false,
        }
      );
    } catch (err) {
      console.error(err);
      process.exit(1);
    }

    console.log(`Server Listening at port:${NC_PORT}`);
  });
}
