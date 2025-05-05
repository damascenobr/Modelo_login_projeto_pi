document.addEventListener('DOMContentLoaded', function () {
  const botaoNovoTopico = document.getElementById('novo-topico');
  const modal = document.getElementById('modal');
  const botaoSalvar = document.getElementById('salvar-topico');
  const botaoCancelar = document.getElementById('cancelar');
  const secaoTopicos = document.getElementById('topicos');
  const inputTitulo = document.getElementById('titulo');
  const inputDescricao = document.getElementById('descricao');

  let respostasPorTopico = {}; // Guarda respostas temporariamente

  function limparCampos() {
    inputTitulo.value = '';
    inputDescricao.value = '';
  }

  function salvarTopicos(topicos) {
    localStorage.setItem('topicos', JSON.stringify(topicos));
  }

  function formatarDataHora(data) {
    const d = new Date(data);
    const horas = String(d.getHours()).padStart(2, '0');
    const minutos = String(d.getMinutes()).padStart(2, '0');
    return `${horas}:${minutos}`;
  }

  function renderizarTopico(titulo, descricao, dataCriacao, index = null) {
    const novoTopico = document.createElement('div');
    novoTopico.classList.add('topico');

    const horaFormatada = formatarDataHora(dataCriacao);

    novoTopico.innerHTML = `
      <h2>${titulo}</h2>
      <p>${descricao}</p>
      <small>Postado às ${horaFormatada}</small>
      <button class="ver-respostas">Ver Respostas</button>
      <div class="chat-respostas" style="display: none; margin-top: 10px;">
        <div class="respostas-lista" style="margin-bottom: 8px;"></div>
        <input type="text" class="resposta-input" placeholder="Digite sua resposta..." style="width: 100%; padding: 6px;">
        <button class="enviar-resposta" style="margin-top: 5px;">Enviar</button>
      </div>
      <button class="excluir-topico">Excluir</button>
    `;

    if (index !== null) {
      novoTopico.dataset.index = index;
    }

    // Botão de excluir
    const botaoExcluir = novoTopico.querySelector('.excluir-topico');
    botaoExcluir.addEventListener('click', function () {
      excluirTopico(novoTopico);
    });

    // Botão ver respostas
    const botaoVer = novoTopico.querySelector('.ver-respostas');
    const areaRespostas = novoTopico.querySelector('.chat-respostas');
    botaoVer.addEventListener('click', () => {
      areaRespostas.style.display = areaRespostas.style.display === 'none' ? 'block' : 'none';
    });

    // Botão enviar resposta
    const inputResposta = novoTopico.querySelector('.resposta-input');
    const botaoEnviar = novoTopico.querySelector('.enviar-resposta');
    const listaRespostas = novoTopico.querySelector('.respostas-lista');

    botaoEnviar.addEventListener('click', () => {
      const texto = inputResposta.value.trim();
      if (texto) {
        const horario = formatarDataHora(new Date());
        const p = document.createElement('p');
        p.textContent = `${texto} — ${horario}`;
        listaRespostas.appendChild(p);
        inputResposta.value = '';

        // Salvar em memória (futuramente salvar no localStorage)
        const id = index !== null ? index : titulo;
        if (!respostasPorTopico[id]) respostasPorTopico[id] = [];
        respostasPorTopico[id].push({ texto, horario });
      }
    });

    secaoTopicos.appendChild(novoTopico);
  }

  function carregarTopicos() {
    secaoTopicos.innerHTML = '';
    const topicosSalvos = JSON.parse(localStorage.getItem('topicos')) || [];
    topicosSalvos.forEach((topico, index) => {
      renderizarTopico(topico.titulo, topico.descricao, topico.dataCriacao, index);
    });
  }

  function excluirTopico(elementoTopico) {
    const index = elementoTopico.dataset.index;
    let topicosSalvos = JSON.parse(localStorage.getItem('topicos')) || [];

    if (index !== undefined) {
      topicosSalvos.splice(index, 1);
      salvarTopicos(topicosSalvos);
    }

    carregarTopicos();
  }

  botaoNovoTopico.addEventListener('click', function () {
    modal.style.display = 'flex';
  });

  botaoCancelar.addEventListener('click', function () {
    modal.style.display = 'none';
    limparCampos();
  });

  botaoSalvar.addEventListener('click', function () {
    const titulo = inputTitulo.value.trim();
    const descricao = inputDescricao.value.trim();

    if (titulo && descricao) {
      const dataCriacao = new Date().toISOString();
      const topicosSalvos = JSON.parse(localStorage.getItem('topicos')) || [];
      topicosSalvos.push({ titulo, descricao, dataCriacao });
      salvarTopicos(topicosSalvos);

      carregarTopicos();
      modal.style.display = 'none';
      limparCampos();
    } else {
      alert('Por favor, preencha todos os campos.');
    }
  });

  carregarTopicos();
});
