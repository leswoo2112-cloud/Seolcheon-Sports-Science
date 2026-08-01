/* ==========================================
   Video Module
========================================== */

"use strict";

const VideoSystem={

    video:null,

    playing:false,

    duration:0,

    currentFrame:0,

    fps:30,

    file:null

};

/* ==========================================
   Initialize
========================================== */

document.addEventListener(

    "DOMContentLoaded",

    initializeVideo

);

function initializeVideo(){

    $("#videoInput")

    ?.addEventListener(

        "change",

        loadVideo

    );

    $("#playVideo")

    ?.addEventListener(

        "click",

        playVideo

    );

    $("#pauseVideo")

    ?.addEventListener(

        "click",

        pauseVideo

    );

    $("#analyzeVideo")

    ?.addEventListener(

        "click",

        analyzeVideo

    );

}

/* ==========================================
   Load Video
========================================== */

function loadVideo(event){

    const file=

        event.target.files[0];

    if(!file) return;

    VideoSystem.file=file;

    const url=

        URL.createObjectURL(file);

    const video=

        $("#analysisVideo");

    video.src=url;

    VideoSystem.video=video;

    video.onloadedmetadata=()=>{

        VideoSystem.duration=

            video.duration;

        showToast(

            "영상 불러오기 완료"

        );

    };

}

/* ==========================================
   Play
========================================== */

function playVideo(){

    if(!VideoSystem.video) return;

    VideoSystem.video.play();

    VideoSystem.playing=true;

}

/* ==========================================
   Pause
========================================== */

function pauseVideo(){

    if(!VideoSystem.video) return;

    VideoSystem.video.pause();

    VideoSystem.playing=false;

}
/* ==========================================
   Frame Control
========================================== */

function nextFrame(){

    if(!VideoSystem.video) return;

    VideoSystem.video.pause();

    VideoSystem.video.currentTime +=

        1/VideoSystem.fps;

}

function previousFrame(){

    if(!VideoSystem.video) return;

    VideoSystem.video.pause();

    VideoSystem.video.currentTime -=

        1/VideoSystem.fps;

}

/* ==========================================
   Slow Motion
========================================== */

function setPlaybackSpeed(speed){

    if(!VideoSystem.video) return;

    VideoSystem.video.playbackRate=speed;

}

function normalSpeed(){

    setPlaybackSpeed(1);

}

function slowMotion(){

    setPlaybackSpeed(0.25);

}

function halfSpeed(){

    setPlaybackSpeed(0.5);

}

/* ==========================================
   Capture Frame
========================================== */

function captureFrame(){

    if(!VideoSystem.video) return;

    const canvas=

        document.createElement("canvas");

    canvas.width=

        VideoSystem.video.videoWidth;

    canvas.height=

        VideoSystem.video.videoHeight;

    const ctx=

        canvas.getContext("2d");

    ctx.drawImage(

        VideoSystem.video,

        0,

        0

    );

    const link=

        document.createElement("a");

    link.download=

        "frame_"+Date.now()+".png";

    link.href=

        canvas.toDataURL("image/png");

    link.click();

}

/* ==========================================
   Analyze Current Frame
========================================== */

async function analyzeCurrentFrame(){

    if(

        !VideoSystem.video ||

        typeof analyzeFrame!=="function"

    ){

        return;

    }

    await analyzeFrame(

        VideoSystem.video

    );

}

/* ==========================================
   Analyze Video
========================================== */

async function analyzeVideo(){

    if(!VideoSystem.video){

        showToast(

            "영상을 먼저 선택하세요.",

            "error"

        );

        return;

    }

    showLoading(

        "영상 분석 중..."

    );

    await analyzeCurrentFrame();

    hideOverlay();

    showToast(

        "프레임 분석 완료"

    );

}
/* ==========================================
   Video Auto Analysis
========================================== */

const VideoAnalysis={

    running:false,

    results:[],

    frameInterval:5, // 5프레임마다 분석

    currentFrame:0

};

/* ==========================================
   Start Analysis
========================================== */

async function startVideoAnalysis(){

    if(!VideoSystem.video) return;

    VideoAnalysis.running=true;

    VideoAnalysis.results=[];

    VideoSystem.video.pause();

    const duration=VideoSystem.video.duration;

    const fps=VideoSystem.fps;

    const totalFrames=Math.floor(duration*fps);

    for(

        let frame=0;

        frame<totalFrames;

        frame+=VideoAnalysis.frameInterval

    ){

        if(!VideoAnalysis.running) break;

        VideoSystem.video.currentTime=

            frame/fps;

        await waitFrame();

        await analyzeCurrentFrame();

        VideoAnalysis.results.push({

            frame,

            time:VideoSystem.video.currentTime,

            score:Analysis.score,

            balance:Analysis.balance,

            posture:Analysis.posture,

            stability:Analysis.stability

        });

        updateVideoProgress(

            frame,

            totalFrames

        );

    }

    VideoAnalysis.running=false;

    finishVideoAnalysis();

}

/* ==========================================
   Wait
========================================== */

function waitFrame(){

    return new Promise(resolve=>{

        VideoSystem.video.onseeked=()=>{

            resolve();

        };

    });

}

/* ==========================================
   Stop
========================================== */

function stopVideoAnalysis(){

    VideoAnalysis.running=false;

}

/* ==========================================
   Progress
========================================== */

function updateVideoProgress(

    current,

    total

){

    const percent=Math.round(

        current/total*100

    );

    $("#videoProgress").value=

        percent;

    $("#videoProgressText").textContent=

        percent+"%";

}

/* ==========================================
   Finish
========================================== */

function finishVideoAnalysis(){

    hideOverlay();

    showToast(

        "영상 전체 분석 완료"

    );

    console.log(

        VideoAnalysis.results

    );

}