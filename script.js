/* ================================================
   SCRIPT PRINCIPAL — Portfólio Brendon Silva
   ================================================
   1. Menu dropdown centralizado (estilo original)
   2. Destaque do item ativo no menu (Intersection Observer)
   3. Tema claro / escuro (persiste no localStorage)
   4. Popup do projeto original (botão '!')
   5. Validação e simulação de envio do formulário
   6. Modal de confirmação de envio
   ================================================ */


/* ---- 1. MENU DROPDOWN ---- */

const menuBtn      = document.getElementById('menuBtn');
const menuDropdown = document.getElementById('menuDropdown');

// Alterna o dropdown ao clicar no botão "Menu ▾"
menuBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const aberto = menuDropdown.classList.toggle('aberto');
  menuBtn.setAttribute('aria-expanded', aberto);
});

// Fecha o dropdown ao clicar fora dele
document.addEventListener('click', (e) => {
  if (!menuBtn.contains(e.target)) {
    menuDropdown.classList.remove('aberto');
    menuBtn.setAttribute('aria-expanded', false);
  }
});

// Fecha o dropdown ao clicar em qualquer link de navegação
document.querySelectorAll('.nav-item').forEach(link => {
  link.addEventListener('click', () => {
    menuDropdown.classList.remove('aberto');
    menuBtn.setAttribute('aria-expanded', false);
  });
});


/* ---- 2. ITEM ATIVO NO MENU (Intersection Observer) ---- */

// Marca o link do menu correspondente à seção visível na tela
const secoes = document.querySelectorAll('section[id]');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.nav-item').forEach(l => l.classList.remove('ativo'));
        const linkAtivo = document.querySelector(`.nav-item[href="#${entry.target.id}"]`);
        if (linkAtivo) linkAtivo.classList.add('ativo');
      }
    });
  },
  { threshold: 0.3 }
);

secoes.forEach(s => observer.observe(s));


/* ---- 3. TEMA CLARO / ESCURO ---- */

const themeToggle = document.getElementById('themeToggle');
const themeIcon   = themeToggle.querySelector('.theme-icon');

// Restaura a preferência salva no localStorage
if (localStorage.getItem('tema') === 'light') {
  document.body.classList.add('light');
  themeIcon.textContent = '🌙';
}

themeToggle.addEventListener('click', () => {
  const isLight = document.body.classList.toggle('light');
  themeIcon.textContent = isLight ? '🌙' : '☀️';
  localStorage.setItem('tema', isLight ? 'light' : 'dark');
});


/* ---- 4. POPUP DO PROJETO ORIGINAL ---- */

const btnOriginal   = document.getElementById('btnOriginal');
const popupOriginal = document.getElementById('popupOriginal');

btnOriginal.addEventListener('click', (e) => {
  e.stopPropagation();
  popupOriginal.classList.toggle('visivel');
});

// Fecha ao clicar fora do popup
document.addEventListener('click', (e) => {
  if (!popupOriginal.contains(e.target) && e.target !== btnOriginal) {
    popupOriginal.classList.remove('visivel');
  }
});


/* ---- 5. VALIDAÇÃO DO FORMULÁRIO DE CONTATO ---- */

const form         = document.getElementById('contatoForm');
const campoNome    = document.getElementById('nome');
const campoEmail   = document.getElementById('email');
const campoMsg     = document.getElementById('mensagem');
const erroNome     = document.getElementById('erroNome');
const erroEmail    = document.getElementById('erroEmail');
const erroMensagem = document.getElementById('erroMensagem');

// Regex para validar formato de e-mail
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function mostrarErro(campo, erroEl, msg) {
  erroEl.textContent = msg;
  campo.classList.add('invalido');
}

function limparErro(campo, erroEl) {
  erroEl.textContent = '';
  campo.classList.remove('invalido');
}

// Validação em tempo real (limpa o erro conforme o usuário corrige)
campoNome.addEventListener('input',  () => { if (campoNome.value.trim())                     limparErro(campoNome,  erroNome); });
campoEmail.addEventListener('input', () => { if (regexEmail.test(campoEmail.value.trim()))   limparErro(campoEmail, erroEmail); });
campoMsg.addEventListener('input',   () => { if (campoMsg.value.trim())                      limparErro(campoMsg,   erroMensagem); });

// Validação completa no momento do envio
form.addEventListener('submit', (e) => {
  e.preventDefault();
  let valido = true;

  if (!campoNome.value.trim()) {
    mostrarErro(campoNome, erroNome, 'Por favor, informe seu nome.');
    valido = false;
  } else {
    limparErro(campoNome, erroNome);
  }

  if (!campoEmail.value.trim()) {
    mostrarErro(campoEmail, erroEmail, 'Por favor, informe seu e-mail.');
    valido = false;
  } else if (!regexEmail.test(campoEmail.value.trim())) {
    mostrarErro(campoEmail, erroEmail, 'Informe um e-mail válido (ex: usuario@dominio.com).');
    valido = false;
  } else {
    limparErro(campoEmail, erroEmail);
  }

  if (!campoMsg.value.trim()) {
    mostrarErro(campoMsg, erroMensagem, 'Por favor, escreva sua mensagem.');
    valido = false;
  } else {
    limparErro(campoMsg, erroMensagem);
  }

  if (valido) {
    form.reset();
    abrirModal();
  }
});


/* ---- 6. MODAL DE CONFIRMAÇÃO ---- */

const modal        = document.getElementById('modalSucesso');
const modalOverlay = document.getElementById('modalOverlay');
const modalFechar  = document.getElementById('modalFechar');

function abrirModal() {
  modal.style.display = modalOverlay.style.display = 'block';
  requestAnimationFrame(() => {
    modal.classList.add('aberto');
    modalOverlay.classList.add('aberto');
  });
}

function fecharModal() {
  modal.classList.remove('aberto');
  modalOverlay.classList.remove('aberto');
  setTimeout(() => {
    modal.style.display = modalOverlay.style.display = 'none';
  }, 300);
}

modalFechar.addEventListener('click', fecharModal);
modalOverlay.addEventListener('click', fecharModal);

// Fecha modal, popup e menu com Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    fecharModal();
    popupOriginal.classList.remove('visivel');
    menuDropdown.classList.remove('aberto');
    menuBtn.setAttribute('aria-expanded', false);
  }
});
