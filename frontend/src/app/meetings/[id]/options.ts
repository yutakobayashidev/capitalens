export const options = (m3u8_url: string) => {
  return {
    autoplay: false,
    controls: true,
    fluid: true,
    language: "ja",
    playbackRates: [0.5, 1, 1.5, 2],
    playsinline: true,
    responsive: true,
    sources: [
      {
        src: m3u8_url,
        type: "application/x-mpegURL",
      },
    ],
  };
};
