/* ==========================================
   comparison.js
========================================== */

"use strict";

/* ==========================================
   Standard Database
========================================== */

const Compare = {

    mode:"national",

    standards:{

        "바이애슬론":{

            score:96,

            balance:95,

            posture:95,

            stability:95

        },

        "육상":{

            score:95,

            balance:94,

            posture:95,

            stability:94

        },

        "농구":{

            score:94,

            balance:93,

            posture:94,

            stability:93

        },

        "축구":{

            score:94,

            balance:94,

            posture:93,

            stability:94

        },

        "체대입시":{

            score:90,

            balance:88,

            posture:89,

            stability:88

        }

    }

};

/* ==========================================
   Compare
========================================== */

function compareScore(){

    const sport=Analysis.sport;

    const target=

        Compare.standards[sport]||

        Compare.standards["육상"];

    const result={

        score:getPercent(

            Analysis.score,

            target.score

        ),

        balance:getPercent(

            Analysis.balance,

            target.balance

        ),

        posture:getPercent(

            Analysis.posture,

            target.posture

        ),

        stability:getPercent(

            Analysis.stability,

            target.stability

        )

    };

    updateCompareUI(result);

    return result;

}

/* ==========================================
   Percent
========================================== */

function getPercent(value,target){

    return Math.min(

        100,

        Math.round(

            value/target*100

        )

    );

}
/* ==========================================
   Grade
========================================== */

function calculateGrade(percent){

    if(percent>=98) return "S+";

    if(percent>=95) return "S";

    if(percent>=90) return "A+";

    if(percent>=85) return "A";

    if(percent>=80) return "B+";

    if(percent>=75) return "B";

    if(percent>=70) return "C";

    return "D";

}

/* ==========================================
   Update UI
========================================== */

function updateCompareUI(result){

    $("#myScore").textContent=

        Analysis.score;

    $("#nationalScore").textContent=

        Compare.standards[Analysis.sport].score;

    $("#nationalRate").textContent=

        result.score+"%";

    $("#nationalGrade").textContent=

        calculateGrade(result.score);

    updateNationalChart(result);

    updateComment(result);

}

/* ==========================================
   Difference
========================================== */

function getDifference(){

    const standard=

        Compare.standards[Analysis.sport];

    return{

        score:

            Analysis.score-

            standard.score,

        balance:

            Analysis.balance-

            standard.balance,

        posture:

            Analysis.posture-

            standard.posture,

        stability:

            Analysis.stability-

            standard.stability

    };

}

/* ==========================================
   Comment
========================================== */

function updateComment(result){

    const diff=getDifference();

    let html="";

    html+="<h3>AI 비교 결과</h3>";

    html+="<br>";

    html+=

    diff.score>=0

    ? "🏆 국가대표 기준 이상입니다.<br><br>"

    : `📈 국가대표보다 ${Math.abs(diff.score)}점 부족합니다.<br><br>`;

    html+="<b>세부 분석</b><br><br>";

    html+=

        "균형 : "+

        result.balance+

        "%<br>";

    html+=

        "자세 : "+

        result.posture+

        "%<br>";

    html+=

        "안정성 : "+

        result.stability+

        "%<br><br>";

    if(diff.balance<0){

        html+="⚖ 균형 훈련 추천<br>";

    }

    if(diff.posture<0){

        html+="🦴 자세 교정 추천<br>";

    }

    if(diff.stability<0){

        html+="🦵 하체 안정성 강화 추천<br>";

    }

    $("#nationalComment").innerHTML=

        html;

}
/* ==========================================
   National Chart
========================================== */

function updateNationalChart(result){

    if(!nationalChart) return;

    nationalChart.data.labels=[

        "AI 점수",

        "균형",

        "자세",

        "안정성"

    ];

    nationalChart.data.datasets=[

        {

            label:"현재",

            data:[

                Analysis.score,

                Analysis.balance,

                Analysis.posture,

                Analysis.stability

            ],

            backgroundColor:"#4F8CFF"

        },

        {

            label:"국가대표",

            data:[

                Compare.standards[Analysis.sport].score,

                Compare.standards[Analysis.sport].balance,

                Compare.standards[Analysis.sport].posture,

                Compare.standards[Analysis.sport].stability

            ],

            backgroundColor:"#22C55E"

        }

    ];

    nationalChart.update();

}

/* ==========================================
   School Average
========================================== */

function compareSchoolAverage(){

    if(App.analysis.length===0){

        return null;

    }

    const average=

        Math.round(

            App.analysis.reduce(

                (sum,item)=>

                sum+item.score,

                0

            )/

            App.analysis.length

        );

    return{

        score:average,

        difference:

            Analysis.score-

            average

    };

}

/* ==========================================
   Personal Best
========================================== */

function comparePersonalBest(){

    const myData=

        App.analysis.filter(

            item=>

            item.sport===Analysis.sport

        );

    if(myData.length===0){

        return null;

    }

    const best=Math.max(

        ...myData.map(

            item=>item.score

        )

    );

    return{

        best,

        difference:

            Analysis.score-best

    };

}

/* ==========================================
   College Compare
========================================== */

function compareCollege(){

    const target=

        Compare.standards["체대입시"];

    return{

        score:getPercent(

            Analysis.score,

            target.score

        ),

        balance:getPercent(

            Analysis.balance,

            target.balance

        ),

        posture:getPercent(

            Analysis.posture,

            target.posture

        ),

        stability:getPercent(

            Analysis.stability,

            target.stability

        )

    };

}

/* ==========================================
   Summary
========================================== */

function createComparisonSummary(){

    const school=

        compareSchoolAverage();

    const personal=

        comparePersonalBest();

    const college=

        compareCollege();

    return{

        national:

            compareScore(),

        school,

        personal,

        college

    };

}
/* ==========================================
   Recommendation Engine
========================================== */

function createRecommendation() {

    const recommend = [];

    if (Analysis.balance < 90) {

        recommend.push({
            title: "균형 훈련",
            description: "싱글 레그 스쿼트 3세트"
        });

    }

    if (Analysis.posture < 90) {

        recommend.push({
            title: "자세 교정",
            description: "벽 자세 유지 5분"
        });

    }

    if (Analysis.stability < 90) {

        recommend.push({
            title: "코어 강화",
            description: "플랭크 3세트"
        });

    }

    if (recommend.length === 0) {

        recommend.push({

            title: "Excellent",

            description: "현재 상태를 유지하세요."

        });

    }

    return recommend;

}

/* ==========================================
   Ranking
========================================== */

function calculateRanking() {

    const sorted = [...App.analysis]

        .sort(

            (a, b) => b.score - a.score

        );

    const rank =

        sorted.findIndex(

            item =>

            item.score === Analysis.score

        ) + 1;

    return {

        rank,

        total: sorted.length

    };

}

/* ==========================================
   Final Result
========================================== */

function createFinalComparison() {

    return {

        national: compareScore(),

        school: compareSchoolAverage(),

        personal: comparePersonalBest(),

        college: compareCollege(),

        ranking: calculateRanking(),

        recommendation: createRecommendation()

    };

}

/* ==========================================
   Export
========================================== */

window.CompareEngine = {

    compareScore,

    compareSchoolAverage,

    comparePersonalBest,

    compareCollege,

    calculateRanking,

    createRecommendation,

    createFinalComparison

};

console.log("🇰🇷 Comparison Module Loaded");