# Maintenance Guide

This document outlines periodic checks and maintenance tasks to ensure the application remains secure and mobile-friendly.

## 1. Security Checks

### SSL/HTTPS Certificates
*   **Issue:** Browsers (especially Safari) will flag the site as "Not Secure" if it is served over HTTP or uses a self-signed certificate.
*   **Resolution:** Ensure the production environment is configured with a valid SSL certificate.
    *   **Vercel/Netlify:** SSL is typically handled automatically.
    *   **Custom Server/VPS:** Use tools like Certbot (Let's Encrypt) or configure a reverse proxy (Nginx/Apache) with SSL termination.
*   **Verification:** Visit the site in a new private/incognito window. Ensure the URL starts with `https://` and there is a lock icon in the address bar.

### Security Headers
The application is configured with strict security headers in `next.config.ts`.
*   **Strict-Transport-Security (HSTS):** Enforces HTTPS.
*   **X-Content-Type-Options:** Prevents MIME-sniffing.
*   **X-Frame-Options:** Prevents clickjacking.
*   **Permissions-Policy:** Restricts access to sensitive features.

**Periodic Check:**
Use a tool like [Security Headers](https://securityheaders.com/) or browser DevTools (Network tab -> Response Headers) to verify these headers are present in production.

### Dependency Audits
Regularly run audits to identify vulnerabilities in dependencies.
```bash
npm audit
```

## 2. Mobile Compatibility Checks

### Landing Page Carousel
*   **Pause/Play Button:**
    *   Check that the button has a transparent background with a white border.
    *   Verify that tapping the button on a mobile device toggles the state (Play/Pause) without getting "stuck" in a hover state (e.g., becoming more opaque/gray and staying that way).
    *   **Fix Implemented:** The button styles use `@media (hover: hover)` to ensure hover effects (increased opacity) only apply to devices with a mouse, preventing sticky hover states on touch devices.

### Navigation & Layout
*   **Sidebar:** Ensure the sidebar collapses or behaves correctly on smaller screens.
*   **Top Padding:** Check that content does not overlap with the fixed header (`.main-content` padding).

### Testing Strategy
*   **Real Devices:** Test on an actual iPhone (Safari) and Android device (Chrome) when possible.
*   **Browser DevTools:** Use Chrome/Safari DevTools "Device Toolbar" to simulate various screen sizes and touch interactions.
