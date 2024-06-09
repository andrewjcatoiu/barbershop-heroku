function showSuccessMessage(email) {
    const head = document.getElementById('mainHeader');
    head.scrollIntoView({ behavior: 'smooth' });
    const successElement = document.getElementById('successMessage');
    successElement.textContent = `Email was sent to: ${email}`;
  
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();
    successModal._element.addEventListener('click', function(event) {
        if (event.target === successModal._element) {
            closeSuccessModal();
            const headerElement = document.getElementById('mainHeader');
            headerElement.scrollIntoView({ behavior: 'smooth' });
        }
    });
}


function closeSuccessModal() {
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.hide();
}


document.getElementById('homeForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const form = event.target;
    const emailInput = document.getElementById('emailInput');
    const email = emailInput.value;

    // Save the email to local storage
    localStorage.setItem('submittedEmail', email);

    // Submit the form
    form.submit();
});


window.addEventListener('load', function() {    
    const submittedEmail = localStorage.getItem('submittedEmail');
    if (submittedEmail) {
        localStorage.removeItem('submittedEmail');
        const headerElement = document.getElementById('mainHeader');
        headerElement.scrollIntoView({ behavior: 'smooth' });
        showSuccessMessage(submittedEmail);
    }
});