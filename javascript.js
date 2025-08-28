// script.js
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const textInput = document.getElementById('text-input');
    const voiceSelect = document.getElementById('voice-select');
    const listenBtn = document.getElementById('listen-btn');
    
    // Speech Synthesis API
    const speechSynthesis = window.speechSynthesis;
    
    // Load available voices
    function loadVoices() {
        const voices = speechSynthesis.getVoices();
        
        // Clear existing options
        voiceSelect.innerHTML = '';
        
        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Google US English';
        voiceSelect.appendChild(defaultOption);
        
        // Add all available voices
        voices.forEach(voice => {
            const option = document.createElement('option');
            option.value = voice.name;
            option.textContent = `${voice.name} (${voice.lang})`;
            
            // Highlight Google voices
            if (voice.name.includes('Google')) {
                option.style.fontWeight = '500';
            }
            
            voiceSelect.appendChild(option);
        });
    }
    
    // Initialize voices
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
    } else {
        loadVoices();
    }
    
    // Play speech
    function speak() {
        const text = textInput.value.trim();
        if (!text) return;
        
        // Stop any ongoing speech
        speechSynthesis.cancel();
        
        // Create utterance
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Set voice
        const selectedVoice = voiceSelect.value;
        if (selectedVoice) {
            const voice = speechSynthesis.getVoices().find(v => v.name === selectedVoice);
            if (voice) {
                utterance.voice = voice;
            }
        }
        
        // Set speech properties
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        // Handle events
        utterance.onstart = () => {
            listenBtn.disabled = true;
        };
        
        utterance.onend = () => {
            listenBtn.disabled = false;
        };
        
        utterance.onerror = () => {
            listenBtn.disabled = false;
            alert("An error occurred while speaking.");
        };
        
        // Speak
        speechSynthesis.speak(utterance);
    }
    
    // Event Listeners
    listenBtn.addEventListener('click', speak);
    
    // Add keyboard support (Enter key)
    textInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            speak();
        }
    });
    
    // Update voice selection when changed
    voiceSelect.addEventListener('change', () => {
        // If we're currently speaking, stop and restart with new voice
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
            setTimeout(speak, 100);
        }
    });
});