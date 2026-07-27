# hxydra

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Django backend setup

This frontend is served by a Django backend. The following configuration is required in the Django project for the HxAT LTI credentials feature to work.

### Environment variables (build-time, set when running `npm run build`)

These are baked into the compiled JS bundle by webpack. See `env.example` for the full list.

| Variable | Description |
|---|---|
| `VUE_APP_STATIC_URL` | Path where static assets are served from |
| `VUE_APP_KONDO_DOMAIN` | Domain for the Kondo service |
| `VUE_APP_KONDO_API_URL` | Base URL for Kondo API calls (e.g. `https://exampleHxydra.com/kondo/v1/`) |
| `VUE_APP_HXAT_API_URL` | Django proxy path for HxAT API calls (e.g. `https://exampleHxat.com/lti_init/`). |

### Server-side secrets (never set as `VUE_APP_*`)

| Variable | Description |
|---|---|
| `HXAT_API_KEY` | API key for the HxAT service. **Must never be exposed to the browser.** Django must inject `Authorization: Bearer <HXAT_API_KEY>` on every request it proxies to the HxAT API. |

### HxAT API proxy

Django must proxy requests to the path defined by `VUE_APP_HXAT_API_URL` (e.g. `/lti_init/`) to the actual HxAT API host and inject the `Authorization: Bearer <HXAT_API_KEY>` header server-side on all such requests.

The webpack dev server handles this automatically in local development via `vue.config.js` (using `HXAT_PROXY_TARGET` and `HXAT_API_KEY`).

### Credentials tab access control

The credentials tab in the Detail View is gated by the `credentials` permission in the `hx-perms` cookie. Django controls what permissions are written into that cookie for each user. Only users whose `hx-perms` cookie includes `kondo-admin` or `kondo-it` will see the tab.
