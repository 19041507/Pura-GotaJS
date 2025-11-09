document.addEventListener('DOMContentLoaded', () => {
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }

    if (!localStorage.getItem('userLogin')) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = 'index.html'; 
        return;
    }

    const produtos = [
        { id: 1, nome: "Garrafão 20L", preco: 15.00, svg: 'garrafao' },
        { id: 2, nome: "Fardo Água S/ Gás (12x500ml)", preco: 18.50, svg: 'fardo-sem-gas' },
        { id: 3, nome: "Fardo Água C/ Gás (6x1.5L)", preco: 25.90, svg: 'fardo-com-gas' }
    ];

    const svgMap = {
        'garrafao': `
            <svg class="product-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C9.79086 2 8 3.79086 8 6V18C8 20.2091 9.79086 22 12 22C14.2091 22 16 20.2091 16 18V6C16 3.79086 14.2091 2 12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M11 6H13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10 2L14 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `,
        'fardo-sem-gas': `
            <svg class="product-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `,
        'fardo-com-gas': `
            <svg class="product-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="6" cy="16" r="1" fill="currentColor"/>
                <circle cx="18" cy="8" r="1" fill="currentColor"/>
                <circle cx="10" cy="8" r="1" fill="currentColor"/>
            </svg>
        `
    };


    const listaProdutos = document.getElementById('lista-produtos');
    const contadorCarrinho = document.getElementById('contador-carrinho');
    const modalCarrinho = document.getElementById('modal-carrinho');
    const itensCarrinhoUl = document.getElementById('itens-carrinho');
    const carrinhoTotalSpan = document.getElementById('carrinho-total');
    const finalizarCompraBtn = document.getElementById('finalizar-compra');

    let carrinho = JSON.parse(localStorage.getItem('carrinhoPuraGota')) || [];
    

    function salvarCarrinho() {
        localStorage.setItem('carrinhoPuraGota', JSON.stringify(carrinho));
    }

    function atualizarContador() {
        const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
        contadorCarrinho.textContent = totalItens;
    }

    function renderizarCarrinho() {
        itensCarrinhoUl.innerHTML = '';
        let total = 0;

        if (carrinho.length === 0) {
            itensCarrinhoUl.innerHTML = '<li>O carrinho está vazio.</li>';
            finalizarCompraBtn.disabled = true;
        } else {
            finalizarCompraBtn.disabled = false;
            carrinho.forEach(item => {
                const li = document.createElement('li');
                const precoUnitario = item.preco.toFixed(2).replace('.', ',');
                const subTotal = (item.preco * item.quantidade).toFixed(2).replace('.', ',');
                
                li.innerHTML = `
                    ${item.nome} (${item.quantidade}x) - R$ ${precoUnitario} 
                    <button class="remover-item" data-id="${item.id}">Remover</button>
                    <span class="sub-total">Subtotal: R$ ${subTotal}</span>
                `;
                itensCarrinhoUl.appendChild(li);
                total += item.preco * item.quantidade;
            });
        }
        carrinhoTotalSpan.textContent = total.toFixed(2).replace('.', ',');
        atualizarContador();
        salvarCarrinho();
    }

    function adicionarAoCarrinho(produtoId) {
        const produto = produtos.find(p => p.id === produtoId);
        if (!produto) return;

        const itemExistente = carrinho.find(item => item.id === produtoId);

        if (itemExistente) {
            itemExistente.quantidade++;
        } else {
            carrinho.push({ ...produto, quantidade: 1 });
        }

        alert(`${produto.nome} adicionado ao carrinho!`);
        renderizarCarrinho();
    }

    function removerDoCarrinho(produtoId) {
        carrinho = carrinho.filter(item => item.id !== produtoId);
        renderizarCarrinho();
    }

    function renderizarProdutos() {
        produtos.forEach(produto => {
            const divProduto = document.createElement('div');
            divProduto.className = 'produto-card';
            
            const produtoSvg = svgMap[produto.svg] || ''; 
            
            divProduto.innerHTML = `
                ${produtoSvg} 
                <h4>${produto.nome}</h4>
                <p>R$ ${produto.preco.toFixed(2).replace('.', ',')}</p>
                <button class="adicionar-carrinho" data-id="${produto.id}">
                    Adicionar ao Carrinho
                </button>
            `;
            listaProdutos.appendChild(divProduto);
        });

        document.querySelectorAll('.adicionar-carrinho').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                adicionarAoCarrinho(id);
            });
        });
    }

    document.getElementById('ver-carrinho').addEventListener('click', () => {
        modalCarrinho.style.display = 'block';
    });

    document.querySelector('.close-button').addEventListener('click', () => {
        modalCarrinho.style.display = 'none';
    });
    
    document.getElementById('fechar-carrinho').addEventListener('click', () => {
        modalCarrinho.style.display = 'none';
    });

    document.getElementById('itens-carrinho').addEventListener('click', (e) => {
        if (e.target.classList.contains('remover-item')) {
            const id = parseInt(e.target.dataset.id);
            removerDoCarrinho(id);
        }
    });
    
    finalizarCompraBtn.addEventListener('click', () => {
        const total = carrinhoTotalSpan.textContent;
        alert(`
            ✅ Pedido Finalizado com sucesso!
            Total a Pagar: R$ ${total}

            Seu pedido será enviado para o endereço cadastrado.
        `);
        
        carrinho = [];
        renderizarCarrinho();
        modalCarrinho.style.display = 'none';
    });

    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('userLogin');
        localStorage.removeItem('userPass');
        localStorage.removeItem('carrinhoPuraGota');
        alert('Sessão encerrada com sucesso.');
        window.location.href = 'index.html';
    });

    renderizarProdutos();
    renderizarCarrinho(); 
});