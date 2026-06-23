document.addEventListener("DOMContentLoaded", () => {

  console.log("Login JS cargado");

  // ===== TAB SWITCHING =====
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tabName = button.dataset.tab;

      // Remover clase active de todos los tabs
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      // Agregar clase active al tab clickeado
      button.classList.add("active");
      document.getElementById(`${tabName}-tab`)?.classList.add("active");
    });
  });

  // ===== EMAIL & PASSWORD TAB =====
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
   * VALIDACIÓN FORMULARIO EMAIL
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
    togglePassword.addEventListener("click", (e) => {
      e.preventDefault();

      if (password.type === "password") {
        password.type = "text";
        togglePassword.textContent = "Ocultar";
      } else {
        password.type = "password";
        togglePassword.textContent = "Mostrar";
      }

    });
  }

  // ===== ADMIN LOGIN TAB =====
  const adminForm = document.getElementById("adminForm");
  const adminIdInput = document.getElementById("adminId");
  const adminIdError = document.getElementById("adminIdError");

  if (adminForm) {
    adminForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      adminIdError.classList.add("hidden");
      const adminId = adminIdInput.value.trim();

      if (!adminId) {
        adminIdError.textContent = "Admin ID is required";
        adminIdError.classList.remove("hidden");
        return;
      }

      try {
        const response = await fetch("/api/admin/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ adminUniqueId: adminId }),
        });

        if (response.ok) {
          const data = await response.json();
          // Guardar token en localStorage
          localStorage.setItem("auth_token", data.session.token);
          localStorage.setItem("user_id", data.user.id);
          localStorage.setItem("user_role", data.user.role);
          
          // Redirigir a dashboard
          window.location.href = "/dashboard";
        } else {
          const error = await response.json();
          adminIdError.textContent = error.error || "Invalid admin ID";
          adminIdError.classList.remove("hidden");
        }
      } catch (error) {
        console.error("Error:", error);
        adminIdError.textContent = "An error occurred. Please try again.";
        adminIdError.classList.remove("hidden");
      }
    });
  }

});