const APPSCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxZGzIYm5hfmE0YfzDStsVCgPmp8BUZBjDCSbRS0uooHmbk_nhfzC6hloKAu2efaERx/exec'; // Cole a URL do seu deploy aqui

const numeroInput = document.getElementById('numero_rifa');
const numeroStatus = document.getElementById('numero-status');
const form = document.getElementById('cadastro-form');
const statusMessage = document.getElementById('status-message');
const submitButton = document.getElementById('submit-btn');

const TOTAL_NUMEROS = 400;
let numerosUsados = [];

// 1. FUNÇÃO DE CARREGAMENTO (agora especifica a ação de leitura)
async function carregarNumerosUsados() {
    statusMessage.textContent = 'Verificando números...';
    try {
        const urlRead = `${APPSCRIPT_URL}?action=read`;
        const response = await fetch(urlRead);
        numerosUsados = await response.json();
        statusMessage.textContent = 'Sistema pronto.';
        setTimeout(() => statusMessage.textContent = '', 2000);
    } catch (error) {
        statusMessage.className = 'status-error';
        statusMessage.textContent = 'Erro ao conectar com a planilha.';
        console.error('Erro:', error);
    }
}

// 2. LÓGICA DE VERIFICAÇÃO EM TEMPO REAL (sem alterações)
numeroInput.addEventListener('input', () => {
    const numero = parseInt(numeroInput.value, 10);
    statusMessage.className = '';
    if (!numero) {
        numeroStatus.textContent = '';
        submitButton.disabled = true;
        return;
    }
    if (numero < 1 || numero > TOTAL_NUMEROS) {
        numeroStatus.textContent = '❌ Inválido';
        numeroStatus.style.color = '#dc3545';
        submitButton.disabled = true;
    } else if (numerosUsados.includes(numero)) {
        numeroStatus.textContent = '❌ Ocupado';
        numeroStatus.style.color = '#dc3545';
        submitButton.disabled = true;
    } else {
        numeroStatus.textContent = '✅ Disponível';
        numeroStatus.style.color = '#28a745';
        submitButton.disabled = false;
    }
});

// 3. LÓGICA DE SUBMISSÃO (agora usando GET com parâmetros na URL)
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitButton.disabled = true;
    statusMessage.className = '';
    statusMessage.textContent = 'Enviando...';

    // Monta a URL com todos os dados do formulário
    const params = new URLSearchParams({
        action: 'write',
        nome: document.getElementById('nome').value,
        telefone: document.getElementById('telefone').value,
        email: document.getElementById('email').value,
        data_nascimento: document.getElementById('data_nascimento').value,
        numero_rifa: numeroInput.value
    });
    const urlWrite = `${APPSCRIPT_URL}?${params.toString()}`;

    try {
        // A requisição agora é um simples GET
        const response = await fetch(urlWrite);
        const result = await response.json();
        
        if (result.status === 'success') {
            statusMessage.className = 'status-success';
            statusMessage.textContent = 'Cadastro realizado com sucesso!';
            form.reset();
            numeroStatus.textContent = '';
            await carregarNumerosUsados();
        } else {
            throw new Error(result.message);
        }

    } catch (error) {
        statusMessage.className = 'status-error';
        statusMessage.textContent = `Erro no cadastro: ${error.message}`;
        console.error('Erro ao enviar:', error);
    }
});

// CARREGAMENTO INICIAL
document.addEventListener('DOMContentLoaded', () => {
    submitButton.disabled = true;
    carregarNumerosUsados();
});