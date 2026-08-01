/* ==========================================
   App Controller
========================================== */

"use strict";

const SSPRO = {

    version: "3.0",

    ready: false,

    currentSport: "바이애슬론",

    currentAthlete: null,

    modules: {}

};

/* ==========================================
   Boot
========================================== */

window.addEventListener(

    "load",

    bootApplication

);

async function bootApplication() {

    showLoading("프로그램 시작 중...");

    try {

        await initializeModules();

        bindEvents();

        loadApplication();

        SSPRO.ready = true;

        hideOverlay();

        showToast("🏆 SSPRO 시작 완료");

    }

    catch (error) {

        console.error(error);

        hideOverlay();

        showToast(

            "프로그램 시작 실패",

            "error"

        );

    }

}

/* ==========================================
   Module Init
========================================== */

async function initializeModules() {

    if (typeof initializeAnalysis === "function") {

        await initializeAnalysis();

    }

    if (typeof initializeFirebase === "function") {

        await initializeFirebase();

    }

    if (typeof initializeCamera === "function") {

        initializeCamera();

    }

    SSPRO.modules = {

        analysis: true,

        camera: true,

        firebase: true

    };

}

/* ==========================================
   Events
========================================== */

function bindEvents() {

    $("#analysisSport")?.addEventListener(

        "change",

        changeSport

    );

}

/* ==========================================
   Sport
========================================== */

function changeSport(e) {

    SSPRO.currentSport = e.target.value;

    Analysis.sport = SSPRO.currentSport;

    showToast(

        SSPRO.currentSport +

        " 분석 모드"

    );

}

/* ==========================================
   Load
========================================== */

function loadApplication() {

    renderAthleteTable();

    updateDashboard();

    refreshApp();

}

/* ==========================================
   Export
========================================== */

window.SSPRO = SSPRO;

console.log(

    "🏆 SSPRO Controller Loaded"

);
/* ==========================================
   Module Health Check
========================================== */

function checkModules() {

    const modules = {

        main: typeof App !== "undefined",

        analysis: typeof Analysis !== "undefined",

        camera: typeof CameraSystem !== "undefined",

        comparison: typeof Compare !== "undefined",

        report: typeof Report !== "undefined",

        athlete: typeof Athlete !== "undefined",

        biathlon: typeof Biathlon !== "undefined",

        college: typeof College !== "undefined"

    };

    console.table(modules);

    return modules;

}

/* ==========================================
   Diagnostics
========================================== */

function runDiagnostics() {

    const result = checkModules();

    const failed = Object.entries(result)

        .filter(([_, ok]) => !ok);

    if (failed.length === 0) {

        showToast("✅ 모든 모듈 정상");

    } else {

        console.warn("누락된 모듈", failed);

        showToast("⚠ 일부 모듈 확인 필요", "error");

    }

}

/* ==========================================
   Auto Save
========================================== */

setInterval(() => {

    if (typeof saveStorage === "function") {

        saveStorage();

    }

}, 30000);

/* ==========================================
   App Information
========================================== */

function showAppInfo() {

    openModal(

        "프로젝트 정보",

        `
        <h3>Seolcheon Sports Science Center PRO</h3>

        <p>Version : ${SSPRO.version}</p>

        <p>AI Engine : MediaPipe Pose</p>

        <p>지원 종목 : 바이애슬론, 육상, 농구, 축구, 체대입시</p>

        <p>개발 상태 : Beta</p>
        `
    );

}

/* ==========================================
   Startup
========================================== */

window.addEventListener("load", () => {

    setTimeout(() => {

        runDiagnostics();

    }, 1500);

});