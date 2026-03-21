import { type Invoice } from '../../../types';

const DEFAULT_PUBLIC_APP_URL = 'https://hackaton-frontend-pearl.vercel.app';

type ShareSnapshot = {
  i: string;
  as?: number;
  au?: number;
  d?: string;
  st?: Invoice['status'];
  s?: string;
  c?: number | string;
  ln?: string;
};

function normalizeBaseUrl(value: string | undefined | null): string | null {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    return `${url.protocol}//${url.host}`;
  } catch {
    return null;
  }
}

function isPrivateHostname(hostname: string): boolean {
  const lower = hostname.toLowerCase();

  if (
    lower === 'localhost' ||
    lower === '0.0.0.0' ||
    lower === '::1' ||
    lower.endsWith('.local')
  ) {
    return true;
  }

  if (/^127\./.test(lower) || /^10\./.test(lower) || /^192\.168\./.test(lower)) {
    return true;
  }

  return /^172\.(1[6-9]|2\d|3[0-1])\./.test(lower);
}

function isReachableMobileOrigin(origin: string | null): boolean {
  if (!origin) {
    return false;
  }

  try {
    const url = new URL(origin);
    return url.protocol === 'https:' && !isPrivateHostname(url.hostname);
  } catch {
    return false;
  }
}

function readCurrentOrigin(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return normalizeBaseUrl(window.location.origin);
}

function shouldEmbedPortableSnapshot(invoice: Invoice): boolean {
  const publicUrl = getPublicAppUrl();
  const currentOrigin = readCurrentOrigin();

  return isDemoInvoice(invoice) || (currentOrigin !== null && currentOrigin !== publicUrl);
}

function encodeSnapshot(snapshot: ShareSnapshot): string {
  const json = JSON.stringify(snapshot);
  const bytes = new TextEncoder().encode(json);
  let binary = '';

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function decodeSnapshotValue(token: string): ShareSnapshot | null {
  try {
    const padded = token.replace(/-/g, '+').replace(/_/g, '/');
    const normalized = `${padded}${'='.repeat((4 - (padded.length % 4)) % 4)}`;
    const binary = atob(normalized);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);

    return JSON.parse(json) as ShareSnapshot;
  } catch {
    return null;
  }
}

function toSnapshot(invoice: Invoice, includeLightningInvoice: boolean): ShareSnapshot {
  return {
    i: invoice.id,
    as: invoice.amountSats,
    au: invoice.amountUsd ?? invoice.amount ?? 0,
    d: invoice.description?.slice(0, 80),
    st: invoice.status,
    s: invoice.store,
    c: includeLightningInvoice ? undefined : invoice.createdAt,
    ln: includeLightningInvoice ? invoice.lightningInvoice : undefined,
  };
}

function fromSnapshot(snapshot: ShareSnapshot): Invoice {
  return {
    id: snapshot.i,
    amount: snapshot.au ?? 0,
    amountSats: snapshot.as,
    amountUsd: snapshot.au,
    description: snapshot.d,
    status: snapshot.st ?? 'pending',
    store: snapshot.s,
    createdAt: snapshot.c ?? Date.now(),
    lightningInvoice: snapshot.ln,
  };
}

export function getPublicAppUrl(): string {
  const envUrl = normalizeBaseUrl(import.meta.env.VITE_PUBLIC_APP_URL);

  if (envUrl) {
    return envUrl;
  }

  const currentOrigin = readCurrentOrigin();
  if (isReachableMobileOrigin(currentOrigin)) {
    return currentOrigin!;
  }

  return DEFAULT_PUBLIC_APP_URL;
}

export function buildInvoiceUrl(invoice: Invoice): string {
  const url = new URL(`/invoice/${encodeURIComponent(invoice.id)}`, `${getPublicAppUrl()}/`);

  if (shouldEmbedPortableSnapshot(invoice)) {
    url.searchParams.set('s', encodeSnapshot(toSnapshot(invoice, false)));
  }

  return url.toString();
}

export function buildPaymentUrl(invoice: Invoice): string {
  const url = new URL(`/pay/${encodeURIComponent(invoice.id)}`, `${getPublicAppUrl()}/`);

  if (shouldEmbedPortableSnapshot(invoice)) {
    url.searchParams.set('s', encodeSnapshot(toSnapshot(invoice, true)));
  }

  return url.toString();
}

export function buildLightningWalletHref(lightningInvoice: string | undefined): string {
  const normalized = lightningInvoice?.trim();

  if (!normalized) {
    return '';
  }

  return normalized.toLowerCase().startsWith('lightning:')
    ? normalized
    : `lightning:${normalized}`;
}

export function decodeInvoiceSnapshot(token: string | null): Invoice | null {
  if (!token) {
    return null;
  }

  const snapshot = decodeSnapshotValue(token);
  return snapshot ? fromSnapshot(snapshot) : null;
}

export function decodeLegacyInvoiceHash(hash: string): Invoice | null {
  if (!hash.includes('#payload=')) {
    return null;
  }

  const payload = hash.split('#payload=')[1];
  if (!payload) {
    return null;
  }

  try {
    const decodedString = decodeURIComponent(atob(payload));
    return JSON.parse(decodedString) as Invoice;
  } catch {
    return null;
  }
}

export function mergeInvoices(primary: Invoice | null, fallback: Invoice | null): Invoice | null {
  if (primary && fallback) {
    return {
      id: primary.id || fallback.id,
      amount: primary.amount ?? fallback.amount,
      amountSats: primary.amountSats ?? fallback.amountSats,
      amountUsd: primary.amountUsd ?? fallback.amountUsd,
      description: primary.description ?? fallback.description,
      status: primary.status ?? fallback.status,
      lightningInvoice: primary.lightningInvoice ?? fallback.lightningInvoice,
      qrCode: primary.qrCode ?? fallback.qrCode,
      store: primary.store ?? fallback.store,
      createdAt: primary.createdAt ?? fallback.createdAt,
      expiresAt: primary.expiresAt ?? fallback.expiresAt,
    };
  }

  return primary ?? fallback;
}

export function isDemoInvoice(invoice: Invoice | null | undefined): boolean {
  if (!invoice) {
    return false;
  }

  return invoice.id.startsWith('mock-inv-') || invoice.lightningInvoice?.includes('mock_') === true;
}
