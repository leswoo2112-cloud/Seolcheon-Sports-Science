/* ==========================================
   Firebase Module
========================================== */

"use strict";

/* ==========================================
   Firebase Config
========================================== */

const firebaseConfig = {

    apiKey: "",

    authDomain: "",

    projectId: "",

    storageBucket: "",

    messagingSenderId: "",

    appId: ""

};

/* ==========================================
   Initialize
========================================== */

let db = null;

async function initializeFirebase() {

    try {

        firebase.initializeApp(firebaseConfig);

        db = firebase.firestore();

        showToast("Firebase 연결 완료");

    }

    catch (error) {

        console.error(error);

        showToast("Firebase 연결 실패","error");

    }

}

/* ==========================================
   Save Athlete
========================================== */

async function saveAthleteCloud(athlete) {

    if (!db) return;

    try {

        await db.collection("athletes").add(athlete);

        showToast("선수 저장 완료");

    }

    catch (error) {

        console.error(error);

    }

}

/* ==========================================
   Save Analysis
========================================== */

async function saveAnalysisCloud(data) {

    if (!db) return;

    try {

        await db.collection("analysis").add(data);

    }

    catch (error) {

        console.error(error);

    }

}
/* ==========================================
   Load Athletes
========================================== */

async function loadAthletesCloud() {

    if (!db) return;

    try {

        const snapshot =

            await db.collection("athletes").get();

        App.athletes = [];

        snapshot.forEach(doc => {

            App.athletes.push({

                id: doc.id,

                ...doc.data()

            });

        });

        if (typeof renderAthleteTable === "function") {

            renderAthleteTable();

        }

        updateDashboard();

        showToast("선수 데이터 불러오기 완료");

    }

    catch (error) {

        console.error(error);

        showToast("선수 데이터 불러오기 실패","error");

    }

}

/* ==========================================
   Load Analysis
========================================== */

async function loadAnalysisCloud() {

    if (!db) return;

    try {

        const snapshot =

            await db.collection("analysis").get();

        App.analysis = [];

        snapshot.forEach(doc => {

            App.analysis.push({

                id: doc.id,

                ...doc.data()

            });

        });

        refreshApp();

        showToast("분석 데이터 불러오기 완료");

    }

    catch (error) {

        console.error(error);

    }

}

/* ==========================================
   Delete Athlete
========================================== */

async function deleteAthleteCloud(id) {

    if (!db) return;

    try {

        await db.collection("athletes")

            .doc(id)

            .delete();

        showToast("선수 삭제 완료");

    }

    catch (error) {

        console.error(error);

        showToast("삭제 실패","error");

    }

}

/* ==========================================
   Update Athlete
========================================== */

async function updateAthleteCloud(id,data){

    if(!db) return;

    try{

        await db.collection("athletes")

            .doc(id)

            .update(data);

        showToast("선수 수정 완료");

    }

    catch(error){

        console.error(error);

    }

}

/* ==========================================
   Sync
========================================== */

async function syncCloud(){

    await loadAthletesCloud();

    await loadAnalysisCloud();

}