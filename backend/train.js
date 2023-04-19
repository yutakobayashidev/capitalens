const fs = require('fs');
const path = require('path');
const faceapi = require('face-api.js');
const canvas = require('canvas');

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

async function run() {
  try {
    console.log('Loading face detection models...');
    await faceapi.nets.ssdMobilenetv1.loadFromDisk('./models');
    await faceapi.nets.faceLandmark68Net.loadFromDisk('./models');
    await faceapi.nets.faceRecognitionNet.loadFromDisk('./models');

    console.log('Generating face descriptors for politicians...');
    const labeledFaceDescriptors = await Promise.all(
      politicianNames.map(async name => {
        const descriptors = await getLabeledFaceDescriptors(name);
        return new faceapi.LabeledFaceDescriptors(name, descriptors);
      })
    );

    console.log('Writing face recognition model to disk...');
    fs.writeFileSync('./models/faceRecognitionModel.json', JSON.stringify(labeledFaceDescriptors));

    console.log('Face recognition model generation completed.');
  } catch (error) {
    console.error(error);
  }
}

async function getLabeledFaceDescriptors(name) {
  console.log(`Generating descriptors for ${name}...`);
  const outputDir = path.join(__dirname, 'politicians', name);
  const imagePaths = fs.readdirSync(outputDir).map(file => path.join(outputDir, file));
  const descriptors = [];

  for (let imagePath of imagePaths) {
    const imgData = fs.readFileSync(imagePath);
    const img = new Image();
    img.src = imgData;

    console.log(`Detecting faces in ${imagePath}...`);
    const detections = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors();
    if (detections.length > 0) {
      descriptors.push(detections[0].descriptor);
    }
  }

  console.log(`Finished generating descriptors for ${name}.`);
  return descriptors;
}

console.log('Getting politician names...');
const politicianNames = fs
  .readdirSync('./politicians')
  .filter(file => fs.statSync(path.join('./politicians', file)).isDirectory());

console.log('Starting face recognition model generation...');
run();
