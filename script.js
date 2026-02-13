// SELETORES

const getElement = (query) => document.querySelector(query);

const container = getElement(".modal-container");
const activeModalClass = "modal-show";

let tarefas = [];

// MODAL

function openModal() {
  container.classList.add(activeModalClass);
}

function closeModal() {
  container.classList.remove(activeModalClass);
}

// DATA E HORA

function dataHora() {
  let data = new Date();
  let horas = data.getHours();
  let minutos = data.getMinutes();
  let mes = data.getMonth();

  const meses = [
    "janeiro", "fevereiro", "março", "abril",
    "maio", "junho", "julho", "agosto",
    "setembro", "outubro", "novembro", "dezembro"
  ];

  let dataFormatada = `${data.getDate()} de ${meses[mes]} de ${data.getFullYear()}`;

  let horarioFormatado =
    (horas < 10 ? "0" : "") + horas +
    (minutos < 10 ? ":0" : ":") + minutos;

  document.getElementById("data").innerHTML = dataFormatada;
  document.getElementById("horario").innerHTML = horarioFormatado;
}

dataHora();

// LOCAL STORAGE

function salvarTarefa(lista) {
  window.localStorage.setItem("lista", JSON.stringify(lista));
}

// ADICIONAR TAREFA

function adicionarUmaTarefa(lista, categoria, horarioTarefa, titulo) {
  lista.push({
    id: lista.length + 1,
    descricao: titulo,
    categoria: categoria,
    horario: horarioTarefa,
    concluida: false
  });

  salvarTarefa(lista);
}

// REMOVER TAREFA

function removerTarefa(obj) {
  let index = obj.classList[0];

  let lista = JSON.parse(window.localStorage.getItem("lista")) || [];

  lista.splice(index, 1);

  salvarTarefa(lista);
  reload();
}

// EDITAR TAREFA

function editarTarefa(obj) {
  openModal();

  let index = obj.classList[0];

  document.getElementById("btn-salvar-tarefa").classList.add("editar");
  document.getElementById("btn-salvar-tarefa").classList.add(index);

  let lista = JSON.parse(window.localStorage.getItem("lista")) || [];

  let item = lista[index];

  document.getElementById("categoria-tarefa").value = item.categoria;
  document.getElementById("horario-tarefa").value = item.horario;
  document.getElementById("titulo-tarefa").value = item.descricao;
}

// TAREFA CONCLUÍDA

function tarefaConcluida(botao) {
  let index = botao.parentElement.classList[1];

  let lista = JSON.parse(localStorage.getItem("lista")) || [];

  lista[index].concluida = !lista[index].concluida;

  salvarTarefa(lista);

  reload();
}


// SUBMIT DO FORMULÁRIO

document.getElementById("nova-tarefa").onsubmit = (e) => {
  e.preventDefault();

  const btnSalvar = document.getElementById("btn-salvar-tarefa");
  const isEditar = btnSalvar.classList.contains("editar");

  let categoriaTarefa = document.getElementById("categoria-tarefa").value;
  let horarioTarefa = document.getElementById("horario-tarefa").value;
  let tituloTarefa = document.getElementById("titulo-tarefa").value;

  let lista = JSON.parse(window.localStorage.getItem("lista")) || [];

  if (isEditar) {
    const index = btnSalvar.classList[1];

    lista.splice(index, 1, {
      id: Number(index) + 1,
      descricao: tituloTarefa,
      categoria: categoriaTarefa,
      horario: horarioTarefa,
    });

    btnSalvar.classList.remove("editar");
    btnSalvar.classList.remove(index);

    salvarTarefa(lista);
    reload();
    return;
  }

  // NOVA TAREFA
  adicionarUmaTarefa(lista, categoriaTarefa, horarioTarefa, tituloTarefa);
  reload();
};

// PREENCHER TAREFAS AO CARREGAR

window.onload = function () {
  tarefas = JSON.parse(window.localStorage.getItem("lista")) || [];

  const containerLista = document.getElementById("tarefas-dia");

  containerLista.innerHTML = "";

  if (tarefas.length === 0) {
    containerLista.innerHTML = "Ainda não há tarefas para este dia";
    containerLista.classList.add("msg-nao-ha-tarefas");
    return;
  }

  containerLista.classList.remove("msg-nao-ha-tarefas");

  tarefas.forEach((tarefa, i) => {
    containerLista.innerHTML += `
      <li class="tarefas-dia ${i} ${tarefa.concluida ? "tarefa-concluida" : ""}">
        
        <button 
          class="btn-tarefa-concluida ${tarefa.concluida ? "check-ativo" : ""}" 
          onclick="tarefaConcluida(this)">
          <i class="fa-solid fa-check"></i>
        </button>

        <div class="descricao-tarefa-dia">
          <h3>${tarefa.descricao}</h3>
          <p>${tarefa.categoria}</p>
          <p>${tarefa.horario}</p>
        </div>

        <div>
          <button 
            class="${i} btn-editar-tarefa" 
            onclick="editarTarefa(this)">
            <i class="fa-solid fa-pen"></i>
          </button>

          <button 
            class="${i} btn-excluir-tarefa" 
            onclick="removerTarefa(this)">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>

      </li>
    `;
  });
};


// RELOAD

function reload() {
  window.location.reload();
}
