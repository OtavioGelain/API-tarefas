    import express from "express"

    const app = express()
    app.use(express.json())
    const PORT = 3000

    const tarefas = [
        {
            id: 1,
            nome: "Arrumar o quarto"
        },
        {
            id: 2,
            nome: "Lavar a louça"
        }
    ]

    function buscarTarefa(id){
        return tarefas.findIndex((tarefa) => {
            return tarefa.id === Number(id)
        })
    }

    app.get("/", (req, res) => {
        res.status(200).send("Organizador de Tarefas")
    })

    app.get("/tarefas", (req, res) => {
        res.status(200).json(tarefas)
    })



    app.post("/tarefas", (req, res) => {
        const {nome} = req.body

        if(!nome){
            return res.status(400).json("ERRO: O campo nome e obrigatorio")
        }

        const novaTarefa = {
            //Confere se o tamanho do array e maior que 0, se for ele retorna o ID da posição tarefas, se nao so atribui 1 ao ID
            id: tarefas.length > 0 ? tarefas[tarefas.length - 1].id +1 : 1,
            nome: nome
        }
        tarefas.push(novaTarefa)

        res.status(201).json(novaTarefa)
    })

    app.put("/tarefas/:id", (req, res) => {
        const index = buscarTarefa(req.params.id)

        if(index === -1){
            return res.status(404).json("ERRO: Tarefa nao encontrada")
        }

        const nome = req.body.nome

        if(!nome){
            return res.status(400).json("ERRO: O campo nome e obrigatorio")
        }

        tarefas[index].nome = nome

        res.status(204).send()

    })

    app.delete("/tarefas/:id", (req, res) => {
        const id = req.params.id
        const index = buscarTarefa(id)

        if(index === -1){
            return res.status(404).json("ERRO: Tarefa nao encontrada")
        }

        const tarefaExcluida = tarefas[index]

        tarefas.splice(index, 1)

        return res.status(200).json({
            mensagem: "Tarefa excluida com sucesso",
            tarefa: tarefaExcluida
        })
    })

    app.get("/tarefas/:id", (req, res) => {
        const index = buscarTarefa(req.params.id)

        if(index === -1){
            return res.status(404).json("ERRO: Tarefa nao encontrada")
        }

        res.status(200).json(tarefas[index])
    })

    app.listen(PORT, () => {
        console.log("Servidor rodando!")
    })