// petala1.js
(function() {
    // IIFE para não poluir o escopo global desnecessariamente

    const areaDasPetalas = document.getElementById('areaDasPetalas');
    
    // LISTA COM TODAS AS SUAS IMAGENS DE PÉTALAS DISPONÍVEIS
    const todasAsImagensDePetalas = [
      'img/petala1C.png',  
      'img/petala1.png',
        'img/petala1A.png',
        'img/petala1B.png'
        // Se você tiver variações como 'petala1.1.png', 'petala2.1.png', adicione-as aqui também.
        // Exemplo:
        // 'img/petala1.1.png',
        // 'img/petala1.2.png',
        // 'img/petala2.1.png',
        // etc.
    ];

    let intervaloDeCriacao = null;

    if (!areaDasPetalas) {
        console.error('Elemento #areaDasPetalas não encontrado para petala1.js!');
        if (typeof window.registrarFuncaoDeParada === 'function') {
            window.registrarFuncaoDeParada(null);
        }
        return;
    }

    if (todasAsImagensDePetalas.length === 0) {
        console.error('Nenhuma imagem de pétala definida na lista em petala1.js!');
        if (typeof window.registrarFuncaoDeParada === 'function') {
            window.registrarFuncaoDeParada(null);
        }
        return;
    }

    function criarPetala() {
        const petalaEl = document.createElement('img');

        // *** ESCOLHE UMA IMAGEM ALEATORIAMENTE DA LISTA ***
        const imagemAleatoriaSrc = todasAsImagensDePetalas[Math.floor(Math.random() * todasAsImagensDePetalas.length)];
        petalaEl.src = imagemAleatoriaSrc;
        // *** FIM DA ESCOLHA ALEATÓRIA ***

        petalaEl.classList.add('petala-animada');

        // Posição horizontal aleatória
        petalaEl.style.left = Math.random() * window.innerWidth + 'px';

        // Duração e delay aleatórios para a animação
        const duracao = Math.random() * 4 + 5; // Duração entre 5s e 9s (ajustado da sugestão anterior)
        const delay = Math.random() * 1.5;    // Delay de até 1.5s (um pouco menos que antes)

        petalaEl.style.animationName = 'animacaoCair'; // Nome da animação definida no CSS
        petalaEl.style.animationDuration = duracao + 's';
        petalaEl.style.animationDelay = delay + 's';
        
        // Adiciona uma pequena variação na rotação inicial e escala para mais naturalidade
        const escalaInicial = 0.8 + Math.random() * 0.4; // Escala entre 0.8 e 1.2
        const rotacaoInicial = Math.random() * 360;    // Rotação inicial de 0 a 360 graus
        petalaEl.style.transform = `scale(${escalaInicial}) rotate(${rotacaoInicial}deg)`;


        areaDasPetalas.appendChild(petalaEl);

        petalaEl.addEventListener('animationend', () => {
            if (petalaEl.parentNode) {
                petalaEl.parentNode.removeChild(petalaEl);
            }
        });
    }

    function pararAnimacaoPetala1() {
        clearInterval(intervaloDeCriacao);
        intervaloDeCriacao = null;
        console.log('Animação de pétalas aleatórias (petala1.js) parada.');
    }

    intervaloDeCriacao = setInterval(criarPetala, 350); // Cria uma nova pétala um pouco mais rápido: a cada 350ms

    if (typeof window.registrarFuncaoDeParada === 'function') {
        window.registrarFuncaoDeParada(pararAnimacaoPetala1);
    } else {
        console.warn('Função window.registrarFuncaoDeParada não encontrada no main.js.');
    }

    console.log('petala1.js executado e animação de pétalas aleatórias iniciada.');

})();