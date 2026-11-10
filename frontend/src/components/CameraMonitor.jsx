import { useEffect, useRef, useState } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

const WASM = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm";
const MODEL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

const CHECK_MS = 500; // check twice per second
const BAD_CHECKS_NEEDED = 4; // problem must last about 2 seconds
const WARNING_GAP_MS = 6000; // minimum time between two camera warnings
const MOVE_LIMIT = 0.12; // how far the head may move (0 to 1 of the frame)

export default function CameraMonitor({ onReady, onError, onWarning }) {
  const videoRef = useRef(null);
  const [status, setStatus] = useState("Starting camera...");

  // always keep the latest callbacks
  const callbacks = useRef({});
  callbacks.current = { onReady, onError, onWarning };

  useEffect(() => {
    let stream = null;
    let landmarker = null;
    let timer = null;
    let stopped = false;

    let calibration = [];
    let baseline = null;
    let badCount = 0;
    let lastWarning = 0;

    function check() {
      const video = videoRef.current;
      if (!video || video.readyState < 2 || !landmarker) return;

      const faces = landmarker.detectForVideo(video, performance.now()).faceLandmarks;
      let problem = null;

      if (faces.length === 0) {
        problem = "Face not visible. Please sit in front of the camera.";
      } else if (faces.length > 1) {
        problem = "More than one face detected.";
      } else {
        const nose = faces[0][1]; // landmark 1 = nose tip
        if (!baseline) {
          calibration.push({ x: nose.x, y: nose.y });
          if (calibration.length >= 6) {
            baseline = {
              x: calibration.reduce((s, p) => s + p.x, 0) / calibration.length,
              y: calibration.reduce((s, p) => s + p.y, 0) / calibration.length,
            };
          }
        } else if (
          Math.abs(nose.x - baseline.x) > MOVE_LIMIT ||
          Math.abs(nose.y - baseline.y) > MOVE_LIMIT
        ) {
          problem = "Please keep your face steady and look at the screen.";
        }
      }

      if (!problem) {
        badCount = 0;
        return;
      }
      badCount += 1;
      if (badCount >= BAD_CHECKS_NEEDED && Date.now() - lastWarning > WARNING_GAP_MS) {
        lastWarning = Date.now();
        badCount = 0;
        callbacks.current.onWarning(problem);
      }
    }

    async function init() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240 },
          audio: false,
        });
      } catch {
        callbacks.current.onError("Camera access is blocked. Allow the camera and refresh the page.");
        return;
      }

      if (stopped || !videoRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      videoRef.current.srcObject = stream;
      await videoRef.current.play().catch(() => {});
      callbacks.current.onReady();
      setStatus("Loading face check...");

      try {
        const files = await FilesetResolver.forVisionTasks(WASM);
        landmarker = await FaceLandmarker.createFromOptions(files, {
          baseOptions: { modelAssetPath: MODEL },
          runningMode: "VIDEO",
          numFaces: 2,
        });
      } catch {
        setStatus("Camera on (face check unavailable)");
        return;
      }

      if (stopped) {
        landmarker.close();
        return;
      }
      setStatus("Keep your face in the frame");
      timer = setInterval(check, CHECK_MS);
    }

    init();

    return () => {
      stopped = true;
      if (timer) clearInterval(timer);
      if (landmarker) landmarker.close();
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return (
    <div className="camera-box">
      <video ref={videoRef} muted playsInline />
      <div className="camera-status">{status}</div>
    </div>
  );
}