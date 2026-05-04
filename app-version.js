const APP_VERSION = '018';

function injectAppVersionBadge() {
    if (!document.body || document.getElementById('appVersionBadge')) {
        return;
    }

    const badge = document.createElement('div');
    badge.id = 'appVersionBadge';
    badge.className = 'app-version-badge';
    badge.textContent = APP_VERSION;
    badge.setAttribute('aria-label', `App version ${APP_VERSION}`);
    badge.setAttribute('title', `App version ${APP_VERSION}`);
    document.body.appendChild(badge);
}

window.MDM_APP_VERSION = APP_VERSION;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectAppVersionBadge);
} else {
    injectAppVersionBadge();
}
