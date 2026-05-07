"use client"

export const ninjaVoice = {
  speak: (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.1; // Slightly faster for tactical feel
    utterance.pitch = 0.9; // Slightly lower for professional tone
    
    window.speechSynthesis.speak(utterance);
  },
  
  announceSuccess: (task: string) => {
    ninjaVoice.speak(`Sistema Ninja informa: ${task} registrado com sucesso.`);
  },
  
  announceTorque: (part: string, value: string) => {
    ninjaVoice.speak(`Atenção ao torque para ${part}: ${value}.`);
  }
}
