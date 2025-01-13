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
        const email = document.getElementById('customerEmail').value;
        const name = document.getElementById('customerName').value;
        const msg = document.getElementById('messageText').value;

        if (!email || !name || !msg) {
            displayError('Please fill out all fields.');
            return false;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            displayError('Please enter a valid email address.');
            return false;
        }
    } catch (error) {
        console.error('Error:', error);
        displayError('An unexpected error occurred. Please try again.');
        return false;
    }

    return true;
}

function displayError(message) {
    const errorElement = document.getElementById('feedbackMsg');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    } else {
        alert(message); // Fallback if error element is not found
    }
}

function handleFormSubmit(event) {
    event.preventDefault();

    const form = document.getElementById('feedbackForm');
    const formData = new FormData(form);
    var errMsg = 'Thanks for your interest!  This site is currently under construction.  Please check back with us later.';
    var successMsg = 'Thank you for your inquiry.  We will get back to you as soon as possible.';

    if (validateEntries() === true) {

        fetch('https://api.tigerstridesolutions.com/api/HttpTriggerContact', {
            method: 'POST',
            body: formData,
            headers: {
                'X-Custom-Header': 'contact-inquiry'
            }
        })
            .then(response => {
                if (response.ok) {
                    document.getElementById('feedbackMsg').innerText = successMsg;
                    form.reset(); // Reset the form
                } else {
                    document.getElementById('feedbackMsg').innerText = errMsg;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('feedbackMsg').innerText = errMsg;
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