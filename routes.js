import express from "express";
import sql from "./database.js";
const routes = express.Router();
//USUÁRIO
routes.post("/login", async (req, res) => {
  try {
    const { user, password } = req.body;
    console.log(req.body)
    const resposta = await sql`select * from usuario where nome_user = ${user}`;
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
    await sql`INSERT INTO usuario(nome_user, senha) VALUES (${user},${password})`;
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
routes.get("/treinos/:cargo/:id_user", async (req, res) => {
  const { cargo, id_user } = req.params;
  console.log(req.params)
  let rows;
  if (cargo == 2) {
    rows = await sql`
       
              SELECT *
      FROM treinos as t JOIN usuario AS u
       ON t.id_user = u.id_user
        JOIN professor AS p
       ON t.id_prof = p.id_prof
      `;

  } else {
    rows = await sql`

          SELECT *
      FROM treinos as t JOIN usuario AS u
       ON t.id_user = u.id_user
        JOIN professor AS p
       ON t.id_prof = p.id_prof
       where t.id_user = ${id_user}
    
      `;
      
  }

  console.log(rows)


  return res.status(200).json(rows);
});


routes.get("/treinos_especif/:id", async (req, res) => {
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
      nome_treino, exercicio, id_prof, id_user, duracao, repeticao } = req.body;
    console.log(req.body)
    const resposta =
      await sql`INSERT INTO treinos(nome_treino, exercicio, id_prof, id_user, duracao, repeticao) VALUES (${nome_treino}, ${exercicio}, ${id_prof}, ${id_user}, ${duracao}, ${repeticao}) RETURNING *`;
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
    const { nome_treino, exercicio } = req.body;
    console.log(req.params)
    const resposta =
      await sql`update treinos set nome_treino = ${nome_treino}, exercicio = ${exercicio} where id_treino= ${id} RETURNING *`;
    return res.status(201).json(resposta[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao editar treino" });
  }
});

export default routes;
