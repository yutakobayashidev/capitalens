import { useEffect, useRef } from "react";
import Player from "video.js/dist/types/player";
import videojs from "video.js";
import "video.js/dist/video-js.css";

export default function VideoJSPlayer({
  options,
  onReady,
}: {
  options: any;
  onReady: (player: Player) => void;
}) {
  const videoRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");

      videoRef.current?.appendChild(videoElement);

      const player = (playerRef.current = videojs(
        videoElement,
        {
          ...options, // retain other options
          userActions: {
            hotkeys: function (event: KeyboardEvent) {
              const skipTime = 10;
              if (event.code === "ArrowRight") {
                player.currentTime(player.currentTime() + skipTime);
              } else if (event.code === "ArrowLeft") {
                player.currentTime(player.currentTime() - skipTime);
              } else if (event.code === "Space") {
                if (player.paused()) {
                  player.play();
                } else {
                  player.pause();
                }
                event.preventDefault();
              }
            },
          },
        },
        function () {
          onReady && onReady(player);
        }
      ));
    } else {
      const player = playerRef.current;
      // player.autoplay(options.autoplay);
      player.width(options.width);
      player.height(options.height);
    }
  }, [options, videoRef, onReady]);

  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
}
