/* ==========================================
   Dashboard Module
========================================== */

"use strict";

const Dashboard={

    todayAnalysis:0,

    bestScore:0,

    averageScore:0,

    athleteCount:0

};

/* ==========================================
   Refresh
========================================== */

function refreshDashboard(){

    calculateDashboard();

    updateDashboardCards();

    updateDashboardChart();

    updateRecentAnalysis();

    updateTodayCoach();

}

/* ==========================================
   Calculate
========================================== */

function calculateDashboard(){

    Dashboard.athleteCount=

        App.athletes.length;

    Dashboard.todayAnalysis=

        App.analysis.length;

    if(App.analysis.length===0){

        Dashboard.averageScore=0;

        Dashboard.bestScore=0;

        return;

    }

    Dashboard.bestScore=

        Math.max(

            ...App.analysis.map(

                item=>item.score

            )

        );

    Dashboard.averageScore=

        Math.round(

            App.analysis.reduce(

                (sum,item)=>

                sum+item.score,

                0

            )/

            App.analysis.length

        );

}

/* ==========================================
   Cards
========================================== */

function updateDashboardCards(){

    $("#dashboardAthleteCount").textContent=

        Dashboard.athleteCount;

    $("#todayAnalysis").textContent=

        Dashboard.todayAnalysis;

    $("#averageScore").textContent=

        Dashboard.averageScore;

    $("#nationalPercent").textContent=

        Dashboard.bestScore+"%";

}
/* ==========================================
   Dashboard Chart
========================================== */

let dashboardChart = null;

function initializeDashboardChart(){

    const canvas = $("#dashboardChart");

    if(!canvas) return;

    dashboardChart = new Chart(

        canvas,

        {

            type:"line",

            data:{

                labels:[],

                datasets:[

                    {

                        label:"AI 점수",

                        data:[],

                        borderWidth:3,

                        tension:0.35,

                        fill:false

                    }

                ]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false,

                animation:false

            }

        }

    );

}

/* ==========================================
   Update Chart
========================================== */

function updateDashboardChart(){

    if(!dashboardChart) return;

    const recent =

        App.analysis.slice(-10);

    dashboardChart.data.labels =

        recent.map(

            (_,index)=>

            index+1

        );

    dashboardChart.data.datasets[0].data =

        recent.map(

            item=>item.score

        );

    dashboardChart.update();

}

/* ==========================================
   Recent Analysis
========================================== */

function updateRecentAnalysis(){

    const target=$("#recentAnalysis");

    if(!target) return;

    target.innerHTML="";

    const recent=

        App.analysis

        .slice(-5)

        .reverse();

    recent.forEach(item=>{

        const div=

            document.createElement("div");

        div.className=

            "recent-item";

        div.innerHTML=`

<b>${item.name||"선수"}</b>

<span>${item.score}점</span>

`;

        target.appendChild(div);

    });

}

/* ==========================================
   Best Athlete
========================================== */

function getBestAthlete(){

    if(App.analysis.length===0){

        return null;

    }

    return App.analysis.reduce(

        (best,current)=>

        current.score>

        best.score

        ?current

        :best

    );

}

/* ==========================================
   AI Coach
========================================== */

function updateTodayCoach(){

    const coach=$("#todayCoach");

    if(!coach) return;

    const best=

        getBestAthlete();

    if(!best){

        coach.textContent=

        "오늘 분석 데이터가 없습니다.";

        return;

    }

    coach.innerHTML=`

🏆 최고 점수

<b>${best.score}</b>

<br>

선수 :

${best.name||"-"}

`;

}
/* ==========================================
   Sport Statistics
========================================== */

function calculateSportStatistics(){

    const stats={};

    App.analysis.forEach(item=>{

        const sport=item.sport||"기타";

        if(!stats[sport]){

            stats[sport]={

                count:0,

                total:0,

                best:0

            };

        }

        stats[sport].count++;

        stats[sport].total+=item.score;

        stats[sport].best=Math.max(

            stats[sport].best,

            item.score

        );

    });

    return stats;

}

/* ==========================================
   Dashboard Progress
========================================== */

function calculateProgress(){

    if(App.analysis.length===0){

        return 0;

    }

    const average=

        Dashboard.averageScore;

    return Math.min(

        100,

        Math.round(

            average

        )

    );

}

/* ==========================================
   Risk Level
========================================== */

function getRiskLevel(){

    if(Analysis.stability>=95)

        return{

            text:"매우 안정",

            color:"#16a34a"

        };

    if(Analysis.stability>=85)

        return{

            text:"안정",

            color:"#3b82f6"

        };

    if(Analysis.stability>=70)

        return{

            text:"주의",

            color:"#f59e0b"

        };

    return{

        text:"위험",

        color:"#ef4444"

    };

}

/* ==========================================
   AI Status
========================================== */

function updateAIStatus(){

    const risk=

        getRiskLevel();

    const el=$("#aiStatus");

    if(!el) return;

    el.textContent=

        risk.text;

    el.style.color=

        risk.color;

}

/* ==========================================
   Achievement
========================================== */

function updateAchievement(){

    const target=

        $("#achievementRate");

    if(!target) return;

    target.textContent=

        calculateProgress()+"%";

}

/* ==========================================
   Dashboard Refresh
========================================== */

function refreshDashboardAll(){

    calculateDashboard();

    updateDashboardCards();

    updateDashboardChart();

    updateRecentAnalysis();

    updateTodayCoach();

    updateAchievement();

    updateAIStatus();

}
/* ==========================================
   Notification Center
========================================== */

const NotificationCenter = {

    list:[]

};

function pushNotification(title,message){

    NotificationCenter.list.unshift({

        title,

        message,

        time:new Date().toLocaleTimeString()

    });

    if(NotificationCenter.list.length>20){

        NotificationCenter.list.pop();

    }

    renderNotifications();

}

function renderNotifications(){

    const target=$("#notificationList");

    if(!target) return;

    target.innerHTML="";

    NotificationCenter.list.forEach(item=>{

        const div=document.createElement("div");

        div.className="notification-item";

        div.innerHTML=`

<strong>${item.title}</strong>

<p>${item.message}</p>

<small>${item.time}</small>

`;

        target.appendChild(div);

    });

}

/* ==========================================
   Clock
========================================== */

function updateClock(){

    const target=$("#currentTime");

    if(!target) return;

    target.textContent=

        new Date().toLocaleString();

}

setInterval(updateClock,1000);

/* ==========================================
   System Status
========================================== */

function updateSystemStatus(){

    const target=$("#systemStatus");

    if(!target) return;

    target.textContent=

        "정상 작동";

}

/* ==========================================
   Memory
========================================== */

function updateMemoryInfo(){

    const target=$("#memoryInfo");

    if(!target) return;

    if(performance.memory){

        target.textContent=

            Math.round(

                performance.memory.usedJSHeapSize/

                1024/

                1024

            )+" MB";

    }else{

        target.textContent="지원 안함";

    }

}

/* ==========================================
   Version
========================================== */

function updateVersion(){

    const target=$("#versionText");

    if(!target) return;

    target.textContent=

        SSPRO.version;

}

/* ==========================================
   Dashboard Init
========================================== */

function initializeDashboard(){

    initializeDashboardChart();

    refreshDashboardAll();

    updateClock();

    updateSystemStatus();

    updateMemoryInfo();

    updateVersion();

}

console.log("📊 Dashboard Module Loaded");