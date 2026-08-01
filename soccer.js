/* ==========================================
   Soccer AI Engine
========================================== */

"use strict";

const Soccer = {

    kickScore:0,
    balanceScore:0,
    supportFootScore:0,
    followThroughScore:0,
    totalScore:0

};

/* ==========================================
   Analyze
========================================== */

function analyzeSoccer(){

    calculateKick();

    calculateSupportFoot();

    calculateFollowThrough();

    calculateSoccerScore();

    updateSoccerUI();

}

/* ==========================================
   Kick Angle
========================================== */

function calculateKick(){

    const angle = calculateAngle(

        lm(24),
        lm(26),
        lm(28)

    );

    Soccer.kickScore = scoreFromTarget(

        angle,
        155,
        15

    );

}

/* ==========================================
   Support Foot
========================================== */

function calculateSupportFoot(){

    const angle = calculateAngle(

        lm(23),
        lm(25),
        lm(27)

    );

    Soccer.supportFootScore = scoreFromTarget(

        angle,
        165,
        15

    );

}

/* ==========================================
   Follow Through
========================================== */

function calculateFollowThrough(){

    const shoulder = lm(12).x;

    const hip = lm(24).x;

    const diff = Math.abs(

        shoulder-hip

    );

    Soccer.followThroughScore =

        Math.max(

            0,

            100-Math.round(diff*250)

        );

}
/* ==========================================
   Shot Power
========================================== */

function calculateShotPower(){

    const hip = calculateAngle(

        lm(12),
        lm(24),
        lm(26)

    );

    Soccer.shotPower = scoreFromTarget(

        hip,
        145,
        20

    );

}

/* ==========================================
   Dribble Balance
========================================== */

function calculateDribbleBalance(){

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

    Soccer.balanceScore =

        Math.max(

            0,

            100 -

            Math.abs(left-right)

        );

}

/* ==========================================
   Kick Accuracy
========================================== */

function calculateKickAccuracy(){

    Soccer.kickAccuracy = Math.round(

        (

            Soccer.kickScore +

            Soccer.balanceScore +

            Soccer.followThroughScore

        ) / 3

    );

}

/* ==========================================
   Total Score
========================================== */

function calculateSoccerScore(){

    calculateShotPower();

    calculateDribbleBalance();

    calculateKickAccuracy();

    Soccer.totalScore = Math.round(

        Soccer.kickScore * 0.30 +

        Soccer.shotPower * 0.25 +

        Soccer.balanceScore * 0.20 +

        Soccer.followThroughScore * 0.25

    );

}

/* ==========================================
   AI Coach
========================================== */

function createSoccerCoach(){

    const coach=[];

    if(Soccer.kickScore<90){

        coach.push(

            "⚽ 킥 순간 무릎 각도를 조금 더 크게 사용하세요."

        );

    }

    if(Soccer.balanceScore<90){

        coach.push(

            "⚖ 지지발 균형을 유지하면 정확도가 향상됩니다."

        );

    }

    if(Soccer.followThroughScore<90){

        coach.push(

            "🎯 킥 후 팔로우스루를 끝까지 유지해 보세요."

        );

    }

    if(coach.length===0){

        coach.push(

            "🏆 매우 안정적인 킥 메커니즘입니다."

        );

    }

    return coach;

}

/* ==========================================
   UI
========================================== */

function updateSoccerUI(){

    $("#soccerScore").textContent =

        Soccer.totalScore;

    $("#kickAccuracy").textContent =

        Soccer.kickAccuracy + "%";

}