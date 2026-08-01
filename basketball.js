/* ==========================================
   Basketball AI Engine
========================================== */

"use strict";

const Basketball = {

    shotScore:0,
    jumpScore:0,
    landingScore:0,
    balanceScore:0,
    releaseScore:0,
    totalScore:0

};

/* ==========================================
   Analyze
========================================== */

function analyzeBasketball(){

    calculateShotForm();

    calculateJump();

    calculateLanding();

    calculateRelease();

    calculateBasketballScore();

    updateBasketballUI();

}

/* ==========================================
   Shot Form
========================================== */

function calculateShotForm(){

    const elbow = calculateAngle(

        lm(12),
        lm(14),
        lm(16)

    );

    Basketball.shotScore = scoreFromTarget(

        elbow,
        90,
        10

    );

}

/* ==========================================
   Jump
========================================== */

function calculateJump(){

    const knee = (

        calculateAngle(

            lm(23),

            lm(25),

            lm(27)

        ) +

        calculateAngle(

            lm(24),

            lm(26),

            lm(28)

        )

    ) / 2;

    Basketball.jumpScore = scoreFromTarget(

        knee,

        120,

        15

    );

}

/* ==========================================
   Landing
========================================== */

function calculateLanding(){

    const left = calculateAngle(

        lm(23),

        lm(25),

        lm(27)

    );

    const right = calculateAngle(

        lm(24),

        lm(26),

        lm(28)

    );

    Basketball.landingScore =

        Math.max(

            0,

            100 -

            Math.abs(

                left-right

            )

        );

}

/* ==========================================
   Release
========================================== */

function calculateRelease(){

    const wrist = calculateAngle(

        lm(14),

        lm(16),

        lm(20)

    );

    Basketball.releaseScore = scoreFromTarget(

        wrist,

        160,

        15

    );

}
/* ==========================================
   Jump Height
========================================== */

function estimateJumpHeight(){

    const hip = (

        lm(23).y +

        lm(24).y

    ) / 2;

    const ankle = (

        lm(27).y +

        lm(28).y

    ) / 2;

    const distance =

        Math.abs(ankle - hip);

    Basketball.jumpHeight =

        Math.round(distance * 100);

}

/* ==========================================
   Release Timing
========================================== */

function calculateReleaseTiming(){

    const shoulder =

        lm(12).y;

    const wrist =

        lm(16).y;

    Basketball.releaseTiming =

        wrist < shoulder

            ? "적절"

            : "빠름";

}

/* ==========================================
   Injury Risk
========================================== */

function calculateInjuryRisk(){

    const left = calculateAngle(

        lm(23),

        lm(25),

        lm(27)

    );

    const right = calculateAngle(

        lm(24),

        lm(26),

        lm(28)

    );

    const diff = Math.abs(left-right);

    Basketball.injuryRisk =

        diff > 15

            ? "높음"

            : diff > 8

            ? "보통"

            : "낮음";

}

/* ==========================================
   Basketball Score
========================================== */

function calculateBasketballScore(){

    Basketball.totalScore = Math.round(

        Basketball.shotScore * 0.30 +

        Basketball.jumpScore * 0.25 +

        Basketball.landingScore * 0.20 +

        Basketball.releaseScore * 0.25

    );

}

/* ==========================================
   AI Coach
========================================== */

function createBasketballCoach(){

    const coach=[];

    if(Basketball.shotScore<90){

        coach.push("🏀 팔꿈치 각도를 조금 더 일정하게 유지하세요.");

    }

    if(Basketball.jumpScore<90){

        coach.push("🦵 점프 시 무릎 사용을 조금 더 적극적으로 해보세요.");

    }

    if(Basketball.landingScore<90){

        coach.push("⚠ 착지 시 좌우 균형을 맞춰 부상 위험을 줄이세요.");

    }

    if(coach.length===0){

        coach.push("🏆 매우 안정적인 슛 메커니즘입니다.");

    }

    return coach;

}

/* ==========================================
   UI
========================================== */

function updateBasketballUI(){

    $("#basketballScore").textContent =

        Basketball.totalScore;

    $("#jumpHeight").textContent =

        Basketball.jumpHeight + " cm";

    $("#injuryRisk").textContent =

        Basketball.injuryRisk;

}