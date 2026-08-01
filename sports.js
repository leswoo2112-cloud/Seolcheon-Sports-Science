/* ===========================================
   sports.js Part 1
   설천고 스포츠과학 훈련센터
   종목훈련 관리
=========================================== */

"use strict";

/* ===========================================
   Sports Module
=========================================== */

const sportsModule = {

    editingId: null,

    currentCategory: "winter"

};

/* ===========================================
   종목 분류
=========================================== */

const SPORTS = {

    winter: [

        "바이애슬론",
        "크로스컨트리",
        "롤러스키",
        "알파인스키",
        "스노보드",
        "스키점프",
        "노르딕복합",
        "프리스타일",
        "컬링",
        "루지",
        "봅슬레이",
        "스켈레톤",
        "쇼트트랙",
        "스피드스케이팅",
        "피겨스케이팅",
        "아이스하키"

    ],

    summer:[

        "육상",
        "축구",
        "농구",
        "배구",
        "야구",
        "핸드볼",
        "럭비",
        "수영",
        "다이빙",
        "펜싱",
        "양궁",
        "사격",
        "태권도",
        "유도",
        "레슬링",
        "복싱",
        "체조",
        "역도",
        "사이클",
        "조정",
        "카누",
        "철인3종",
        "탁구",
        "배드민턴",
        "테니스",
        "골프"

    ],

    college:[

        "100m",
        "200m",
        "400m",
        "800m",
        "1500m",
        "왕복달리기",
        "제자리멀리뛰기",
        "멀리뛰기",
        "높이뛰기",
        "턱걸이",
        "윗몸일으키기",
        "메디신볼",
        "배근력",
        "악력",
        "좌전굴",
        "20m왕복달리기"

    ]

};

/* ===========================================
   DOM
=========================================== */

const sportsDOM = {

    athlete:

    document.getElementById(

    "sportsAthleteSelect"

    ),

    type:

    document.getElementById(

    "sportsTypeSelect"

    ),

    training:

    document.getElementById(

    "sportsTrainingType"

    ),

    date:

    document.getElementById(

    "sportsDateInput"

    ),

    duration:

    document.getElementById(

    "sportsDurationInput"

    ),

    score:

    document.getElementById(

    "sportsScoreInput"

    ),

    memo:

    document.getElementById(

    "sportsMemoInput"

    ),

    table:

    document.getElementById(

    "sportsTableBody"

    )

};

/* ===========================================
   종목 목록 출력
=========================================== */

function loadSports(category){

    sportsModule.currentCategory=

    category;

    if(!sportsDOM.type){

        return;

    }

    sportsDOM.type.innerHTML="";

    SPORTS[category].forEach(

        sport=>{

            sportsDOM.type.innerHTML+=`

<option value="${sport}">

${sport}

</option>

`;

        }

    );

}
/* ===========================================
   sports.js Part 2
   훈련 저장 / AI 분석
=========================================== */

"use strict";

/* ===========================================
   Training Load
=========================================== */

function calculateTrainingLoad(duration, rpe){

    duration = Number(duration) || 0;
    rpe = Number(rpe) || 0;

    return duration * rpe;

}

/* ===========================================
   점수 등급
=========================================== */

function getScoreGrade(score){

    score = Number(score);

    if(score >= 97) return "S+";
    if(score >= 94) return "S";
    if(score >= 90) return "A+";
    if(score >= 85) return "A";
    if(score >= 80) return "B+";
    if(score >= 75) return "B";
    if(score >= 70) return "C";
    return "D";

}

/* ===========================================
   AI 피드백
=========================================== */

function createAnalysis(score){

    score = Number(score);

    if(score >= 95){

        return{

            level:"매우 우수",

            color:"#29D17C",

            comment:"국가대표 수준의 훈련 수행입니다."

        };

    }

    if(score >= 85){

        return{

            level:"우수",

            color:"#00B7FF",

            comment:"훈련 수행이 매우 안정적입니다."

        };

    }

    if(score >= 75){

        return{

            level:"보통",

            color:"#FFD54A",

            comment:"기술과 지구력을 조금 더 향상시키세요."

        };

    }

    return{

        level:"보완 필요",

        color:"#FF5555",

        comment:"기본기와 자세 교정이 필요합니다."

    };

}

/* ===========================================
   저장
=========================================== */

function saveSportsRecord(){

    const athleteId = sportsDOM.athlete.value;

    if(!athleteId){

        toast("선수를 선택하세요.","error");

        return;

    }

    const score = Number(sportsDOM.score.value);

    const rpe = Math.round(score / 10);

    const record={

        id:createId(),

        athleteId,

        sport:sportsDOM.type.value,

        trainingType:

        sportsDOM.training.value,

        date:sportsDOM.date.value,

        duration:Number(

            sportsDOM.duration.value

        ),

        score,

        grade:getScoreGrade(score),

        rpe,

        trainingLoad:

        calculateTrainingLoad(

            sportsDOM.duration.value,

            rpe

        ),

        memo:

        sportsDOM.memo.value,

        createdAt:

        new Date().toISOString()

    };

    app.sports.push(record);

    saveData();

    renderSportsTable();

    updateDashboard();

    updateSportsAnalysis();

    toast(

        "훈련기록 저장 완료"

    );

    resetSportsForm();

}
/* ===========================================
   sports.js Part 3
   기록 출력 / 수정 / 삭제
=========================================== */

"use strict";

/* ===========================================
   테이블 출력
=========================================== */

function renderSportsTable(){

    if(!sportsDOM.table) return;

    sportsDOM.table.innerHTML="";

    app.sports

    .sort((a,b)=>

        new Date(b.date)-new Date(a.date)

    )

    .forEach(record=>{

        const athlete=

        app.athletes.find(

            a=>a.id===record.athleteId

        );

        sportsDOM.table.innerHTML+=`

<tr>

<td>${record.date}</td>

<td>${athlete?.name || "-"}</td>

<td>${record.sport}</td>

<td>${record.trainingType}</td>

<td>${record.duration}분</td>

<td>

<span class="badge">

${record.grade}

</span>

</td>

<td>${record.score}</td>

<td>

<button
onclick="editSportsRecord('${record.id}')">

수정

</button>

<button
class="danger"
onclick="deleteSportsRecord('${record.id}')">

삭제

</button>

</td>

</tr>

`;

    });

}

/* ===========================================
   수정
=========================================== */

function editSportsRecord(id){

    const record=

    app.sports.find(

        item=>item.id===id

    );

    if(!record) return;

    sportsModule.editingId=id;

    sportsDOM.athlete.value=

    record.athleteId;

    sportsDOM.type.value=

    record.sport;

    sportsDOM.training.value=

    record.trainingType;

    sportsDOM.date.value=

    record.date;

    sportsDOM.duration.value=

    record.duration;

    sportsDOM.score.value=

    record.score;

    sportsDOM.memo.value=

    record.memo;

    toast(

        "훈련기록 수정모드"

    );

}

/* ===========================================
   삭제
=========================================== */

function deleteSportsRecord(id){

    if(

        !confirm(

            "훈련기록을 삭제하시겠습니까?"

        )

    ){

        return;

    }

    app.sports=

    app.sports.filter(

        item=>item.id!==id

    );

    saveData();

    renderSportsTable();

    updateDashboard();

    toast(

        "삭제 완료"

    );

}

/* ===========================================
   초기화
=========================================== */

function resetSportsForm(){

    sportsModule.editingId=null;

    sportsDOM.date.value="";

    sportsDOM.duration.value="";

    sportsDOM.score.value="";

    sportsDOM.memo.value="";

}

/* ===========================================
   AI 분석
=========================================== */

function updateSportsAnalysis(){

    const score=

    Number(

        sportsDOM.score.value||0

    );

    const analysis=

    createAnalysis(score);

    const result=

    document.getElementById(

        "sportsAnalysisResult"

    );

    if(!result) return;

    result.innerHTML=`

<h3 style="color:${analysis.color}">

${analysis.level}

</h3>

<p>

${analysis.comment}

</p>

<p>

등급 :

<strong>

${getScoreGrade(score)}

</strong>

</p>

`;

}

/* ===========================================
   점수 입력
=========================================== */

sportsDOM.score?.addEventListener(

    "input",

    updateSportsAnalysis

);

/* ===========================================
   저장 버튼
=========================================== */

document

.getElementById(

"saveSportsRecordButton"

)

?.addEventListener(

"click",

saveSportsRecord

);

/* ===========================================
   Export
=========================================== */

window.renderSportsTable=
renderSportsTable;

window.editSportsRecord=
editSportsRecord;

window.deleteSportsRecord=
deleteSportsRecord;
/* ===========================================
   sports.js Part 4
   스포츠과학 분석
=========================================== */

"use strict";

/* ===========================================
   Heart Rate Zone
=========================================== */

function calculateHeartRateZone(age, heartRate){

    const maxHR = 220 - Number(age);

    const percent = (heartRate / maxHR) * 100;

    if(percent < 60) return "Zone 1";

    if(percent < 70) return "Zone 2";

    if(percent < 80) return "Zone 3";

    if(percent < 90) return "Zone 4";

    return "Zone 5";

}

/* ===========================================
   TRIMP
=========================================== */

function calculateTRIMP(duration,rpe){

    duration = Number(duration)||0;

    rpe = Number(rpe)||0;

    return Math.round(duration*rpe*1.5);

}

/* ===========================================
   Calories
=========================================== */

function calculateCalories(weight,duration,met){

    weight = Number(weight)||0;

    duration = Number(duration)||0;

    met = Number(met)||8;

    return Math.round(

        met *

        weight *

        (duration/60)

    );

}

/* ===========================================
   평균속도
=========================================== */

function calculateAverageSpeed(distance,time){

    distance = Number(distance)||0;

    time = Number(time)||0;

    if(time===0){

        return 0;

    }

    return Number(

        (distance/(time/60))

        .toFixed(2)

    );

}

/* ===========================================
   국가대표 점수
=========================================== */

function compareNationalScore(score){

    if(score>=95){

        return{

            level:"국가대표",

            color:"#29D17C"

        };

    }

    if(score>=90){

        return{

            level:"전국대회",

            color:"#00E5FF"

        };

    }

    if(score>=80){

        return{

            level:"선수",

            color:"#FFD54A"

        };

    }

    return{

        level:"기초훈련",

        color:"#FF5555"

    };

}

/* ===========================================
   AI 추천
=========================================== */

function createTrainingRecommendation(record){

    const result=[];

    if(record.score<80){

        result.push(

            "기초 기술훈련 증가"

        );

    }

    if(record.trainingLoad<300){

        result.push(

            "훈련부하 증가"

        );

    }

    if(record.trainingLoad>900){

        result.push(

            "회복훈련 권장"

        );

    }

    if(record.grade==="S+"){

        result.push(

            "현재 프로그램 유지"

        );

    }

    return result;

}

/* ===========================================
   AI 카드
=========================================== */

function renderTrainingScience(record){

    const target=

    document.getElementById(

    "sportsScience"

    );

    if(!target)return;

    const national=

    compareNationalScore(

        record.score

    );

    target.innerHTML=`

<div class="science-grid">

<div class="science-card">

<h3>Training Load</h3>

<div class="science-value">

${record.trainingLoad}

</div>

</div>

<div class="science-card">

<h3>TRIMP</h3>

<div class="science-value">

${calculateTRIMP(

record.duration,

record.rpe

)}

</div>

</div>

<div class="science-card">

<h3>국가대표 기준</h3>

<div

class="science-value"

style="color:${national.color}"

>

${national.level}

</div>

</div>

<div class="science-card">

<h3>AI 추천</h3>

<p>

${createTrainingRecommendation(record).join("<br>")}

</p>

</div>

</div>

`;

}

/* ===========================================
   Export
=========================================== */

window.calculateHeartRateZone=
calculateHeartRateZone;

window.calculateTRIMP=
calculateTRIMP;

window.calculateCalories=
calculateCalories;

window.calculateAverageSpeed=
calculateAverageSpeed;

window.compareNationalScore=
compareNationalScore;

window.renderTrainingScience=
renderTrainingScience;