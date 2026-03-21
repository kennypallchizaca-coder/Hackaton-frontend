import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { cn } from '../../utils/cn';

interface QRCodeDisplayProps {
  value: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  width?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

export function QRCodeDisplay({
  value,
  alt,
  className,
  imageClassName,
  width = 320,
  errorCorrectionLevel = 'M',
}: QRCodeDisplayProps) {
  const [src, setSrc] = useState('');

  useEffect(() => {
    let cancelled = false;

    QRCode.toDataURL(value, {
      width,
      margin: 4,
      errorCorrectionLevel,
      color: {
        dark: '#020617',
        light: '#FFFFFF',
      },
    })
      .then((dataUrl) => {
        if (!cancelled) {
          setSrc(dataUrl);
        }
      })
      .catch((error) => {
        console.error('Failed to render QR code', error);
        if (!cancelled) {
          setSrc('');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [errorCorrectionLevel, value, width]);

  return (
    <div className={cn('relative overflow-hidden rounded-lg bg-white', className)}>
      {src ? (
        <img
          src={src}
          alt={alt}
          width={width}
          height={width}
          className={cn('block h-auto w-full', imageClassName)}
        />
      ) : (
        <div className="flex aspect-square w-full items-center justify-center bg-slate-100">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-slate-700" />
        </div>
      )}
    </div>
  );
}
