import "dayjs/locale/ja";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.locale("ja");
dayjs.extend(relativeTime);

export function getFaviconSrcFromHostname(hostname: string) {
  return `https://www.google.com/s2/favicons?sz=128&domain=${hostname}`;
}

export function getHostFromURL(url: string) {
  const urlObj = new URL(url);
  return urlObj.hostname;
}

export function getHostFromURLProtocol(url: string) {
  const urlObj = new URL(url);
  return urlObj.protocol + "//" + urlObj.hostname;
}

export function formatDate(dateText: string, format = "YYYY-MM-DD") {
  const date = dayjs(dateText);
  // conditionally return relative date
  const isRecent = Math.abs(date.diff(Date.now(), "month")) < 6;

  return isRecent ? date.fromNow() : date.format(format);
}

export const kanaToHira = (str: string) =>
  str.replace(/[\u30a1-\u30f6]/g, (match) =>
    String.fromCharCode(match.charCodeAt(0) - 0x60)
  );

export const isKanji = (ch: string): boolean => {
  const unicode = ch.charCodeAt(0);
  return unicode >= 0x4e00 && unicode <= 0x9faf;
};

export function hiraToKana(str: string | null) {
  if (!str) {
    return null;
  }
  return str.replace(/[\u3041-\u3096]/g, function (match) {
    return String.fromCharCode(match.charCodeAt(0) + 0x60);
  });
}
