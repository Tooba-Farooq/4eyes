import React, { useRef, useEffect, useState } from 'react';
import { Camera, RefreshCw, Download, ShoppingCart, Loader } from 'lucide-react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


const ARGlassesTryOn = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [selectedGlasses, setSelectedGlasses] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [error, setError] = useState(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const faceMeshRef = useRef(null);
  const threeSceneRef = useRef(null);
  const animationFrameRef = useRef(null);

  const glassesCollection = [
  { id: 1, name: 'Aviator', brand: 'Ray-Ban', price: 150, metallic: true },
  { id: 2, name: 'Square', brand: 'Oakley', price: 120, metallic: false },
  { id: 3, name: 'Round', brand: 'Gucci', price: 200, metallic: true },
  { id: 4, name: 'Cat Eye', brand: 'Prada', price: 180, metallic: false },
  { id: 5, name: 'Sporty', brand: 'Nike', price: 130, metallic: true },
];


  useEffect(() => {
    if (isCameraOn) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isCameraOn]);

  useEffect(() => {
    if (selectedGlasses && threeSceneRef.current) {
      updateGlassesModel(selectedGlasses);
    }
  }, [selectedGlasses]);

  const startCamera = async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = async () => {
          await videoRef.current.play();
          initializeThreeJS();
          await loadMediaPipe();
        };
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions.');
      setIsLoading(false);
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (faceMeshRef.current) {
      faceMeshRef.current.close();
      faceMeshRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (threeSceneRef.current) {
      threeSceneRef.current = null;
    }
  };

  const initializeThreeJS = () => {
    const canvas = overlayCanvasRef.current;
    const video = videoRef.current;
    
    if (!canvas || !video) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45, // Field of view
      canvas.width / canvas.height,
      0.1,
      2000
    );
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true
    });
    renderer.setSize(canvas.width, canvas.height);
    renderer.setClearColor(0x000000, 0);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(5, 5, 5);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight2.position.set(-5, 5, 5);
    scene.add(directionalLight2);

    threeSceneRef.current = {
      scene,
      camera,
      renderer,
      glassesGroup: new THREE.Group()
    };

    scene.add(threeSceneRef.current.glassesGroup);
    
    console.log('Three.js initialized successfully');
  };

  const loadMediaPipe = async () => {
    try {
      // Load MediaPipe Face Mesh from CDN
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js';
      script.async = true;
      
      script.onload = () => {
        const FaceMesh = window.FaceMesh;
        
        faceMeshRef.current = new FaceMesh({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
          }
        });

        faceMeshRef.current.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        // Suppress MediaPipe internal logs (optional)
        faceMeshRef.current.setOptions({
          selfieMode: true
        });

        faceMeshRef.current.onResults(onFaceMeshResults);
        
        startFaceDetection();
        setIsLoading(false);
      };

      script.onerror = () => {
        console.error('Failed to load MediaPipe');
        setError('Failed to load face detection. Using fallback mode.');
        setIsLoading(false);
        startBasicDetection();
      };

      document.body.appendChild(script);
    } catch (err) {
      console.error('MediaPipe loading error:', err);
      setError('Face detection unavailable. Using basic mode.');
      setIsLoading(false);
      startBasicDetection();
    }
  };

  const startFaceDetection = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas || !faceMeshRef.current) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const detect = async () => {
      if (video.readyState === 4) {
        await faceMeshRef.current.send({ image: video });
      }
      animationFrameRef.current = requestAnimationFrame(detect);
    };

    detect();
  };

  const onFaceMeshResults = (results) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
      setFaceDetected(true);
      const landmarks = results.multiFaceLandmarks[0];
      
      if (selectedGlasses && threeSceneRef.current) {
        renderGlasses3D(landmarks, canvas.width, canvas.height);
      }
    } else {
      setFaceDetected(false);
    }
  };

  const renderGlasses3D = (landmarks, videoWidth, videoHeight) => {
  const { scene, camera, renderer, glassesGroup } = threeSceneRef.current;

  if (!landmarks) return;

  // Key facial landmarks
  const leftEye = landmarks[33];     // Left eye outer corner
  const rightEye = landmarks[263];   // Right eye outer corner
  const noseTip = landmarks[1];      // Nose tip
  const noseBridge = landmarks[168]; // Nose bridge

  // 1️⃣ Position: midpoint between eyes and slightly above nose bridge
  const centerX = (leftEye.x + rightEye.x) / 2;
  const centerY = (leftEye.y + rightEye.y) / 2;
  const centerZ = (leftEye.z + rightEye.z) / 2;

  // Convert normalized landmarks (0-1) to Three.js coordinates
  const x = (centerX - 0.5) * 20; // adjust 20 if needed
  const y = -(centerY - 0.5) * 20;
  const z = centerZ * -20 - 5;    // adjust -5 if glasses appear too far/close

  glassesGroup.position.set(x, y, z);

  // 2️⃣ Rotation
  const deltaX = rightEye.x - leftEye.x;
  const deltaY = rightEye.y - leftEye.y;
  const angleZ = Math.atan2(deltaY, deltaX); // tilt head sideways
  glassesGroup.rotation.z = angleZ;

  // Head tilt forward/backward
  const tiltX = (noseTip.z - noseBridge.z) * 5; // adjust factor if needed
  glassesGroup.rotation.x = tiltX;

  // Optional: rotate around Y for subtle head turning
  // const deltaZ = rightEye.z - leftEye.z;
  // glassesGroup.rotation.y = deltaZ * 5;

  // 3️⃣ Scale: based on distance between eyes
  const eyeDistance = Math.sqrt(
    Math.pow(deltaX * videoWidth, 2) + Math.pow(deltaY * videoHeight, 2)
  );

  const referenceEyeDistance = 120; // tune this to match your GLB model’s eye distance
  const scale = eyeDistance / referenceEyeDistance;
  glassesGroup.scale.set(scale, scale, scale);

  // Render the scene
  renderer.render(scene, camera);
};


  const updateGlassesModel = (glasses) => {
  if (!threeSceneRef.current) return;
  const { glassesGroup } = threeSceneRef.current;

  // Clear existing glasses
  while (glassesGroup.children.length > 0) {
    glassesGroup.remove(glassesGroup.children[0]);
  }

  // Load GLB model
  const loader = new GLTFLoader();
  loader.load(
    '/glasses_4.glb',  // Path to your GLB in public folder
    (gltf) => {
      const model = gltf.scene;

      // Optional: scale, rotation adjustments
      model.scale.set(10, 10, 10); // Adjust size
      model.rotation.set(0, Math.PI, 0); // Adjust rotation if needed

      glassesGroup.add(model);
    },
    undefined,
    (error) => {
      console.error('Failed to load GLB model:', error);
    }
  );
};

  const startBasicDetection = () => {
    // Fallback to basic detection if MediaPipe fails
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const detect = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      animationFrameRef.current = requestAnimationFrame(detect);
    };

    detect();
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const overlayCanvas = overlayCanvasRef.current;
    
    if (canvas && overlayCanvas) {
      // Create a temporary canvas to combine both layers
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      
      // Draw video frame
      tempCtx.drawImage(canvas, 0, 0);
      
      // Draw 3D glasses overlay
      tempCtx.drawImage(overlayCanvas, 0, 0);
      
      const photo = tempCanvas.toDataURL('image/png');
      setCapturedPhoto(photo);
    }
  };

  const downloadPhoto = () => {
    if (capturedPhoto) {
      const link = document.createElement('a');
      link.download = `4eyes-tryon-${Date.now()}.png`;
      link.href = capturedPhoto;
      link.click();
    }
  };

  const addToCart = () => {
    if (selectedGlasses) {
      alert(`Added ${selectedGlasses.name} to cart!`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">4Eyes AR Virtual Try-On</h1>
          <p className="text-gray-600">Advanced face tracking with realistic 3D glasses models</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Glasses Selection */}
          <div className="md:col-span-1 bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Select Glasses</h2>
            <div className="space-y-3">
              {glassesCollection.map(glasses => (
                <button
                  key={glasses.id}
                  onClick={() => setSelectedGlasses(glasses)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition ${
                    selectedGlasses?.id === glasses.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900">{glasses.name}</div>
                  <div className="text-sm text-gray-600">{glasses.brand}</div>
                  <div className="text-lg font-bold text-indigo-600 mt-1">
                    ${glasses.price}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {glasses.metallic ? '✨ Metallic' : '🎨 Matte'} • 3D Model
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* AR Try-On View */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Live Try-On</h2>
                {faceDetected && isCameraOn && (
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Face detected
                  </p>
                )}
              </div>
              {!isCameraOn && (
                <button
                  onClick={() => setIsCameraOn(true)}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  <Camera className="w-4 h-4" />
                  Start Camera
                </button>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {!isCameraOn && !capturedPhoto && (
              <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Click "Start Camera" to begin</p>
                  <p className="text-sm text-gray-500 mt-2">Uses MediaPipe + Three.js for realistic 3D tracking</p>
                </div>
              </div>
            )}

            {capturedPhoto && !isCameraOn ? (
              <div className="relative">
                <img src={capturedPhoto} alt="Captured" className="w-full rounded-xl" />
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => {
                      setCapturedPhoto(null);
                      setIsCameraOn(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retake
                  </button>
                  <button
                    onClick={downloadPhoto}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={addToCart}
                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ) : (
              isCameraOn && (
                <div className="relative">
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl z-10">
                      <div className="text-center">
                        <Loader className="animate-spin w-12 h-12 text-indigo-600 mx-auto mb-4" />
                        <p className="text-gray-600 font-medium">Loading face detection...</p>
                        <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="relative rounded-xl overflow-hidden bg-black">
                    <video
                      ref={videoRef}
                      className="w-full rounded-xl"
                      autoPlay
                      playsInline
                      muted
                      style={{ display: 'none' }}
                    />
                    <canvas
                      ref={canvasRef}
                      className="w-full rounded-xl absolute top-0 left-0"
                    />
                    <canvas
                      ref={overlayCanvasRef}
                      className="w-full rounded-xl absolute top-0 left-0"
                      style={{ pointerEvents: 'none' }}
                    />
                  </div>

                  {!isLoading && (
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={capturePhoto}
                        disabled={!faceDetected}
                        className={`flex-1 px-6 py-3 rounded-lg transition font-semibold ${
                          faceDetected
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {faceDetected ? 'Capture Photo' : 'Position your face...'}
                      </button>
                      <button
                        onClick={() => {
                          setIsCameraOn(false);
                          stopCamera();
                        }}
                        className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition"
                      >
                        Stop Camera
                      </button>
                    </div>
                  )}

                  {selectedGlasses && !isLoading && (
                    <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-gray-900">
                            Currently trying: {selectedGlasses.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            ${selectedGlasses.price} • {selectedGlasses.metallic ? 'Metallic' : 'Matte'} finish
                          </div>
                        </div>
                        <button
                          onClick={addToCart}
                          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </div>

        {/* Features & Instructions */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">✨ Advanced Features</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span><strong>MediaPipe Face Mesh:</strong> 468-point facial landmark detection for precise tracking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span><strong>Three.js 3D Models:</strong> Realistic glasses with proper depth, lighting, and materials</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span><strong>Real-time Head Tracking:</strong> Glasses follow your face movements and rotations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span><strong>Metallic & Matte Materials:</strong> PBR rendering for photorealistic appearance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span><strong>5 Unique Styles:</strong> Aviator, Square, Round, Cat Eye, and Sporty designs</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">📖 How to Use</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>Select a glasses style from the left panel</li>
              <li>Click "Start Camera" to activate your webcam</li>
              <li>Position your face in the center of the frame</li>
              <li>Wait for "Face detected" indicator (green dot)</li>
              <li>The 3D glasses will automatically track your face</li>
              <li>Move your head to see realistic 3D rendering</li>
              <li>Capture photos when you find your perfect style</li>
              <li>Download images or add directly to cart</li>
            </ol>
          </div>
        </div>

        {/* Technical Info */}
        <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl shadow-lg p-6">
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">🚀 Powered By</h3>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              <span className="bg-white px-4 py-2 rounded-lg shadow">MediaPipe Face Mesh</span>
              <span className="bg-white px-4 py-2 rounded-lg shadow">Three.js WebGL</span>
              <span className="bg-white px-4 py-2 rounded-lg shadow">React + Tailwind</span>
              <span className="bg-white px-4 py-2 rounded-lg shadow">Django REST API Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARGlassesTryOn;