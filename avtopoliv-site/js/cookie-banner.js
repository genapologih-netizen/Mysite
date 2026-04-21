(function() {
    var COOKIE_KEY = 'cookie_consent_accepted';
    var banner = document.getElementById('cookie-banner');
    var btn = document.getElementById('cookie-accept');
    if (!banner || !btn) return;

    if (!localStorage.getItem(COOKIE_KEY)) {
        banner.hidden = false;
    }

    btn.addEventListener('click', function() {
        localStorage.setItem(COOKIE_KEY, '1');
        banner.hidden = true;
    });
})();
