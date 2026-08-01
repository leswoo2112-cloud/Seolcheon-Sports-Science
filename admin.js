/* ==========================================
   Admin Module
========================================== */

"use strict";

const Admin={

    loggedIn:false,

    user:null,

    role:"guest"

};

/* ==========================================
   Login
========================================== */

function adminLogin(id,password){

    if(

        id==="admin" &&

        password==="sspro2026"

    ){

        Admin.loggedIn=true;

        Admin.user=id;

        Admin.role="admin";

        showAdminPage();

        showToast("관리자 로그인");

    }

    else{

        showToast(

            "아이디 또는 비밀번호 오류",

            "error"

        );

    }

}

/* ==========================================
   Logout
========================================== */

function adminLogout(){

    Admin.loggedIn=false;

    Admin.user=null;

    Admin.role="guest";

    hideAdminPage();

    showToast("로그아웃");

}

/* ==========================================
   Dashboard
========================================== */

function updateAdminDashboard(){

    $("#adminAthletes").textContent=

        App.athletes.length;

    $("#adminAnalysis").textContent=

        App.analysis.length;

    $("#adminReports").textContent=

        App.reportHistory

        ?App.reportHistory.length

        :0;

}

/* ==========================================
   Show
========================================== */

function showAdminPage(){

    $("#adminPanel")

    ?.classList.remove(

        "hidden"

    );

}

/* ==========================================
   Hide
========================================== */

function hideAdminPage(){

    $("#adminPanel")

    ?.classList.add(

        "hidden"

    );

}
/* ==========================================
   Athlete Management
========================================== */

function adminDeleteAthlete(id){

    if(!Admin.loggedIn){

        showToast("관리자 권한이 필요합니다.","error");

        return;

    }

    App.athletes=App.athletes.filter(

        athlete=>athlete.id!==id

    );

    saveStorage();

    renderAthleteTable();

    updateAdminDashboard();

}

/* ==========================================
   Backup
========================================== */

function backupDatabase(){

    if(!Admin.loggedIn) return;

    const backup={

        athletes:App.athletes,

        analysis:App.analysis,

        reports:App.reportHistory||[],

        created:new Date().toISOString(),

        version:SSPRO.version

    };

    const blob=new Blob(

        [

            JSON.stringify(

                backup,

                null,

                2

            )

        ],

        {

            type:"application/json"

        }

    );

    const url=

        URL.createObjectURL(blob);

    const a=

        document.createElement("a");

    a.href=url;

    a.download=

        "SSPRO_Backup.json";

    a.click();

    URL.revokeObjectURL(url);

    showToast("백업 완료");

}

/* ==========================================
   Restore
========================================== */

function restoreDatabase(data){

    App.athletes=

        data.athletes||[];

    App.analysis=

        data.analysis||[];

    App.reportHistory=

        data.reports||[];

    saveStorage();

    renderAthleteTable();

    refreshDashboardAll();

    updateAdminDashboard();

    showToast("복원 완료");

}

/* ==========================================
   System Log
========================================== */

const SystemLog=[];

function addSystemLog(type,message){

    SystemLog.unshift({

        type,

        message,

        time:new Date()

            .toLocaleString()

    });

    if(SystemLog.length>300){

        SystemLog.pop();

    }

}

function renderSystemLog(){

    const target=$("#systemLog");

    if(!target) return;

    target.innerHTML="";

    SystemLog.forEach(log=>{

        const div=

            document.createElement("div");

        div.className="system-log";

        div.innerHTML=`

<strong>${log.type}</strong>

<span>${log.time}</span>

<br>

${log.message}

`;

        target.appendChild(div);

    });

}

/* ==========================================
   Export
========================================== */

window.AdminModule={

    adminLogin,

    adminLogout,

    adminDeleteAthlete,

    backupDatabase,

    restoreDatabase,

    addSystemLog,

    renderSystemLog

};

console.log("👨‍💼 Admin Module Loaded");
/* ==========================================
   Statistics
========================================== */

function calculateAdminStatistics(){

    const stats={

        athleteCount:App.athletes.length,

        analysisCount:App.analysis.length,

        averageScore:0,

        bestScore:0

    };

    if(App.analysis.length){

        stats.averageScore=Math.round(

            App.analysis.reduce(

                (sum,item)=>sum+item.score,

                0

            )/App.analysis.length

        );

        stats.bestScore=Math.max(

            ...App.analysis.map(

                item=>item.score

            )

        );

    }

    return stats;

}

/* ==========================================
   Ranking
========================================== */

function getAthleteRanking(){

    return [...App.analysis]

        .sort(

            (a,b)=>b.score-a.score

        )

        .slice(0,10);

}

/* ==========================================
   Data Validation
========================================== */

function validateDatabase(){

    const errors=[];

    App.athletes.forEach((athlete,index)=>{

        if(!athlete.name){

            errors.push(

                `선수 ${index+1} 이름 누락`

            );

        }

        if(!athlete.sport){

            errors.push(

                `${athlete.name} 종목 누락`

            );

        }

    });

    return errors;

}

/* ==========================================
   Health Check
========================================== */

function runHealthCheck(){

    const errors=

        validateDatabase();

    if(errors.length===0){

        addSystemLog(

            "SYSTEM",

            "데이터 정상"

        );

        showToast(

            "시스템 정상"

        );

    }else{

        errors.forEach(error=>{

            addSystemLog(

                "ERROR",

                error

            );

        });

        renderSystemLog();

    }

}

/* ==========================================
   Dashboard Refresh
========================================== */

function refreshAdmin(){

    updateAdminDashboard();

    renderSystemLog();

    runHealthCheck();

}