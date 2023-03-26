import React, { useRef, useState, useEffect } from "react";
import * as faceapi from "face-api.js";

type Props = {
  onFaceDetect: (name: string) => void;
};

const FaceDetection: React.FC<Props> = ({ onFaceDetect }) => {
  const [loading, setLoading] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const imgFile = event.target.files && event.target.files[0];
    if (!imgFile) return;

    const img = await faceapi.bufferToImage(imgFile);

    // Load the face recognition model
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

    // Perform face recognition
    const detections = await faceapi
      .detectAllFaces(img)
      .withFaceLandmarks()
      .withFaceDescriptors();
    if (detections.length === 0) {
      alert("顔の取得に失敗しました。");
      setLoading(false);
      return;
    }

    const bestMatch = faceMatcher.findBestMatch(detections[0].descriptor);
    onFaceDetect(bestMatch.label);
    setImgSrc(URL.createObjectURL(imgFile));
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <input
        ref={inputRef}
        className="hidden"
        type="file"
        accept="image/*"
        onChange={handleUpload}
      />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => inputRef.current!.click()}
        disabled={loading}
      >
        画像をアップロード
      </button>
      {imgSrc && (
        <img
          src={imgSrc}
          alt="アップロードされた画像"
          className="border-solid border-2 border-gray-600 max-w-md max-h-md"
        />
      )}
    </div>
  );
};

export default FaceDetection;
