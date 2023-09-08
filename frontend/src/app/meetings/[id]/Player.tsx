import "video.js/dist/video-js.css";

import { useEffect, useRef } from "react";
import videojs from "video.js";
import Player from "video.js/dist/types/player";

export default function VideoJSPlayer({
  onReady,
  options,
}: {
  onReady: (player: Player) => void;
  options: any;
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

              if (player) {
                const currentTime = player.currentTime();

                if (event.code === "Space") {
                  event.preventDefault();
                  if (player.paused()) {
                    player.play();
                  } else {
                    player.pause();
                  }
                }
                if (currentTime !== undefined) {
                  if (event.code === "ArrowRight") {
                    player.currentTime(currentTime + skipTime);
                  } else if (event.code === "ArrowLeft") {
                    player.currentTime(currentTime - skipTime);
                  }
                }
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
