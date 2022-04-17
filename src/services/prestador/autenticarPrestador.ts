import db from "../../libs/configs/db";
import { log } from "../../libs/log";
import { compareEncryptedData } from "../../libs/utils/encryption";
import { gerarToken } from "../../libs/utils/generateToken";
import { LoginInfo } from "../../models/cliente.models";

export async function autenticarPrestadorService(
  email: string,
  password: string,
  device
) {
  const prestadorExiste = await db.prestador.findFirst({
    where: {
      email: email,
    },
  });

  if (!prestadorExiste) {
    return undefined;
  }

  const passwordMatch = compareEncryptedData(
    prestadorExiste.password,
    password
  );

  if (!passwordMatch) {
    return undefined;
  }

  const generatedToken = gerarToken(prestadorExiste.id);

  const loginInfo: LoginInfo = {
    uniqueID: device.uniqueID,
    token: generatedToken,
    device,
  };

  try {
    await db.prestador.update({
      where: {
        id: prestadorExiste.id,
      },
      data: {
        loginInfo: {
          upsert: {
            where: {
              id: loginInfo.uniqueID,
            },
            update: {
              token: loginInfo.token,
              device: loginInfo.device,
            },
            create: {
              id: loginInfo.uniqueID,
              token: loginInfo.token,
              device: loginInfo.device,
            },
          },
        },
      },
    });
  } catch (e) {
    log.error(`Erro ao criar a informação do login- ${e}`);
    return undefined;
  }

  //const refreshToken = await gerarRefreshTokenPrestador(prestadorExiste.id);
  return { generatedToken };
}
