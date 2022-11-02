//cria os elementos para modal
const getElement = (...queries) => document.querySelector(...queries);

const buttonAddTarefa = getElement("#btn-adicionar");
const container = getElement(".modal-container");
const modal = getElement(".modal");
const tituloModal = getElement(".titulo-modal");
const btnSalvar = getElement("#btn-salvar-tarefa");
const btnCancelar = getElement("#btn-cancelar-tarefa");

const activeModalClass = "modal-show";
//adiciona e fecha o modal ao clicar no botão
const openModal = () => container.classList.add(activeModalClass);
const closeModal = () => container.classList.remove(activeModalClass);

// FUNÇÃO PARA DATA E HORA DA PÁGINA
const dataHora = () => {
  let data = new Date();
  let horas = data.getHours();
  let minutos = data.getMinutes();
  let mes = data.getMonth();
  let mesPorExtenso = "";

  switch (mes) {
    case 0:
      mesPorExtenso = "janeiro";
      break;
    case 1:
      mesPorExtenso = "fevereiro";
      break;
    case 2:
      mesPorExtenso = "março";
      break;
    case 3:
      mesPorExtenso = "abril";
      break;
    case 4:
      mesPorExtenso = "maio";
      break;
    case 5:
      mesPorExtenso = "junho";
      break;
    case 6:
      mesPorExtenso = "julho";
      break;
    case 7:
      mesPorExtenso = "agosto";
      break;
    case 8:
      mesPorExtenso = "setembro";
      break;
    case 9:
      mesPorExtenso = "outubro";
      break;
    case 10:
      mesPorExtenso = "novembro";
      break;
    case 11:
      mesPorExtenso = "dezembro";
      break;
  }

  let dataFormatada = `${data.getDate()} de ${mesPorExtenso} de ${data.getFullYear()}`;
  let horarioFormatado = (horas < 10 ? "0" : "") + horas;
  horarioFormatado = horas + (minutos < 10 ? ":0" : ":") + minutos;

  document.getElementById("data").innerHTML = dataFormatada;
  document.getElementById("horario").innerHTML = horarioFormatado;
};

// CHAMA A FUNÇÃO DATA E HORA E EXIBE NA TELA
dataHora();

let tarefas = [];

//ADICIONAR UMA TAREFA
function adicionarUmaTarefa(tarefa, categoria, horarioTarefa, titulo) {
  tarefa.push({
    id: tarefa.length + 1,
    descricao: titulo,
    categoria: categoria,
    horario: horarioTarefa,
  });

  window.localStorage.setItem("lista", JSON.stringify(tarefa));
}

//dar reload na pagina
function reload() {
  window.location.reload();
}

//SALVAR TAREFA NO BANCO
function salvarTarefa(lista) {
  window.localStorage.setItem("lista", JSON.stringify(lista));
}

// PREENCHE COM AS TAREFAS DO "BANCO"
window.onload = function preencherTarefas() {
  tarefas = JSON.parse(window.localStorage.getItem("lista"));
  let naoHaTarefa = document.getElementById("tarefas-dia");
  naoHaTarefa.classList.add("msg-nao-ha-tarefas");

  if (tarefas == null || tarefas.length == 0) {
    naoHaTarefa.innerHTML = "Ainda não há tarefas para este dia";
    return;
  } else {
    const div = document.getElementById("tarefas-dia");
    lista = document.createElement("ul");
    for (let i = 0; i < tarefas.length; i++) {
      lista.innerHTML += `<li class="tarefas-dia ${i}">
           <button class="btn-tarefa-concluida" onclick="tarefaConcluida(this)"><i class="fa-solid fa-check"></i></button>
           <div class="descricao-tarefa-dia">
                <h3>${tarefas[i].descricao}</h3>
                <p>${tarefas[i].categoria}</p>
                <p>${tarefas[i].horario}</p>                   
            </div>
            <div>
                <button class="${i} btn-editar-tarefa" onclick="editarTarefa(this)"><i class="fa-solid fa-pen"></i></button>
                <button class="${i} btn-excluir-tarefa" onclick="removerTarefa(this)"><i class="fa-solid fa-trash"></i></button>
            </div>`;
    }

    div.appendChild(lista);
  }
};

// TAREFA CONCLUIDA
// function tarefaConcluida() {
//   const btnTarefaConcluida = document.getElementsByClassName("btn-tarefa-concluida")[0];
//   btnTarefaConcluida.classList.toggle("tarefa-concluida");
//   console.log("função tarefa concluida");
// }

//VALIDA SE VAI EDITAR OU SALVAR UMA NOVA TAREFA NO MODAL
document.getElementById("nova-tarefa").onsubmit = (e) => {
  const isEditar = document.getElementById("btn-salvar-tarefa").classList[0];

  if (isEditar == "editar") {
    const itemASerEditado =
      document.getElementById("btn-salvar-tarefa").classList[1];
    let lista = JSON.parse(window.localStorage.getItem("lista"));

    let item = lista[itemASerEditado];
    let categoriaTarefa = document.getElementById("categoria-tarefa").value;
    let horarioTarefa = document.getElementById("horario-tarefa").value;
    let tituloTarefa = document.getElementById("titulo-tarefa").value;

    lista.splice(itemASerEditado, 1, {
      id: itemASerEditado,
      descricao: tituloTarefa,
      categoria: categoriaTarefa,
      horario: horarioTarefa,
    });
    window.sessionStorage.setItem("item", JSON.stringify(item));
    salvarTarefa(lista);

    document.getElementById("btn-salvar-tarefa").classList.remove("editar");
    document
      .getElementById("btn-salvar-tarefa")
      .classList.remove(itemASerEditado);
    reload();
    return;
  }

  if (e.submitter.id == "btn-cancelar-tarefa") {
    reload();
    return;
  } else {
    e.preventDefault();
    let categoriaTarefa = document.getElementById("categoria-tarefa").value;
    let horarioTarefa = document.getElementById("horario-tarefa").value;
    let tituloTarefa = document.getElementById("titulo-tarefa").value;
    let tarefas = JSON.parse(window.localStorage.getItem("lista"));

    const btnSalvarTarefa = document.getElementById("btn-salvar-tarefa");
    btnSalvarTarefa.addEventListener(
      "click",
      adicionarUmaTarefa(tarefas, categoriaTarefa, horarioTarefa, tituloTarefa)
    );

    reload();
  }
};

//REMOVER TAREFAS
function removerTarefa(obj) {
  let itemASerRemovido = obj.classList[0];

  let lista = JSON.parse(window.localStorage.getItem("lista"));

  lista.splice(itemASerRemovido, 1);

  salvarTarefa(lista);
  reload();
}

// ADICIONAR TAREFA
const adicionarTarefa = () => {
  let novaTarefa = {};
  tarefas.push(novaTarefa);
};

//EDITAR TAREFA
function editarTarefa(obj) {
  openModal();

  let itemASerEditado = obj.classList[0];

  document.getElementById("btn-salvar-tarefa").classList.add("editar");
  document.getElementById("btn-salvar-tarefa").classList.add(itemASerEditado);

  let lista = JSON.parse(window.localStorage.getItem("lista"));

  let item = lista[itemASerEditado];

  document.getElementById("categoria-tarefa").value = item.categoria;
  document.getElementById("horario-tarefa").value = item.horario;
  document.getElementById("titulo-tarefa").value = item.descricao;
}
