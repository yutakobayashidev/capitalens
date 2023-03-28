import { useRef, useState, useEffect } from "react";
import * as faceapi from "face-api.js";

type Props = {
  onFaceDetect: (name: string) => void;
};

const FaceDetection: React.FC<Props> = ({ onFaceDetect }) => {
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  const handleDetectFace = async () => {
    setLoading(true);

    if (!videoRef.current) {
      setLoading(false);
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
      alert("顔の取得に失敗しました。");
      setLoading(false);
      return;
    }

    const bestMatch = faceMatcher.findBestMatch(detections[0].descriptor);
    onFaceDetect(bestMatch.label);

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <video
        ref={videoRef}
        autoPlay
        muted
        className="border-solid border-2 border-gray-600 max-w-md max-h-md"
      ></video>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleDetectFace}
        disabled={loading}
      >
        顔を認識
      </button>
    </div>
  );
};

export default FaceDetection;
