document.addEventListener("DOMContentLoaded", () => {

  console.log("JS cargado");

  // Referencias
  const form = document.getElementById("loginForm");
  const email = document.getElementById("email");
  const password = document.getElementById("password");

  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");

  const togglePassword = document.getElementById("togglePassword");

  /**
   * Validar email
   */
  function isValidEmail(value) {
    return /\S+@\S+\.\S+/.test(value);
  }

  /**
   * VALIDACIÓN FORMULARIO
   */
  if (form) {
    form.addEventListener("submit", function (e) {

      let valid = true;

      emailError.classList.add("hidden");
      passwordError.classList.add("hidden");

      if (!email.value || !isValidEmail(email.value)) {
        emailError.classList.remove("hidden");
        valid = false;
      }

      if (!password.value) {
        passwordError.classList.remove("hidden");
        valid = false;
      }

      if (!valid) {
        e.preventDefault();
      }

    });
  }

  /**
   * MOSTRAR / OCULTAR PASSWORD
   */
  if (togglePassword && password) {
    togglePassword.addEventListener("click", () => {

      if (password.type === "password") {
        password.type = "text";
        togglePassword.textContent = "Ocultar";
      } else {
        password.type = "password";
        togglePassword.textContent = "Mostrar";
      }

    });
  }

});