document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('feedbackForm').addEventListener('submit', handleFormSubmit);
    document.getElementById('feedbackForm').addEventListener('reset', resetFeedback);

    // Add event listener for the name field to warm up the Azure Function on first interaction
    const nameField = document.getElementById('customerName');
    if (nameField) {
        // Use the input event instead of change to detect typing
        nameField.addEventListener('input', warmUpAzureFunction, { once: true });
    }
});

function initValidation() {
    document.getElementById('feedbackForm').addEventListener('submit', function (event) {
        var emailField = document.getElementById('customerEmail');
        var email = emailField.value;
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            alert('Please enter a valid email address.');
            event.preventDefault();
        }
    });
}

function validateEntries() {
    try {
        const email = document.getElementById('customerEmail');
        const name = document.getElementById('customerName');
        const msg = document.getElementById('messageText');

        setFieldAppearance(email, email.value);
        setFieldAppearance(name, name.value);
        setFieldAppearance(msg, msg.value);

        if (!email.value || !name.value || !msg.value) {
            displayMessage('Please fill out all fields.', true);
            return false;
        }
        
    } catch (error) {
        console.error('Error:', error);
        displayMessage('An unexpected error occurred. Please try again.', true);
        return false;
    }

    return true;
}

function setFieldAppearance(field, isValid) {
    if (isValid) {
        field.classList.remove('feedback-field-err');
        field.classList.add('feedback-field-normal');
    } else {
        field.classList.remove('feedback-field-normal');
        field.classList.add('feedback-field-err');    }
}

function displayMessage(message, bError) {
    const errorElement = document.getElementById('feedbackMsg');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        if (bError) {
            errorElement.classList.remove('feedback-ok');
            errorElement.classList.add('feedback-err');
        } else {
            errorElement.classList.remove('feedback-err');
            errorElement.classList.add('feedback-ok');
        }
    } else {
        alert(message); // Fallback if error element is not found
    }
}

function handleFormSubmit(event) {
    event.preventDefault();

    const form = document.getElementById('feedbackForm');
    const formData = new FormData(form);
    var errMsg = 'Thanks for your interest!  This site is currently under construction.  Please check back with us later.';
    var successMsg = 'Thank you, your inquiry has been received.';
    var processingMsg = 'Processing your request...';

    if (validateEntries() === true) {

        displayMessage(processingMsg, false);
        fetch('https://api.tigerstridesolutions.com/api/HttpTriggerContact', {
            method: 'POST',
            body: formData,
            headers: {
                'X-Custom-Header': 'contact-inquiry'
            }
        })
            .then(response => {
                if (response.ok) {
                    displayMessage(successMsg, false); 
                } else {
                    displayMessage(errMsg, false);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                displayMessage(errMsg, false);
            });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    //initValidation();
    document.getElementById('feedbackForm').addEventListener('submit', handleFormSubmit);
});

function resetFeedback() {
    document.getElementById('feedbackMsg').innerText = '';
}

/**
 * Warm up the Azure Function with a lightweight health check request
 * This helps reduce cold start latency when the actual form is submitted
 */
function warmUpAzureFunction() {
    console.log('Warming up Azure Function...');
    
    // Make a lightweight request to the health check endpoint
    fetch('https://api.tigerstridesolutions.com/api/CheckHealth', {
        method: 'GET',
        headers: {
            'X-Custom-Header': 'warmup-request'
        }
    })
    .then(response => {
        if (response.ok) {
            console.log('Azure Function warmed up successfully');
        }
    })
    .catch(error => {
        // Silently handle errors - this is just a warm-up request
        console.debug('Warm-up request error (non-critical):', error);
    });
}