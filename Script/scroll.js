function scrollToBottom() {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
        scrollToBottom();
    } else if (scrollTop < lastScrollTop) {
        scrollToTop();
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});