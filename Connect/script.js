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
    
    if(usuarios.cargo == 2){
      localStorage.setItem('id', usuarios.id_prof);
      localStorage.setItem('nome', usuarios.nome_prof);
      localStorage.setItem('cargo', usuarios.cargo);

    } else{

      localStorage.setItem('id', usuarios.id_user);
      localStorage.setItem('nome', usuarios.nome_user);
      localStorage.setItem('cargo', usuarios.cargo);
    }
    
    console.log(usuarios);


    window.location.href = "../home/index.html";
} else {
   return alert("Usuario ou senha incorretos");
}

});

