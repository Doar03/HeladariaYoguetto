// Carrusel automático de productos
document.addEventListener('DOMContentLoaded', function() {
    console.log('Cargando carrusel...');
    
    // Elementos del carrusel
    const carouselTrack = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const indicatorsContainer = document.querySelector('.carousel-indicators');
    
    // Verificar que los elementos existan
    if (!carouselTrack || !slides.length) {
        console.error('Error: Elementos del carrusel no encontrados');
        return;
    }
    
    console.log('Slides encontrados:', slides.length);
    
    let currentSlide = 0;
    let autoPlayInterval;
    let isPlaying = true;
    const slideInterval = 4000; // 4 segundos 
    
    // Crear indicadores
    function createIndicators() {
        if (!indicatorsContainer) return;
        
        indicatorsContainer.innerHTML = '';
        
        slides.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.classList.add('carousel-indicator');
            if (index === 0) indicator.classList.add('active');
            
            indicator.addEventListener('click', () => {
                goToSlide(index);
                resetAutoPlay();
            });
            
            indicatorsContainer.appendChild(indicator);
        });
    }
    
    //  indicadores
    function updateIndicators() {
        const indicators = document.querySelectorAll('.carousel-indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.remove('active');
            if (index === currentSlide) {
                indicator.classList.add('active');
            }
        });
    }
    
    // Ir a slide específico
    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        const translateX = -currentSlide * 100;
        carouselTrack.style.transform = `translateX(${translateX}%)`;
        updateIndicators();
        console.log('Cambiando a slide:', currentSlide);
    }
    
    // Slide siguiente
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        goToSlide(currentSlide);
    }
    
    // Slide anterior
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(currentSlide);
    }
    
    // Iniciar reproducción automática
    function startAutoPlay() {
        if (isPlaying) return;
        
        console.log('Iniciando reproducción automática');
        autoPlayInterval = setInterval(nextSlide, slideInterval);
        isPlaying = true;
        updatePlayButtons();
    }
    
    // Pausar reproducción aut
    function pauseAutoPlay() {
        if (!isPlaying) return;
        
        console.log('Pausando reproducción automática');
        clearInterval(autoPlayInterval);
        isPlaying = false;
        updatePlayButtons();
    }
    
    // Reiniciar reproducción 
    function resetAutoPlay() {
        pauseAutoPlay();
        setTimeout(startAutoPlay, slideInterval);
    }
    
    // Actualizar botones de reproducción
    function updatePlayButtons() {
        const playBtn = document.querySelector('.play-btn');
        const pauseBtn = document.querySelector('.pause-btn');
        
        if (playBtn && pauseBtn) {
            if (isPlaying) {
                playBtn.style.display = 'none';
                pauseBtn.style.display = 'flex';
            } else {
                playBtn.style.display = 'flex';
                pauseBtn.style.display = 'none';
            }
        }
    }
    
    // Inicializar carrusel
    function initCarousel() {
        console.log('Inicializando carrusel...');
        
        createIndicators();
        goToSlide(0);
        startAutoPlay();
        
        // Botones de navegación
        const prevBtn = document.querySelector('.carousel-nav-btn.prev');
        const nextBtn = document.querySelector('.carousel-nav-btn.next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetAutoPlay();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetAutoPlay();
            });
        }
        
        // Botones de control de reproducción
        const playBtn = document.querySelector('.play-btn');
        const pauseBtn = document.querySelector('.pause-btn');
        
        if (playBtn) {
            playBtn.addEventListener('click', startAutoPlay);
        }
        
        if (pauseBtn) {
            pauseBtn.addEventListener('click', pauseAutoPlay);
        }
        
        // Pausar al pasar el mouse
        const carouselContainer = document.querySelector('.carousel-auto-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', pauseAutoPlay);
            carouselContainer.addEventListener('mouseleave', () => {
                if (!isPlaying) startAutoPlay();
            });
        }
        
        // Swipe para móviles
        let startX = 0;
        let endX = 0;
        let isDragging = false;
        
        carouselTrack.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            pauseAutoPlay();
        }, { passive: true });
        
        carouselTrack.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            endX = e.touches[0].clientX;
        }, { passive: true });
        
        carouselTrack.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            
            const threshold = 50;
            const diff = startX - endX;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
            
            // Reanudar después de un tiempo
            setTimeout(() => {
                if (!isPlaying) startAutoPlay();
            }, 3000);
        }, { passive: true });
        
        console.log('Carrusel inicializado correctamente');
    }
    
    // Inicializar carrusel
    initCarousel();
    
    // Navegación suave
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Actualizar año en footer
    const currentYear = new Date().getFullYear();
    const yearElements = document.querySelectorAll('.current-year');
    yearElements.forEach(el => {
        el.textContent = currentYear;
    });
    
    // Animaciones para las tarjetas de productos
    const productCards = document.querySelectorAll('.product-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, observerOptions);
    
    productCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
    
    // Animación para las tarjetas de información
    const infoCards = document.querySelectorAll('.info-card');
    
    infoCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        // Observar después de un delay
        setTimeout(() => {
            observer.observe(card);
        }, 500);
    });
    
    // Efecto para el botón CTA
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        ctaButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    }
    
    // Efecto de carga inicial
    const heroContent = document.querySelector('.hero .container');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(20px)';
        heroContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }
    
    // el carrusel funcione después de redimensionar
    window.addEventListener('resize', () => {
        // Forzar actualización del carrusel
        goToSlide(currentSlide);
    });
    
    // Depuración: Mostrar estado del carrusel
    console.log('Carrusel configurado correctamente');
    console.log('Total de slides:', slides.length);
    console.log('Intervalo de cambio:', slideInterval, 'ms');
});