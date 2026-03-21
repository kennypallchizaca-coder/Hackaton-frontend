# KuriPay - Criptografía Web Institucional 🚀

**KuriPay** es una plataforma institucional diseñada para la gestión, ahorro e intercambio de activos (Fiat y Cripto) orientada a estructurar la economía financiera entre tres actores clave de la cadena de valor.

Este repositorio contiene la **Frontend Application** (React + Vite + Tailwind), optimizada, pulida y lista para presentación en Hackathon.

---

## 👥 Roles del Ecosistema

El flujo económico de KuriPay se sostiene sobre 3 roles de negocio estrictamente definidos:

1. 👤 **El Consumidor**
   - **Objetivo:** Usuario final que utiliza el sistema para ahorro y gasto diario.
   - **Funciones:** Compra cripto con dinero real, vende sus criptos únicamente a los Transaccionadores y gasta sus fondos exclusivamente en los Locales.

2. ⚡ **El Transaccionador (Agente de Liquidez)**
   - **Objetivo:** Es el puente de liquidez oficial que permite la entrada y salida de capital (Fiat ↔ Cripto) en el ecosistema.
   - **Funciones:** Adquiere cripto con dinero real de Consumidores y Locales, y vende cripto por dinero real. Revisa aspectos de Compliance (KYC/AML).

3. 🏪 **El Local (Comercio o Servicio)**
   - **Objetivo:** Punto de aceptación de pagos que captura valor y recircula o liquida sus ganancias.
   - **Funciones:** Genera facturas B2B, cobra a Consumidores usando terminales POS con códigos QR dinámicos nativos, y vende excedentes Cripto a Transaccionadores.

---

## 🛠️ ¿Cómo Probar la Aplicación? (Prueba Rápida)

Para facilitar la evaluación de los jueces, se ha integrado un entorno de **"Demo Quick Login"**. Este entorno es **100% independiente del Backend** en caso de fallas de red durante la presentación, lo que garantiza una sesión indestructible y veloz.

### Paso 1: Levantar el Entorno Local
Abre tu terminal en la carpeta de este proyecto y ejecuta:
```bash
npm install
npm run dev
```
Dirígete a `http://localhost:5173/login`.

### Paso 2: Iniciar Sesión Rápida
Observarás tres botones coloreados encima del bloque de Login Manual ("Demo Quick Login").
- No necesitas ingresar contraseñas.
- Haz clic en **Consumidor** (Azul), **Transaccionador** (Morado) o **Local** (Verde).
- El sistema forjará automáticamente credenciales seguras y te enviará a tu Dashboard específico donde verás tu Inicial de rol respectiva (C, T o L) en el menú lateral inferior.

### Paso 3: Flujo de Pago a PDF (Prueba Core)
Te recomendamos probar el flujo de Terminal Punto de Venta (POS) diseñado para los **Locales**:
1. Haz clic en **Local** para iniciar sesión como Comerciante.
2. En la barra lateral, haz clic en **POS Terminal** (el ícono en forma de tarjeta/factura).
3. Introduce una cantidad bajo "Payment Amount" (*Ej: 50*).
4. Introduce un texto descriptivo bajo "Internal Memo" (*Ej: Almuerzo*).
5. Dale clic al botón azul **"Generate Terminal QR"**.
6. Observarás a la derecha el código QR de pago Lightning.
7. Simula la transacción exitosa pulsando el botón verde **"Simular Pago (Testing)"**.
8. Automáticamente el puente detectará el cobro on-chain, mostrando la pantalla **"SETTLED"**.
9. El QR cambiará de rol para ahora distribuir la factura; pulsa el gran botón amarillo **"VER PDF"**.
10. Se abrirá el elegante comprobante electrónico nativo, donde los clientes pueden presionar **"Descargar PDF"** de manera instantánea o compartir el URL como enlace verificable.

---

## 🌐 Producción y Despliegue (Vercel)

El proyecto está configurado y optimizado (`npm run build` sin errores, linter limpio y reglas estrictas SPA) para desplegarse mediante plataformas serverless.

1. **Frontend:** 
   Simplemente conéctalo a Vercel, ajusta las Variables de Entorno (`VITE_API_URL`) usando la plantilla `.env.example`, y el archivo `vercel.json` autogestionará el renderizado en `index.html` sin mostrar errores 404 al recargar pantallas de transacciones.
2. **Backend:**
   Tu API de NestJS ya posee un `vercel.json` con preconfiguración `@vercel/node` habilitando la infraestructura Serverless lista para recibir comandos Prisma a través del `postinstall`.
