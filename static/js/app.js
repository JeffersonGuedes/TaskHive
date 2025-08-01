const alerta = document.querySelector('.alerta');
let listaTarefas = {};

const btnCadastrar = document.querySelector('#btnCadastrar');
btnCadastrar.addEventListener('click', handleCadastrar);

const btnLimpar = document.querySelector('#btnLimpar');
btnLimpar.style.display = 'none';

function receberDados() {
    const titulo = document.querySelector('#titulo');
    const descricao = document.querySelector('#descricao');
    alerta.classList.remove('sucesso');

    if (!validarDados(titulo.value)) {
        titulo.focus();
        alerta.innerHTML = 'Preencha o campo título';
        return false;
    }

    if (!validarDados(descricao.value)) {
        descricao.focus();
        alerta.innerHTML = 'Preencha o campo descrição';
        return false;
    }

    listaTarefas = {
        titulo: titulo.value,
        descricao: descricao.value,
    };

    return true;
}

function validarDados(campo) {
    return campo != '' ? true : false;
}

function cadastrarTarefa() {
    const id = gerenciarID();
    const titulo = listaTarefas.titulo;
    const descricao = listaTarefas.descricao;

    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

    tarefas.push({ id, titulo, descricao });
    localStorage.setItem('tarefas', JSON.stringify(tarefas));

    alerta.classList.add('sucesso');
    alerta.innerHTML = 'Tarefa cadastrada';
    listarTarefas();

    btnLimpar.click();
}

function listarTarefas() {
    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

    const tarefasCadastradas = document.querySelector('#tarefas');
    tarefasCadastradas.innerHTML = '';

    tarefas.forEach(tarefa => {
        const id = tarefa.id;
        const titulo = tarefa.titulo;
        const descricao = tarefa.descricao;

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
        btnExcluir.addEventListener('click', function() {
            excluirTarefa(id);
        });
        
        cardTarefa.appendChild(cardTitulo);
        cardTarefa.appendChild(cardDescricao);
        cardTarefa.appendChild(btnEditar);
        cardTarefa.appendChild(btnExcluir);
    });
}

function gerenciarID() {
    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

    if (tarefas.length < 1) {
        return 1;
    } else {
        const maiorID = tarefas.reduce((max, obj) => obj.id > max.id ? obj : max, tarefas[0]);
        return maiorID.id + 1;
    }
}

listarTarefas();

function excluirTarefa(id) {
    let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    tarefas = tarefas.filter(tarefa => tarefa.id !== id);
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
    listarTarefas();
}

function editarTarefa(id) {
    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    const tarefa = tarefas.find(tarefa => tarefa.id === id);

    if (tarefa) {
        document.querySelector('#titulo').value = tarefa.titulo;
        document.querySelector('#descricao').value = tarefa.descricao;

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
    }
}

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

function atualizarTarefa(id) {
    const titulo = document.querySelector('#titulo').value;
    const descricao = document.querySelector('#descricao').value;

    let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

    tarefas = tarefas.map(tarefa => {
        if (tarefa.id === id) {
            return { ...tarefa, titulo, descricao };
        }
        return tarefa;
    });

    localStorage.setItem('tarefas', JSON.stringify(tarefas));
    listarTarefas();
}
