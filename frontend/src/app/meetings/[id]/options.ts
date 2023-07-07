export const options = (m3u8_url: string) => {
  return {
    autoplay: false,
    controls: true,
    responsive: true,
    playsinline: true,
    fluid: true,
    playbackRates: [0.5, 1, 1.5, 2],
    language: "ja",
    sources: [
      {
        src: m3u8_url,
        type: "application/x-mpegURL",
      },
    ],
  };
};
