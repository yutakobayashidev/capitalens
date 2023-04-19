import { useRef, useState, useEffect, useCallback } from 'react';
import * as faceapi from 'face-api.js';

type Props = {
  onFaceDetect: (name: string) => void;
};

const FaceDetection: React.FC<Props> = ({ onFaceDetect }) => {
  const [isLoadingModels, setIsLoadingModels] = useState(true);
  const [isFrontCamera, setIsFrontCamera] = useState(false); // デフォルトはバックカメラを使用する
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const faceRecognitionModelUrl = '/models/faceRecognitionModel.json';
  const faceMatcherTolerance = 0.6;
  const faceDetectionInterval = 100;
  const intervalIdRef = useRef<NodeJS.Timeout>();

  const loadModels = async () => {
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    ]);
    setIsLoadingModels(false);
  };

  useEffect(() => {
    loadModels();
  }, []);

  const startVideo = useCallback(async () => {
    if (!videoRef.current || isLoadingModels) return;
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: isFrontCamera ? 'user' : 'environment', // isFrontCameraがtrueの場合はインカメラを使用する
      },
    });
    videoRef.current.srcObject = stream;

    // 顔の追跡をリセットする
    if (canvasRef.current) {
      const context = canvasRef.current.getContext(
        '2d'
      ) as CanvasRenderingContext2D;
      if (context) {
        context.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
      }
    }
  }, [isLoadingModels, isFrontCamera]);

  useEffect(() => {
    startVideo();
  }, [startVideo]);

  useEffect(() => {
    const detectFace = async () => {
      if (!videoRef.current || !canvasRef.current || isLoadingModels) {
        return;
      }

      const faceRecognitionModel = await (
        await fetch(faceRecognitionModelUrl)
      ).json();
      const labeledFaceDescriptors = faceRecognitionModel.map((item: any) => {
        const descriptors = item.descriptors.map(
          (descriptor: number[]) => new Float32Array(descriptor)
        );
        return new faceapi.LabeledFaceDescriptors(item.label, descriptors);
      });

      const faceMatcher = new faceapi.FaceMatcher(
        labeledFaceDescriptors,
        faceMatcherTolerance
      );

      const detections = await faceapi
        .detectAllFaces(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (detections.length === 0) {
        return;
      }

      const bestMatch = faceMatcher.findBestMatch(detections[0].descriptor);
      onFaceDetect(bestMatch.label);

      if (canvasRef.current) {
        const displaySize = {
          width: videoRef.current.clientWidth,
          height: videoRef.current.clientHeight,
        };
        faceapi.matchDimensions(canvasRef.current, displaySize);
        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );
        const context = canvasRef.current.getContext(
          '2d'
        ) as CanvasRenderingContext2D; // Add explicit type casting
        if (context) {
          context.clearRect(0, 0, displaySize.width, displaySize.height);
          faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
        }
      }
    };

    intervalIdRef.current = setInterval(detectFace, faceDetectionInterval);
    return () => {
      clearInterval(intervalIdRef.current);
    };
  }, [onFaceDetect, isLoadingModels, isFrontCamera]);

  const handleCameraToggle = () => {
    setIsFrontCamera(!isFrontCamera);
    clearInterval(intervalIdRef.current); // 顔の追跡を停止する
  };

  return (
    <div className='flex flex-col items-center space-y-4'>
      {isLoadingModels ? (
        <p>Loading models...</p>
      ) : (
        <div className='relative'>
          <video
            ref={videoRef}
            autoPlay
            muted
            className='border-solid border-2 border-gray-600 max-w-md max-h-md'
          ></video>
          <canvas
            ref={canvasRef}
            className='absolute top-0 left-0 border-solid border-2 border-gray-600 max-w-md max-h-md'
          />
        </div>
      )}
      <button
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        onClick={handleCameraToggle}
      >
        {isFrontCamera ? 'Back Camera' : 'Front Camera'}
      </button>
    </div>
  );
};

export default FaceDetection;
