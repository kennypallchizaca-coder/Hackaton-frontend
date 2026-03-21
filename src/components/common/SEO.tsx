import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
}

export const SEO = ({
  title = "KuriPay | Criptografía Web Institucional",
  description = "Plataforma de pagos y trading de criptomonedas con cumplimiento de grado institucional, IA avanzada y pruebas de inocencia.",
  keywords = "criptomonedas, bitcoin, trading, cumplimiento, KYT, GenLayer, KuriPay, fintech",
  ogImage = "/og-image.png",
  ogType = "website",
  canonical
}: SEOProps) => {
  const siteName = "KuriPay";
  const fullTitle = title === siteName ? title : `${title} | ${siteName}`;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Mobile Meta */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="theme-color" content="#020617" />
    </Helmet>
  );
};
