import React, { useState } from "react";
import { Camera, CheckCircle } from "lucide-react";
import NavigationBar from "../assets/Components/NavigationBar";
import Footer from "../assets/Components/Footer";
import FaceDetector from "../assets/Components/FaceDetector";
import VirtualGlasses from "../assets/Components/VirtualGlasses";


const GLASSES_OPTIONS = [
  { 
    id: "glasses_3.glb", 
    name: "Round Frame Sunnies", 
    price: "$75", 
    image: "/images/glasses_3_thumb.jpg" 
  },
  { 
    id: "glasses_4.glb", 
    name: "Round Frame ", 
    price: "$95", 
    image: "/images/glasses_4_thumb.jpg" 
  },
  { 
    id: "glasses_5.glb", 
    name: "Star Funky Shades", 
    price: "$110", 
    image: "/images/glasses_5_thumb.jpg" 
  },

];

export default function VirtualTryOnPage() {
  const [faceData, setFaceData] = useState(null);
  const [selectedGlasses, setSelectedGlasses] = useState("glasses_4.glb");
  const [showInstructions, setShowInstructions] = useState(true);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const handleFaceUpdate = (landmarks) => {
    setFaceData(landmarks);
    if (landmarks && !isCameraReady) {
      setIsCameraReady(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavigationBar />

      <main className="flex-grow py-8 container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Virtual Try-On</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Camera View */}
          <div className="lg:col-span-2">
            <div className="bg-gray-100 rounded-lg overflow-hidden shadow-lg relative">
              {/* Instructions Overlay */}
              {showInstructions && (
                <div className="absolute inset-0 bg-black bg-opacity-75 z-20 flex items-center justify-center p-6">
                  <div className="bg-white rounded-lg p-8 max-w-md text-center">
                    <Camera className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                    <h3 className="text-xl font-bold mb-4">How to Use</h3>
                    <ul className="text-left space-y-3 mb-6">
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Position your face in the center of the frame</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Ensure good lighting for best results</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Select different glasses from the sidebar</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Keep your face centered for accurate positioning</span>
                      </li>
                    </ul>
                    <button
                      onClick={() => setShowInstructions(false)}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Got It, Start Try-On
                    </button>
                  </div>
                </div>
              )}

              {/* Camera Feed Container */}
              <div className="relative aspect-[4/3] bg-gray-900">
                {/* Face Detection Guide */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <div className="w-80 h-96 border-4 border-dashed border-white/50 rounded-3xl flex items-center justify-center">
                    <div className="text-white text-center">
                      <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm opacity-75">Position your face here</p>
                    </div>
                  </div>
                </div>

                {/* Face Detection Status */}
                {isCameraReady && (
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm z-10">
                    ✓ Face Detected
                  </div>
                )}

                {/* Camera Component */}
                <div className="w-full h-full">
                  <FaceDetector 
                    onFaceUpdate={handleFaceUpdate}
                    showOverlay={false}
                  />
                </div>

                {/* Virtual Glasses Overlay */}
                {faceData && (
                  <VirtualGlasses 
                    faceData={faceData}
                    modelName={selectedGlasses}
                  />
                )}
              </div>

              {/* Controls */}
              <div className="bg-white p-4 border-t border-gray-200 flex justify-between items-center">
                <button
                  onClick={() => setShowInstructions(true)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Show Instructions
                </button>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                  Capture Photo
                </button>
              </div>
            </div>
          </div>

          {/* Glasses Selection Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Select Glasses</h2>
              
              {/* Current Selection */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600 mb-1">Currently Trying</p>
                <p className="font-semibold">
                  {GLASSES_OPTIONS.find(g => g.id === selectedGlasses)?.name}
                </p>
                <p className="text-blue-600 font-bold">
                  {GLASSES_OPTIONS.find(g => g.id === selectedGlasses)?.price}
                </p>
              </div>

              {/* Glasses List */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {GLASSES_OPTIONS.map((glasses) => (
                  <button
                    key={glasses.id}
                    onClick={() => setSelectedGlasses(glasses.id)}
                    className={`w-full flex items-center p-3 rounded-lg border-2 transition ${
                      selectedGlasses === glasses.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="w-20 h-20 bg-gray-100 rounded-lg mr-3 flex-shrink-0">
                      <img 
                        src={glasses.image} 
                        alt={glasses.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="text-left flex-grow">
                      <h3 className="font-semibold text-sm">{glasses.name}</h3>
                      <p className="text-blue-600 font-bold">{glasses.price}</p>
                    </div>
                    {selectedGlasses === glasses.id && (
                      <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>

              {/* Add to Cart */}
              <button className="w-full mt-6 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition font-semibold">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}