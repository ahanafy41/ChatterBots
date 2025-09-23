/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLiveAPIContext } from '../../../contexts/LiveAPIContext';

// Target 2 frames per second for performance on lower-end devices
const FPS = 2;
const FRAME_INTERVAL = 1000 / FPS;

export default function VideoFeed() {
  const { client, connected } = useLiveAPIContext();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [canSwitchCamera, setCanSwitchCamera] = useState(false);

  // Check for multiple cameras on mount
  useEffect(() => {
    async function checkDevices() {
      if (navigator.mediaDevices?.enumerateDevices) {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoInputs = devices.filter(
            device => device.kind === 'videoinput',
          );
          setCanSwitchCamera(videoInputs.length > 1);
        } catch (err) {
          console.error('Error enumerating devices:', err);
        }
      }
    }
    checkDevices();
  }, []);

  // Handle camera stream setup and teardown
  useEffect(() => {
    async function setupCamera() {
      // Stop any existing stream before opening a new one
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setVideoReady(false); // Reset ready state for new stream
        }
      } catch (err) {
        console.error(`Error accessing ${facingMode} camera:`, err);
      }
    }

    setupCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  // Function to capture and send a frame
  const captureAndSendFrame = useCallback(() => {
    if (
      videoRef.current &&
      canvasRef.current &&
      videoRef.current.readyState >= 2 // Check if video has enough data
    ) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        // Resize frame to improve performance on mobile devices
        const MAX_DIMENSION = 360;
        let { videoWidth: width, videoHeight: height } = video;

        if (width > height) {
          if (width > MAX_DIMENSION) {
            height = Math.round(height * (MAX_DIMENSION / width));
            width = MAX_DIMENSION;
          }
        } else {
          if (height > MAX_DIMENSION) {
            width = Math.round(width * (MAX_DIMENSION / height));
            height = MAX_DIMENSION;
          }
        }

        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);
        // Get base64 data, remove the prefix 'data:image/jpeg;base64,'
        const base64Data = canvas.toDataURL('image/jpeg', 0.5).split(',')[1];

        if (base64Data) {
          client.sendRealtimeInput([
            {
              mimeType: 'image/jpeg',
              data: base64Data,
            },
          ]);
        }
      }
    }
  }, [client]);

  // Start/stop frame capture based on connection status
  useEffect(() => {
    let lastFrameTime = 0;
    const captureLoop = (timestamp: number) => {
      animationFrameRef.current = requestAnimationFrame(captureLoop);

      if (timestamp - lastFrameTime < FRAME_INTERVAL) {
        return; // Skip if not enough time has passed
      }
      lastFrameTime = timestamp;
      captureAndSendFrame();
    };

    if (connected && videoReady) {
      // Start the loop
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(captureLoop);
    } else {
      // Stop the loop
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [connected, videoReady, captureAndSendFrame]);

  const handleSwitchCamera = () => {
    setFacingMode(prevMode => (prevMode === 'user' ? 'environment' : 'user'));
  };

  return (
    <div
      className="absolute bottom-28 right-4 rtl:right-auto rtl:left-4 w-52 h-39 md:w-64 md:h-48 rounded-xl overflow-hidden border-2 border-gray-700 shadow-lg z-20 bg-black"
      aria-label="معاينة كاميرا المستخدم"
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        onLoadedData={() => setVideoReady(true)}
        className="w-full h-full object-cover scale-x-[-1]"
        aria-hidden="true"
      />
      <canvas ref={canvasRef} style={{ display: 'none' }} aria-hidden="true" />
      {canSwitchCamera && (
        <button
          className="absolute top-2 right-2 z-10 bg-black/50 rounded-full p-2 text-white hover:bg-black/75 transition-colors"
          onClick={handleSwitchCamera}
          aria-label={
            facingMode === 'user'
              ? 'التبديل إلى الكاميرا الخلفية'
              : 'التبديل إلى الكاميرا الأمامية'
          }
        >
          <span className="icon">cameraswitch</span>
        </button>
      )}
    </div>
  );
}
