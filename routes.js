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
routes.get("/usuarios", async (req, res) => {
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
    console.log(user,password)
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
    const { nome_p } = req.body;
    const resposta = await sql`UPDATE usuario
	SET usuario=${nome_p}	WHERE id_user=${id} RETURNING *;`;
    return res.status(200).json(resposta[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao deletar produto" });
  }
});



//PRODUTOS
routes.get("/produtos", async (req, res) => {
  const { search } = req.query;
  let rows;
  if (search) {
    rows = await sql`
        SELECT *
        FROM produtos
        WHERE 
          nome_prod ILIKE ${"%" + search + "%"}
      `;
  } else {
    rows = await sql`
       select * from produtos as p join fabricante as f on p.id_fabric = f.id_fab;
      `;
  }
  return res.status(200).json(rows);
});

routes.get("/produto/:id", async (req, res) => {
  const { id } = req.params;
  const resposta = await sql`select * from produtos where id_prod=${id}`;
  return res.status(200).json(resposta[0]);
});
routes.get("/fabricante", async (req, res) => {
  const resposta = await sql`select * from fabricante`;
  return res.status(200).json(resposta[0]);
});

routes.post("/cad_produto", async (req, res) => {
  try {
    const {
     nome_prod, codigo, preco, quantidade, cor, capac, espec, quantidade_min, id_fabric
    } = req.body;
    const resposta =
      await sql`INSERT INTO produtos(nome_prod, codigo, preco, quantidade, cor, capac, espec, quantidade_min, id_fabric) VALUES (${nome_prod}, ${codigo}, ${preco}, ${quantidade}, ${cor}, ${capac}, ${espec}, ${quantidade_min}, ${id_fabric}) RETURNING *`;
    return res.status(201).json(resposta[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Erro interno ao cadastrar produto",
    });
  }
});

routes.delete("/deleta/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await sql`DELETE FROM produtos WHERE id_prod = ${id}`;
    return res.status(200).json({ message: "Produto deletado" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao deletar produto" });
  }
});

routes.put("/editar/:id", async (req, res) => {
  try {
    const { id } = req.params;
     const {
     nome_prod, codigo, preco, quantidade, cor, capac, espec, quantidade_min
    } = req.body;
    const resposta =
      await sql`update produtos set nome_prod = ${nome_prod}, codigo=${codigo}, preco=${preco}, quantidade=${quantidade}, cor=${cor}, capac=${capac}, espec=${espec}, quantidade_min=${quantidade_min} where id_prod=${id} RETURNING *`;
    return res.status(201).json(resposta[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao deletar produto" });
  }
});

export default routes;
