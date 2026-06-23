document.addEventListener("DOMContentLoaded", function () {
  console.log("Register JS cargado");

  const form = document.getElementById("registerForm");

  // Campos del formulario
  const firstName = document.querySelector('input[name="firstName"]');
  const lastName = document.querySelector('input[name="lastName"]');
  const idType = document.querySelector('select[name="idType"]');
  const idNumber = document.querySelector('input[name="idNumber"]');
  const gender = document.querySelector('select[name="gender"]');
  const birthDate = document.querySelector('input[name="birthDate"]');
  const city = document.querySelector('input[name="city"]');
  const district = document.querySelector('input[name="district"]');
  const address = document.querySelector('input[name="address"]');
  const email = document.querySelector('input[name="email"]');
  const confirmEmail = document.querySelector('input[name="confirmEmail"]');
  const password = document.querySelector('input[name="password"]');
  const confirmPassword = document.querySelector('input[name="confirmPassword"]');
  const terms = document.querySelector('input[type="checkbox"]');

  /**
   * Mostrar error en campo
   */
  function showError(input, message) {
    if (!input) return;
    const inputGroup = input.parentElement;
    let errorElement = inputGroup?.querySelector(".error");

    if (!errorElement) {
      errorElement = document.createElement("span");
      errorElement.className = "error";
      inputGroup?.appendChild(errorElement);
    }

    errorElement.textContent = message;
    input.classList.add("error");
    input.classList.remove("valid");
  }

  /**
   * Remover error del campo
   */
  function removeError(input) {
    if (!input) return;
    const inputGroup = input.parentElement;
    const errorElement = inputGroup?.querySelector(".error");
    if (errorElement) {
      errorElement.remove();
    }
    input.classList.remove("error");
    input.classList.add("valid");
  }

  /**
   * Validar que solo contenga letras
   */
  function isValidName(value) {
    return /^[a-zA-ZáéíóúñÑ\s]+$/.test(value);
  }

  /**
   * Validar email
   */
  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  /**
   * Validación de campos
   */
  function validateFirstName() {
    const value = firstName?.value.trim() || "";
    if (value === "") {
      showError(firstName, "First name is required");
      return false;
    }
    if (value.length < 2) {
      showError(firstName, "First name must be at least 2 characters");
      return false;
    }
    if (!isValidName(value)) {
      showError(firstName, "First name can only contain letters");
      return false;
    }
    removeError(firstName);
    return true;
  }

  function validateLastName() {
    const value = lastName?.value.trim() || "";
    if (value === "") {
      showError(lastName, "Last name is required");
      return false;
    }
    if (value.length < 2) {
      showError(lastName, "Last name must be at least 2 characters");
      return false;
    }
    if (!isValidName(value)) {
      showError(lastName, "Last name can only contain letters");
      return false;
    }
    removeError(lastName);
    return true;
  }

  function validateIdType() {
    const value = idType?.value || "";
    if (value === "") {
      showError(idType, "Please select an ID type");
      return false;
    }
    removeError(idType);
    return true;
  }

  function validateIdNumber() {
    const value = idNumber?.value.trim() || "";
    if (value === "") {
      showError(idNumber, "ID number is required");
      return false;
    }
    if (!/^\d+$/.test(value)) {
      showError(idNumber, "ID number must contain only digits");
      return false;
    }
    if (value.length < 5 || value.length > 15) {
      showError(idNumber, "ID number must be between 5 and 15 digits");
      return false;
    }
    removeError(idNumber);
    return true;
  }

  function validateGender() {
    // Gender is optional
    return true;
  }

  function validateBirthDate() {
    const value = birthDate?.value;
    if (!value) {
      // Birth date is optional
      return true;
    }

    const fecha = new Date(value);
    const hoy = new Date();
    let age = hoy.getFullYear() - fecha.getFullYear();
    const monthDiff = hoy.getMonth() - fecha.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && hoy.getDate() < fecha.getDate())) {
      age--;
    }

    if (age < 18) {
      showError(birthDate, "You must be at least 18 years old");
      return false;
    }

    if (age > 120) {
      showError(birthDate, "Please verify your date of birth");
      return false;
    }

    removeError(birthDate);
    return true;
  }

  function validateCity() {
    const value = city?.value.trim() || "";
    if (value && !isValidName(value)) {
      showError(city, "City can only contain letters");
      return false;
    }
    removeError(city);
    return true;
  }

  function validateDistrict() {
    const value = district?.value.trim() || "";
    if (value && !/^[a-zA-Z0-9áéíóúñÑ\s]+$/.test(value)) {
      showError(district, "District can only contain letters and numbers");
      return false;
    }
    removeError(district);
    return true;
  }

  function validateAddress() {
    const value = address?.value.trim() || "";
    if (value && value.length < 5) {
      showError(address, "Address must be at least 5 characters");
      return false;
    }
    removeError(address);
    return true;
  }

  function validateEmail() {
    const value = email?.value.trim() || "";
    if (value === "") {
      showError(email, "Email is required");
      return false;
    }
    if (!isValidEmail(value)) {
      showError(email, "Please enter a valid email");
      return false;
    }
    removeError(email);
    return true;
  }

  function validateConfirmEmail() {
    const emailValue = email?.value.trim() || "";
    const confirmValue = confirmEmail?.value.trim() || "";

    if (confirmValue === "") {
      showError(confirmEmail, "Please confirm your email");
      return false;
    }

    if (emailValue !== confirmValue) {
      showError(confirmEmail, "Emails do not match");
      return false;
    }

    removeError(confirmEmail);
    return true;
  }

  function validatePassword() {
    const value = password?.value || "";
    if (value === "") {
      showError(password, "Password is required");
      return false;
    }

    if (value.length < 8) {
      showError(password, "Password must be at least 8 characters");
      return false;
    }

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumbers = /\d/.test(value);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      showError(password, "Password must contain uppercase, lowercase, and numbers");
      return false;
    }

    removeError(password);
    return true;
  }

  function validateConfirmPassword() {
    const passwordValue = password?.value || "";
    const confirmValue = confirmPassword?.value || "";

    if (confirmValue === "") {
      showError(confirmPassword, "Please confirm your password");
      return false;
    }

    if (passwordValue !== confirmValue) {
      showError(confirmPassword, "Passwords do not match");
      return false;
    }

    removeError(confirmPassword);
    return true;
  }

  function validateTerms() {
    if (!terms?.checked) {
      const checkbox = document.querySelector(".checkbox");
      checkbox?.style.setProperty("border-color", "#f44336");
      return false;
    }
    return true;
  }

  /**
   * Validar todos los campos
   */
  function validateAll() {
    return (
      validateFirstName() &&
      validateLastName() &&
      validateIdType() &&
      validateIdNumber() &&
      validateGender() &&
      validateBirthDate() &&
      validateCity() &&
      validateDistrict() &&
      validateAddress() &&
      validateEmail() &&
      validateConfirmEmail() &&
      validatePassword() &&
      validateConfirmPassword() &&
      validateTerms()
    );
  }

  /**
   * Agregar listeners para validación en tiempo real
   */
  firstName?.addEventListener("blur", validateFirstName);
  lastName?.addEventListener("blur", validateLastName);
  idType?.addEventListener("change", validateIdType);
  idNumber?.addEventListener("blur", validateIdNumber);
  gender?.addEventListener("change", validateGender);
  birthDate?.addEventListener("blur", validateBirthDate);
  city?.addEventListener("blur", validateCity);
  district?.addEventListener("blur", validateDistrict);
  address?.addEventListener("blur", validateAddress);
  email?.addEventListener("blur", validateEmail);
  confirmEmail?.addEventListener("blur", validateConfirmEmail);
  password?.addEventListener("blur", validatePassword);
  confirmPassword?.addEventListener("blur", validateConfirmPassword);

  /**
   * Validar al submit
   */
  if (form) {
    form.addEventListener("submit", (e) => {
      if (!validateAll()) {
        e.preventDefault();
      }
    });
  }

});
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
