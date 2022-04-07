import { log } from "../../../../libs/log";
import { updateAtividadeService } from "../../../../services/atividade/updateAtividade";
import { Roles } from "../../interfaces/payload";
import { ResponseEventContext } from "../../interfaces/responseEventContext";
import { Events } from "../types/events.types";

export async function responseEventHandler({
  payload,
  socket,
  sockets,
}: ResponseEventContext) {
  log.info(`Response event`);
  let to: string;

  updateAtividadeService(payload.atividade);

  if (payload.TriggeredBy.role === Roles.CLIENTE) {
    to = sockets.find((f) => f[payload.atividade.Prestador.id])[
      payload.atividade.Prestador.id
    ];
  } else if (payload.TriggeredBy.role === Roles.PRESTADOR) {
    to = sockets.find((f) => f[payload.atividade.Cliente.id])[
      payload.atividade.Cliente.id
    ];
  }

  if (to) {
    log.info(to);
    socket.to(to).emit(Events.RESPONSE, payload.atividade);
  }
}
