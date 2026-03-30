// errorHandler.js

class APIErrorHandler {
  constructor() {
    this.errors = {
      // Errores de red/HTTP
      NETWORK_ERROR: "Error de conexión. Verifica tu internet.",
      TIMEOUT_ERROR: "La solicitud tardó demasiado tiempo.",

      // Errores del cliente (4xx)
      400: "Solicitud incorrecta. Verifica los datos enviados.",
      401: "No autorizado. Por favor inicia sesión nuevamente.",
      403: "No tienes permisos para realizar esta acción.",
      404: "El recurso solicitado no existe.",
      429: "Demasiadas solicitudes. Espera un momento.",

      // Errores del servidor (5xx)
      500: "Error interno del servidor. Intenta más tarde.",
      502: "Servicio no disponible temporalmente.",
      503: "Servidor en mantenimiento.",

      // Errores personalizados
      VALIDATION_ERROR: "Error de validación en los datos.",
      UNKNOWN_ERROR: "Ocurrió un error inesperado.",
    };
  }

  // Método principal para manejar errores
  handleError(error) {
    console.error("Error capturado:", error);

    // Error de red
    if (error.message === "Network Error" || !navigator.onLine) {
      return this.showError("NETWORK_ERROR");
    }

    // Error con código HTTP
    if (error.response) {
      const status = error.response.status;
      return this.showError(status);
    }

    // Error de timeout
    if (error.code === "ECONNABORTED") {
      return this.showError("TIMEOUT_ERROR");
    }

    // Error desconocido
    return this.showError("UNKNOWN_ERROR");
  }

  // Mostrar mensaje de error
  showError(errorCode) {
    const message = this.errors[errorCode] || this.errors.UNKNOWN_ERROR;

    // Puedes mostrar el error de diferentes formas
    console.error(`[${errorCode}]: ${message}`);

    // Mostrar notificación al usuario
    this.showNotification(message, "error");

    // También puedes lanzar un evento personalizado
    this.dispatchErrorEvent(errorCode, message);

    return { error: true, code: errorCode, message };
  }

  // Mostrar notificación
  showNotification(message, type = "error") {
    // Aquí puedes integrar con tu sistema de notificaciones
    // Ejemplo simple:
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      background: ${type === "error" ? "#ff4444" : "#4CAF50"};
      color: white;
      border-radius: 8px;
      z-index: 9999;
      animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 5000);
  }

  // Disparar evento personalizado
  dispatchErrorEvent(code, message) {
    const errorEvent = new CustomEvent("apiError", {
      detail: { code, message, timestamp: new Date() },
    });
    window.dispatchEvent(errorEvent);
  }
}

// Crear instancia global
const apiErrorHandler = new APIErrorHandler();
