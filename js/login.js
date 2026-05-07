const togglePassword = document.querySelector(".toggle-password");
const passwordInput = document.getElementById("password");

togglePassword.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    togglePassword.textContent = isPassword ? "🙈" : "👁️";

});

const form = document.querySelector(".formulario");
const username = document.getElementById("username");
const password = document.getElementById("password");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valido = true;
    document.querySelectorAll(".error-message").forEach(el => el.textContent = "");
    document.querySelectorAll("input").forEach(el => el.classList.remove("input-error"));

    if(username.value.trim().length < 4){
        setError(username, "Usuario o email inválido");
        valido = false;
    }

    if(password.value.length < 6){
        setError(password, "Contraseña inválida");
        valido = false;
    }

    if(valido){
        console.log("Login válido 🚀");
        // fetch backend
    }
});

function setError(input, mensaje){
    const error = document.getElementById(`error-${input.id}`);
    input.classList.add("input-error");
    error.textContent = mensaje;
}