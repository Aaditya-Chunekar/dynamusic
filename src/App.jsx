// import React, { useEffect, useRef, useState } from "react";
// import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
// import hand_landmarker_task from "/src/hand_landmarker.task";
// import "/src/index.css";
//
// const Demo = () => {
//     const videoRef = useRef(null);
//     const canvasRef = useRef(null);
//     const [songName, setSongName] = useState("");
//     const [audioFile, setAudioFile] = useState(null);
//
//     const handleDrop = (e) => {
//         e.preventDefault();
//         const file = e.dataTransfer.files[0];
//
//         if (file && file.type.startsWith("audio/")) {
//             const audioURL = URL.createObjectURL(file);
//             setAudioFile(audioURL);
//             setSongName(file.name);
//
//             const externalAudio = document.getElementById("myAudio");
//             if (externalAudio) {
//                 externalAudio.src = audioURL;
//                 externalAudio.load();
//             }
//         } else {
//             alert("Please drop a valid audio file.");
//         }
//     };
//
//     const handleDragOver = (e) => {
//         e.preventDefault();
//     };
//
//     useEffect(() => {
//         let handLandmarker;
//         let animationFrameId;
//
//         const initializeHandDetection = async () => {
//             try {
//                 const vision = await FilesetResolver.forVisionTasks(
//                     "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
//                 );
//                 handLandmarker = await HandLandmarker.createFromOptions(vision, {
//                     baseOptions: { modelAssetPath: hand_landmarker_task },
//                     numHands: 2,
//                     runningMode: "VIDEO",
//                     delegate: "GPU"
//                 });
//                 detectHands();
//             } catch (error) {
//                 console.error("Error initializing hand detection:", error);
//             }
//         };
//
//         function mapRange(value, inMin, inMax, outMin, outMax) {
//             console.log("dist test",value);
//             return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
//         }
//
//         function getDistance(x1, y1, x2, y2) {
//             const dx = x2 - x1;
//             const dy = y2 - y1;
//             return Math.sqrt(dx * dx + dy * dy);
//         }
//
//         function changeSpeed(val) {
//             console.log(val);
//             document.getElementById("myAudio").playbackRate = val;
//         }
//
//         const drawLandmarks = (landmarksArray) => {
//             const canvas = canvasRef.current;
//             const ctx = canvas.getContext("2d");
//             ctx.save();
//             ctx.clearRect(0, 0, canvas.width, canvas.height);
//
//             landmarksArray.forEach((landmarks) => {
//                 const thumbTip = landmarks[4];
//                 const indexTip = landmarks[8];
//
//                 if (thumbTip && indexTip) {
//                     const x1 = thumbTip.x * canvas.width;
//                     const y1 = thumbTip.y * canvas.height;
//                     const x2 = indexTip.x * canvas.width;
//                     const y2 = indexTip.y * canvas.height;
//
//                     ctx.beginPath();
//                     ctx.arc(x1, y1, 8, 0, 2 * Math.PI);
//                     ctx.fillStyle = "white";
//                     ctx.fill();
//
//                     ctx.beginPath();
//                     ctx.arc(x2, y2, 8, 0, 2 * Math.PI);
//                     ctx.fillStyle = "white";
//                     ctx.fill();
//
//                     ctx.beginPath();
//                     ctx.moveTo(x1, y1);
//                     ctx.lineTo(x2, y2);
//                     ctx.strokeStyle = "white";
//                     ctx.lineWidth = 4;
//                     ctx.stroke();
//
//                     const speed = mapRange(getDistance(thumbTip.x, thumbTip.y, indexTip.x, indexTip.y), 0.02, 0.5, 0.5, 2);
//                     const clampedSpeed = Math.max(0.5, Math.min(2, speed));
//                     changeSpeed(clampedSpeed);
//                 }
//             });
//
//             ctx.restore();
//         };
//
//         const detectHands = async () => {
//             const video = videoRef.current;
//             if (!handLandmarker || !video || video.readyState < 2) {
//                 animationFrameId = requestAnimationFrame(detectHands);
//                 return;
//             }
//
//             const results = handLandmarker.detectForVideo(video, performance.now());
//
//             if (results.landmarks) {
//                 drawLandmarks(results.landmarks);
//             }
//             animationFrameId = requestAnimationFrame(detectHands);
//         };
//
//         const startWebcam = async () => {
//             try {
//                 const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//                 const video = videoRef.current;
//                 video.srcObject = stream;
//                 video.onloadedmetadata = () => {
//                     const canvas = canvasRef.current;
//                     canvas.width = video.videoWidth;
//                     canvas.height = video.videoHeight;
//                     initializeHandDetection();
//                 };
//             } catch (error) {
//                 console.error("Error accessing webcam:", error);
//             }
//         };
//
//         startWebcam();
//
//         return () => {
//             if (videoRef.current && videoRef.current.srcObject) {
//                 videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
//             }
//             if (handLandmarker) {
//                 handLandmarker.close();
//             }
//             if (animationFrameId) {
//                 cancelAnimationFrame(animationFrameId);
//             }
//         };
//     }, []);
//
//     return (
//         <>
//             <link rel="preconnect" href="https://fonts.googleapis.com" />
//                         <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
//                          <link href="https://fonts.googleapis.com/css2?family=Zen+Dots&display=swap" rel="stylesheet" />
//                          <link rel="preconnect" href="https://fonts.googleapis.com" />
//                          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
//                          <link href="https://fonts.googleapis.com/css2?family=Doto:wght@700&display=swap" rel="stylesheet" />
//             <div className="bg-[#a0430a] w-screen h-screen overflow-auto">
//                 <div className="flex flex-col justify-center items-center pt-6">
//                     <h1 className="w-fit font-zen-dots-regular text-7xl text-transparent bg-clip-text bg-gradient-to-r from-white to-[#5FBCF5]">
//                         dynamusic
//                     </h1>
//                     <h2 className="m-5 font-doto-bold font-white text-white text-2xl">Pinch to slow down. Expand to speed it.</h2>
//                 </div>
//
//                 <div className="flex justify-center items-start gap-8 p-10">
//                     {/* Video + Canvas */}
//                     <div className="relative w-[640px] h-[480px]">
//                         <video
//                             className="rounded-2xl absolute top-0 left-0 w-full h-full object-cover"
//                             ref={videoRef}
//                             autoPlay
//                             playsInline
//                             muted
//                         />
//                         <canvas
//                             ref={canvasRef}
//                             className="rounded-2xl absolute top-0 left-0 w-full h-full pointer-events-none"
//                         />
//                     </div>
//
//                     {/* Drag & Drop */}
//                     <div
//                         className="w-[640px] h-[480px] flex flex-col items-center justify-center w-64 h-64 border-4 border-dashed border-blue-400 rounded-2xl p-4 bg-gray-900 text-white"
//                         onDrop={handleDrop}
//                         onDragOver={handleDragOver}
//                     >
//                         <p className="text-lg text-center">Drag & drop your audio file here</p>
//                         {audioFile && (
//                             <p className="mt-2 text-green-400 font-semibold text-center">
//                                 Now Playing: {songName}
//                             </p>
//                         )}
//                     </div>
//                 </div>
//
//                 <div className="flex flex-col items-center">
//                     <audio id="myAudio" controls className="mt-4">
//                         <source type="audio/mpeg" />
//                         Your browser does not support the audio element.
//                     </audio>
//                 </div>
//             </div>
//         </>
//     );
// };
//
// export default Demo;
import React, { useEffect, useRef, useState } from "react";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import hand_landmarker_task from "/src/hand_landmarker.task";
import "/src/index.css";

const Demo = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [songName, setSongName] = useState("");
    const [audioFile, setAudioFile] = useState(null);
    const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("audio/")) {
            const audioURL = URL.createObjectURL(file);
            setAudioFile(audioURL);
            setSongName(file.name);
            const externalAudio = document.getElementById("myAudio");
            if (externalAudio) {
                externalAudio.src = audioURL;
                externalAudio.load();
            }
        } else {
            alert("Please drop a valid audio file.");
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    useEffect(() => {
        let handLandmarker;
        let animationFrameId;

        const initializeHandDetection = async () => {
            try {
                const vision = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
                );
                handLandmarker = await HandLandmarker.createFromOptions(vision, {
                    baseOptions: { modelAssetPath: hand_landmarker_task },
                    numHands: 2,
                    runningMode: "VIDEO",
                    delegate: "GPU"
                });
                detectHands();
            } catch (error) {
                console.error("Error initializing hand detection:", error);
            }
        };

        function getDistance(x1, y1, x2, y2) {
            const dx = x2 - x1;
            const dy = y2 - y1;
            return Math.sqrt(dx * dx + dy * dy);
        }

        function mapRange(value, inMin, inMax, outMin, outMax) {
            return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
        }

        function changeSpeed(val) {
            const clamped = Math.max(0.5, Math.min(2, val));
            const rounded = parseFloat(clamped.toFixed(1));
            setPlaybackSpeed(rounded);
            document.getElementById("myAudio").playbackRate = rounded;
        }

        const drawLandmarks = (landmarksArray) => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            ctx.save();
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            landmarksArray.forEach((landmarks) => {
                const thumbTip = landmarks[4];
                const indexTip = landmarks[8];

                if (thumbTip && indexTip) {
                    const x1 = thumbTip.x * canvas.width;
                    const y1 = thumbTip.y * canvas.height;
                    const x2 = indexTip.x * canvas.width;
                    const y2 = indexTip.y * canvas.height;

                    // Draw points and connecting line
                    ctx.beginPath();
                    ctx.arc(x1, y1, 8, 0, 2 * Math.PI);
                    ctx.fillStyle = "white";
                    ctx.fill();

                    ctx.beginPath();
                    ctx.arc(x2, y2, 8, 0, 2 * Math.PI);
                    ctx.fillStyle = "white";
                    ctx.fill();

                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.strokeStyle = "white";
                    ctx.lineWidth = 4;
                    ctx.stroke();

                    const screenDistance = getDistance(thumbTip.x, thumbTip.y, indexTip.x, indexTip.y);
                    const speed = mapRange(screenDistance, 0.02, 0.5, 0.5, 2);
                    changeSpeed(speed);
                }
            });

            ctx.restore();
        };

        const detectHands = async () => {
            const video = videoRef.current;
            if (!handLandmarker || !video || video.readyState < 2) {
                animationFrameId = requestAnimationFrame(detectHands);
                return;
            }

            const results = handLandmarker.detectForVideo(video, performance.now());

            if (results.landmarks) {
                drawLandmarks(results.landmarks);
            }
            animationFrameId = requestAnimationFrame(detectHands);
        };

        const startWebcam = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                const video = videoRef.current;
                video.srcObject = stream;
                video.onloadedmetadata = () => {
                    const canvas = canvasRef.current;
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    initializeHandDetection();
                };
            } catch (error) {
                console.error("Error accessing webcam:", error);
            }
        };

        startWebcam();

        return () => {
            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
            }
            handLandmarker?.close();
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link href="https://fonts.googleapis.com/css2?family=Zen+Dots&display=swap" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/css2?family=Doto:wght@700&display=swap" rel="stylesheet" />
            <div className="bg-[#a0430a] w-screen h-screen overflow-auto">
                <div className="flex flex-col justify-center items-center pt-6">
                    <h1 className="w-fit font-zen-dots-regular text-7xl text-transparent bg-clip-text bg-gradient-to-r from-white to-[#5FBCF5]">
                        dynamusic
                    </h1>
                    <h2 className="m-5 font-doto-bold text-white text-2xl">Pinch to slow down. Expand to speed up.</h2>
                    <div className="w-1/2 flex flex-col items-center">
                        <label className="text-lg mb-1">Speed: {playbackSpeed.toFixed(1)}x</label>
                        <div className="flex justify-between w-full text-sm mb-1">
                            <span>0.5x</span>
                            <span>2.0x</span>
                        </div>
                        <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={playbackSpeed}
                            readOnly
                            className="w-full accent-blue-400"
                        />
                    </div>
                </div>

                <div className="flex justify-center items-start gap-8 p-10">
                    <div className="relative w-[640px] h-[480px]">
                        <video
                            className="rounded-2xl absolute top-0 left-0 w-full h-full object-cover"
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                        />
                        <canvas
                            ref={canvasRef}
                            className="rounded-2xl absolute top-0 left-0 w-full h-full pointer-events-none"
                        />
                    </div>

                    <div className="flex flex-row justify-center items-center w-[640px] h-[480px]">

                        <div
                            className="w-full h-full flex flex-row items-center justify-center border-4 border-dashed border-blue-400 rounded-2xl p-4 bg-gray-900 text-white"
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                        >
                            <p className="text-lg text-center">Drag & drop your audio file here</p>
                            {audioFile && (
                                <p className="mt-2 text-green-400 font-semibold text-center">
                                    Now Playing: {songName}
                                </p>
                            )}
                            <div className="w-full h-[30%] flex flex-col items-center text-white mt-6">
                                <audio id="myAudio" controls className="mt-4 mb-2">
                                    <source type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </>
    );
};

export default Demo;
