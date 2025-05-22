// Sender API integration
const SENDER_API_KEY = 'YOUR_SENDER_API_KEY'; // Replace with your actual API key
const SENDER_GROUP_ID = 'YOUR_SENDER_GROUP_ID'; // Replace with your actual group ID

document.addEventListener('DOMContentLoaded', () => {
  const footerForm = document.getElementById('footer-signup');
  const heroForm = document.getElementById('hero-signup');
  const footerFormStatus = document.getElementById('footer-form-status');
  const heroFormStatus = document.getElementById('hero-form-status');
  let isSubmitting = false;

  const validateEmail = (email) => {
    return Boolean(email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/));
  };

  const showMessage = (statusElement, message, isError = false) => {
    statusElement.textContent = message;
    statusElement.className = `mt-4 text-sm ${isError ? 'text-red-400' : 'text-sky-400'}`;
  };

  const toggleLoading = (form, loading) => {
    isSubmitting = loading;
    const submitButton = form.querySelector('button[type="submit"]');
    
    if (loading) {
      submitButton.innerHTML = `
        <span>Processing</span>
        <span class="loading-spinner ml-2 h-4 w-4 inline-block border-2 border-white border-t-transparent rounded-full animate-spin"></span>
      `;
      submitButton.disabled = true;
    } else {
      // Determine which button we're dealing with
      if (form.id === 'footer-signup') {
        submitButton.innerHTML = 'Get Early Access';
      } else {
        submitButton.innerHTML = 'Join the beta';
      }
      submitButton.disabled = false;
    }
  };

  const setCookie = (name, value, days) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
  };

  const handleSubmit = async (e, form, statusElement) => {
    e.preventDefault();
    
    if (isSubmitting) {
      return false;
    }
    
    const email = form.querySelector('input[type="email"]').value;
    const nameInput = form.querySelector('input[name="name"]');
    const name = nameInput ? nameInput.value : 'Subscriber';

    if (!validateEmail(email)) {
      showMessage(statusElement, 'Please enter a valid email address', true);
      return;
    }
    
    toggleLoading(form, true);

    try {
      const response = await fetch('https://api.sender.net/v2/subscribers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SENDER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          firstname: name,
          groups: [SENDER_GROUP_ID],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Subscription error');
      }

      showMessage(statusElement, 'Thanks for signing up for early access!');
      form.reset();
      setCookie('senderSubscribed', 'true', 365);
    } catch (error) {
      console.error(error);
      showMessage(
        statusElement,
        error.message === 'Extension context invalidated'
          ? 'Sorry, an error occurred. Please refresh the page and try again.'
          : 'Something went wrong. Please try again.',
        true,
      );
    } finally {
      toggleLoading(form, false);
    }
  };

  if (footerForm) {
    footerForm.addEventListener('submit', (e) => handleSubmit(e, footerForm, footerFormStatus));
  }
  
  if (heroForm) {
    heroForm.addEventListener('submit', (e) => handleSubmit(e, heroForm, heroFormStatus));
  }
});
