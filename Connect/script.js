//realizar login
const api = "http://localhost:3000/"
const form = document.querySelector("form")
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const user = document.querySelector("#nome").value
  const password = document.querySelector("#senha").value

  const resposta = await fetch(`${api}login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user,
      password
    }),
  });

  if (resposta.status == 200) {
    const usuarios = await resposta.json();
    localStorage.setItem('id', usuarios.id_user)
    localStorage.setItem('nome', usuarios.nome)
    alert("Login Concluido!")
    window.location.href = "../home/index.html"
  } else {
    alert("Usuario ou senha incorretos");
  }
});