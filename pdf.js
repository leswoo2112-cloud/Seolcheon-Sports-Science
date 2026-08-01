/* ==========================================
   Polar BLE Module
========================================== */

"use strict";

const PolarBLE={

    device:null,

    server:null,

    service:null,

    characteristic:null,

    connected:false,

    heartRate:0,

    battery:0

};

/* ==========================================
   Connect
========================================== */

async function connectPolar(){

    try{

        PolarBLE.device=

            await navigator.bluetooth.requestDevice({

                filters:[

                    {

                        services:[

                            "heart_rate"

                        ]

                    }

                ]

            });

        PolarBLE.server=

            await PolarBLE.device.gatt.connect();

        PolarBLE.service=

            await PolarBLE.server

            .getPrimaryService(

                "heart_rate"

            );

        PolarBLE.characteristic=

            await PolarBLE.service

            .getCharacteristic(

                "heart_rate_measurement"

            );

        await PolarBLE.characteristic

            .startNotifications();

        PolarBLE.characteristic

            .addEventListener(

                "characteristicvaluechanged",

                heartRateChanged

            );

        PolarBLE.connected=true;

        showToast("Polar 연결 성공");

    }

    catch(error){

        console.error(error);

        showToast("Polar 연결 실패","error");

    }

}

/* ==========================================
   Disconnect
========================================== */

function disconnectPolar(){

    if(

        PolarBLE.device &&

        PolarBLE.device.gatt.connected

    ){

        PolarBLE.device.gatt.disconnect();

    }

    PolarBLE.connected=false;

    showToast("Polar 연결 종료");

}

/* ==========================================
   Heart Rate Event
========================================== */

function heartRateChanged(event){

    const value=

        event.target.value;

    PolarBLE.heartRate=

        value.getUint8(1);

    updateHeartRateUI();

}
/* ==========================================
   Heart Rate Zone
========================================== */

const HeartZone={

    zone:1,

    maxHR:200

};

function calculateHeartZone(){

    const hr=

        PolarBLE.heartRate;

    const percent=

        hr/

        HeartZone.maxHR*100;

    if(percent<60){

        HeartZone.zone=1;

    }

    else if(percent<70){

        HeartZone.zone=2;

    }

    else if(percent<80){

        HeartZone.zone=3;

    }

    else if(percent<90){

        HeartZone.zone=4;

    }

    else{

        HeartZone.zone=5;

    }

    return HeartZone.zone;

}

/* ==========================================
   Training Intensity
========================================== */

function getTrainingIntensity(){

    switch(

        calculateHeartZone()

    ){

        case 1:

            return "회복";

        case 2:

            return "유산소";

        case 3:

            return "지구력";

        case 4:

            return "고강도";

        case 5:

            return "최대";

    }

}

/* ==========================================
   Estimated Calories
========================================== */

function estimateCalories(){

    const minutes=

        Session.duration/60;

    return Math.round(

        PolarBLE.heartRate*

        0.12*

        minutes

    );

}

/* ==========================================
   Update UI
========================================== */

function updateHeartRateUI(){

    $("#heartRate").textContent=

        PolarBLE.heartRate;

    $("#heartZone").textContent=

        "Zone "+

        calculateHeartZone();

    $("#heartIntensity").textContent=

        getTrainingIntensity();

    $("#calorie").textContent=

        estimateCalories();

}

/* ==========================================
   History
========================================== */

const HeartHistory=[];

function saveHeartRate(){

    HeartHistory.push({

        time:Date.now(),

        heartRate:PolarBLE.heartRate

    });

    if(

        HeartHistory.length>

        500

    ){

        HeartHistory.shift();

    }

}