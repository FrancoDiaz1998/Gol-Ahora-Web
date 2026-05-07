const togglePassword = document.querySelector(".toggle-password");
const passwordInput = document.getElementById("password");

togglePassword.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";

    passwordInput.type = isPassword ? "text" : "password";

    togglePassword.textContent = isPassword ? "🙈" : "👁️";
});


const form = document.querySelector(".formulario");
const nombre = document.getElementById("nombre");
const apellido = document.getElementById("apellido");
const dni = document.getElementById("dni");
const telefono = document.getElementById("telefono");
const usuario = document.getElementById("user");
const email = document.getElementById("email");
const password = document.getElementById("password");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    let valido = true;

    // LIMPIAR ERRORES
    document.querySelectorAll(".error-message").forEach(el => el.textContent = "");
    document.querySelectorAll("input").forEach(el => el.classList.remove("input-error"));

    // NOMBRE
    if (nombre.value.trim().length < 2) {
        setError(nombre, "Nombre muy corto");
        valido = false;
    }

    // APELLIDO
    if (apellido.value.trim().length < 2) {
        setError(apellido, "Apellido muy corto");
        valido = false;
    }

    // DNI
    if (dni.value.length < 7 || dni.value.length > 8 || isNaN(dni.value)) {
        setError(dni, "DNI inválido");
        valido = false;
    }

    // TELÉFONO
    if (telefono.value.length < 8 || telefono.value.length > 15) {
        setError(telefono, "Teléfono inválido");
        valido = false;
    }

    // EMAIL
    if (!email.value.includes("@") || !email.value.includes(".")) {
        setError(email, "Email inválido");
        valido = false;
    }

    // Usuario
    if (usuario.value.trim().length < 4 || usuario.value.trim().length > 20) {
        setError(usuario, "El nombre de usuario debe tener entre 4 y 20 caracteres");
        valido = false;
    }

    // PASSWORD
    if (password.value.length < 6) {
        setError(password, "Mínimo 6 caracteres");
        valido = false;
    }

    // SI TODO OK
    if (valido) {
        console.log("Formulario válido 🚀");

        // acá después va fetch al backend
    }
});

function setError(input, mensaje) {
    const error = document.getElementById(`error-${input.id}`);
    input.classList.add("input-error");
    error.textContent = mensaje;
}