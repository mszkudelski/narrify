// Privacy Popup Functionality
// This script handles the privacy/cookie consent popup across all pages

document.addEventListener('DOMContentLoaded', function() {
    const privacyPopup = document.getElementById('privacy-popup');
    const acceptButton = document.getElementById('accept-privacy');
    
    // Don't show popup on privacy policy page
    if (window.location.pathname.includes('privacy.html')) {
        if (privacyPopup) {
            privacyPopup.style.display = 'none';
        }
        return;
    }
    
    if (!privacyPopup || !acceptButton) {
        return; // Exit if elements don't exist
    }

    // Check if user has already accepted privacy policy
    const hasAcceptedPrivacy = localStorage.getItem('privacyAccepted');

    if (!hasAcceptedPrivacy) {
        // Show popup after a short delay with animation
        setTimeout(() => {
            privacyPopup.style.display = 'block';
            // Trigger animation
            setTimeout(() => {
                privacyPopup.style.opacity = '1';
                privacyPopup.style.transform = 'translateY(0)';
            }, 10);
        }, 1500);
    } else {
        privacyPopup.style.display = 'none';
    }

    // Accept button functionality with smooth hide animation
    acceptButton.addEventListener('click', () => {
        localStorage.setItem('privacyAccepted', 'true');
        privacyPopup.style.opacity = '0';
        privacyPopup.style.transform = 'translateY(100%)';
        setTimeout(() => {
            privacyPopup.style.display = 'none';
        }, 300);
        
        // Track the acceptance event if analytics is available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'privacy_accepted', {
                'event_category': 'privacy',
                'event_label': 'cookie_consent'
            });
        }
    });
});
