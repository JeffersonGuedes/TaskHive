const alerta = document.querySelector('.alerta');
let listaTarefas = {};

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
    // Se o campo for diferente de '', retorna true, senão retorna false
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

    // Limpa os campos do form
    btnLimpar.click();
}

function listarTarefas() {
    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

    const tarefasCadastradas = document.querySelector('#tarefas');
    tarefasCadastradas.innerHTML = '';

    tarefas.forEach(tarefa => {
        // Encapsula os valores informados
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

        // Remove o evento de cadastro e adiciona o de atualização
        btnCadastrar.removeEventListener('click', handleCadastrar);
        btnCadastrar.addEventListener('click', function handleAtualizar(evento) {
            evento.preventDefault();

            if (!receberDados()) {
                return;
            }

            atualizarTarefa(id);

            // Restaura o botão "Cadastrar" e seus eventos originais após a atualização
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
    }, tempo);   // 1 segundo == 1000 milissegundos
}

function atualizarTarefa(id) {
    const titulo = document.querySelector('#titulo').value;
    const descricao = document.querySelector('#descricao').value;

    let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

    // Atualiza os dados da tarefa com o ID correspondente
    tarefas = tarefas.map(tarefa => {
        if (tarefa.id === id) {
            return { ...tarefa, titulo, descricao };
        }
        return tarefa;
    });

    localStorage.setItem('tarefas', JSON.stringify(tarefas));
    listarTarefas();
}
