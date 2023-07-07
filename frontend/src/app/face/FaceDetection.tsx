import * as faceapi from "face-api.js";
import { useCallback,useEffect, useRef, useState } from "react";
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
  const faceDetectionInterval = 300;
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

      const detection = await faceapi
        .detectSingleFace(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptor();

      const displaySize = {
        height: videoRef.current.clientHeight,
        width: videoRef.current.clientWidth,
      };
      faceapi.matchDimensions(canvasRef.current, displaySize);

      const context = canvasRef.current.getContext(
        "2d"
      ) as CanvasRenderingContext2D;
      if (context) {
        context.clearRect(0, 0, displaySize.width, displaySize.height);
      }

      if (detection) {
        setIsFaceDetected(true);
        const resizedDetection = faceapi.resizeResults(detection, displaySize);
        faceapi.draw.drawDetections(canvasRef.current, resizedDetection);
      } else {
        setIsFaceDetected(false);
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
    if (
      !videoRef.current ||
      !canvasRef.current ||
      isLoadingModels ||
      !isFaceDetected
    ) {
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

    const detection = await faceapi
      .detectSingleFace(videoRef.current)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      return;
    }

    const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
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
        video: {
          facingMode: isFrontCamera ? "user" : "environment",
          height: { ideal: 480 }, // add these
          width: { ideal: 640 }, // add these
        },
      });
      if (stream) {
        setCameraPermission(true);
        startVideo();
      }
    } catch (err) {
      console.error("Error requesting camera access:", err);
      setErrorMessage(
        "カメラへのアクセスがブロックされています。ブラウザの設定でカメラへのアクセスを許可してください。"
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
            loop
            playsInline
            className="h-full w-full"
          ></video>
          <canvas
            ref={canvasRef}
            className="absolute left-0 top-0 h-full w-full"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <img
            src="/l_01_square_white.png"
            height={400}
            width={400}
            alt="Vote"
          />
          <p className="mb-3 text-center">
            選挙ポスターや議員の顔をスキャンして、議員の詳細な政策や、SNSをチェックしましょう。
          </p>
          <button
            className="flex items-center rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            onClick={handleRequestCameraAccess}
          >
            <FaCamera className="mr-2" />
            カメラへのアクセスをリクエスト
          </button>
          {errorMessage && <p className="mt-3 text-red-500">{errorMessage}</p>}
        </div>
      )}
      <div className="my-5 flex flex-col items-center space-y-4">
        <button
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          onClick={handleCameraToggle}
        >
          {isFrontCamera ? "Back Camera" : "Front Camera"}
        </button>
        <button
          className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700 disabled:bg-gray-300"
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
