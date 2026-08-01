/* ==========================================
   SSPRO AI Engine V4
========================================== */

"use strict";

const AIEngine={

    version:"4.0",

    confidence:0,

    quality:0,

    symmetry:0,

    movement:0,

    stability:0,

    score:0

};

/* ==========================================
   Start AI
========================================== */

function runAIEngine(){

    calculateSymmetryScore();

    calculateMovementQuality();

    calculateStabilityScore();

    calculateConfidence();

    calculateFinalScore();

}

/* ==========================================
   Symmetry
========================================== */

function calculateSymmetryScore(){

    const leftArm=

        calculateAngle(

            lm(11),

            lm(13),

            lm(15)

        );

    const rightArm=

        calculateAngle(

            lm(12),

            lm(14),

            lm(16)

        );

    const gap=

        Math.abs(

            leftArm-rightArm

        );

    AIEngine.symmetry=

        Math.max(

            0,

            100-gap

        );

}

/* ==========================================
   Movement
========================================== */

function calculateMovementQuality(){

    AIEngine.movement=

        Math.round(

            (

                Analysis.balance+

                Analysis.posture+

                Analysis.stability

            )/3

        );

}

/* ==========================================
   Stability
========================================== */

function calculateStabilityScore(){

    AIEngine.stability=

        Analysis.stability;

}
/* ==========================================
   Confidence
========================================== */

function calculateConfidence(){

    AIEngine.confidence=

        Math.round(

            (

                AIEngine.symmetry+

                AIEngine.movement+

                AIEngine.stability

            )/3

        );

}

/* ==========================================
   Final Score
========================================== */

function calculateFinalScore(){

    AIEngine.score=

        Math.round(

            AIEngine.confidence*0.35+

            AIEngine.symmetry*0.25+

            AIEngine.movement*0.20+

            AIEngine.stability*0.20

        );

}

/* ==========================================
   Export
========================================== */

window.AIEngine=AIEngine;

console.log(

    "🤖 AI Engine V4 Loaded"

);
/* ==========================================
   Motion Quality
========================================== */

const Motion={

    frames:[],

    smoothness:0,

    consistency:0

};

function recordFrame(){

    Motion.frames.push({

        score:AIEngine.score,

        balance:Analysis.balance,

        posture:Analysis.posture,

        stability:Analysis.stability,

        time:performance.now()

    });

    if(Motion.frames.length>300){

        Motion.frames.shift();

    }

}

/* ==========================================
   Smoothness
========================================== */

function calculateSmoothness(){

    if(Motion.frames.length<2){

        return 100;

    }

    let total=0;

    for(

        let i=1;

        i<Motion.frames.length;

        i++

    ){

        total+=Math.abs(

            Motion.frames[i].score-

            Motion.frames[i-1].score

        );

    }

    Motion.smoothness=Math.max(

        0,

        100-

        Math.round(

            total/

            Motion.frames.length

        )

    );

}

/* ==========================================
   Consistency
========================================== */

function calculateConsistency(){

    if(Motion.frames.length===0){

        Motion.consistency=0;

        return;

    }

    const average=

        Motion.frames.reduce(

            (sum,item)=>

            sum+item.score,

            0

        )/

        Motion.frames.length;

    Motion.consistency=

        Math.round(

            average

        );

}
/* ==========================================
   AI Quality
========================================== */

function calculateQuality(){

    calculateSmoothness();

    calculateConsistency();

    AIEngine.quality=Math.round(

        (

            Motion.smoothness+

            Motion.consistency+

            AIEngine.confidence

        )/3

    );

}

/* ==========================================
   Final AI Report
========================================== */

function generateAIReport(){

    return{

        score:AIEngine.score,

        quality:AIEngine.quality,

        confidence:AIEngine.confidence,

        symmetry:AIEngine.symmetry,

        movement:AIEngine.movement,

        stability:AIEngine.stability,

        smoothness:Motion.smoothness,

        consistency:Motion.consistency

    };

}

/* ==========================================
   Update
========================================== */

function updateAIEngine(){

    runAIEngine();

    recordFrame();

    calculateQuality();

}