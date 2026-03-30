// script.js

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registerForm");

  // Campos del formulario
  const nombre = document.querySelector('input[name="nombre"]');
  const apellido = document.querySelector('input[name="apellido"]');
  const tipoId = document.querySelector('select[name="tipoId"]');
  const numeroId = document.querySelector('input[name="numero"]');
  const genero = document.querySelector('select[name="genero"]');
  const fecha = document.querySelector('input[name="fecha"]');
  const ciudad = document.querySelector('input[name="ciudad"]');
  const barrio = document.querySelector('input[name="barrio"]');
  const direccion = document.querySelector('input[name="direccion"]');
  const email = document.querySelector('input[name="email"]');
  const confirmEmail = document.querySelector('input[name="confirmEmail"]');
  const password = document.querySelector('input[name="password"]');
  const confirmPassword = document.querySelector('input[name="confirmPassword"]');
  const terminos = document.querySelector('input[type="checkbox"]');

  // Función para mostrar errores
  function showError(input, message) {
    const inputGroup = input.parentElement;
    let errorElement = inputGroup.querySelector(".error-message");

    if (!errorElement) {
      errorElement = document.createElement("div");
      errorElement.className = "error-message";
      inputGroup.appendChild(errorElement);
    }

    errorElement.textContent = message;
    errorElement.style.color = "#ff6b6b";
    errorElement.style.fontSize = "12px";
    errorElement.style.marginTop = "5px";
    input.style.borderBottomColor = "#ff6b6b";
  }

  function removeError(input) {
    const inputGroup = input.parentElement;
    const errorElement = inputGroup.querySelector(".error-message");
    if (errorElement) {
      errorElement.remove();
    }
    input.style.borderBottomColor = "#444";
  }

  // Validaciones individuales
  function validateNombre() {
    const value = nombre.value.trim();
    if (value === "") {
      showError(nombre, "El nombre es obligatorio");
      return false;
    }
    if (value.length < 2) {
      showError(nombre, "El nombre debe tener al menos 2 caracteres");
      return false;
    }
    if (!/^[a-zA-ZáéíóúñÑ\s]+$/.test(value)) {
      showError(nombre, "El nombre solo debe contener letras");
      return false;
    }
    removeError(nombre);
    return true;
  }

  function validateApellido() {
    const value = apellido.value.trim();
    if (value === "") {
      showError(apellido, "El apellido es obligatorio");
      return false;
    }
    if (value.length < 2) {
      showError(apellido, "El apellido debe tener al menos 2 caracteres");
      return false;
    }
    if (!/^[a-zA-ZáéíóúñÑ\s]+$/.test(value)) {
      showError(apellido, "El apellido solo debe contener letras");
      return false;
    }
    removeError(apellido);
    return true;
  }

  function validateTipoId() {
    const value = tipoId.value;
    if (value === "" || value === "Selecciona") {
      showError(tipoId, "Selecciona un tipo de identificación");
      return false;
    }
    removeError(tipoId);
    return true;
  }

  function validateNumeroId() {
    const value = numeroId.value.trim();
    if (value === "") {
      showError(numeroId, "El número de identificación es obligatorio");
      return false;
    }
    if (!/^\d+$/.test(value)) {
      showError(numeroId, "El número de identificación solo debe contener números");
      return false;
    }
    if (value.length < 5 || value.length > 15) {
      showError(numeroId, "El número de identificación debe tener entre 5 y 15 dígitos");
      return false;
    }
    removeError(numeroId);
    return true;
  }

  function validateGenero() {
    const value = genero.value;
    if (value === "" || value === "Selecciona") {
      // El género es opcional, así que no mostramos error
      return true;
    }
    removeError(genero);
    return true;
  }

  function validateFecha() {
    const value = fecha.value;
    if (value === "") {
      // La fecha es opcional
      return true;
    }

    const fechaNacimiento = new Date(value);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mesDiff = hoy.getMonth() - fechaNacimiento.getMonth();

    if (mesDiff < 0 || (mesDiff === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }

    if (edad < 18) {
      showError(fecha, "Debes ser mayor de 18 años");
      return false;
    }

    if (edad > 100) {
      showError(fecha, "Por favor verifica tu fecha de nacimiento");
      return false;
    }

    removeError(fecha);
    return true;
  }

  function validateCiudad() {
    const value = ciudad.value.trim();
    if (value !== "" && !/^[a-zA-ZáéíóúñÑ\s]+$/.test(value)) {
      showError(ciudad, "La ciudad solo debe contener letras");
      return false;
    }
    removeError(ciudad);
    return true;
  }

  function validateBarrio() {
    const value = barrio.value.trim();
    if (value !== "" && !/^[a-zA-Z0-9áéíóúñÑ\s]+$/.test(value)) {
      showError(barrio, "El barrio solo debe contener letras y números");
      return false;
    }
    removeError(barrio);
    return true;
  }

  function validateDireccion() {
    const value = direccion.value.trim();
    if (value !== "" && value.length < 5) {
      showError(direccion, "La dirección debe tener al menos 5 caracteres");
      return false;
    }
    removeError(direccion);
    return true;
  }

  function validateEmail() {
    const value = email.value.trim();
    if (value === "") {
      showError(email, "El correo electrónico es obligatorio");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      showError(email, "Ingresa un correo electrónico válido");
      return false;
    }

    removeError(email);
    return true;
  }

  function validateConfirmEmail() {
    const emailValue = email.value.trim();
    const confirmValue = confirmEmail.value.trim();

    if (confirmValue === "") {
      showError(confirmEmail, "Confirma tu correo electrónico");
      return false;
    }

    if (emailValue !== confirmValue) {
      showError(confirmEmail, "Los correos electrónicos no coinciden");
      return false;
    }

    removeError(confirmEmail);
    return true;
  }

  function validatePassword() {
    const value = password.value;
    if (value === "") {
      showError(password, "La contraseña es obligatoria");
      return false;
    }

    if (value.length < 8) {
      showError(password, "La contraseña debe tener al menos 8 caracteres");
      return false;
    }

    // Validar que tenga al menos una letra mayúscula, una minúscula y un número
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumbers = /\d/.test(value);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      showError(password, "La contraseña debe contener al menos una mayúscula, una minúscula y un número");
      return false;
    }

    removeError(password);
    return true;
  }

  function validateConfirmPassword() {
    const passwordValue = password.value;
    const confirmValue = confirmPassword.value;

    if (confirmValue === "") {
      showError(confirmPassword, "Confirma tu contraseña");
      return false;
    }

    if (passwordValue !== confirmValue) {
      showError(confirmPassword, "Las contraseñas no coinciden");
      return false;
    }

    removeError(confirmPassword);
    return true;
  }

  function validateTerminos() {
    if (!terminos.checked) {
      showError(terminos, "Debes aceptar los términos y condiciones");
      return false;
    }
    removeError(terminos);
    return true;
  }

  // Validar todos los campos
  function validateAll() {
    return (
      validateNombre() &&
      validateApellido() &&
      validateTipoId() &&
      validateNumeroId() &&
      validateGenero() &&
      validateFecha() &&
      validateCiudad() &&
      validateBarrio() &&
      validateDireccion() &&
      validateEmail() &&
      validateConfirmEmail() &&
      validatePassword() &&
      validateConfirmPassword() &&
      validateTerminos()
    );
  }

  // Eventos en tiempo real (cuando el usuario escribe)
  nombre.addEventListener("input", validateNombre);
  nombre.addEventListener("blur", validateNombre);

  apellido.addEventListener("input", validateApellido);
  apellido.addEventListener("blur", validateApellido);

  tipoId.addEventListener("change", validateTipoId);
  numeroId.addEventListener("input", validateNumeroId);
  numeroId.addEventListener("blur", validateNumeroId);

  genero.addEventListener("change", validateGenero);
  fecha.addEventListener("change", validateFecha);

  ciudad.addEventListener("input", validateCiudad);
  ciudad.addEventListener("blur", validateCiudad);

  barrio.addEventListener("input", validateBarrio);
  barrio.addEventListener("blur", validateBarrio);

  direccion.addEventListener("input", validateDireccion);
  direccion.addEventListener("blur", validateDireccion);

  email.addEventListener("input", validateEmail);
  email.addEventListener("blur", validateEmail);

  confirmEmail.addEventListener("input", validateConfirmEmail);
  confirmEmail.addEventListener("blur", validateConfirmEmail);

  password.addEventListener("input", validatePassword);
  password.addEventListener("blur", validatePassword);

  confirmPassword.addEventListener("input", validateConfirmPassword);
  confirmPassword.addEventListener("blur", validateConfirmPassword);

  terminos.addEventListener("change", validateTerminos);

  // Evento de envío del formulario
  form.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevenir envío para validar

    if (validateAll()) {
      // Si todas las validaciones pasan, enviar el formulario
      console.log("Formulario válido, enviando datos...");

      // Aquí puedes enviar los datos al servidor
      // form.submit(); // Descomenta esta línea si quieres enviar el formulario

      // O usar fetch para enviar los datos
      const formData = new FormData(form);

      fetch(form.action, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Respuesta del servidor:", data);
          // Mostrar mensaje de éxito
          alert("¡Registro exitoso!");
          // Redirigir o limpiar formulario
          // window.location.href = '/login';
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Error al registrar. Por favor intenta de nuevo.");
        });
    } else {
      console.log("Formulario con errores");
      // Scroll al primer error
      const firstError = document.querySelector(".error-message");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  });

  // Mostrar/ocultar contraseña (opcional)
  const mostrarPassword = document.querySelector(".toggle-password");
  if (mostrarPassword) {
    mostrarPassword.addEventListener("click", function () {
      const type = password.getAttribute("type") === "password" ? "text" : "password";
      password.setAttribute("type", type);
      this.textContent = type === "password" ? "👁️" : "👁️‍🗨️";
    });
  }
});
