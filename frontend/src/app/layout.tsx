import "./globals.css";
import type { Metadata } from "next";
import cn from "classnames";
import Header from "@src/app/_components/Header";
import Footer from "@src/app/_components/Footer";
import { Inter, Noto_Sans_JP } from "next/font/google";
import BottomMenu from "@src/app/_components/BottomMenu";
import GoogleAnalytics from "@src/app/_components/GoogleAnalytics";
import { config } from "@site.config";

const ogImage = `${config.siteRoot}opengraph.jpg`;

export const metadata: Metadata = {
  title: {
    default: config.siteMeta.title,
    template: `%s | ${config.siteMeta.title}`,
  },
  description: config.siteMeta.description,
  twitter: {
    card: "summary_large_image",
    title: config.siteMeta.title,
    images: [ogImage],
  },
  openGraph: {
    title: config.siteMeta.title,
    siteName: config.siteMeta.title,
    url: config.siteRoot,
    locale: "ja-JP",
    images: [
      {
        url: ogImage,
      },
    ],
  },
};

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoSansJP = Noto_Sans_JP({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={cn(inter.variable, notoSansJP.variable)}>
      <head>
        <link
          rel="icon"
          href={`data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text x=%2250%%22 y=%2250%%22 style=%22dominant-baseline:central;text-anchor:middle;font-size:90px;%22>${
            process.env.NODE_ENV === `development` ? `🚧` : `🏛️`
          }</text></svg>`}
        />
        <link
          rel="icon alternate"
          type="image/png"
          href={`https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/72x72/${
            process.env.NODE_ENV === `development` ? `1f6a7` : `1f3db`
          }.png`}
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-512x512.png"></link>
        <meta name="theme-color" content="#1E50B5" />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
        <BottomMenu />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
