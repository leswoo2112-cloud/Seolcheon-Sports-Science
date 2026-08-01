/* ==========================================
   Biathlon AI Engine
========================================== */

"use strict";

const Biathlon = {

    skiScore:0,

    poleScore:0,

    balanceScore:0,

    glideScore:0,

    shootingScore:0,

    totalScore:0

};

/* ==========================================
   Start
========================================== */

function analyzeBiathlon(){

    calculatePoleAngle();

    calculateLegDrive();

    calculateWeightShift();

    calculateGlide();

    calculateBiathlonScore();

    updateBiathlonUI();

}

/* ==========================================
   Pole Angle
========================================== */

function calculatePoleAngle(){

    const left=

        calculateAngle(

            lm(11),

            lm(13),

            lm(15)

        );

    const right=

        calculateAngle(

            lm(12),

            lm(14),

            lm(16)

        );

    const average=

        (left+right)/2;

    Biathlon.poleScore=

        scoreFromTarget(

            average,

            165,

            15

        );

}

/* ==========================================
   Leg Drive
========================================== */

function calculateLegDrive(){

    const left=

        calculateAngle(

            lm(23),

            lm(25),

            lm(27)

        );

    const right=

        calculateAngle(

            lm(24),

            lm(26),

            lm(28)

        );

    const average=

        (left+right)/2;

    Biathlon.skiScore=

        scoreFromTarget(

            average,

            150,

            20

        );

}

/* ==========================================
   Weight Shift
========================================== */

function calculateWeightShift(){

    const shoulderCenter=

        (lm(11).x+lm(12).x)/2;

    const hipCenter=

        (lm(23).x+lm(24).x)/2;

    const diff=

        Math.abs(

            shoulderCenter-

            hipCenter

        );

    Biathlon.balanceScore=

        Math.max(

            0,

            100-

            Math.round(

                diff*350

            )

        );

}
/* ==========================================
   Glide Efficiency
========================================== */

function calculateGlide(){

    const leftLeg=

        calculateAngle(

            lm(23),

            lm(25),

            lm(27)

        );

    const rightLeg=

        calculateAngle(

            lm(24),

            lm(26),

            lm(28)

        );

    const average=

        (leftLeg+rightLeg)/2;

    Biathlon.glideScore=

        scoreFromTarget(

            average,

            168,

            12

        );

}

/* ==========================================
   Pole Power
========================================== */

function calculatePolePower(){

    const shoulderY=

        (lm(11).y+lm(12).y)/2;

    const wristY=

        (lm(15).y+lm(16).y)/2;

    const power=

        Math.abs(

            shoulderY-

            wristY

        );

    Biathlon.polePower=

        Math.min(

            100,

            Math.round(

                power*350

            )

        );

}

/* ==========================================
   Shooting Stability
========================================== */

function calculateShooting(){

    const shoulder=

        Math.abs(

            lm(11).y-

            lm(12).y

        );

    const wrist=

        Math.abs(

            lm(15).y-

            lm(16).y

        );

    const value=

        shoulder+wrist;

    Biathlon.shootingScore=

        Math.max(

            0,

            100-

            Math.round(

                value*300

            )

        );

}

/* ==========================================
   Heart Rate
========================================== */

const HeartRate={

    connected:false,

    bpm:0

};

function updateHeartRate(value){

    HeartRate.bpm=value;

}

function getHeartRateZone(){

    if(HeartRate.bpm<120) return "회복";

    if(HeartRate.bpm<140) return "유산소";

    if(HeartRate.bpm<160) return "템포";

    if(HeartRate.bpm<180) return "고강도";

    return "최대";

}

/* ==========================================
   Total Score
========================================== */

function calculateBiathlonScore(){

    calculatePolePower();

    calculateShooting();

    Biathlon.totalScore=

        Math.round(

            Biathlon.skiScore*0.25+

            Biathlon.poleScore*0.20+

            Biathlon.balanceScore*0.20+

            Biathlon.glideScore*0.20+

            Biathlon.shootingScore*0.15

        );

}
/* ==========================================
   Biathlon National Standard
========================================== */

const BiathlonStandard={

    skiScore:95,

    poleScore:95,

    balanceScore:95,

    glideScore:94,

    shootingScore:96

};

/* ==========================================
   Compare National
========================================== */

function compareBiathlonNational(){

    return{

        ski:getPercent(

            Biathlon.skiScore,

            BiathlonStandard.skiScore

        ),

        pole:getPercent(

            Biathlon.poleScore,

            BiathlonStandard.poleScore

        ),

        balance:getPercent(

            Biathlon.balanceScore,

            BiathlonStandard.balanceScore

        ),

        glide:getPercent(

            Biathlon.glideScore,

            BiathlonStandard.glideScore

        ),

        shooting:getPercent(

            Biathlon.shootingScore,

            BiathlonStandard.shootingScore

        )

    };

}

/* ==========================================
   Left / Right Symmetry
========================================== */

function calculateSymmetry(){

    const legGap=Math.abs(

        Analysis.leftKnee-

        Analysis.rightKnee

    );

    const armGap=Math.abs(

        Analysis.leftElbow-

        Analysis.rightElbow

    );

    return{

        leg:Math.max(

            0,

            100-legGap

        ),

        arm:Math.max(

            0,

            100-armGap

        )

    };

}

/* ==========================================
   Glide Efficiency
========================================== */

function calculateEfficiency(){

    return Math.round(

        (

            Biathlon.glideScore+

            Biathlon.balanceScore+

            Biathlon.skiScore

        )/3

    );

}

/* ==========================================
   AI Coach
========================================== */

function createBiathlonCoach(){

    const message=[];

    if(Biathlon.glideScore<90){

        message.push(

            "🎿 활주 시간이 짧습니다."

        );

    }

    if(Biathlon.balanceScore<90){

        message.push(

            "⚖ 체중 이동을 더 크게 해보세요."

        );

    }

    if(Biathlon.shootingScore<90){

        message.push(

            "🎯 사격 자세 안정성이 부족합니다."

        );

    }

    if(Biathlon.poleScore<90){

        message.push(

            "🦾 폴 각도를 조금 더 뒤로 밀어주세요."

        );

    }

    if(message.length===0){

        message.push(

            "🏆 국가대표 수준입니다."

        );

    }

    return message;

}

/* ==========================================
   Update UI
========================================== */

function updateBiathlonUI(){

    const compare=

        compareBiathlonNational();

    console.log(compare);

    console.log(

        createBiathlonCoach()

    );

}
/* ==========================================
   Biathlon Cycle Analysis
========================================== */

const Cycle = {

    count:0,

    lastHipY:0,

    state:"up",

    cadence:0,

    startTime:performance.now()

};

function analyzeCycle(){

    const hip=(

        lm(23).y+

        lm(24).y

    )/2;

    if(

        Cycle.state==="up" &&

        hip>Cycle.lastHipY+0.015

    ){

        Cycle.state="down";

    }

    if(

        Cycle.state==="down" &&

        hip<Cycle.lastHipY-0.015

    ){

        Cycle.state="up";

        Cycle.count++;

    }

    Cycle.lastHipY=hip;

}

/* ==========================================
   Cadence
========================================== */

function calculateCadence(){

    const second=

        (

            performance.now()-

            Cycle.startTime

        )/1000;

    if(second<=0) return;

    Cycle.cadence=

        Math.round(

            Cycle.count/

            second*

            60

        );

}

/* ==========================================
   Glide Time
========================================== */

function calculateGlideTime(){

    const left=

        Math.abs(

            lm(27).x-

            lm(23).x

        );

    const right=

        Math.abs(

            lm(28).x-

            lm(24).x

        );

    return Math.round(

        (

            left+

            right

        )*100

    );

}

/* ==========================================
   Estimated Speed
========================================== */

function estimateSpeed(){

    const cadence=

        Cycle.cadence;

    const glide=

        calculateGlideTime();

    return Number(

        (

            cadence*

            glide/

            100

        ).toFixed(1)

    );

}

/* ==========================================
   Session
========================================== */

const Session={

    duration:0,

    distance:0,

    avgScore:0

};

function updateSession(){

    Session.duration=

        Math.round(

            (

                performance.now()-

                Cycle.startTime

            )/1000

        );

    Session.avgScore=

        Math.round(

            (

                Analysis.score+

                Biathlon.totalScore

            )/2

        );

}

/* ==========================================
   Dashboard
========================================== */

function updateBiathlonDashboard(){

    console.table({

        score:Biathlon.totalScore,

        cadence:Cycle.cadence,

        glide:calculateGlideTime(),

        speed:estimateSpeed(),

        heart:HeartRate.bpm,

        zone:getHeartRateZone()

    });

}
/* ==========================================
   Polar BLE (준비)
========================================== */

const Polar = {

    device:null,

    server:null,

    heartService:null,

    heartCharacteristic:null,

    connected:false

};

async function connectPolar(){

    if(!navigator.bluetooth){

        showToast("이 브라우저는 Bluetooth를 지원하지 않습니다.","error");

        return;

    }

    try{

        Polar.device=

            await navigator.bluetooth.requestDevice({

                filters:[

                    {

                        services:["heart_rate"]

                    }

                ]

            });

        Polar.server=

            await Polar.device.gatt.connect();

        Polar.heartService=

            await Polar.server.getPrimaryService(

                "heart_rate"

            );

        Polar.heartCharacteristic=

            await Polar.heartService.getCharacteristic(

                "heart_rate_measurement"

            );

        await Polar.heartCharacteristic.startNotifications();

        Polar.heartCharacteristic.addEventListener(

            "characteristicvaluechanged",

            heartRateChanged

        );

        Polar.connected=true;

        showToast("Polar 연결 완료");

    }

    catch(error){

        console.error(error);

        showToast("Polar 연결 실패","error");

    }

}

/* ==========================================
   Heart Rate
========================================== */

function heartRateChanged(event){

    const value=event.target.value;

    const bpm=value.getUint8(1);

    HeartRate.bpm=bpm;

}

/* ==========================================
   Disconnect
========================================== */

function disconnectPolar(){

    if(

        Polar.device &&

        Polar.device.gatt.connected

    ){

        Polar.device.gatt.disconnect();

    }

    Polar.connected=false;

}

/* ==========================================
   Training Score
========================================== */

function calculateTrainingScore(){

    return Math.round(

        (

            Analysis.score+

            Biathlon.totalScore+

            calculateEfficiency()

        )/3

    );

}

/* ==========================================
   Save Session
========================================== */

function saveBiathlonSession(){

    const session={

        date:new Date().toLocaleString(),

        score:calculateTrainingScore(),

        cadence:Cycle.cadence,

        glide:calculateGlideTime(),

        speed:estimateSpeed(),

        heartRate:HeartRate.bpm,

        zone:getHeartRateZone()

    };

    if(!App.biathlonSessions){

        App.biathlonSessions=[];

    }

    App.biathlonSessions.push(session);

    localStorage.setItem(

        "biathlonSessions",

        JSON.stringify(App.biathlonSessions)

    );

    showToast("훈련 기록 저장 완료");

}