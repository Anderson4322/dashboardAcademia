const userName = document.querySelector("h2")
const btnlogin = document.querySelector(".login")
const btnCadastro = document.querySelector(".cadastro")

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
} else {
    userName.textContent = `${name}`
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
    quantidade.textContent = "Nenhum aluno foi listado"
}

const api = "http://localhost:3000/"
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    
    
    const nome_prod = document.querySelector("#nome_prod").value
    const codigo = document.querySelector("#codigo").value
    const preco = document.querySelector("#preco").value
    const quantidade = document.querySelector("#quantidade").value
    const cor = document.querySelector("#cor").value
    const capac = document.querySelector("#capac").value
    const espec = document.querySelector("#espec").value
    const quantidade_min = document.querySelector("#quantidade_min").value
    const id_fabric = document.querySelector("#id_fabric").value
    
    const resposta = await fetch(`${api}cad_produto`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            nome_prod,
            codigo,
            preco,
            quantidade,
            cor,
            capac,
            espec,
            quantidade_min,
            id_fabric
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

const id_fabric = document.querySelector("#id_fabric")
let prods = [];
window.addEventListener("load", async () => {
    const resposta = await fetch(`${api}produtos`);
    prods = await resposta.json();
    console.log(prods)
    prods.forEach((prod) => {
        id_fabric.innerHTML += `
      <option value="${prod.id_fab}">${prod.nome_fab}</option>
      `;
    })
    renderizar(prods);
});

function renderizar(prods) {
    prods.forEach((element) => {
        corpo.innerHTML += `     <tr>
                <td>${element.id_prod}</td>
                <td>${element.id_fab}</td>
                <td>${element.nome_prod}</td>
                <td>${element.codigo}</td>
                <td>${element.preco}</td>
                <td>${element.quantidade}</td>
                <td>${element.cor}</td>
                <td>${element.capac}</td>
                <td>${element.espec}</td>
                <td>${element.quantidade_min}</td>
                <td>
                <div id="buttonMove">
                <button onclick="deletar(${element.id_prod})">🗑️</button>
                <button onclick='editar(${element.id_prod})'>✏️</button>
                </div>
                </td>
            </tr>`;
        total++;
        quantidade.textContent = "Total de Alunos:" + total;
    });
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
    const produto = await fetch(`${api}/produto/${id}`);
    const prod = await produto.json();
    const datas = {
        nome_prod: prompt("Nome do produto", prod.nome_prod),
        codigo: prompt("codigo", prod.codigo),
        preco: prompt("preco", prod.preco),
        quantidade: prompt("quantidade", prod.quantidade),
        cor: prompt("cor", prod.cor),
        capac: prompt("capacidade", prod.capac),
        espec: prompt("especifações", prod.espec),
        quantidade_min: prompt("quantidade minima", prod.quantidade_min),
    };
    const resposta = await fetch(`${api}/editar/${id}`, {
        method: "put",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(datas),
    });
    resposta.status == 201 ? window.location.reload() : alert("erro ao editar");
}