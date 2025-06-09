// --- Script para o Carrossel ---
const carousels = {}; // Objeto para armazenar o estado de cada carrossel

function inicializarCarrossel(carrosselId) {
    const carrosselElement = document.getElementById(carrosselId);
    if (!carrosselElement) {
        // console.error(`Elemento do carrossel com ID '${carrosselId}' não encontrado.`);
        return;
    }
    const items = carrosselElement.querySelectorAll('.carrossel-item');
    if (items.length === 0) {
        return;
    }

    carousels[carrosselId] = {
        currentIndex: 0,
        items: items,
        element: carrosselElement,
        totalItems: items.length,
        isAnimating: false // Flag para prevenir múltiplos cliques rápidos
    };

    mostrarSlide(carrosselId, 0, true); // O 'true' é para a primeira inicialização sem transição abrupta
}

function mostrarSlide(carrosselId, index, instant = false) {
    const carouselData = carousels[carrosselId];
    if (!carouselData || carouselData.isAnimating && !instant) return;

    carouselData.isAnimating = true;

    // Lógica para carrossel INFINITO
    if (index >= carouselData.totalItems) {
        carouselData.currentIndex = 0; // Volta para o primeiro
    } else if (index < 0) {
        carouselData.currentIndex = carouselData.totalItems - 1; // Vai para o último
    } else {
        carouselData.currentIndex = index;
    }

    const newTransformValue = -carouselData.currentIndex * 100; // %

    if (instant) {
        carouselData.element.style.transition = 'none'; // Remove transição para mudança instantânea
        carouselData.element.style.transform = `translateX(${newTransformValue}%)`;
        // Força reflow para aplicar a mudança sem transição antes de reativá-la
        void carouselData.element.offsetWidth;
        carouselData.element.style.transition = 'transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
    } else {
        carouselData.element.style.transform = `translateX(${newTransformValue}%)`;
    }
    
    setTimeout(() => {
        carouselData.isAnimating = false;
    }, 500); // Tempo da transição CSS
}

function mudarSlide(carrosselId, direcao) {
    const carouselData = carousels[carrosselId];
    if (!carouselData || carouselData.isAnimating) return;

    const novoIndex = carouselData.currentIndex + direcao;
    mostrarSlide(carrosselId, novoIndex);
}

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa todos os carrosséis da página
    inicializarCarrossel('carrosselFacial');
    inicializarCarrossel('carrosselCorporal');
    inicializarCarrossel('carrosselLabial'); // <-- Linha adicionada

    // Atualiza o ano no rodapé
    const anoAtualSpan = document.getElementById('ano-atual');
    if (anoAtualSpan) {
        anoAtualSpan.textContent = new Date().getFullYear();
    }

    // Adiciona rolagem suave para links de âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const hrefAttribute = this.getAttribute('href');
            if (hrefAttribute && hrefAttribute.length > 1) {
                const targetElement = document.querySelector(hrefAttribute);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});
