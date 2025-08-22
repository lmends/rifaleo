const APPSCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxJYdyw5uRaVrtRxBzoZGSCr1TkqvVIphz42y101ASc4Zq46ums7Gm0pyECt8RHq7DY/exec';

const numeroInput = document.getElementById('numero_rifa');
const numeroStatus = document.getElementById('numero-status');
const form = document.getElementById('cadastro-form');
const statusMessage = document.getElementById('status-message');
const submitButton = document.getElementById('submit-btn');
const telefoneInput = document.getElementById('telefone');
const clearButton = document.getElementById('clear-btn');

const TOTAL_NUMEROS = 400;
let numerosUsados = [];

clearButton.addEventListener('click', () => {
    form.reset(); // Reseta todos os campos do formulário
    numeroStatus.textContent = ''; // Limpa o status do número
    statusMessage.textContent = ''; // Limpa a mensagem principal
    statusMessage.className = '';
    submitButton.disabled = true; // Desabilita o botão de cadastrar
    document.getElementById('nome').focus(); // Foca no primeiro campo (Nome)
});


function aplicarMascaraTelefone(event) {
    let valor = event.target.value.replace(/\D/g, '').substring(0, 11);
    if (valor.length > 10) {
        valor = valor.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (valor.length > 5) {
        valor = valor.replace(/(\d{2})(\d{4,5})/, '($1) $2-');
    } else if (valor.length > 2) {
        valor = valor.replace(/(\d{2})(\d+)/, '($1) $2');
    } else if (valor.length > 0) {
        valor = valor.replace(/(\d{1,2})/, '($1');
    }
    event.target.value = valor;
}

telefoneInput.addEventListener('input', aplicarMascaraTelefone);

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

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitButton.disabled = true;
    statusMessage.className = '';
    statusMessage.textContent = 'Enviando...';

    const params = new URLSearchParams({
        action: 'write',
        nome: document.getElementById('nome').value,
        telefone: telefoneInput.value.replace(/\D/g, ''),
        email: document.getElementById('email').value,
        data_nascimento: document.getElementById('data_nascimento').value,
        numero_rifa: numeroInput.value
    });
    const urlWrite = `${APPSCRIPT_URL}?${params.toString()}`;

    try {
        const response = await fetch(urlWrite);
        const result = await response.json();
        
        if (result.status === 'success') {
            statusMessage.className = 'status-success';
            statusMessage.textContent = 'Cadastro realizado com sucesso!';
            
            // =====================================================================
            // --- INÍCIO DA NOVA LÓGICA DE RESET INTELIGENTE ---
            // =====================================================================

            // 1. Limpa apenas o campo do número da rifa
            numeroInput.value = '';

            // 2. Limpa a mensagem de status do número (✅/❌)
            numeroStatus.textContent = '';

            // 3. Coloca o foco de volta no campo do número para o próximo cadastro
            numeroInput.focus();
            
            // 4. Bônus: Mantém a mensagem de sucesso por alguns segundos e depois avisa que está pronto
            setTimeout(() => {
                statusMessage.textContent = 'Pronto para o próximo número...';
                statusMessage.className = '';
            }, 2500); // 2.5 segundos

            // 5. Recarrega a lista de números atualizada em segundo plano
            await carregarNumerosUsados();
            
            // =====================================================================
            // --- FIM DA NOVA LÓGICA ---
            // =====================================================================

        } else {
            throw new Error(result.message);
        }

    } catch (error) {
        statusMessage.className = 'status-error';
        statusMessage.textContent = `Erro no cadastro: ${error.message}`;
        console.error('Erro ao enviar:', error);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    submitButton.disabled = true;
    carregarNumerosUsados();
});