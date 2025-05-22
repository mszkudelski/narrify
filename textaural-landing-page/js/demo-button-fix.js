// Interactive Demo Logic Updates
document.addEventListener('DOMContentLoaded', () => {
  const playDemoButton = document.getElementById('playDemoButton');
  const demoAudio = document.getElementById('demoAudio');
  const playIcon = playDemoButton?.querySelector('.play-icon');
  const pauseIcon = playDemoButton?.querySelector('.pause-icon');
  const playText = playDemoButton?.querySelector('.play-text');
  const pauseText = playDemoButton?.querySelector('.pause-text');
  
  if (playDemoButton && demoAudio) {
    // Update original event listener to handle play/pause in a single button
    const originalDemoClickListener = playDemoButton.onclick;
    playDemoButton.onclick = null;
    
    playDemoButton.addEventListener('click', () => {
      if (demoAudio.paused) {
        // Switch to "playing" state
        playDemoButton.classList.add('is-playing');
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
        playText.classList.add('hidden');
        pauseText.classList.remove('hidden');
        
        // Play audio
        demoAudio.play().catch(error => {
          console.error("Error playing audio:", error);
        });
      } else {
        // Switch to "paused" state
        playDemoButton.classList.remove('is-playing');
        pauseIcon.classList.add('hidden');
        playIcon.classList.remove('hidden');
        pauseText.classList.add('hidden');
        playText.classList.remove('hidden');
        
        // Pause audio
        demoAudio.pause();
      }
    });
    
    // Reset button state when audio ends
    demoAudio.addEventListener('ended', () => {
      playDemoButton.classList.remove('is-playing');
      pauseIcon.classList.add('hidden');
      playIcon.classList.remove('hidden');
      pauseText.classList.add('hidden');
      playText.classList.remove('hidden');
    });
  }
});
