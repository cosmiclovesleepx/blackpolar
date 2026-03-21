// TLM App JavaScript
const log = {
  info: (message, data = '') => {
    console.log(`%c[INFO]%c ${message}`, 'color: #3498db; font-weight: bold;', 'color: inherit;', data);
  },
  success: (message, data = '') => {
    console.log(`%c[SUCCESS]%c ${message}`, 'color: #2ecc71; font-weight: bold;', 'color: inherit;', data);
  },
  warn: (message, data = '') => {
    console.warn(`%c[WARN]%c ${message}`, 'color: #f39c12; font-weight: bold;', 'color: inherit;', data);
  },
  error: (message, data = '') => {
    console.error(`%c[ERROR]%c ${message}`, 'color: #e74c3c; font-weight: bold;', 'color: inherit;', data);
  },
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const api = {
  get: async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      log.error('GET request failed:', error.message);
      throw error;
    }
  },

  post: async (url, data = {}, options = {}) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: JSON.stringify(data),
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      log.error('POST request failed:', error.message);
      throw error;
    }
  },
};

document.addEventListener('DOMContentLoaded', () => {
  log.success('Application initialized');
  checkApiHealth();
  addSmoothScroll();
  initializeResponsiveMenu();
});

async function checkApiHealth() {
  try {
    const health = await api.get('/health');
    log.success('API Health Check', health);
    return health;
  } catch (error) {
    log.warn('API health check failed');
  }
}

function addSmoothScroll() {
  $$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });
}

function initializeResponsiveMenu() {
  log.info('Responsive menu initialized');
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const throttle = (func, limit) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    log,
    api,
    formatDate,
    debounce,
    throttle,
  };
}
