const alerta = document.querySelector('.alerta');

// Ação do button Cadastrar
const btnCadastrar = document.querySelector('#btnCadastrar');
btnCadastrar.addEventListener('click', handleCadastrar);

// Ação do button Limpar
const btnLimpar = document.querySelector('#btnLimpar');
btnLimpar.style.display = 'none';

function receberDados() {
    const titulo = document.querySelector('#titulo');
    const descricao = document.querySelector('#descricao');
    alerta.classList.remove('sucesso');

    // Verifica se foi preenchido o título
    if (!validarDados(titulo.value)) {
        titulo.focus();
        alerta.innerHTML = 'Preencha o campo título';
        return false;
    }

    // Verifica se foi preenchido a descrição
    if (!validarDados(descricao.value)) {
        descricao.focus();
        alerta.innerHTML = 'Preencha o campo descrição';
        return false;
    }

    // Adiciona o objeto no array
    listaTarefas = {
        titulo: titulo.value,
        descricao: descricao.value,
    };

    return true;
}

function validarDados(campo) {
    return campo !== '' ? true : false;
}

/* GET */
function listarTarefas() {
    fetch('https://parseapi.back4app.com/parse/classes/tasks', {
        method: 'GET',
        headers: {
            'X-Parse-Application-Id': 'xfbr7O9fYqZrqVoJTdcmei5VRkhu7IPJ4kfIBX0u',
            'X-Parse-REST-API-Key': 'jksOaalBcOudSNjBUAVaEDHBrOXpUQ8m1sxzEWML',
        }
    })
        .then(response => response.json())
        .then(tarefas => {
            const tarefasCadastradas = document.querySelector('#tarefas');
            tarefasCadastradas.innerHTML = '';

            tarefas.results.forEach(tarefa => {
                const id = tarefa.objectId;
                const titulo = tarefa.title;
                const descricao = tarefa.description;

                const cardTarefa = document.createElement('div');
                cardTarefa.classList.add('card-tarefa');
                tarefasCadastradas.appendChild(cardTarefa);

                const cardTitulo = document.createElement('div');
                cardTitulo.innerHTML = titulo;

                const cardDescricao = document.createElement('div');
                cardDescricao.innerHTML = descricao;

                const btnEditar = document.createElement('button');
                btnEditar.setAttribute('class', 'btn-editar');
                btnEditar.setAttribute('id', id);
                btnEditar.addEventListener('click', () => {
                    editarTarefa(id);
                });

                const btnExcluir = document.createElement('button');
                btnExcluir.setAttribute('class', 'btn-excluir');
                btnExcluir.setAttribute('id', id);
                btnExcluir.addEventListener('click', function () {
                    excluirTarefa(id);
                });

                cardTarefa.appendChild(cardTitulo);
                cardTarefa.appendChild(cardDescricao);
                cardTarefa.appendChild(btnEditar);
                cardTarefa.appendChild(btnExcluir);
            });
        })
        .catch(error => console.error('Erro ao listar tarefas:', error));
}

/* POST */
function cadastrarTarefa() {
    const titulo = listaTarefas.titulo;
    const descricao = listaTarefas.descricao;

    fetch('https://parseapi.back4app.com/parse/classes/tasks', {
        method: 'POST',
        headers: {
            'X-Parse-Application-Id': 'xfbr7O9fYqZrqVoJTdcmei5VRkhu7IPJ4kfIBX0u',
            'X-Parse-REST-API-Key': 'jksOaalBcOudSNjBUAVaEDHBrOXpUQ8m1sxzEWML',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title: titulo,
            description: descricao
        }),
    })
        .then(response => response.json())
        .then(data => {
            alerta.classList.add('sucesso');
            alerta.innerHTML = 'Tarefa cadastrada';
            listarTarefas();
            btnLimpar.click();
        })
        .catch(error => console.error('Erro ao cadastrar tarefa:', error));
}

/* PUT */
function atualizarTarefa(id) {
    const titulo = document.querySelector('#titulo').value;
    const descricao = document.querySelector('#descricao').value;

    fetch(`https://parseapi.back4app.com/parse/classes/tasks/${id}`, {
        method: 'PUT',
        headers: {
            'X-Parse-Application-Id': 'xfbr7O9fYqZrqVoJTdcmei5VRkhu7IPJ4kfIBX0u',
            'X-Parse-REST-API-Key': 'jksOaalBcOudSNjBUAVaEDHBrOXpUQ8m1sxzEWML',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title: titulo,
            description: descricao
        }),
    })
        .then(response => response.json())
        .then(data => {
            alerta.classList.add('sucesso');
            alerta.innerHTML = 'Tarefa atualizada';
            listarTarefas();
        })
        .catch(error => console.error('Erro ao atualizar tarefa:', error));
}

/* DELETE */
function excluirTarefa(id) {
    fetch(`https://parseapi.back4app.com/parse/classes/tasks/${id}`, {
        method: 'DELETE',
        headers: {
            'X-Parse-Application-Id': 'xfbr7O9fYqZrqVoJTdcmei5VRkhu7IPJ4kfIBX0u',
            'X-Parse-REST-API-Key': 'jksOaalBcOudSNjBUAVaEDHBrOXpUQ8m1sxzEWML',
        },
    })
        .then(response => response.json())
        .then(data => {
            listarTarefas();
        })
        .catch(error => console.error('Erro ao excluir tarefa:', error));
}

/* GET by id */
function editarTarefa(id) {
    fetch(`https://parseapi.back4app.com/parse/classes/tasks/${id}`, {
        method: 'GET',
        headers: {
            'X-Parse-Application-Id': 'xfbr7O9fYqZrqVoJTdcmei5VRkhu7IPJ4kfIBX0u',
            'X-Parse-REST-API-Key': 'jksOaalBcOudSNjBUAVaEDHBrOXpUQ8m1sxzEWML',
        },
    })
        .then(response => response.json())
        .then(tarefa => {
            document.querySelector('#titulo').value = tarefa.title;
            document.querySelector('#descricao').value = tarefa.description;

            btnCadastrar.innerHTML = 'Atualizar';

            btnCadastrar.removeEventListener('click', handleCadastrar);
            btnCadastrar.addEventListener('click', function handleAtualizar(evento) {
                evento.preventDefault();

                if (!receberDados()) {
                    return;
                }

                atualizarTarefa(id);

                btnCadastrar.innerHTML = 'Cadastrar';
                btnCadastrar.removeEventListener('click', handleAtualizar);
                btnCadastrar.addEventListener('click', handleCadastrar);

                btnLimpar.click();
            });
        })
        .catch(error => console.error('Erro ao buscar tarefa:', error));
}

/* Handle cadastrar */
function handleCadastrar(evento) {
    evento.preventDefault();

    if (!receberDados()) {
        return;
    }

    cadastrarTarefa();
    removerAlerta(alerta, 2500);
}

function removerAlerta(elemento, tempo) {
    setTimeout(() => {
        elemento.innerHTML = '';
    }, tempo);
}

// Listar tarefas ao carregar a página
listarTarefas();
