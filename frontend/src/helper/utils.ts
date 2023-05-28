import dayjs from "dayjs";
import "dayjs/locale/ja";
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
