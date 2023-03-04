import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import * as hands from '@mediapipe/hands';
import * as cam from '@mediapipe/camera_utils';
import * as controls from '@mediapipe/control_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const connect = window.drawConnectors;
  var camera = null;

  const onResults = async (model) => {
    if(typeof webcamRef.current !== "undefined" && webcamRef.current !== null && webcamRef.current.video.readyState === 4){
      const video = webcamRef.current.video;

      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const ctx = canvasRef.current.getContext("2d");
      ctx.save();

      ctx.clearRect(0,0, videoWidth, videoHeight);
      ctx.drawImage(model.image, 0,0, videoWidth, videoHeight);
      console.log(model);
      if(model.multiHandLandmarks){
        for(const landmarks of model.multiHandLandmarks){
          drawConnectors(ctx, landmarks, hands.HAND_CONNECTIONS, {color: '#00FF00', lineWidth: 5});
          drawLandmarks(ctx, landmarks, {color: '#FF0000', lineWidth: 2});

        
        }
      }
    }
  };
  


  useEffect(() => {
    const hand = new hands.Hands({locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }});

    hand.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    hand.onResults(onResults);

    if (typeof webcamRef.current !== "undefined" && webcamRef.current !== null) {
      camera = new cam.Camera(webcamRef.current.video, {
        onFrame:async () => {
          await hand.send({image:webcamRef.current.video})
        },
        width: 1280,
        height: 1040,
      });
      camera.start();
    }
  });


  return (
    <div>
      <Webcam
          ref={webcamRef}
          audio={false}
          id="img"
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 1280,
            height: 1040,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 1280,
            height: 1040,
          }}
          id="myCanvas"
        />
    </div>
  );
}

export default App;
