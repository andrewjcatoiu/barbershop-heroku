// document.addEventListener('DOMContentLoaded', function() {
//     const contactLinks = document.querySelectorAll('a[name="about"]');
//     contactLinks.forEach((link) => {
//         link.addEventListener('click', handleAboutClick);
//     });

//     function handleAboutClick(event) {
//         event.preventDefault();
//         console.log('clicked');
//         const targetElement = document.getElementById('target-about');
//         console.log(targetElement)
//         if (targetElement) {
//             console.log('true');
//             targetElement.scrollIntoView({ behavior: 'smooth' });

//             setTimeout(function() {
//                 const urlWithoutTarget = window.location.href.split("#")[0];
//                 history.replaceState(null, null, urlWithoutTarget + "/home");
//             }, 300);
//             console.log("success");
//         } else {
//             console.log("error");
//         }

//         return false;
//     } 
// });