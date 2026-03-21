import jsQR from 'jsqr';
import { PNG } from 'pngjs';
import QRCode from 'qrcode';

const scenarios = [
  {
    name: 'public payment URL',
    value: 'https://hackaton-frontend-pearl.vercel.app/pay/inv_live_123456789',
    errorCorrectionLevel: 'M',
    sizes: [160, 192, 240, 320],
  },
  {
    name: 'public receipt URL',
    value: 'https://hackaton-frontend-pearl.vercel.app/invoice/inv_live_123456789',
    errorCorrectionLevel: 'Q',
    sizes: [160, 192, 240, 320],
  },
  {
    name: 'portable local/mobile fallback URL',
    value:
      'https://hackaton-frontend-pearl.vercel.app/pay/mock-inv-123456?s=eyJpIjoibW9jay1pbnYtMTIzNDU2IiwiYXMiOjEyMDAwLCJhdSI6Ny41NiwiZCI6Ik1lcmNoYW50IHBheW1lbnQgZm9yIG1vYmlsZSIsInN0IjoicGVuZGluZyIsInMiOiJDYWZlIENlbnRyYWwiLCJsbiI6ImxuYmMxMjBuMXBkZW1vZmFsbGJhY2sifQ',
    errorCorrectionLevel: 'L',
    sizes: [192, 240, 320],
  },
];
let failures = 0;

for (const scenario of scenarios) {
  for (const size of scenario.sizes) {
    const pngBuffer = await QRCode.toBuffer(scenario.value, {
      type: 'png',
      width: size,
      margin: 4,
      errorCorrectionLevel: scenario.errorCorrectionLevel,
      color: {
        dark: '#020617',
        light: '#FFFFFF',
      },
    });

    const image = PNG.sync.read(pngBuffer);
    const decoded = jsQR(
      new Uint8ClampedArray(image.data.buffer, image.data.byteOffset, image.data.byteLength),
      image.width,
      image.height,
    );

    if (!decoded || decoded.data !== scenario.value) {
      failures += 1;
      console.error(`FAIL ${scenario.name} @ ${size}px`);
      continue;
    }

    console.log(`PASS ${scenario.name} @ ${size}px`);
  }
}

if (failures > 0) {
  process.exit(1);
}
