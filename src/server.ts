import app from "./app";
import { log } from "./log";
log;

app.listen(process.env.PORT || 8080, () => {
  log.info(`RODANDO NA PORTA ${process.env.PORT ? process.env.PORT : 8080}...`);
});