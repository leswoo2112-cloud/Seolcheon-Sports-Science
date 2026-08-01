/* ==========================================
   Report Module
========================================== */

"use strict";

const Report = {

    score:0,

    grade:"-",

    recommendation:[],

    created:new Date()

};

/* ==========================================
   Generate Report
========================================== */

function generateReport(){

    Report.score=Analysis.score;

    Report.grade=calculateReportGrade();

    Report.recommendation=

        createRecommendation();

    updateReport();

}

/* ==========================================
   Grade
========================================== */

function calculateReportGrade(){

    const score=Analysis.score;

    if(score>=95) return "S";

    if(score>=90) return "A+";

    if(score>=85) return "A";

    if(score>=80) return "B+";

    if(score>=75) return "B";

    if(score>=70) return "C";

    return "D";

}

/* ==========================================
   Update UI
========================================== */

function updateReport(){

    $("#reportScore").textContent=

        Report.score;

    $("#reportGrade").textContent=

        Report.grade;

    $("#trainingLevel").textContent=

        getTrainingLevel();

    $("#reportRisk").textContent=

        getRisk();

    updateReportChart();

    updateReportFeedback();

}
/* ==========================================
   Report Chart
========================================== */

function updateReportChart(){

    if(!reportChart) return;

    reportChart.data.labels=[

        "AI 점수",

        "균형",

        "자세",

        "안정성"

    ];

    reportChart.data.datasets=[

        {

            label:"현재",

            data:[

                Analysis.score,

                Analysis.balance,

                Analysis.posture,

                Analysis.stability

            ],

            backgroundColor:"#4F8CFF"

        }

    ];

    reportChart.update();

}

/* ==========================================
   AI Feedback
========================================== */

function updateReportFeedback(){

    const feedback=[];

    if(Analysis.score>=95){

        feedback.push(

            "🏆 국가대표 수준의 자세입니다."

        );

    }

    if(Analysis.balance<90){

        feedback.push(

            "⚖ 좌우 균형 훈련을 추천합니다."

        );

    }

    if(Analysis.posture<90){

        feedback.push(

            "🦴 상체 자세를 조금 더 세워주세요."

        );

    }

    if(Analysis.stability<90){

        feedback.push(

            "🦵 코어 안정성 운동이 필요합니다."

        );

    }

    if(Biathlon.totalScore>90){

        feedback.push(

            "🎿 바이애슬론 활주 효율이 매우 좋습니다."

        );

    }

    if(feedback.length===0){

        feedback.push(

            "🤖 분석 결과를 기다리는 중입니다."

        );

    }

    $("#reportFeedback").innerHTML=

        feedback.join("<br><br>");

}

/* ==========================================
   Training Level
========================================== */

function getTrainingLevel(){

    if(Analysis.score>=95)

        return "국가대표";

    if(Analysis.score>=90)

        return "엘리트";

    if(Analysis.score>=80)

        return "선수";

    if(Analysis.score>=70)

        return "성장";

    return "기초";

}

/* ==========================================
   Strength / Weakness
========================================== */

function getStrengths(){

    const list=[];

    if(Analysis.balance>=90)

        list.push("균형");

    if(Analysis.posture>=90)

        list.push("자세");

    if(Analysis.stability>=90)

        list.push("안정성");

    return list;

}

function getWeaknesses(){

    const list=[];

    if(Analysis.balance<90)

        list.push("균형");

    if(Analysis.posture<90)

        list.push("자세");

    if(Analysis.stability<90)

        list.push("안정성");

    return list;

}
/* ==========================================
   Report Events
========================================== */

document.addEventListener("DOMContentLoaded",()=>{

    $("#pdfButton")?.addEventListener(

        "click",

        exportPDF

    );

    $("#printButton")?.addEventListener(

        "click",

        printReport

    );

    $("#shareButton")?.addEventListener(

        "click",

        shareReport

    );

});

/* ==========================================
   Export PDF
========================================== */

function exportPDF(){

    const report={

        date:new Date().toLocaleString(),

        sport:Analysis.sport,

        score:Analysis.score,

        grade:Report.grade,

        balance:Analysis.balance,

        posture:Analysis.posture,

        stability:Analysis.stability,

        recommendation:Report.recommendation

    };

    const blob=new Blob(

        [

            JSON.stringify(

                report,

                null,

                2

            )

        ],

        {

            type:"application/json"

        }

    );

    const url=URL.createObjectURL(blob);

    const a=document.createElement("a");

    a.href=url;

    a.download=

        `Report_${Date.now()}.json`;

    a.click();

    URL.revokeObjectURL(url);

    showToast("리포트 저장 완료");

}

/* ==========================================
   Print
========================================== */

function printReport(){

    window.print();

}

/* ==========================================
   Share
========================================== */

async function shareReport(){

    const text=`

🏆 설천고 스포츠과학센터

종목 : ${Analysis.sport}

AI 점수 : ${Analysis.score}

등급 : ${Report.grade}

균형 : ${Analysis.balance}

자세 : ${Analysis.posture}

안정성 : ${Analysis.stability}

`;

    if(navigator.share){

        await navigator.share({

            title:"AI Report",

            text

        });

    }

    else{

        navigator.clipboard.writeText(text);

        showToast("클립보드에 복사되었습니다.");

    }

}

/* ==========================================
   History
========================================== */

function saveReportHistory(){

    if(!App.reportHistory){

        App.reportHistory=[];

    }

    App.reportHistory.push({

        date:new Date().toLocaleString(),

        score:Analysis.score,

        sport:Analysis.sport,

        grade:Report.grade

    });

    localStorage.setItem(

        "reportHistory",

        JSON.stringify(

            App.reportHistory

        )

    );

}