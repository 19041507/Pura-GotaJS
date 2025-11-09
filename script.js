document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('form-cadastro');

    if (registerForm) {
        registerForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const nomeCompleto = document.getElementById('nome').value.trim();
            const senhaCadastro = document.getElementById('senha').value.trim();

            if (!nomeCompleto || !senhaCadastro) {
                alert('Por favor, preencha o Nome Completo e a Senha para cadastro.');
                return;
            }

            localStorage.setItem('userLogin', nomeCompleto);
            localStorage.setItem('userPass', senhaCadastro);
            
            registerForm.reset();

            alert(`✅ Cadastro realizado! Você pode agora logar com: Usuário: ${nomeCompleto}, Senha: ${senhaCadastro}`);
            window.location.href = '#login'; 
        });
    }

    function fazerLogin(usuario, senha) {
        const storedLogin = localStorage.getItem('userLogin');
        const storedPass = localStorage.getItem('userPass');

        if (!storedLogin) {
            alert('❌ Nenhum usuário cadastrado. Faça o cadastro primeiro!');
            return;
        }

        if (usuario === storedLogin && senha === storedPass) {
            alert(`✅ Login bem-sucedido! Redirecionando para a loja...`);
            window.location.href = 'comprar.html'; 
        } else {
            alert('❌ Credenciais inválidas. Verifique seu nome e senha.');
        }
    }

    const loginForm = document.getElementById('form-login');

    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const loginUser = document.getElementById('login-user').value.trim();
            const loginPass = document.getElementById('login-pass').value.trim(); 
            
            if (!loginUser || !loginPass) {
                alert('Por favor, preencha o login e a senha.');
                return;
            }

            fazerLogin(loginUser, loginPass);
        });
    }
    
    const inputTelefone = document.getElementById('telefone');

    if (inputTelefone) {
        inputTelefone.addEventListener('keydown', function (event) {
            const isNumber = (event.key >= '0' && event.key <= '9');
            const isControl = (event.key === 'Backspace' || event.key === 'Delete' || event.key === 'Tab' || event.key === 'Enter' || event.key.startsWith('Arrow'));
            const isShortcut = (event.ctrlKey || event.metaKey);
            if (!isNumber && !isControl && !isShortcut) {
                event.preventDefault();
            }
        });

        inputTelefone.addEventListener('paste', function (event) {
            const paste = (event.clipboardData || window.clipboardData).getData('text')
            const cleanedPaste = paste.replace(/\D/g, '');
            event.preventDefault();
            this.value = cleanedPaste;
        });

        inputTelefone.addEventListener('input', function (event) {
            let value = event.target.value.replace(/\D/g, '');
            let formattedValue = '';
            
            if (value.length > 0) {
                formattedValue = '(' + value.substring(0, 2);
            }
            if (value.length > 2) {
                formattedValue += ') ';
                formattedValue += value.substring(2, 7); 
            }
            if (value.length > 7) {
                formattedValue += '-';
                formattedValue += value.substring(7, 11);
            }
            event.target.value = formattedValue;
        });
    }
    
    const inputNome = document.getElementById('nome');

    if (inputNome) {
        inputNome.addEventListener('input', function (event) {
            event.target.value = event.target.value.replace(/[^a-zA-ZáàâãéèêíìîóòôõúùûüçÇÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛÜ\s]/g, '');
        });

        inputNome.addEventListener('keydown', function (event) {
            const isAllowedChar = /^[a-zA-ZáàâãéèêíìîóòôõúùûüçÇÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛÜ\s]$/.test(event.key);
            const isControl = (event.key === 'Backspace' || event.key === 'Delete' || event.key === 'Tab' || event.key === 'Enter' || event.key.startsWith('Arrow'));
            const isShortcut = (event.ctrlKey || event.metaKey);
            
            if (!isAllowedChar && !isControl && !isShortcut) {
                event.preventDefault();
            }
        });
        
        inputNome.addEventListener('paste', function (event) {
            const paste = (event.clipboardData || window.clipboardData).getData('text');
            const cleanedPaste = paste.replace(/[^a-zA-ZáàâãéèêíìîóòôõúùûüçÇÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛÜ\s]/g, '');
            event.preventDefault();
            this.value = cleanedPaste;
        });
    }

    const toggleButton = document.createElement('button');
    toggleButton.classList.add('btn', 'btn-toggle-mode');
    toggleButton.style.marginTop = '20px';
    toggleButton.style.width = '100%';

    const loginContainer = document.querySelector('#login .form-container');
            
    if (loginContainer) {
        loginContainer.appendChild(toggleButton);
    }
    
    function applyTheme(isDark) {
        if (isDark) {
            document.body.classList.add('dark-mode');
            toggleButton.textContent = '☀️ Modo Claro';
            toggleButton.style.backgroundColor = '#6c757d'; 
        } else {
            document.body.classList.remove('dark-mode');
            toggleButton.textContent = '🌙 Modo Escuro';
            toggleButton.style.backgroundColor = '#0056b3'; 
        }
    }
    
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark';
    applyTheme(isDark);

    toggleButton.addEventListener('click', function () {
        const isCurrentlyDark = document.body.classList.contains('dark-mode');
        
        if (isCurrentlyDark) {
            applyTheme(false);
            localStorage.setItem('theme', 'light');
        } else {
            applyTheme(true);
            localStorage.setItem('theme', 'dark');
        }
    });
});