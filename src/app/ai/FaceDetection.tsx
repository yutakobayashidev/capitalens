// FaceDetection.tsx

import React, { useRef, useState, useEffect } from "react";
import * as faceapi from "face-api.js";

type Props = {
  onFaceDetect: (name: string) => void;
};

const FaceDetection: React.FC<Props> = ({ onFaceDetect }) => {
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const loadModels = async () => {
    setLoading(true);
    await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
    await faceapi.nets.ageGenderNet.loadFromUri("/models");
    await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
    await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
    setLoading(false);
  };

  useEffect(() => {
    loadModels();
  }, []);

  const startVideo = async () => {
    if (!videoRef.current) return;
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  };

  useEffect(() => {
    startVideo();
  }, []);

  useEffect(() => {
    const detectFace = async () => {
      if (!videoRef.current || !canvasRef.current) {
        return;
      }

      const faceRecognitionModelRaw = await (
        await fetch("/models/faceRecognitionModel.json")
      ).json();

      const faceRecognitionModel = faceRecognitionModelRaw.map(
        (labeledDescriptor: any) => {
          return new faceapi.LabeledFaceDescriptors(
            labeledDescriptor.label,
            labeledDescriptor.descriptors.map(
              (descriptor: number[]) => new Float32Array(descriptor)
            )
          );
        }
      );

      const faceMatcher = new faceapi.FaceMatcher(faceRecognitionModel, 0.6);

      const detections = await faceapi
        .detectAllFaces(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (detections.length === 0) {
        return;
      }

      const bestMatch = faceMatcher.findBestMatch(detections[0].descriptor);
      onFaceDetect(bestMatch.label);

      // Draw face detection results
      if (videoRef.current && canvasRef.current) {
        const displaySize = {
          width: videoRef.current.clientWidth,
          height: videoRef.current.clientHeight,
        };
        faceapi.matchDimensions(canvasRef.current, displaySize);
        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, displaySize.width, displaySize.height);
          faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
        }
      }
    };

    const intervalId = setInterval(detectFace, 100);
    return () => {
      clearInterval(intervalId);
    };
  }, [onFaceDetect]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          muted
          className="border-solid border-2 border-gray-600 max-w-md max-h-md"
        ></video>
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 border-solid border-2 border-gray-600 max-w-md max-h-md"
        />
      </div>
    </div>
  );
};

export default FaceDetection;
