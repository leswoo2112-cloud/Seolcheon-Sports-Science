/*
=========================================
main.js
Seolcheon Sports Science Center PRO
Main Controller
Version 1.0
=========================================
*/

"use strict";

import { CameraManager } from "./camera.js";
import { AnalysisEngine } from "./analysis.js";
import { ReportEngine } from "./report.js";
import { FirebaseManager } from "./firebase.js";
import { Dashboard } from "./dashboard.js";
import { SportsEngine } from "./sports.js";
import { AthleteManager } from "./athlete.js";

const firebase = new FirebaseManager();

const dashboard = new Dashboard(firebase);

const sports = new SportsEngine();

const athletes = new AthleteManager();

const camera = new CameraManager();

const analysis = new AnalysisEngine();

const report = new ReportEngine();

/* ===================================== */
/* Initialize */
/* ===================================== */

async function initialize(){

    try{

        await dashboard.initialize();

        console.log("Dashboard Ready");

    }catch(error){

        console.error(error);

    }

}

/* ===================================== */
/* Start Camera */
/* ===================================== */

async function startCamera(){

    try{

        await camera.initialize();

        await camera.start();

        console.log("Camera Started");

    }catch(error){

        console.error(error);

    }

}

/* ===================================== */
/* Stop Camera */
/* ===================================== */

function stopCamera(){

    camera.stop();

    console.log("Camera Stopped");

}
/* ===================================== */
/* Register Events */
/* ===================================== */

function registerEvents(){

    document
    .getElementById("startCamera")
    ?.addEventListener(

        "click",

        startCamera

    );

    document
    .getElementById("stopCamera")
    ?.addEventListener(

        "click",

        stopCamera

    );

    document
    .getElementById("captureButton")
    ?.addEventListener(

        "click",

        captureAnalysis

    );

    document
    .getElementById("saveButton")
    ?.addEventListener(

        "click",

        saveAnalysis

    );

}

/* ===================================== */
/* Capture Analysis */
/* ===================================== */

async function captureAnalysis(){

    try{

        const pose =

        camera.getPoseData();

        if(!pose){

            alert("포즈를 인식하지 못했습니다.");

            return;

        }

        const result =

        analysis.analyze(pose);

        report.create(

            result,

            athletes.currentAthlete

        );

        dashboard.setAverageScore(

            result.score

        );

    }

    catch(error){

        console.error(error);

    }

}

/* ===================================== */
/* Save Analysis */
/* ===================================== */

async function saveAnalysis(){

    try{

        const pose =

        camera.getPoseData();

        if(!pose){

            return;

        }

        const result =

        analysis.analyze(pose);

        await firebase.saveAnalysis({

            athlete:

            athletes.currentAthlete,

            result

        });

        dashboard.showNotification(

            "분석 결과가 저장되었습니다."

        );

    }

    catch(error){

        console.error(error);

    }

}
/* ===================================== */
/* Analysis Loop */
/* ===================================== */

let animationId = null;

function startAnalysisLoop(){

    function update(){

        if(camera.running){

            const pose =

            camera.getPoseData();

            if(pose){

                const result =

                analysis.analyze(pose);

                report.create(

                    result,

                    athletes.currentAthlete

                );

                dashboard.setAverageScore(

                    result.score

                );

                dashboard.setNationalPercent(

                    result.percent

                );

            }

        }

        animationId =

        requestAnimationFrame(update);

    }

    update();

}

/* ===================================== */
/* Stop Analysis Loop */
/* ===================================== */

function stopAnalysisLoop(){

    if(animationId){

        cancelAnimationFrame(

            animationId

        );

        animationId = null;

    }

}

/* ===================================== */
/* Create Athlete */
/* ===================================== */

function createAthlete(data){

    const athlete =

    athletes.create(data);

    console.log(

        "Athlete Created",

        athlete

    );

    return athlete;

}

/* ===================================== */
/* Select Sport */
/* ===================================== */

function changeSport(name){

    sports.selectSport(name);

    console.log(

        "Current Sport :",

        name

    );

}
/* ===================================== */
/* Dashboard Update */
/* ===================================== */

async function updateDashboard(){

    try{

        await dashboard.refresh();

    }

    catch(error){

        console.error(error);

    }

}

/* ===================================== */
/* Auto Save */
/* ===================================== */

let autoSaveTimer = null;

function startAutoSave(){

    autoSaveTimer = setInterval(

        async()=>{

            if(!camera.running){

                return;

            }

            const pose = camera.getPoseData();

            if(!pose){

                return;

            }

            const result = analysis.analyze(pose);

            await firebase.saveAnalysis({

                athleteId:

                athletes.currentAthlete?.id,

                score:

                result.score,

                grade:

                result.grade,

                createdAt:

                new Date()

            });

        },

        60000

    );

}

/* ===================================== */
/* Stop Auto Save */
/* ===================================== */

function stopAutoSave(){

    if(autoSaveTimer){

        clearInterval(

            autoSaveTimer

        );

        autoSaveTimer = null;

    }

}

/* ===================================== */
/* Shutdown */
/* ===================================== */

function shutdown(){

    stopAnalysisLoop();

    stopAutoSave();

    stopCamera();

}

/* ===================================== */
/* Window Event */
/* ===================================== */

window.addEventListener(

    "beforeunload",

    shutdown

);

/* ===================================== */
/* Run */
/* ===================================== */

(async()=>{

    await initialize();

    registerEvents();

    startAnalysisLoop();

    startAutoSave();

})();