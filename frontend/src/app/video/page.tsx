'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

export default function IndexPage() {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videojs(videoRef.current, {
        sources: [
          {
            src: 'https://webtv-vod.live.ipcasting.jp/vod/mp4:7338.mp4/playlist.m3u8',
            type: 'application/x-mpegURL',
          },
        ],
      });
    }
  });

  return (
    <div>
      <video controls ref={videoRef} className='video-js' />
    </div>
  );
}
