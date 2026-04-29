const button = document.getElementById('abrir-galeria');
const galeria = document.querySelector('.galeria');

button.addEventListener('click', (e) => {
    e.preventDefault(); // evita que el <a href="#"> suba la página

    galeria.classList.toggle('abierta');

    if (galeria.classList.contains('abierta')) {
        button.textContent = 'Ocultar canchas';
    } else {
        button.textContent = 'Ver canchas';
    }
});