import express from "express";
import sql from "./database.js";
const routes = express.Router();
//USUÁRIO
routes.post("/login", async (req, res) => {
  try {
    const { user, password } = req.body;
    const resposta = await sql`select * from usuario where nome = ${user}`;
    if (password == resposta[0].senha) {
      return res.status(200).json(resposta[0]);
    }
    return res.status(401).json("erro ao logar");
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
});
routes.get("/usuario", async (req, res) => {
  const resposta = await sql`select * from usuario`;
  return res.status(200).json(resposta);
});
routes.get("/usuario/:id", async (req, res) => {
  const { id } = req.params;
  const resposta = await sql`select * from usuario where id_user= ${id}`;
  return res.status(200).json(resposta[0]);
});

routes.post("/cadastro", async (req, res) => {
  try {
    const { user, password } = req.body;
    console.log(user, password)
    await sql`INSERT INTO usuario(nome, senha) VALUES (${user},${password})`;
    return res.status(201).json();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Erro interno ao cadastrar usuário",
    });
  }
});
routes.delete("/deletar/:id", async (req, res) => {
  const { id } = req.params;
  await sql`delete from usuario where id_user = ${id}`;
  return res.status(200).json("Deletado");
});
routes.put("/editarUser/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nome } = req.body;
    const resposta = await sql`UPDATE usuario
	SET usuario=${nome}	WHERE id_user=${id} RETURNING *;`;
    return res.status(200).json(resposta[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao deletar Usuario" });
  }
});



//Treinos
routes.get("/treinos", async (req, res) => {
  const { search } = req.query;
  let rows;
  if (search) {
    rows = await sql`
        SELECT *
        FROM treinos
        WHERE 
          nome_treino ILIKE ${"%" + search + "%"}
      `;
  } else {
    rows = await sql`
        SELECT *
        FROM treinos
        as p join usuario as f on p.id_user = f.id_user
      `;
  }
  return res.status(200).json(rows);
});

routes.get("/treinos/:id", async (req, res) => {
  const { id } = req.params;
  const resposta = await sql`select * from treinos where id_treino=${id}`;
  return res.status(200).json(resposta[0]);
});
routes.get("/professor", async (req, res) => {
  const resposta = await sql`select * from professor`;
  return res.status(200).json(resposta[0]);
});

routes.post("/cad_treinos", async (req, res) => {
  try {
    const {
      nome_treino, exercicio, id_prof, id_user } = req.body;
    const resposta =
      await sql`INSERT INTO treinos(nome_treino, exercicio, id_prof, id_user) VALUES (${nome_treino}, ${exercicio}, ${id_prof}, ${id_user}) RETURNING *`;
    return res.status(201).json(resposta[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Erro interno ao adicionar treino",
    });
  }
});

routes.delete("/deleta/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await sql`DELETE FROM treinos WHERE id_treino = ${id}`;
    return res.status(200).json({ message: "treino deletado" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao deletar treino" });
  }
});

routes.put("/editar/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      id_user,nome_treino ,  exercicio, id_prof,  
    } = req.body;
    const resposta =
      await sql`update produtos set nome_prod = ${nome_treino}, ${exercicio} where id_treino=${id} RETURNING *`;
    return res.status(201).json(resposta[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao editar treino" });
  }
});

export default routes;
