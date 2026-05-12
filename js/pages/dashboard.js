// frontend/js/pages/dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar iconos de Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Selección de elementos
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    // 3. Verificación de existencia para evitar errores en consola
    if (menuToggle && sidebar && overlay) {
        
        const toggleMenu = () => {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('active');
        };

        // Evento para abrir/cerrar
        menuToggle.addEventListener('click', toggleMenu);

        // Evento para cerrar al tocar el overlay (fuera del menú)
        overlay.addEventListener('click', toggleMenu);
    }
});