document.getElementById('login-form').addEventListener('submit', function(event) {
    // Impede o envio padrão do formulário
    event.preventDefault();

    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    // Carrega as credenciais do arquivo JSON
    fetch('credentials.json')
        .then(response => response.json())
        .then(credentials => {
            // Verifica se o usuário e a senha correspondem
            if (usernameInput === credentials.username && passwordInput === credentials.password) {
                // Sucesso! Redireciona para o painel de administração
                // (Crie este arquivo no próximo passo)
                window.location.href = 'admin_panel.html';
            } else {
                // Falha no login
                errorMessage.textContent = 'Usuário ou senha inválidos.';
            }
        })
        .catch(error => {
            console.error('Erro ao carregar o arquivo de credenciais:', error);
            errorMessage.textContent = 'Erro no sistema. Tente novamente.';
        });
});