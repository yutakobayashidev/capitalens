import { useRef, useState, useEffect, useCallback } from "react";
import * as faceapi from "face-api.js";
import { FaCamera } from "react-icons/fa";

type Props = {
  onFaceDetect: (name: string) => void;
};

const FaceDetection: React.FC<Props> = ({ onFaceDetect }) => {
  const [isLoadingModels, setIsLoadingModels] = useState(true);
  const [isFrontCamera, setIsFrontCamera] = useState(false); // デフォルトはバックカメラを使用する
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const faceRecognitionModelUrl = "/models/faceRecognitionModel.json";
  const faceMatcherTolerance = 0.6;
  const faceDetectionInterval = 100;
  const intervalIdRef = useRef<NodeJS.Timeout>();
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadModels = async () => {
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
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
        facingMode: isFrontCamera ? "user" : "environment", // isFrontCameraがtrueの場合はインカメラを使用する
      },
    });
    videoRef.current.srcObject = stream;

    // 顔の追跡をリセットする
    if (canvasRef.current) {
      const context = canvasRef.current.getContext(
        "2d"
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
  }, [startVideo, cameraPermission]);

  useEffect(() => {
    const detectFace = async () => {
      if (!videoRef.current || !canvasRef.current || isLoadingModels) {
        return;
      }

      const detections = await faceapi
        .detectAllFaces(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (detections.length > 0) {
        setIsFaceDetected(true);
      } else {
        setIsFaceDetected(false);
      }

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
          "2d"
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

  const handleNameDetect = async () => {
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
  };

  useEffect(() => {
    const checkCameraPermission = async () => {
      try {
        const permissionStatus = await navigator.permissions.query({
          name: "camera" as PermissionName, // Add 'as PermissionName' for a type assertion
        });

        if (permissionStatus.state === "granted") {
          setCameraPermission(true);
        } else {
          setCameraPermission(false);
        }

        permissionStatus.onchange = () => {
          if (permissionStatus.state === "granted") {
            setCameraPermission(true);
          } else {
            setCameraPermission(false);
          }
        };
      } catch (err) {
        console.error("Error checking camera permission:", err);
      }
    };

    checkCameraPermission();
  }, []);

  const handleRequestCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (stream) {
        setCameraPermission(true);
        startVideo();
      }
    } catch (err) {
      console.error("Error requesting camera access:", err);
      setErrorMessage(
        "カメラへのアクセスが拒否されました。ブラウザの設定でカメラへのアクセスを許可してください。"
      );
    }
  };

  return (
    <div className="mx-auto max-w-screen-xl px-4 md:px-8">
      {isLoadingModels ? (
        <p>Loading models...</p>
      ) : cameraPermission ? (
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full h-full"
          ></video>
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <img
            src="/undraw_voting_nvu7.svg"
            className="mb-5"
            height={400}
            width={400}
          />
          <p className="text-center">
            選挙ポスターや議員の顔をスキャンして、議員の詳細な政策や、SNSをチェックしましょう。
            <br />
            この機能の利用には、カメラへのアクセスが必要です。
          </p>
          <button
            className="bg-blue-500 flex items-center hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleRequestCameraAccess}
          >
            <FaCamera className="mr-2" />
            カメラへのアクセスをリクエスト
          </button>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </div>
      )}
      <div className="flex flex-col items-center space-y-4 mt-5">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleCameraToggle}
        >
          {isFrontCamera ? "Back Camera" : "Front Camera"}
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 disabled:bg-gray-300 text-white font-bold py-2 px-4 rounded"
          onClick={handleNameDetect}
          disabled={!isFaceDetected} // isFaceDetectedがtrueでない場合はボタンを無効化
        >
          Detect Name
        </button>
      </div>
    </div>
  );
};

export default FaceDetection;
