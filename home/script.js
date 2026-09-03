const userName = document.querySelector("h2")
const btnlogin = document.querySelector(".login")
const btnCadastro = document.querySelector(".cadastro")
const cargo = localStorage.getItem("cargo")
const name = localStorage.getItem("nome")

const alertModal = document.querySelector("#modalLogin");
if (!name) {
    userName.textContent = " Visitante"
} else if (cargo == 2) {
    userName.textContent = `Bem vindo professor: ${name}`
} else {
    userName.textContent = `Bem vindo aluno: ${name}`
}

const openButton = document.querySelector("#open")


if (cargo == 1) {
    openButton.style.display = "none"
}
const modal = document.querySelector("#modal")
document.querySelector("#open").addEventListener('click', () => {
    const user = localStorage.getItem("nome")

    if (!user) {
        return alertModal.showModal()
    }
    modal.showModal()
})
document.querySelector("#close").addEventListener('click', () => {
    modal.close()
})

const form = document.querySelector("form")
const corpo = document.querySelector("tbody")
const quantidade = document.querySelector("#nProdutos")

let total = 0;
if (total == 0) {
    quantidade.textContent = "Nenhum treino foi listado"
}

const api = "http://localhost:3000/"
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome_treino = document.querySelector("#treino").value;
    const exercicio = document.querySelector("#exercicios").value;
    const duracao = document.querySelector("#duracao").value;
    const repeticao = document.querySelector("#repeticao").value;
    const id_user = document.querySelector("#id_usuario").value;
    const id_prof = localStorage.getItem("id")

    const resposta = await fetch(`${api}cad_treinos`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            nome_treino,
            exercicio,
            duracao,
            repeticao,
            id_prof,
            id_user
        }),
    });

    if (resposta.status == 201) {
        const Produto = await resposta.json();
        alert("Produto adicionado")
        window.location.reload()
    } else {
        alert("Erro");

    }
});

const disconnect = document.querySelector("#disconnect")
disconnect.addEventListener('click', () => {
    localStorage.clear()
    alert("System from disconnect..")
    window.location.replace("../Connect/index.html")
})

const id_fabric = document.querySelector("#id_usuario")
let prods = [];

const id_user = localStorage.getItem("id")
window.addEventListener("load", async () => {
    const resposta = await fetch(`${api}treinos/${cargo}/${id_user}`);
    const usuarios = await fetch(`${api}usuario`);

    prods = await resposta.json();
    const users = await usuarios.json();
    users.forEach((prod) => {
        id_fabric.innerHTML += `
      <option value="${prod.id_user}">${prod.nome_user}</option>
      `;
    })


    renderizar(prods);
});


function renderizar(prods) {
    prods.forEach((element) => {
        corpo.innerHTML += `     <tr>
                <td>${element.id_treino}</td>
                <td>${element.nome_user}</td>
                <td>${element.nome_treino}</td>
                <td>${element.duracao}</td>
                <td>${element.repeticao}</td>
                <td>${element.exercicio}</td>
                <td>${element.nome_prof}</td>
                <td>
                <div id="buttonMove">
                ${cargo != 1 ? `<button id="deletar" onclick="deletar(${element.id_treino})">🗑️</button>` : '<div></div>'}
                ${cargo != 1 ? `<button id="editar" onclick="editar(${element.id_treino})">✏️</button>` : '<div></div>'}                
                ${cargo != 1 ? `<button id="ficha" onclick="ficha(${element.id_user})">🗃️</button>` : '<div></div>'}                
                </div>
                </td>
            </tr>`;
        total++;
        quantidade.textContent = "Total de Treinos:" + total;
    });
}

async function ficha(id) {
    console.log(id)
    const closeDetalhes = document.querySelector("#closeDetalhes")
    closeDetalhes.addEventListener('click', () => {
        const modalDetalhes = document.querySelector("#DetalhesModal")
        modalDetalhes.close()
    })

    const usuario = await fetch(`${api}usuario_especif/${id}`);
    const user = await usuario.json();
    const divDesativar = document.querySelector("#divDesativar")
    const modalDetalhes = document.querySelector("#DetalhesModal")
    const Nome_aluno = document.querySelector("#Nome_aluno")
    const Detalhes_peso = document.querySelector("#Detalhes_peso")
    const Detalhes_altura = document.querySelector("#Detalhes_altura")
    const Detalhes_idade = document.querySelector("#Detalhes_idade")
    const Detalhes_status = document.querySelector("#Detalhes_status")
    Nome_aluno.textContent = `Ficha do aluno: ${user.nome_user}`
    Nome_aluno.style.fontSize = "20px"
    Detalhes_peso.textContent = `Peso: ${user.peso} kg`
    Detalhes_altura.textContent = `Altura: ${user.altura} m`
    Detalhes_idade.textContent = `Idade: ${user.idade}`
    Detalhes_status.textContent = `${user.status}`

    const desativarBtn = document.querySelector("#desativarBtn")
    const ativarBtn = document.querySelector("#ativarBtn")

    ativarBtn.addEventListener("click", () => {
        Ativar(id)
    })

    desativarBtn.addEventListener("click", () => {
        Desativar(id)
    })
    modalDetalhes.showModal()

    async function Ativar(id) {
        const status = "ativo";
        const resposta = await fetch(`${api}editarUser/${id}`, {
            method: "PUT",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ status })
        })
        if (resposta.status == 200) {
            console.log(id, status)
        } else {
            return alert("Erro ao alterar")
        }
    }

    async function Desativar(id) {
        const status = "desativar";

        const resposta = await fetch(`${api}editarUser/${id}`, {
            method: "PUT",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ status })
        })
        if (resposta.status == 200) {
            console.log(id, status)
        } else {
            return alert("Erro ao alterar")
        }
    }

}




async function deletar(id) {
    const resposta = await fetch(`${api}deleta/${id}`, {
        method: "DELETE",
    });
    if (resposta.status == 200) {
        return window.location.reload();
    }
    return alert("erro ao deletar");
}

async function editar(id) {
    const produto = await fetch(`${api}treinos_especif/${id}`);
    const prod = await produto.json();
    const datas = {
        nome_treino: prompt("Nome do treino", prod.nome_treino),
        exercicio: prompt("Exercicios", prod.exercicio),

    };
    const resposta = await fetch(`${api}editar/${id}`, {
        method: "put",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(datas),
    });
    if (resposta.status == 201) {
        window.location.reload()
    }
    else {

        return alert("erro ao editar");
    }
}