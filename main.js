/* ==========================================
   Seolcheon Sports Science Center PRO V3
   main.js
========================================== */

"use strict";

/* ==========================================
   App
========================================== */

const App={

currentPage:"dashboard",

darkMode:true,

athletes:[],

analysis:[],

camera:null,

stream:null,

version:"3.0"

};

/* ==========================================
   Shortcut
========================================== */

const $=(selector)=>document.querySelector(selector);

const $$=(selector)=>document.querySelectorAll(selector);

/* ==========================================
   Init
========================================== */

window.addEventListener("DOMContentLoaded",()=>{

initialize();

});

/* ==========================================
   Initialize
========================================== */

function initialize(){

hideLoading();

initializeClock();

initializeMenu();

initializeDarkMode();

initializeToast();

initializeModal();

loadStorage();

console.log(

"🏆 SSPRO V3 Started"

);

}

/* ==========================================
   Loading
========================================== */

function hideLoading(){

setTimeout(()=>{

$("#loadingScreen")
.classList
.add("hide");

},1000);

}

/* ==========================================
   Clock
========================================== */

function initializeClock(){

updateClock();

setInterval(

updateClock,

1000

);

}

function updateClock(){

const now=new Date();

$("#clock").textContent=

now.toLocaleString("ko-KR");

}
/* ==========================================
   Menu
========================================== */

function initializeMenu() {

    $$(".menu").forEach(button => {

        button.addEventListener("click", () => {

            changePage(button.dataset.page);

        });

    });

}

function changePage(page) {

    App.currentPage = page;

    /* 메뉴 활성화 */

    $$(".menu").forEach(button => {

        button.classList.remove("active");

        if (button.dataset.page === page) {

            button.classList.add("active");

        }

    });

    /* 페이지 숨기기 */

    $$(".page").forEach(pageElement => {

        pageElement.classList.remove("active");

    });

    /* 페이지 표시 */

    const target = $("#" + page + "Page");

    if (target) {

        target.classList.add("active");

    }

}

/* ==========================================
   Dark Mode
========================================== */

function initializeDarkMode() {

    const saved = localStorage.getItem("darkMode");

    if (saved !== null) {

        App.darkMode = saved === "true";

    }

    applyDarkMode();

    $("#darkModeButton").addEventListener("click", toggleDarkMode);

}

function toggleDarkMode() {

    App.darkMode = !App.darkMode;

    localStorage.setItem("darkMode", App.darkMode);

    applyDarkMode();

}

function applyDarkMode() {

    document.body.classList.toggle("light", !App.darkMode);

    $("#darkModeButton").textContent =
        App.darkMode ? "🌙" : "☀️";

}

/* ==========================================
   Storage
========================================== */

function loadStorage() {

    const athletes =
        localStorage.getItem("athletes");

    const analysis =
        localStorage.getItem("analysis");

    if (athletes) {

        App.athletes =
            JSON.parse(athletes);

    }

    if (analysis) {

        App.analysis =
            JSON.parse(analysis);

    }

    updateDashboard();

}

function saveStorage() {

    localStorage.setItem(

        "athletes",

        JSON.stringify(App.athletes)

    );

    localStorage.setItem(

        "analysis",

        JSON.stringify(App.analysis)

    );

}
/* ==========================================
   Toast
========================================== */

function initializeToast(){

    $("#toast").className="";

    $("#toast").textContent="";

}

function showToast(message,type="success"){

    const toast=$("#toast");

    toast.textContent=message;

    toast.className="show "+type;

    clearTimeout(toast.timer);

    toast.timer=setTimeout(()=>{

        toast.className="";

    },3000);

}

/* ==========================================
   Modal
========================================== */

function initializeModal(){

    $("#closeModal").addEventListener("click",closeModal);

    $("#modal").addEventListener("click",(e)=>{

        if(e.target.id==="modal"){

            closeModal();

        }

    });

}

function openModal(title,html){

    $("#modalTitle").textContent=title;

    $("#modalBody").innerHTML=html;

    $("#modal").classList.add("show");

}

function closeModal(){

    $("#modal").classList.remove("show");

}

/* ==========================================
   Dashboard
========================================== */

function updateDashboard(){

    $("#dashboardAthleteCount").textContent=

        App.athletes.length;

    $("#todayAnalysis").textContent=

        App.analysis.length;

    if(App.analysis.length===0){

        $("#averageScore").textContent="0";

        $("#nationalPercent").textContent="0%";

        return;

    }

    const sum=App.analysis.reduce(

        (total,item)=>

        total+(item.score||0),

        0

    );

    const average=Math.round(

        sum/App.analysis.length

    );

    $("#averageScore").textContent=

        average;

    $("#nationalPercent").textContent=

        average+"%";

}

/* ==========================================
   Keyboard Shortcut
========================================== */

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        closeModal();

    }

    if(e.ctrlKey&&e.key.toLowerCase()==="s"){

        e.preventDefault();

        saveStorage();

        showToast("저장되었습니다.");

    }

});

/* ==========================================
   Loading Overlay
========================================== */

function showLoading(text="AI 분석중..."){

    $("#loadingOverlay").classList.add("show");

    $("#loadingOverlay p").textContent=text;

}

function hideOverlay(){

    $("#loadingOverlay").classList.remove("show");

}

/* ==========================================
   Reset
========================================== */

function resetAll(){

    if(

        !confirm("모든 데이터를 삭제하시겠습니까?")

    ){

        return;

    }

    localStorage.clear();

    location.reload();

}

/* ==========================================
   Version
========================================== */

console.log(

"==================================="

);

console.log(

"Seolcheon Sports Science Center PRO"

);

console.log(

"Version : "+App.version

);

console.log(

"==================================="

);
/* ==========================================
   Chart
========================================== */

let dashboardChart = null;
let reportChart = null;
let nationalChart = null;

function initializeCharts() {

    if ($("#dashboardChart")) {

        dashboardChart = new Chart(

            $("#dashboardChart"),

            {

                type: "line",

                data: {

                    labels: [],

                    datasets: [

                        {

                            label: "AI 점수",

                            data: [],

                            borderColor: "#4F8CFF",

                            backgroundColor: "rgba(79,140,255,.2)",

                            fill: true,

                            tension: .35

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            labels: {

                                color: "#FFFFFF"

                            }

                        }

                    },

                    scales: {

                        x: {

                            ticks: {

                                color: "#CBD5E1"

                            }

                        },

                        y: {

                            ticks: {

                                color: "#CBD5E1"

                            }

                        }

                    }

                }

            }

        );

    }

}

/* ==========================================
   Refresh Dashboard
========================================== */

function refreshDashboardChart() {

    if (!dashboardChart) return;

    dashboardChart.data.labels = App.analysis.map(

        (_, index) => index + 1

    );

    dashboardChart.data.datasets[0].data =

        App.analysis.map(

            item => item.score || 0

        );

    dashboardChart.update();

}

/* ==========================================
   Recent Analysis
========================================== */

function renderRecentAnalysis() {

    const list = $("#recentAnalysisList");

    if (!list) return;

    list.innerHTML = "";

    if (App.analysis.length === 0) {

        list.innerHTML =

            '<div class="empty">분석 기록이 없습니다.</div>';

        return;

    }

    App.analysis

        .slice()

        .reverse()

        .slice(0, 10)

        .forEach(item => {

            const div = document.createElement("div");

            div.className = "analysis-item";

            div.innerHTML = `

                <strong>${item.name}</strong>

                <br>

                ${item.sport}

                <br>

                AI 점수 : ${item.score}

            `;

            list.appendChild(div);

        });

}

/* ==========================================
   Refresh
========================================== */

function refreshApp() {

    updateDashboard();

    refreshDashboardChart();

    renderRecentAnalysis();

}

/* ==========================================
   Window
========================================== */

window.addEventListener(

    "resize",

    () => {

        dashboardChart?.resize();

        reportChart?.resize();

        nationalChart?.resize();

    }

);

/* ==========================================
   Start
========================================== */

setTimeout(() => {

    initializeCharts();

    refreshApp();

}, 300);

/* ==========================================
   Service Worker
========================================== */

if ("serviceWorker" in navigator) {

    window.addEventListener(

        "load",

        () => {

            navigator.serviceWorker

                .register("./sw.js")

                .then(() => {

                    console.log(

                        "Service Worker Registered"

                    );

                })

                .catch(console.error);

        }

    );

}