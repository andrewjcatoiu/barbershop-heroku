const homeLinks = document.querySelectorAll('a[name="scroll"]');

homeLinks.forEach((link) => {
    link.addEventListener('click', handleHomeClick);
});

function handleHomeClick(event) {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');
    const elementID = href.substring(1);
    const targetElement = document.getElementById(elementID);

    if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
    }
}




// navigate to home page
// scrolls down to target element