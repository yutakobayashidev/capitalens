import "@src/app/globals.css";

import { auth } from "@auth";
import { config } from "@site.config";
import CommandMenu from "@src/app/cmd";
import GoogleAnalytics from "@src/app/google-analytics";
import BottomMenu from "@src/components/bottom-menu/bottom-menu";
import Chatbot from "@src/components/chatbot/chatbot";
import Footer from "@src/components/footer/footer";
import Header from "@src/components/header/header";
import Toaster from "@src/components/ui/toaster";
import cn from "classnames";
import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";

const ogImage = `${config.siteRoot}opengraph.jpg`;

export const metadata: Metadata = {
  title: {
    default: config.siteMeta.title,
    template: `%s | ${config.siteMeta.title}`,
  },
  description: config.siteMeta.description,
  openGraph: {
    title: config.siteMeta.title,
    images: [
      {
        url: ogImage,
      },
    ],
    locale: "ja-JP",
    siteName: config.siteMeta.title,
    url: config.siteRoot,
  },
  twitter: {
    title: config.siteMeta.title,
    card: "summary_large_image",
    images: [ogImage],
  },
};

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  weight: ["400", "500", "700"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const countryPromise = fetch(
    "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/index.json"
  );

  const sessionPromise = auth();

  const [session, country_flag] = await Promise.all([
    sessionPromise,
    countryPromise,
  ]);

  const countries = await country_flag.json();

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
        <CommandMenu countries={countries} user={session?.user} />
        <Chatbot countries={countries} user={session?.user} />
        <GoogleAnalytics />
        <Toaster />
      </body>
    </html>
  );
}
