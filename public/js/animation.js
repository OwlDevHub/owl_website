document.addEventListener("DOMContentLoaded", function() {
    const animatedElements = document.querySelectorAll('.ui, .contacts, .download_app');

    const animateOnScroll = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const animationClass = entry.target.getAttribute('data-animation');
                entry.target.classList.add('animate__animated', `${animationClass}`);
                observer.unobserve(entry.target);
                console.debug("Animated", entry.target);
            }
        });
    };
    
    const observer = new IntersectionObserver(animateOnScroll, {
    });
    animatedElements.forEach(element => {
        observer.observe(element);
    });

    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });
});
