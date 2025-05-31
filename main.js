// main.js

// Variáveis globais para gerenciar o script da pétala e sua função de parada
let scriptPetalaAtual = null;
let funcaoDeParadaDaAnimacaoAtual = null;

// Função global para o script da pétala (petala1.js) registrar como ele pode ser parado
window.registrarFuncaoDeParada = function(funcaoDeParada) {
    funcaoDeParadaDaAnimacaoAtual = funcaoDeParada;
    const btnPararPetalasEl = document.getElementById('btnPararPetalas'); // Pega o botão aqui

    if (btnPararPetalasEl) { // Verifica se o botão de parar existe
        if (funcaoDeParada) {
            btnPararPetalasEl.style.display = 'inline-block';
        } else {
            btnPararPetalasEl.style.display = 'none';
        }
    } else {
        // Se o botão não for encontrado, pode ser um problema no HTML ou o ID está errado
        console.warn("Elemento 'btnPararPetalas' não encontrado ao registrar função de parada.");
    }
};

// Espera todo o HTML da página carregar antes de executar o código abaixo
document.addEventListener('DOMContentLoaded', () => {

    // Seleciona os elementos do DOM aqui, DEPOIS que o HTML carregou
    const btnPetala1 = document.getElementById('btnPetala1');
    const btnPararPetalas = document.getElementById('btnPararPetalas');
    const areaDasPetalas = document.getElementById('areaDasPetalas');
    const elementoMensagemDoDia = document.getElementById('mensagemDoDia');
    
    const areaDoVersiculoDiv = document.getElementById('areaDoVersiculo');
    const textoVersiculoEl = document.getElementById('textoVersiculo');
    const referenciaVersiculoEl = document.getElementById('referenciaVersiculo');

    // --- 1. LÓGICA PARA EXIBIR MENSAGEM ROMÂNTICA ALEATÓRIA ---
    if (elementoMensagemDoDia) {
        if (typeof mensagens !== 'undefined' && mensagens.length > 0) {
            const indiceAleatorio = Math.floor(Math.random() * mensagens.length);
            elementoMensagemDoDia.innerHTML = mensagens[indiceAleatorio]; // Use innerHTML se tiver emojis/HTML
        } else {
            elementoMensagemDoDia.textContent = 'Nenhuma mensagem romântica para hoje. Verifique mensagens.js!';
            console.warn('Array de mensagens (do mensagens.js) não encontrado ou está vazio.');
        }
    } else {
        console.error("Elemento #mensagemDoDia não foi encontrado no HTML.");
    }

    // --- 2. LÓGICA PARA BUSCAR E EXIBIR VERSÍCULO BÍBLICO ---
    // !!! ÚNICA ALTERAÇÃO FEITA AQUI: A LISTA DE VERSÍCULOS ABAIXO FOI ATUALIZADA !!!
    const listaDeVersiculosReferencia = [
        "1 Coríntios 13:4",   // Apenas o versículo 4
        "1 João 4:8",         // Apenas o versículo 8
        "Salmos 23:1",
        "Filipenses 4:13",
        "Provérbios 3:5",     // Apenas o versículo 5
        "Romanos 8:39",       // Apenas o versículo 39 (ou 8:38 se preferir)
        "Efésios 4:32",
        "Colossenses 3:14",
        "João 14:27",         // Exemplo adicional de versículo único
        "Salmos 119:105",     // Exemplo adicional
        "1 Pedro 4:8"         // Exemplo adicional
    ];
    // !!! FIM DA ALTERAÇÃO NA LISTA !!!

    async function buscarEMostrarVersiculo() {
        if (!textoVersiculoEl || !referenciaVersiculoEl || !areaDoVersiculoDiv) {
            console.error("Elementos HTML para o versículo não foram encontrados.");
            return;
        }

        const referenciaEscolhida = listaDeVersiculosReferencia[Math.floor(Math.random() * listaDeVersiculosReferencia.length)];
        
        // Formata a referência para a API (substitui espaços por '+')
        const referenciaFormatada = referenciaEscolhida.replace(/ /g, "+");
        const apiUrl = `https://bible-api.com/${referenciaFormatada}?translation=almeida&verse_numbers=true`;

        try {
            areaDoVersiculoDiv.style.display = 'inline-block'; // Mostra a área
            textoVersiculoEl.textContent = 'Buscando inspiração divina...';
            referenciaVersiculoEl.textContent = '';

            const resposta = await fetch(apiUrl);
            if (!resposta.ok) {
                // Se a API retornar um erro, mostra o status para ajudar a depurar
                throw new Error(`Erro na API da Bíblia: ${resposta.status} - ${resposta.statusText}. URL: ${apiUrl}`);
            }
            const dados = await resposta.json();

            if (dados && dados.text && dados.reference) {
                textoVersiculoEl.textContent = dados.text;
                referenciaVersiculoEl.textContent = dados.reference;
            } else {
                // Se a resposta da API não tiver o formato esperado
                throw new Error('Resposta da API da Bíblia em formato inesperado.');
            }
        } catch (erro) {
            console.error("Erro ao buscar versículo:", erro);
            textoVersiculoEl.textContent = "Não foi possível carregar o versículo neste momento.";
            referenciaVersiculoEl.textContent = `Tentativa: ${referenciaEscolhida}`; // Mostra qual versículo tentou buscar
        }
    }

    if (areaDoVersiculoDiv) { // Só tenta buscar se a área do versículo existir no HTML
        buscarEMostrarVersiculo();
    }
    // --- FIM DA LÓGICA DO VERSÍCULO ---


    // --- 3. LÓGICA DOS BOTÕES DE PÉTALAS ---
    function carregarScriptPetala(caminhoDoScript) {
        if (typeof funcaoDeParadaDaAnimacaoAtual === 'function') {
            funcaoDeParadaDaAnimacaoAtual();
            funcaoDeParadaDaAnimacaoAtual = null;
        }
        if (areaDasPetalas) areaDasPetalas.innerHTML = ''; // Limpa pétalas antigas da área

        if (scriptPetalaAtual && scriptPetalaAtual.parentNode) {
            scriptPetalaAtual.parentNode.removeChild(scriptPetalaAtual);
            scriptPetalaAtual = null;
        }

        const novoScript = document.createElement('script');
        novoScript.src = caminhoDoScript;
        novoScript.onload = () => {
            console.log(`Script ${caminhoDoScript} carregado com sucesso.`);
        };
        novoScript.onerror = () => {
            console.error(`ERRO ao carregar o script: ${caminhoDoScript}`);
            window.registrarFuncaoDeParada(null); // Garante que o botão de parar seja escondido
        };
        document.body.appendChild(novoScript);
        scriptPetalaAtual = novoScript;
    }

    function pararTodasAsPetalas() {
        if (typeof funcaoDeParadaDaAnimacaoAtual === 'function') {
            funcaoDeParadaDaAnimacaoAtual();
            funcaoDeParadaDaAnimacaoAtual = null;
        }
        if (areaDasPetalas) areaDasPetalas.innerHTML = '';
        
        const btnParar = document.getElementById('btnPararPetalas'); // Pega o botão aqui para garantir
        if(btnParar) btnParar.style.display = 'none';


        if (scriptPetalaAtual && scriptPetalaAtual.parentNode) {
            scriptPetalaAtual.parentNode.removeChild(scriptPetalaAtual);
            scriptPetalaAtual = null;
        }
        console.log('Animação das pétalas parada e área limpa.');
    }

    // Configura o botão "Revelar Pétalas"
    if (btnPetala1) {
        btnPetala1.addEventListener('click', () => {
            console.log('Botão "Revelar Pétalas" clicado.');
            carregarScriptPetala('petala1.js'); // petala1.js deve ter a lógica das pétalas aleatórias
        });
    } else {
        console.error("Botão #btnPetala1 não foi encontrado no HTML.");
    }

    // Configura o botão "Parar Animação"
    const btnParar = document.getElementById('btnPararPetalas'); // Re-selecionar para garantir
    if (btnParar) {
        btnParar.addEventListener('click', () => {
            pararTodasAsPetalas();
        });
    } else {
        // Não é um erro crítico se o botão de parar não for achado inicialmente,
        // pois ele começa escondido e é mostrado por window.registrarFuncaoDeParada
        // console.info("Botão #btnPararPetalas não encontrado inicialmente (começa escondido).");
    }
    // --- FIM DA LÓGICA DOS BOTÕES DE PÉTALAS ---

});
// --- FIM DO DOMContentLoaded ---