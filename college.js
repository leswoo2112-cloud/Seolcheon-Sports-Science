/* ==========================================
   College Entrance AI
========================================== */

"use strict";

const College = {

    event: "제자리멀리뛰기",

    score: 0,

    grade: "-",

    university: []

};

/* ==========================================
   Event
========================================== */

function setCollegeEvent(event){

    College.event = event;

}

/* ==========================================
   Analyze
========================================== */

function analyzeCollege(){

    calculateCollegeScore();

    calculateCollegeGrade();

    recommendUniversity();

    updateCollegeUI();

}

/* ==========================================
   Score
========================================== */

function calculateCollegeScore(){

    College.score = Math.round(

        Analysis.score * 0.4 +

        Analysis.balance * 0.2 +

        Analysis.posture * 0.2 +

        Analysis.stability * 0.2

    );

}

/* ==========================================
   Grade
========================================== */

function calculateCollegeGrade(){

    const score = College.score;

    if(score >= 95) College.grade = "S";

    else if(score >= 90) College.grade = "A+";

    else if(score >= 85) College.grade = "A";

    else if(score >= 80) College.grade = "B+";

    else if(score >= 75) College.grade = "B";

    else College.grade = "C";

}

/* ==========================================
   University
========================================== */

function recommendUniversity(){

    College.university = [];

    if(College.score >= 95){

        College.university.push("한국체육대학교");

        College.university.push("용인대학교");

    }

    if(College.score >= 90){

        College.university.push("경희대학교");

        College.university.push("단국대학교");

    }

    if(College.score >= 85){

        College.university.push("상명대학교");

        College.university.push("경성대학교");

    }

}

/* ==========================================
   UI
========================================== */

function updateCollegeUI(){

    $("#collegeScore").textContent = College.score;

    $("#collegePercent").textContent = College.grade;

    $("#collegeName").textContent =

        College.university.join(", ");

}
/* ==========================================
   Event Evaluation
========================================== */

const CollegeStandard={

    "제자리멀리뛰기":95,

    "10m 왕복달리기":94,

    "메디신볼":93,

    "좌전굴":90,

    "윗몸일으키기":92,

    "턱걸이":95,

    "오래달리기":91,

    "높이뛰기":94

};

function compareCollegeStandard(){

    const target=

        CollegeStandard[College.event]??90;

    return Math.min(

        100,

        Math.round(

            College.score/

            target*100

        )

    );

}

/* ==========================================
   Weak Point
========================================== */

function getCollegeWeakPoint(){

    const result=[];

    if(Analysis.balance<90){

        result.push("균형");

    }

    if(Analysis.posture<90){

        result.push("자세");

    }

    if(Analysis.stability<90){

        result.push("안정성");

    }

    return result;

}

/* ==========================================
   AI Coach
========================================== */

function createCollegeCoach(){

    const message=[];

    const weak=

        getCollegeWeakPoint();

    if(weak.includes("균형")){

        message.push(

            "⚖ 균형 훈련을 추천합니다."

        );

    }

    if(weak.includes("자세")){

        message.push(

            "🦴 자세 교정 운동이 필요합니다."

        );

    }

    if(weak.includes("안정성")){

        message.push(

            "🦵 코어 안정성 운동을 추천합니다."

        );

    }

    if(message.length===0){

        message.push(

            "🏆 체대입시 상위권 수준입니다."

        );

    }

    return message;

}

/* ==========================================
   Refresh
========================================== */

function refreshCollege(){

    const percent=

        compareCollegeStandard();

    $("#collegePercent").textContent=

        percent+"%";

    console.log(

        createCollegeCoach()

    );

}

/* ==========================================
   Export
========================================== */

window.CollegeEngine={

    analyzeCollege,

    refreshCollege,

    compareCollegeStandard,

    createCollegeCoach

};

console.log(

    "🎓 College Module Loaded"

);