const express = require("express");
const cors = require("cors")
const app = express();
const porta = 3000;
app.use(express.json());
app.use(cors())
const informacoes = [
    {
        id: 1,
        nome: "Maria Silva",
        CPF: "12345678901",
        CEP: "01234567",
        UF: "SP",
        RUA: "Av. Central",
        NUMERO: 123,
        COMPLEMENTO: "Apto 12"
    }
]

function validarInformacao(nome, CPF, CEP, UF, RUA, NUMERO) {
    console.log(CPF)
    if (!CPF || CPF.length > 11) {

        return {
            codigo: 400,
            mensagem: "CPF inválido"
        }
    }
    if (!CEP || CEP.length != 8) {
        return {
            codigo: 400,
            mensagem: "CEP inválido"
        }
    }
    if (!nome && !CPF && !CEP && !UF && !RUA && !NUMERO) {
        return {
            codigo: 400,
            mensagem: "Informação faltando"
        }

    }
    return {
        codigo: 201,
        mensagem: "Informação cadastrada com sucesso"
    }

}



app.get("/informacoes", (req, res) => {
    res.send(informacoes)
    // console.log(informacoes);
})

app.get("/informacoes/:id", (req, res) => {
    const id = parseInt(req.params.id)
    const informacao = informacoes.find((informacoes => informacoes.id === id))
    if (informacao) {
        res.json(informacao)
    }
    else {
        res.status(404).json(
            {
                erro: "Informação não encontrada"
            }
        )
    }
})

app.post("/informacoes", (req, res) => {
    const { nome, CPF, CEP, UF, RUA, NUMERO, COMPLEMENTO } = req.body;
    const cpfExiste = informacoes.find(informacoes => informacoes.CPF === CPF);
    if (cpfExiste) {
        return res.status(409).json({
            erro: "CPF já existe"
        })
    }
    const valida = validarInformacao(nome, CPF, CEP, UF, RUA, NUMERO)
    let codigo = valida.codigo
    let mensagem = valida.mensagem
    if (valida.codigo === 400) {
        return res.status(valida.codigo).json({ erro: valida.mensagem })
    }

    const id = informacoes.length > 0 ? informacoes[informacoes.length - 1].id + 1 : 1

    const novaInformacao = { id, nome, CPF, CEP, UF, RUA, NUMERO, COMPLEMENTO }
    console.log(novaInformacao)

    informacoes.push(novaInformacao)
    // res.status(201).json({
    //     mensagem: "Informação cadastrada com sucesso",
    //     informação: novaInformacao
    // })
    res.status(valida.codigo).json(valida.mensagem)


})

app.put("/informacoes/:id", (req, res) => {
    const id = parseInt(req.params.id)
    const { nome, CPF, CEP, UF, RUA, NUMERO, COMPLEMENTO } = req.body;
    const teste = informacoes.find((teste => teste.id === id))

    // console.log("Estamos atualizando as informações do id" + id)
    // console.log(`Nome ${nome} CPF ${CPF} CEP ${CEP} UF ${UF} RUA ${RUA} NUMERO ${NUMERO} COMPLEMENTO ${COMPLEMENTO}`)
    // console.log(`id ${id} foi atualizado com sucesso!! <3`)
    
     teste.nome = nome
     teste.CPF = CPF
     teste.CEP=CEP
     teste.UF=UF
     teste.RUA=RUA
     teste.NUMERO=NUMERO
     teste.COMPLEMENTO=COMPLEMENTO
    res.json({
    mensagem: "atualizado com sucesso!"
})
})

app.delete("/informacoes/:id", (req, res) =>{
    const id = parseInt(req.params.id)
    const teste = informacoes.findIndex((teste => teste.id === id))
    if (teste === -1){
        return res.status(404).json({
            erro: "informação não encontrada :("
        })
    }
   
    //console.log(teste)
    informacoes.splice(teste, 1)
    
   res.status(201).json({
            mensagem: "informação deletada :)"
        })
    
})

app.listen(porta, () => console.log(`Servidor rodando http://localhost:${porta}/`));