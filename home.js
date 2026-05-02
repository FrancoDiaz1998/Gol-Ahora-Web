// GALERIA DESPLEGABLE
const button = document.getElementById('abrir-galeria');
const galeria = document.querySelector('.galeria');

button.addEventListener('click', (e) => {
    e.preventDefault(); // evita que el <a href="#"> suba la página

    galeria.classList.toggle('abierta');

    if (galeria.classList.contains('abierta')) {
        button.textContent = 'Ocultar';
    } else {
        button.textContent = 'Ver canchas';
    }
});

// VENTANA MODAL CONTACTO
const btnContacto = document.querySelector('.contacto');
const modal = document.getElementById('modal-contacto');
const cerrar = document.getElementById('cerrar-modal');

// abrir/cerrar con el botón
btnContacto.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.toggle('activo');
});

// cerrar con la X
cerrar.addEventListener('click', () => {
    modal.classList.remove('activo');
});

// cerrar haciendo click afuera
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('activo');
    }
});    