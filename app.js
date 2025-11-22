import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

// Conexão com MongoDB
mongoose
  .connect(process.env.MONGO_URL, {
      dbName: "tarefasdb"
  })
  .then(() => console.log("MongoDB conectado com sucesso"))
  .catch(err => console.log("Erro ao conectar com o MongoDB:", err))

const app = express()
app.use(express.json())
const PORT = 3000

// Schema da tarefa
const tarefaSchema = new mongoose.Schema({
    nome: { type: String, required: true }
})

const Tarefa = mongoose.model("Tarefa", tarefaSchema)

// Rotas

app.get("/", (req, res) => {
    res.status(200).send("Organizador de Tarefas")
})

app.get("/tarefas", async (req, res) => {
    const tarefas = await Tarefa.find()
    res.status(200).json(tarefas)
})

app.get("/tarefas/:id", async (req, res) => {
    const tarefa = await Tarefa.findById(req.params.id)

    if (!tarefa) {
        return res.status(404).json("ERRO: Tarefa não encontrada")
    }

    res.status(200).json(tarefa)
})

app.post("/tarefas", async (req, res) => {
    const { nome } = req.body

    if (!nome) {
        return res.status(400).json("ERRO: O campo nome é obrigatório")
    }

    const novaTarefa = await Tarefa.create({ nome })
    res.status(201).json(novaTarefa)
})

app.put("/tarefas/:id", async (req, res) => {
    const { nome } = req.body

    const tarefaAtualizada = await Tarefa.findByIdAndUpdate(
        req.params.id,
        { nome },
        { new: true }
    )

    if (!tarefaAtualizada) {
        return res.status(404).json("ERRO: Tarefa não encontrada")
    }

    res.status(200).json(tarefaAtualizada)
})

app.delete("/tarefas/:id", async (req, res) => {
    const tarefa = await Tarefa.findByIdAndDelete(req.params.id)

    if (!tarefa) {
        return res.status(404).json("ERRO: Tarefa não encontrada")
    }

    res.status(200).json({
        mensagem: "Tarefa excluída com sucesso",
        tarefa
    })
})

app.listen(PORT, () => {
    console.log("Servidor rodando na porta " + PORT)
})
