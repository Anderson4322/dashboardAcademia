const userName = document.querySelector("h2")
const btnlogin = document.querySelector(".login")
const btnCadastro = document.querySelector(".cadastro")
const cargo = localStorage.getItem("cargo")

btnCadastro.addEventListener('click', () => {
    window.location.href = "../register/index.html"
})

btnlogin.addEventListener('click', () => {
    window.location.href = "../Connect/index.html"
})

const name = localStorage.getItem("nome")


const alertModal = document.querySelector("#modalLogin");
if (!name) {
    userName.textContent = " Visitante"
} else if(cargo == 2) {
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
    console.log(prods)
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
                <button id="deletar" onclick="deletar(${element.id_treino})">🗑️</button>
                <button id="editar" onclick="editar(${element.id_treino})">✏️</button>
                </div>
                </td>
            </tr>`;
        total++;
        quantidade.textContent = "Total de Alunos:" + total;
    });
    const editar = document.querySelector("#editar")

    if (cargo == 1) {
        editar.style.display = "none"
        deleta.style.display = "none"
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