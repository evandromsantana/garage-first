/**
 * Utilitário de Feedback Háptico para o Garage Ninja
 * Focado em uso com luvas e ambientes de oficina.
 */

export const haptics = {
  // Vibração curta para toques em botões
  light: () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(15)
    }
  },
  
  // Vibração média para confirmações de sucesso
  success: () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([30, 50, 30])
    }
  },
  
  // Vibração forte/dupla para alertas críticos
  warning: () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([100, 50, 100])
    }
  },
  
  // Vibração forte para ações de impacto (como abrir modo oficina)
  heavy: () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(60)
    }
  },

  // Vibração de erro (sequência curta e rápida)
  error: () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([50, 50, 50, 50])
    }
  }
}
