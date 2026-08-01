/* ==========================================
   Analysis Engine
========================================== */

"use strict";

const Analysis = {

    pose: null,

    initialized: false,

    landmarks: [],

    score: 0,

    balance: 0,

    posture: 0,

    stability: 0,

    sport: "바이애슬론"

};

/* ==========================================
   Initialize
========================================== */

async function initializeAnalysis(){

    Analysis.pose = new Pose({

        locateFile:(file)=>{

            return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;

        }

    });

    Analysis.pose.setOptions({

        modelComplexity:2,

        smoothLandmarks:true,

        enableSegmentation:false,

        smoothSegmentation:true,

        minDetectionConfidence:0.6,

        minTrackingConfidence:0.6

    });

    Analysis.pose.onResults(onPoseResults);

    Analysis.initialized=true;

    console.log("🤖 Analysis Ready");

}

/* ==========================================
   Receive Frame
========================================== */

async function analyzeFrame(video){

    if(!Analysis.initialized){

        return;

    }

    await Analysis.pose.send({

        image:video

    });

}

/* ==========================================
   Pose Result
========================================== */

function onPoseResults(results){

    if(!results.poseLandmarks){

        return;

    }

    Analysis.landmarks=

        results.poseLandmarks;

    drawSkeleton(results);

    calculateAnalysis();

}
/* ==========================================
   Draw Skeleton
========================================== */

function drawSkeleton(results){

    const canvas=$("#poseCanvas");

    if(!canvas) return;

    const ctx=canvas.getContext("2d");

    canvas.width=canvas.clientWidth;
    canvas.height=canvas.clientHeight;

    ctx.clearRect(

        0,
        0,
        canvas.width,
        canvas.height

    );

    drawConnectors(

        ctx,

        results.poseLandmarks,

        POSE_CONNECTIONS,

        {

            color:"#4F8CFF",

            lineWidth:4

        }

    );

    drawLandmarks(

        ctx,

        results.poseLandmarks,

        {

            color:"#22C55E",

            fillColor:"#FFFFFF",

            radius:5

        }

    );

}

/* ==========================================
   Landmark Shortcut
========================================== */

function lm(index){

    return Analysis.landmarks[index];

}

/* ==========================================
   Calculate Angle
========================================== */

function calculateAngle(a,b,c){

    const ab={

        x:a.x-b.x,

        y:a.y-b.y

    };

    const cb={

        x:c.x-b.x,

        y:c.y-b.y

    };

    const dot=

        ab.x*cb.x+

        ab.y*cb.y;

    const mag1=Math.sqrt(

        ab.x**2+

        ab.y**2

    );

    const mag2=Math.sqrt(

        cb.x**2+

        cb.y**2

    );

    let angle=Math.acos(

        dot/(mag1*mag2)

    );

    angle=

        angle*180/Math.PI;

    return Math.round(angle);

}

/* ==========================================
   Joint Angles
========================================== */

function calculateJointAngles(){

    Analysis.leftKnee=

        calculateAngle(

            lm(23),

            lm(25),

            lm(27)

        );

    Analysis.rightKnee=

        calculateAngle(

            lm(24),

            lm(26),

            lm(28)

        );

    Analysis.leftElbow=

        calculateAngle(

            lm(11),

            lm(13),

            lm(15)

        );

    Analysis.rightElbow=

        calculateAngle(

            lm(12),

            lm(14),

            lm(16)

        );

}

/* ==========================================
   Balance
========================================== */

function calculateBalance(){

    const shoulder=

        Math.abs(

            lm(11).y-

            lm(12).y

        );

    const hip=

        Math.abs(

            lm(23).y-

            lm(24).y

        );

    Analysis.balance=

        Math.max(

            0,

            100-

            Math.round(

                (shoulder+hip)*200

            )

        );

}
/* ==========================================
   AI Analysis
========================================== */

function calculateAnalysis(){

    calculateJointAngles();

    calculateBalance();

    calculatePosture();

    calculateStability();

    calculateScore();

    updateAnalysisUI();

}

/* ==========================================
   Posture
========================================== */

function calculatePosture(){

    const shoulderTilt=

        Math.abs(

            lm(11).y-

            lm(12).y

        );

    const hipTilt=

        Math.abs(

            lm(23).y-

            lm(24).y

        );

    const bodyTilt=

        shoulderTilt+hipTilt;

    Analysis.posture=

        Math.max(

            0,

            100-

            Math.round(bodyTilt*180)

        );

}

/* ==========================================
   Stability
========================================== */

function calculateStability(){

    const kneeGap=

        Math.abs(

            Analysis.leftKnee-

            Analysis.rightKnee

        );

    const elbowGap=

        Math.abs(

            Analysis.leftElbow-

            Analysis.rightElbow

        );

    Analysis.stability=

        Math.max(

            0,

            100-

            Math.round(

                (kneeGap+elbowGap)/2

            )

        );

}

/* ==========================================
   AI Score
========================================== */

function calculateScore(){

    Analysis.score=Math.round(

        Analysis.balance*0.35+

        Analysis.posture*0.35+

        Analysis.stability*0.30

    );

}

/* ==========================================
   Update UI
========================================== */

function updateAnalysisUI(){

    $("#aiScore").textContent=

        Analysis.score;

    $("#balanceScore").textContent=

        Analysis.balance+"%";

    $("#nationalCompare").textContent=

        Math.min(

            100,

            Analysis.score

        )+"%";

    $("#injuryRisk").textContent=

        getRisk();

}

/* ==========================================
   Injury Risk
========================================== */

function getRisk(){

    if(Analysis.score>=90)

        return "매우 안전";

    if(Analysis.score>=80)

        return "안전";

    if(Analysis.score>=70)

        return "주의";

    if(Analysis.score>=60)

        return "위험";

    return "매우 위험";

}

/* ==========================================
   Save Result
========================================== */

function saveAnalysisResult(){

    App.analysis.push({

        date:new Date().toLocaleString(),

        sport:Analysis.sport,

        score:Analysis.score,

        balance:Analysis.balance,

        posture:Analysis.posture,

        stability:Analysis.stability

    });

    saveStorage();

    refreshApp();

}
/* ==========================================
   National Compare
========================================== */

const NationalStandard = {

    default:95,

    biathlon:96,

    athletics:95,

    basketball:94,

    soccer:94,

    volleyball:94,

    baseball:94,

    golf:95,

    taekwondo:96,

    swimming:95,

    college:90

};

function compareNational(){

    const target=

        NationalStandard[Analysis.sport.toLowerCase()] ??

        NationalStandard.default;

    const percent=Math.round(

        (Analysis.score/target)*100

    );

    $("#nationalCompare").textContent=

        Math.min(percent,100)+"%";

    return percent;

}

/* ==========================================
   AI Coach
========================================== */

function generateCoachComment(){

    let comments=[];

    if(Analysis.balance<85){

        comments.push(

            "⚖ 좌우 균형을 개선하세요."

        );

    }

    if(Analysis.posture<85){

        comments.push(

            "🦴 상체 자세가 무너집니다."

        );

    }

    if(Analysis.stability<85){

        comments.push(

            "🦵 하체 안정성이 부족합니다."

        );

    }

    if(Analysis.leftKnee<150){

        comments.push(

            "📐 왼쪽 무릎 각도를 조금 더 펴세요."

        );

    }

    if(Analysis.rightKnee<150){

        comments.push(

            "📐 오른쪽 무릎 각도를 조금 더 펴세요."

        );

    }

    if(comments.length===0){

        comments.push(

            "🏆 국가대표 수준의 자세입니다."

        );

    }

    $("#reportFeedback").innerHTML=

        comments.join("<br>");

}

/* ==========================================
   Sport Analysis
========================================== */

function analyzeSport(){

    switch(Analysis.sport){

        case "바이애슬론":

            analyzeBiathlon();

            break;

        case "육상":

            analyzeAthletics();

            break;

        case "농구":

            analyzeBasketball();

            break;

        case "축구":

            analyzeSoccer();

            break;

        case "체대입시":

            analyzeCollege();

            break;

        default:

            break;

    }

}

/* ==========================================
   Placeholder
========================================== */

function analyzeBiathlon(){}

function analyzeAthletics(){}

function analyzeBasketball(){}

function analyzeSoccer(){}

function analyzeCollege(){}

/* ==========================================
   Refresh
========================================== */

function refreshAnalysis(){

    compareNational();

    generateCoachComment();

}