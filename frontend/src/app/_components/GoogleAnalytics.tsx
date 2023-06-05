"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { GA_TRACKING_ID, pageview } from "@src/lib/gtag";

const GoogleAnalytics = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => {
    if (!searchParams) return;
    const url = pathname + searchParams.toString();
    pageview(url);
  }, [pathname, searchParams]);

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_TRACKING_ID}', {
          page_path: window.location.pathname,
        });
      `,
        }}
      />
    </>
  );
};

export default function Analytics(): JSX.Element {
  return (
    <>
      {GA_TRACKING_ID && (
        <Suspense>
          <GoogleAnalytics />
        </Suspense>
      )}
    </>
  );
}
