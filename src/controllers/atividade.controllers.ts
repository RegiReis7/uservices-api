import { Request, Response } from "express";
import Atividade from "../models/atividade.models";
import {
  actualizarAtividadeService,
  criarAtividadeService,
} from "../services/atividade.services";

export const criarAtividade = async (req: Request, res: Response) => {
  const atividade: Atividade = req.body;
  const response = await criarAtividadeService(atividade);

  if (response) {
    res.status(201).json(response);
  } else {
    res.status(400).json({ mensagem: "Erro ao criar nova atividade", sucesso : false });
  }
};

export const actualizarAtividade = async (req: Request, res: Response) => {
  const { atividade } = req.body;
  const response = await actualizarAtividadeService(atividade);

  if (response) {
    res.status(200).json(response);
  } else {
    res.status(400).json({ mensagem: "Erro ao actualiar a atividade", sucesso : false });
  }
};
