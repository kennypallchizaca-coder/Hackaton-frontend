# KuriPay Frontend

Frontend React + Vite + Tailwind para KuriPay.

## Links
- Frontend: `https://hackaton-frontend-pearl.vercel.app/`
- Backend API: `https://hackaton-backend-ecru.vercel.app/`

## Flujo QR movil
- El QR de pago ya no depende de `localhost` ni de un servicio externo de imagen.
- El QR abre una URL publica `/pay/:id` compatible con camaras moviles comunes.
- La pagina publica deriva al wallet Lightning y mantiene acceso a la factura.
- El QR de factura abre `/invoice/:id` por HTTPS y la pagina evita `window.print()` automatico en moviles.

## Variables de entorno
Usa `.env.example` como base:

```bash
VITE_API_URL=https://hackaton-backend-ecru.vercel.app
VITE_PUBLIC_APP_URL=https://hackaton-frontend-pearl.vercel.app
VITE_ENABLE_DEMO_PAYMENT_FALLBACK=false
```

- `VITE_PUBLIC_APP_URL` debe apuntar al dominio HTTPS publico real que se incrusta en los QR.
- `VITE_ENABLE_DEMO_PAYMENT_FALLBACK` solo debe activarse en entornos controlados de demo.

## Desarrollo

```bash
npm install
npm run dev
```

## Verificacion

```bash
npm run build
npm run verify:qr
```

`verify:qr` valida que los payloads QR sigan siendo decodificables en `160`, `192`, `240` y `320` px.
