/* ==========================================
   Camera
========================================== */

"use strict";

const CameraSystem = {

    stream: null,

    recorder: null,

    chunks: [],

    facingMode: "environment",

    devices: [],

    currentDeviceId: null,

    fps: 0,

    fpsTimer: 0

};

/* ==========================================
   Init
========================================== */

document.addEventListener(

    "DOMContentLoaded",

    initializeCamera

);

function initializeCamera() {

    $("#startCameraButton")?.addEventListener(

        "click",

        startCamera

    );

    $("#stopCameraButton")?.addEventListener(

        "click",

        stopCamera

    );

    $("#switchCameraButton")?.addEventListener(

        "click",

        switchCamera

    );

    $("#captureButton")?.addEventListener(

        "click",

        captureImage

    );

    $("#recordButton")?.addEventListener(

        "click",

        toggleRecording

    );

    $("#fullscreenButton")?.addEventListener(

        "click",

        fullscreenCamera

    );

}

/* ==========================================
   Start Camera
========================================== */

async function startCamera() {

    try {

        stopCamera();

        CameraSystem.stream =

            await navigator.mediaDevices.getUserMedia({

                video: {

                    facingMode:

                        CameraSystem.facingMode,

                    width: {

                        ideal: 1920

                    },

                    height: {

                        ideal: 1080

                    }

                },

                audio: false

            });

        const video = $("#cameraVideo");

        video.srcObject =

            CameraSystem.stream;

        await video.play();

        showToast("카메라 시작");

        detectDevices();

    }

    catch (error) {

        console.error(error);

        showToast(

            "카메라 접근 실패",

            "error"

        );

    }

}

/* ==========================================
   Stop Camera
========================================== */

function stopCamera() {

    if (!CameraSystem.stream) return;

    CameraSystem.stream

        .getTracks()

        .forEach(track => {

            track.stop();

        });

    CameraSystem.stream = null;

}
/* ==========================================
   Detect Camera
========================================== */

async function detectDevices() {

    try {

        const devices =

            await navigator.mediaDevices.enumerateDevices();

        CameraSystem.devices =

            devices.filter(

                device => device.kind === "videoinput"

            );

        console.log(

            CameraSystem.devices

        );

    }

    catch (error) {

        console.error(error);

    }

}

/* ==========================================
   Switch Camera
========================================== */

async function switchCamera() {

    if (CameraSystem.devices.length < 2) {

        CameraSystem.facingMode =

            CameraSystem.facingMode === "user"

                ? "environment"

                : "user";

    }

    else {

        const current =

            CameraSystem.devices.findIndex(

                device =>

                    device.deviceId ===

                    CameraSystem.currentDeviceId

            );

        const next =

            (current + 1) %

            CameraSystem.devices.length;

        CameraSystem.currentDeviceId =

            CameraSystem.devices[next].deviceId;

    }

    await restartCamera();

}

/* ==========================================
   Restart
========================================== */

async function restartCamera() {

    stopCamera();

    try {

        let constraint = {

            video: {}

        };

        if (CameraSystem.currentDeviceId) {

            constraint.video.deviceId = {

                exact:

                CameraSystem.currentDeviceId

            };

        }

        else {

            constraint.video.facingMode =

                CameraSystem.facingMode;

        }

        CameraSystem.stream =

            await navigator.mediaDevices.getUserMedia(

                constraint

            );

        const video =

            $("#cameraVideo");

        video.srcObject =

            CameraSystem.stream;

        await video.play();

        showToast(

            "카메라 전환 완료"

        );

    }

    catch (error) {

        console.error(error);

        showToast(

            "카메라 전환 실패",

            "error"

        );

    }

}

/* ==========================================
   FPS
========================================== */

function startFPSCounter() {

    let last = performance.now();

    let frames = 0;

    function loop(now) {

        frames++;

        if (now - last >= 1000) {

            CameraSystem.fps = frames;

            frames = 0;

            last = now;

            updateFPS();

        }

        requestAnimationFrame(loop);

    }

    requestAnimationFrame(loop);

}

function updateFPS() {

    let fpsElement =

        document.getElementById("fpsValue");

    if (!fpsElement) return;

    fpsElement.textContent =

        CameraSystem.fps + " FPS";

}
/* ==========================================
   Capture
========================================== */

function captureImage() {

    const video = $("#cameraVideo");

    if (!video || !CameraSystem.stream) {

        showToast("카메라가 실행되지 않았습니다.","error");

        return;

    }

    const canvas = document.createElement("canvas");

    canvas.width = video.videoWidth;

    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(

        video,

        0,

        0,

        canvas.width,

        canvas.height

    );

    const link = document.createElement("a");

    link.download =

        `capture_${Date.now()}.png`;

    link.href = canvas.toDataURL("image/png");

    link.click();

    showToast("사진 저장 완료");

}

/* ==========================================
   Recording
========================================== */

function toggleRecording() {

    if (CameraSystem.recorder &&
        CameraSystem.recorder.state === "recording") {

        stopRecording();

    } else {

        startRecording();

    }

}

function startRecording() {

    if (!CameraSystem.stream) {

        showToast("카메라를 먼저 실행하세요.","error");

        return;

    }

    CameraSystem.chunks = [];

    CameraSystem.recorder = new MediaRecorder(

        CameraSystem.stream,

        {

            mimeType:"video/webm"

        }

    );

    CameraSystem.recorder.ondataavailable = e=>{

        if(e.data.size>0){

            CameraSystem.chunks.push(e.data);

        }

    };

    CameraSystem.recorder.onstop = saveRecording;

    CameraSystem.recorder.start();

    $("#recordButton").textContent="■ 녹화 종료";

    showToast("녹화 시작");

}

function stopRecording(){

    if(!CameraSystem.recorder) return;

    CameraSystem.recorder.stop();

    $("#recordButton").textContent="🎥 녹화 시작";

    showToast("녹화 종료");

}

function saveRecording(){

    const blob=new Blob(

        CameraSystem.chunks,

        {

            type:"video/webm"

        }

    );

    const url=URL.createObjectURL(blob);

    const a=document.createElement("a");

    a.href=url;

    a.download=

        `record_${Date.now()}.webm`;

    a.click();

    URL.revokeObjectURL(url);

}

/* ==========================================
   Full Screen
========================================== */

async function fullscreenCamera(){

    const element=document.querySelector(".camera-view");

    if(!element) return;

    if(document.fullscreenElement){

        document.exitFullscreen();

        return;

    }

    if(element.requestFullscreen){

        await element.requestFullscreen();

    }

}

/* ==========================================
   Mirror
========================================== */

function setMirror(enable=true){

    const video=$("#cameraVideo");

    if(!video) return;

    video.style.transform=

        enable

        ? "scaleX(-1)"

        : "scaleX(1)";

}

/* ==========================================
   Snapshot
========================================== */

function snapshot(){

    captureImage();

}

/* ==========================================
   Status
========================================== */

function isCameraRunning(){

    return CameraSystem.stream!==null;

}
/* ==========================================
   Camera Status
========================================== */

function updateCameraStatus(message){

    const status=document.getElementById("cameraStatus");

    if(status){

        status.textContent=message;

    }

}

/* ==========================================
   Frame Loop
========================================== */

let cameraAnimationId=null;

function startFrameLoop(){

    stopFrameLoop();

    const video=$("#cameraVideo");

    function render(){

        if(video && video.readyState>=2){

            if(typeof analyzeFrame==="function"){

                analyzeFrame(video);

            }

        }

        cameraAnimationId=requestAnimationFrame(render);

    }

    render();

}

function stopFrameLoop(){

    if(cameraAnimationId){

        cancelAnimationFrame(cameraAnimationId);

        cameraAnimationId=null;

    }

}

/* ==========================================
   Device Change
========================================== */

if(navigator.mediaDevices){

    navigator.mediaDevices.addEventListener(

        "devicechange",

        async()=>{

            await detectDevices();

            showToast("카메라 목록이 업데이트되었습니다.");

        }

    );

}

/* ==========================================
   Permission
========================================== */

async function checkCameraPermission(){

    if(!navigator.permissions) return;

    try{

        const permission=

            await navigator.permissions.query({

                name:"camera"

            });

        console.log(

            "Camera Permission :",

            permission.state

        );

    }

    catch(e){

        console.log(e);

    }

}

/* ==========================================
   Destroy
========================================== */

function destroyCamera(){

    stopFrameLoop();

    stopCamera();

}

/* ==========================================
   Restart Complete
========================================== */

async function restartCamera(){

    stopFrameLoop();

    stopCamera();

    await startCamera();

    startFrameLoop();

}

/* ==========================================
   Start Camera Override
========================================== */

const _startCamera=startCamera;

startCamera=async function(){

    await _startCamera();

    startFrameLoop();

    updateCameraStatus("🟢 카메라 연결");

};

/* ==========================================
   Stop Camera Override
========================================== */

const _stopCamera=stopCamera;

stopCamera=function(){

    stopFrameLoop();

    _stopCamera();

    updateCameraStatus("🔴 카메라 종료");

};

/* ==========================================
   Before Unload
========================================== */

window.addEventListener(

    "beforeunload",

    ()=>{

        destroyCamera();

    }

);

/* ==========================================
   Camera Ready
========================================== */

console.log("📷 Camera Module Loaded");