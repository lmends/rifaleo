// Cole a NOVA URL do seu deploy aqui
const APPSCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx5Q23tPkJ36Kdv-iYrnajV03LN3fQfJZzX84p-SF_NNRi4PEp5lg4FO6KRhfSQ3o5v/exec';

// --- Elementos do DOM ---
const modal = document.getElementById('modal-consulta');
const btnAbrirModal = document.querySelector('.btn-consultar');
const btnFecharModal = document.getElementById('modal-close-btn');
const formConsulta = document.getElementById('form-consulta');
const resultadoDiv = document.getElementById('resultado-consulta');
const btnBuscar = document.getElementById('btn-buscar');

// --- Funções para controlar o Modal ---
function abrirModal(e) {
    e.preventDefault(); // Impede o link de navegar
    modal.style.display = 'flex';
}

function fecharModal() {
    modal.style.display = 'none';
}

// --- Event Listeners ---
btnAbrirModal.addEventListener('click', abrirModal);
btnFecharModal.addEventListener('click', fecharModal);
// Fecha o modal se clicar fora da caixa de conteúdo
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        fecharModal();
    }
});

// --- Lógica da Consulta ---
formConsulta.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('consulta-email').value;
    const dataNasc = document.getElementById('consulta-nascimento').value;

    btnBuscar.textContent = 'Buscando...';
    btnBuscar.disabled = true;
    resultadoDiv.innerHTML = '';

    // Monta a URL de consulta
    const params = new URLSearchParams({
        action: 'consult',
        email: email,
        data_nascimento: dataNasc
    });
    const urlConsulta = `${APPSCRIPT_URL}?${params.toString()}`;

    try {
        const response = await fetch(urlConsulta);
        const numeros = await response.json();

        if (numeros.length > 0) {
            resultadoDiv.innerHTML = `<p>Seus números da sorte são:</p><h3>${numeros.join(', ')}</h3>`;
        } else {
            resultadoDiv.innerHTML = `<p>Nenhum número encontrado para os dados informados. Verifique se digitou tudo corretamente.</p>`;
        }

    } catch (error) {
        resultadoDiv.innerHTML = `<p style="color: red;">Ocorreu um erro ao buscar. Tente novamente.</p>`;
        console.error('Erro na consulta:', error);
    } finally {
        btnBuscar.textContent = 'Buscar';
        btnBuscar.disabled = false;
    }
});