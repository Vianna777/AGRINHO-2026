// ============================================
// AGRINHO 2026 - JavaScript Interativo
// ============================================

// ============================================
// 1. CONFIGURAÇÕES E VARIÁVEIS GLOBAIS
// ============================================

// Dados de exemplo para o site (simulando um banco de dados)
const dadosAgrinho = {
    projetos: [
        { id: 1, titulo: "Horta Sustentável", categoria: "agricultura", descricao: "Projeto de horta orgânica com reaproveitamento de água" },
        { id: 2, titulo: "Energia Solar no Campo", categoria: "energia", descricao: "Instalação de placas solares para bombeamento de água" },
        { id: 3, titulo: "Compostagem Comunitária", categoria: "reciclagem", descricao: "Transformação de resíduos orgânicos em adubo" },
        { id: 4, titulo: "Irrigação Inteligente", categoria: "tecnologia", descricao: "Sistema automatizado de irrigação com sensores" },
        { id: 5, titulo: "Agrofloresta Familiar", categoria: "agricultura", descricao: "Cultivo integrado de espécies nativas e produtivas" }
    ],
    noticias: [
        { titulo: "Recorde na safra 2026", data: "26/06/2026", resumo: "Produtividade alcança novos patamares no campo" },
        { titulo: "Tecnologia rural", data: "25/06/2026", resumo: "Startups desenvolvem apps para o agronegócio" },
        { titulo: "Sustentabilidade em foco", data: "24/06/2026", resumo: "Práticas sustentáveis ganham espaço no campo" }
    ],
    usuarios: [
        { nome: "João", cidade: "São Paulo", interesses: "agricultura" },
        { nome: "Maria", cidade: "Paraná", interesses: "tecnologia" },
        { nome: "José", cidade: "Minas Gerais", interesses: "reciclagem" }
    ]
};

// Estado da aplicação
let estadoApp = {
    temaAtual: 'claro',
    projetoSelecionado: null,
    filtroCategoria: 'todos'
};

// ============================================
// 2. FUNÇÕES DE UTILIDADE (Helpers)
// ============================================

// Função para formatar datas
function formatarData(dataString) {
    const partes = dataString.split('/');
    return `${partes[0]}/${partes[1]}/${partes[2]}`;
}

// Função para gerar ID único
function gerarId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Função para validar email
function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Função para debounce (otimizar eventos)
function debounce(func, wait = 300) {
    let timeout;
    return function executar(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// ============================================
// 3. FUNÇÕES DE MANIPULAÇÃO DO DOM
// ============================================

// Função para criar elementos HTML dinamicamente
function criarElemento(tag, classes = [], atributos = {}, conteudo = '') {
    const elemento = document.createElement(tag);
    
    if (classes.length > 0) {
        elemento.classList.add(...classes);
    }
    
    Object.keys(atributos).forEach(chave => {
        elemento.setAttribute(chave, atributos[chave]);
    });
    
    if (conteudo) {
        elemento.innerHTML = conteudo;
    }
    
    return elemento;
}

// Função para adicionar evento com segurança
function adicionarEvento(elemento, evento, funcao) {
    if (elemento) {
        elemento.addEventListener(evento, funcao);
    }
}

// ============================================
// 4. FUNÇÕES DE NEGÓCIO (Core)
// ============================================

// Função para buscar projetos por categoria
function filtrarProjetos(categoria) {
    if (categoria === 'todos') {
        return dadosAgrinho.projetos;
    }
    return dadosAgrinho.projetos.filter(projeto => 
        projeto.categoria === categoria
    );
}

// Função para buscar notícias recentes
function getNoticiasRecentes(quantidade = 3) {
    return dadosAgrinho.noticias.slice(0, quantidade);
}

// Função para cadastrar novo projeto
function cadastrarProjeto(titulo, categoria, descricao) {
    if (!titulo || !categoria || !descricao) {
        throw new Error('Todos os campos são obrigatórios');
    }
    
    const novoProjeto = {
        id: dadosAgrinho.projetos.length + 1,
        titulo: titulo.trim(),
        categoria: categoria.trim().toLowerCase(),
        descricao: descricao.trim()
    };
    
    dadosAgrinho.projetos.push(novoProjeto);
    return novoProjeto;
}

// Função para alternar tema (claro/escuro)
function alternarTema() {
    const body = document.body;
    const temaAtual = estadoApp.temaAtual;
    
    if (temaAtual === 'claro') {
        body.classList.add('tema-escuro');
        body.classList.remove('tema-claro');
        estadoApp.temaAtual = 'escuro';
        localStorage.setItem('tema', 'escuro');
    } else {
        body.classList.add('tema-claro');
        body.classList.remove('tema-escuro');
        estadoApp.temaAtual = 'claro';
        localStorage.setItem('tema', 'claro');
    }
}

// Função para salvar preferências do usuário
function salvarPreferencias(nome, cidade, interesses) {
    const usuario = {
        nome: nome.trim(),
        cidade: cidade.trim(),
        interesses: interesses.trim().toLowerCase()
    };
    
    dadosAgrinho.usuarios.push(usuario);
    localStorage.setItem('usuario_preferencias', JSON.stringify(usuario));
    return usuario;
}

// ============================================
// 5. FUNÇÕES DE INTERFACE (UI)
// ============================================

// Função para renderizar projetos na página
function renderizarProjetos(categoria = 'todos') {
    const container = document.getElementById('projetos-container');
    if (!container) return;
    
    const projetosFiltrados = filtrarProjetos(categoria);
    
    container.innerHTML = '';
    
    if (projetosFiltrados.length === 0) {
        container.innerHTML = '<p class="mensagem-vazia">Nenhum projeto encontrado nesta categoria.</p>';
        return;
    }
    
    projetosFiltrados.forEach(projeto => {
        const card = criarElemento('div', ['projeto-card'], {
            'data-id': projeto.id
        });
        
        card.innerHTML = `
            <h3>${projeto.titulo}</h3>
            <span class="categoria-badge">${projeto.categoria}</span>
            <p>${projeto.descricao}</p>
            <button class="btn-detalhes" data-id="${projeto.id}">Ver detalhes</button>
        `;
        
        container.appendChild(card);
    });
    
    // Adicionar eventos aos botões de detalhes
    document.querySelectorAll('.btn-detalhes').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            mostrarDetalhesProjeto(id);
        });
    });
}

// Função para mostrar detalhes do projeto
function mostrarDetalhesProjeto(id) {
    const projeto = dadosAgrinho.projetos.find(p => p.id === id);
    if (!projeto) {
        alert('Projeto não encontrado!');
        return;
    }
    
    const modal = document.getElementById('modal-detalhes');
    if (modal) {
        document.getElementById('modal-titulo').textContent = projeto.titulo;
        document.getElementById('modal-categoria').textContent = `Categoria: ${projeto.categoria}`;
        document.getElementById('modal-descricao').textContent = projeto.descricao;
        modal.style.display = 'block';
    }
}

// Função para renderizar notícias
function renderizarNoticias() {
    const container = document.getElementById('noticias-container');
    if (!container) return;
    
    const noticias = getNoticiasRecentes(3);
    
    container.innerHTML = '';
    
    noticias.forEach(noticia => {
        const item = criarElemento('div', ['noticia-item']);
        item.innerHTML = `
            <h4>${noticia.titulo}</h4>
            <span class="noticia-data">${formatarData(noticia.data)}</span>
            <p>${noticia.resumo}</p>
        `;
        container.appendChild(item);
    });
}

// Função para validar formulário de contato
function validarFormularioContato(event) {
    event.preventDefault();
    
    const nome = document.getElementById('nome-contato')?.value;
    const email = document.getElementById('email-contato')?.value;
    const mensagem = document.getElementById('mensagem-contato')?.value;
    
    // Validações
    if (!nome || nome.trim().length < 3) {
        alert('Por favor, informe seu nome completo (mínimo 3 caracteres)');
        return false;
    }
    
    if (!email || !validarEmail(email)) {
        alert('Por favor, informe um e-mail válido');
        return false;
    }
    
    if (!mensagem || mensagem.trim().length < 10) {
        alert('Por favor, escreva uma mensagem com pelo menos 10 caracteres');
        return false;
    }
    
    // Simular envio
    console.log('Formulário enviado:', { nome, email, mensagem });
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    
    // Limpar formulário
    document.getElementById('form-contato')?.reset();
    return true;
}

// ============================================
// 6. FUNÇÕES DE ANIMAÇÃO E INTERATIVIDADE
// ============================================

// Função para animar elementos ao scroll
function animarAoScroll() {
    const elementos = document.querySelectorAll('.animar-ao-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animado');
            }
        });
    }, { threshold: 0.1 });
    
    elementos.forEach(elemento => {
        observer.observe(elemento);
    });
}

// Função para toggle de menu mobile
function toggleMenuMobile() {
    const menu = document.getElementById('menu-mobile');
    const overlay = document.getElementById('overlay-mobile');
    
    if (menu) {
        menu.classList.toggle('ativo');
        if (overlay) {
            overlay.classList.toggle('ativo');
        }
        document.body.classList.toggle('menu-aberto');
    }
}

// Função para fechar modal
function fecharModal() {
    const modal = document.getElementById('modal-detalhes');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ============================================
// 7. FUNÇÃO DE INICIALIZAÇÃO
// ============================================

// Função principal que inicia o site
function inicializarSite() {
    console.log('🌱 AGRINHO 2026 - Site Inicializado');
    
    // Carregar tema salvo
    const temaSalvo = localStorage.getItem('tema');
    if (temaSalvo) {
        estadoApp.temaAtual = temaSalvo;
        document.body.classList.add(`tema-${temaSalvo}`);
    } else {
        document.body.classList.add('tema-claro');
    }
    
    // Renderizar conteúdo inicial
    renderizarProjetos('todos');
    renderizarNoticias();
    
    // Configurar eventos principais
    // Evento do botão tema
    const btnTema = document.getElementById('btn-alternar-tema');
    if (btnTema) {
        btnTema.addEventListener('click', alternarTema);
    }
    
    // Evento do menu mobile
    const btnMenu = document.getElementById('btn-menu-mobile');
    if (btnMenu) {
        btnMenu.addEventListener('click', toggleMenuMobile);
    }
    
    // Evento para fechar menu ao clicar fora
    const overlay = document.getElementById('overlay-mobile');
    if (overlay) {
        overlay.addEventListener('click', toggleMenuMobile);
    }
    
    // Evento para fechar modal
    const btnFecharModal = document.querySelector('.btn-fechar-modal');
    if (btnFecharModal) {
        btnFecharModal.addEventListener('click', fecharModal);
    }
    
    // Fechar modal ao clicar fora
    const modal = document.getElementById('modal-detalhes');
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === this) {
                fecharModal();
            }
        });
    }
    
    // Evento do formulário de contato
    const formContato = document.getElementById('form-contato');
    if (formContato) {
        formContato.addEventListener('submit', validarFormularioContato);
    }
    
    // Filtro de projetos
    const filtroCategoria = document.getElementById('filtro-categoria');
    if (filtroCategoria) {
        filtroCategoria.addEventListener('change', function() {
            renderizarProjetos(this.value);
        });
    }
    
    // Iniciar animações
    animarAoScroll();
    
    // Verificar se há preferências do usuário salvas
    const preferenciasSalvas = localStorage.getItem('usuario_preferencias');
    if (preferenciasSalvas) {
        try {
            const dados = JSON.parse(preferenciasSalvas);
            console.log('👤 Preferências do usuário carregadas:', dados);
        } catch (e) {
            console.warn('Erro ao carregar preferências:', e);
        }
    }
    
    console.log('✅ Site AGRINHO 2026 pronto para uso!');
}

// ============================================
// 8. EXPORTAÇÃO (para módulos ou uso global)
// ============================================

// Exportar funções para uso global (se necessário)
window.AgriApp = {
    inicializar: inicializarSite,
    dados: dadosAgrinho,
    estado: estadoApp,
    funcoes: {
        filtrarProjetos,
        cadastrarProjeto,
        alternarTema,
        salvarPreferencias,
        renderizarProjetos,
        validarEmail
    }
};

// ============================================
// 9. INICIALIZAÇÃO AUTOMÁTICA
// ============================================

// Aguarda o DOM carregar completamente
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarSite);
} else {
    // DOM já carregado
    inicializarSite();
}

// ============================================
// 10. FUNÇÕES DE TESTE (opcional)
// ============================================

// Função para testar a aplicação (pode ser removida em produção)
function testarAplicacao() {
    console.log('🧪 Testando Aplicação AGRINHO 2026...');
    
    // Testar filtro
    const projetosAgricultura = filtrarProjetos('agricultura');
    console.log('Projetos de agricultura:', projetosAgricultura);
    
    // Testar cadastro
    try {
        const novo = cadastrarProjeto(
            'Teste Automatizado',
            'tecnologia',
            'Projeto de teste criado pelo sistema'
        );
        console.log('Novo projeto cadastrado:', novo);
    } catch (error) {
        console.error('Erro ao cadastrar:', error.message);
    }
    
    // Testar validação de email
    console.log('Email válido (teste@email.com):', validarEmail('teste@email.com'));
    console.log('Email inválido (teste@):', validarEmail('teste@'));
    
    console.log('✅ Testes concluídos!');
}

// Descomente a linha abaixo para executar testes automáticos
// testarAplicacao();

// ============================================
// FIM DO ARQUIVO
// ============================================
