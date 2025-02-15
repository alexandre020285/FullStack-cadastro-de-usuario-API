import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cors());

app.post("/usuarios", async (req, res) => {
  const { name, age, email } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: {
        name: req.body.name,
        age: req.body.age,
        email: req.body.email,
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);

    if (error.code === "P2002") {
      res.status(400).json({ error: "Email já está em uso." });
    } else {
      res.status(500).json({ error: "Erro interno ao criar usuário." });
    }
  }
});

app.get("/usuarios", async (req, res) => {
  try {
    let users = [];
    if (req.query) {
      users = await prisma.user.findMany({
        where: {
          name: req.query.name,
          email: req.query.email,
          age: req.query.age,
        },
      });
    } else {
      users = await prisma.user.findMany();
    }
    res.status(200).json(users);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ error: "Erro interno ao buscar usuários." });
  }
});

app.put("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        age,
      },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(404).json({ error: "Usuário não encontrado." });
  }
});

app.delete("/usuarios/:id", async (req, res) => {
  try {
    await prisma.user.delete({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    res.status(404).json({ error: "Usuário não encontrado." });
  }
});

// app.listen(3000, () => {
//   console.log("Server is running on port 3000");
// });
app.listen(process.env.PORT || 3000, () => {

  console.log(`Server is running on port ${process.env.PORT || 3000}`);

});