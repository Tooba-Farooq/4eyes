import React, { useEffect, useRef, useState } from "react";
import { FilesetResolver, FaceLandmarker } from "@mediapipe/tasks-vision";

/**
 * Props:
 * - onFaceUpdate(landmarks)  : called with an array of 468 landmarks (or null if no face)
 * - showOverlay (bool)       : whether to draw landmarks on a canvas overlay (default true)
 * - maxFaces (number)        : how many faces to detect (default 1)
 */
export default function FaceDetector({
  onFaceUpdate = () => {},
  showOverlay = true,
  maxFaces = 1,
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const faceLandmarkerRef = useRef(null);
  const rafRef = useRef(null);
  const streamRef = useRef(null); // ADD THIS: Store stream reference
  const [isReady, setIsReady] = useState(false);

  // smoothing buffer to reduce jitter (optional)
  const lastResultRef = useRef(null);
  const SMOOTHING_ALPHA = 0.75; // 0 = no smoothing, closer to 1 = heavy smoothing

  useEffect(() => {
    let mounted = true;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
          audio: false,
        });
        if (!mounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream; // CHANGE: Store stream reference
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      } catch (err) {
        console.error("Camera start failed:", err);
      }
    }

    async function loadModel() {
      try {
        // FilesetResolver expects path to wasm and supporting files. This example uses the hosted mediapipe CDN.
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(
          vision,
          {
            baseOptions: {
              modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            },
            runningMode: "VIDEO",
            numFaces: maxFaces,
          }
        );

        setIsReady(true);
      } catch (err) {
        console.error("Failed to load MediaPipe FaceLandmarker:", err);
      }
    }

    startCamera();
    loadModel();

    return () => {
      mounted = false;
      
      // CHANGE: Stop camera stream when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      
      // Clear video source
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [maxFaces]);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext?.("2d");

    if (!video || !faceLandmarkerRef.current) return;

    const faceLandmarker = faceLandmarkerRef.current;

    // Resize canvas to match video display size
    function resizeCanvas() {
      if (!canvas || !video) return;
      const rect = video.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    }

    // map normalized landmark coords (0..1 from MediaPipe) to canvas pixel coords
    function normToCanvas(pt) {
      // MediaPipe's coordinates: x and y normalized relative to original input image.
      // Because we're using the video element as the input (and possibly CSS scaled),
      // map normalized coords to element pixel dims.
      const rect = video.getBoundingClientRect();
      return {
        x: pt.x * rect.width,
        y: pt.y * rect.height,
        z: pt.z ?? 0,
      };
    }

    function drawLandmarks(landmarks) {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!landmarks || landmarks.length === 0) return;

      // draw points
      ctx.fillStyle = "rgba(0,255,0,0.9)";
      for (let i = 0; i < landmarks.length; i++) {
        const p = normToCanvas(landmarks[i]);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // optionally draw eye-nose-ear references for debugging
      // left eye outer: 33, right eye outer: 263, nose tip/bridge: 1 or 168
      const ids = { leftEye: 33, rightEye: 263, noseTip: 168 };
      ctx.fillStyle = "rgba(255,0,0,0.95)";
      ["leftEye", "rightEye", "noseTip"].forEach((key) => {
        const id = ids[key];
        if (landmarks[id]) {
          const p = normToCanvas(landmarks[id]);
          ctx.beginPath();
          ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    }

    // main loop: uses requestAnimationFrame and detectForVideo
    let lastTime = performance.now();
    async function loop() {
      if (!video || video.readyState < 2 || !faceLandmarker) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      // MediaPipe prefers timestamps in ms
      const now = performance.now();
      try {
        const result = faceLandmarker.detectForVideo(video, now);
        // result.faceLandmarks is an array-of-arrays: one per face
        let landmarks = null;
        if (result && result.faceLandmarks && result.faceLandmarks.length > 0) {
          landmarks = result.faceLandmarks[0]; // we use first face
        }

        // optional simple smoothing to reduce jitter between frames
        if (landmarks && lastResultRef.current) {
          const prev = lastResultRef.current;
          const smoothed = landmarks.map((p, i) => {
            const prevP = prev[i] || p;
            return {
              x: SMOOTHING_ALPHA * prevP.x + (1 - SMOOTHING_ALPHA) * p.x,
              y: SMOOTHING_ALPHA * prevP.y + (1 - SMOOTHING_ALPHA) * p.y,
              z: SMOOTHING_ALPHA * (prevP.z ?? 0) + (1 - SMOOTHING_ALPHA) * (p.z ?? 0),
            };
          });
          landmarks = smoothed;
        }

        lastResultRef.current = landmarks;

        // send landmarks to parent
        onFaceUpdate(landmarks);

        if (showOverlay) drawLandmarks(landmarks);
      } catch (err) {
        // non-fatal: model may throw occasionally
        console.warn("Face detection error:", err);
      }

      lastTime = now;
      rafRef.current = requestAnimationFrame(loop);
    }

    // start loop after video plays
    function startLoopWhenReady() {
      if (!video) return;
      if (video.readyState >= 2) {
        resizeCanvas();
        rafRef.current = requestAnimationFrame(loop);
      } else {
        // wait until video can play
        const handle = () => {
          resizeCanvas();
          rafRef.current = requestAnimationFrame(loop);
          video.removeEventListener("loadeddata", handle);
        };
        video.addEventListener("loadeddata", handle);
      }
    }

    startLoopWhenReady();
    window.addEventListener("resize", resizeCanvas);

    // cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null; // CHANGE: Clear the reference
      }
    };
  }, [isReady, onFaceUpdate, showOverlay]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <video
        ref={videoRef}
        playsInline
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: "scaleX(-1)", // mirror so it feels like a selfie camera
        }}
      />
      {showOverlay && (
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            pointerEvents: "none",
            transform: "scaleX(-1)", // match mirror of video
            width: "100%",
            height: "100%",
          }}
        />
      )}
    </div>
  );
}