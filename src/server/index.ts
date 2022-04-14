import app from "../apps/httpApp";
import { log } from "../libs/log";
import http from "http";
import dotenv from "dotenv";
import webSocketApp from "../apps/webSocketApp";
import cluster from "cluster";
import { cpus } from "os";
import { setupMaster } from "@socket.io/sticky";
import { setupPrimary } from "@socket.io/cluster-adapter";

dotenv.config();

if (cluster.isPrimary) {
  const numCPUs = cpus().length;

  const httpServer = http.createServer(app);

  setupMaster(httpServer, {
    loadBalancingMethod: "least-connection",
  });

  setupPrimary();

  cluster.setupPrimary({
    serialization: "advanced",
  });

  httpServer.listen(process.env.PORT || 8080);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    log.info(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });

  log.info("All Clusters Are Running");
} else {
  const httpServer = http.createServer(app);
  webSocketApp(httpServer);
}
