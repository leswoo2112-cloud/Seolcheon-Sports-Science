/* ===========================================
   athlete.js Part 1
   설천고 스포츠과학 훈련센터
   선수 관리
=========================================== */

"use strict";

/* ===========================================
   Athlete Module
=========================================== */

const athleteModule = {

    editingId: null

};

/* ===========================================
   DOM
=========================================== */

const athleteDOM = {

    name: document.getElementById("athleteName"),

    gender: document.getElementById("athleteGender"),

    birth: document.getElementById("athleteBirth"),

    event: document.getElementById("athleteEvent"),

    height: document.getElementById("athleteHeight"),

    weight: document.getElementById("athleteWeight"),

    saveButton: document.getElementById("saveAthleteButton"),

    resetButton: document.getElementById("resetAthleteButton"),

    table: document.getElementById("athleteTableBody")

};

/* ===========================================
   BMI
=========================================== */

function calculateBMI(height, weight){

    height = Number(height);

    weight = Number(weight);

    if(height <= 0 || weight <= 0){

        return 0;

    }

    return (

        weight /

        Math.pow(height / 100,2)

    ).toFixed(1);

}

/* ===========================================
   Athlete Object
=========================================== */

function createAthleteObject(){

    return{

        id:createId(),

        name:athleteDOM.name.value.trim(),

        gender:athleteDOM.gender.value,

        birth:athleteDOM.birth.value,

        event:athleteDOM.event.value.trim(),

        height:Number(

            athleteDOM.height.value

        ),

        weight:Number(

            athleteDOM.weight.value

        ),

        bmi:calculateBMI(

            athleteDOM.height.value,

            athleteDOM.weight.value

        ),

        createdAt:new Date()

        .toISOString()

    };

}

/* ===========================================
   Validation
=========================================== */

function validateAthlete(){

    if(

        athleteDOM.name.value.trim()===""

    ){

        toast(

            "선수 이름을 입력하세요.",

            "error"

        );

        return false;

    }

    if(

        athleteDOM.event.value.trim()===""

    ){

        toast(

            "종목을 입력하세요.",

            "error"

        );

        return false;

    }

    return true;

}
/* ===========================================
   athlete.js Part 2
   선수 CRUD
=========================================== */

/* ===========================================
   선수 저장
=========================================== */

function saveAthlete(){

    if(!validateAthlete()){

        return;

    }

    const athlete = createAthleteObject();

    if(athleteModule.editingId){

        const index = app.athletes.findIndex(

            item => item.id === athleteModule.editingId

        );

        if(index !== -1){

            athlete.id = athleteModule.editingId;

            athlete.createdAt =

                app.athletes[index].createdAt;

            app.athletes[index] = athlete;

        }

        athleteModule.editingId = null;

        toast("선수 정보가 수정되었습니다.");

    }

    else{

        app.athletes.push(athlete);

        toast("선수가 등록되었습니다.");

    }

    saveData();

    renderAthleteTable();

    renderAthleteSelect();

    updateDashboard();

    resetAthleteForm();

}

/* ===========================================
   선수 삭제
=========================================== */

function deleteAthlete(id){

    if(

        !confirm("선수를 삭제하시겠습니까?")

    ){

        return;

    }

    app.athletes = app.athletes.filter(

        athlete => athlete.id !== id

    );

    saveData();

    renderAthleteTable();

    renderAthleteSelect();

    updateDashboard();

    toast("삭제되었습니다.");

}

/* ===========================================
   선수 수정
=========================================== */

function editAthlete(id){

    const athlete =

        app.athletes.find(

            item => item.id === id

        );

    if(!athlete){

        return;

    }

    athleteModule.editingId = id;

    athleteDOM.name.value = athlete.name;

    athleteDOM.gender.value = athlete.gender;

    athleteDOM.birth.value = athlete.birth;

    athleteDOM.event.value = athlete.event;

    athleteDOM.height.value = athlete.height;

    athleteDOM.weight.value = athlete.weight;

    athleteDOM.saveButton.textContent =

        "선수 수정";

}

/* ===========================================
   테이블 출력
=========================================== */

function renderAthleteTable(){

    if(!athleteDOM.table){

        return;

    }

    athleteDOM.table.innerHTML = "";

    app.athletes.forEach(athlete=>{

        athleteDOM.table.innerHTML += `

<tr>

<td>${athlete.name}</td>

<td>${athlete.gender}</td>

<td>${athlete.event}</td>

<td>${athlete.height} cm</td>

<td>${athlete.weight} kg</td>

<td>

<button
onclick="editAthlete('${athlete.id}')">

수정

</button>

<button
class="danger"
onclick="deleteAthlete('${athlete.id}')">

삭제

</button>

</td>

</tr>

`;

    });

}

/* ===========================================
   초기화
=========================================== */

function resetAthleteForm(){

    athleteDOM.name.value = "";

    athleteDOM.birth.value = "";

    athleteDOM.event.value = "";

    athleteDOM.height.value = "";

    athleteDOM.weight.value = "";

    athleteDOM.gender.selectedIndex = 0;

    athleteModule.editingId = null;

    athleteDOM.saveButton.textContent =

        "저장";

}

/* ===========================================
   이벤트
=========================================== */

athleteDOM.saveButton?.addEventListener(

    "click",

    saveAthlete

);

athleteDOM.resetButton?.addEventListener(

    "click",

    resetAthleteForm

);

/* ===========================================
   Export
=========================================== */

window.renderAthleteTable = renderAthleteTable;

window.editAthlete = editAthlete;

window.deleteAthlete = deleteAthlete;
/* ===========================================
   athlete.js Part 3
   검색 / 필터 / 통계
=========================================== */

"use strict";

/* ===========================================
   검색
=========================================== */

function searchAthletes(keyword = "") {

    keyword = keyword.trim().toLowerCase();

    if (!keyword) {

        return app.athletes;

    }

    return app.athletes.filter(athlete => {

        return (

            athlete.name.toLowerCase().includes(keyword) ||

            athlete.event.toLowerCase().includes(keyword)

        );

    });

}

/* ===========================================
   종목 필터
=========================================== */

function filterAthletes(eventName = "") {

    if (!eventName) {

        return app.athletes;

    }

    return app.athletes.filter(

        athlete => athlete.event === eventName

    );

}

/* ===========================================
   BMI 등급
=========================================== */

function getBMIGrade(bmi){

    bmi = Number(bmi);

    if(bmi < 18.5){

        return "저체중";

    }

    if(bmi < 23){

        return "정상";

    }

    if(bmi < 25){

        return "과체중";

    }

    return "비만";

}

/* ===========================================
   선수 통계
=========================================== */

function updateAthleteStatistics(){

    const total = app.athletes.length;

    const male = app.athletes.filter(

        athlete => athlete.gender === "남"

    ).length;

    const female = app.athletes.filter(

        athlete => athlete.gender === "여"

    ).length;

    const totalHeight = app.athletes.reduce(

        (sum, athlete) => sum + (athlete.height || 0),

        0

    );

    const totalWeight = app.athletes.reduce(

        (sum, athlete) => sum + (athlete.weight || 0),

        0

    );

    const avgHeight =

        total ? (totalHeight / total).toFixed(1) : 0;

    const avgWeight =

        total ? (totalWeight / total).toFixed(1) : 0;

    document.getElementById("athleteTotal")?.textContent = total;

    document.getElementById("athleteMale")?.textContent = male;

    document.getElementById("athleteFemale")?.textContent = female;

    document.getElementById("athleteAvgHeight")?.textContent =

        avgHeight + " cm";

    document.getElementById("athleteAvgWeight")?.textContent =

        avgWeight + " kg";

}

/* ===========================================
   선수 카드
=========================================== */

function createAthleteCard(athlete){

    return `

<div class="athlete-card">

<h3>${athlete.name}</h3>

<p>${athlete.event}</p>

<p>${athlete.height} cm</p>

<p>${athlete.weight} kg</p>

<p>BMI : ${athlete.bmi}

(${getBMIGrade(athlete.bmi)})</p>

</div>

`;

}

/* ===========================================
   카드 출력
=========================================== */

function renderAthleteCards(){

    const container =

        document.getElementById(

            "athleteCardList"

        );

    if(!container){

        return;

    }

    container.innerHTML =

        app.athletes

        .map(createAthleteCard)

        .join("");

}

/* ===========================================
   새로고침
=========================================== */

function refreshAthleteModule(){

    renderAthleteTable();

    renderAthleteCards();

    updateAthleteStatistics();

    renderAthleteSelect();

}

/* ===========================================
   Export
=========================================== */

window.refreshAthleteModule =

refreshAthleteModule;
/* ===========================================
   athlete.js Part 4
   선수 프로필 / 사진 / 체력정보
=========================================== */

"use strict";

/* ===========================================
   사진 업로드
=========================================== */

function uploadAthletePhoto(id,file){

    const reader=new FileReader();

    reader.onload=e=>{

        const athlete=app.athletes.find(

            a=>a.id===id

        );

        if(!athlete)return;

        athlete.photo=e.target.result;

        saveData();

        refreshAthleteModule();

        toast("선수 사진이 저장되었습니다.");

    };

    reader.readAsDataURL(file);

}

/* ===========================================
   종목 아이콘
=========================================== */

function getSportIcon(event){

    const icons={

        "바이애슬론":"🎿",

        "크로스컨트리":"⛷️",

        "롤러스키":"🛼",

        "육상":"🏃",

        "수영":"🏊",

        "축구":"⚽",

        "농구":"🏀",

        "배구":"🏐",

        "야구":"⚾",

        "유도":"🥋",

        "태권도":"🥋",

        "레슬링":"🤼",

        "역도":"🏋️",

        "사격":"🎯",

        "양궁":"🏹",

        "체조":"🤸",

        "빙상":"⛸️",

        "쇼트트랙":"⛸️",

        "스피드스케이팅":"⛸️"

    };

    return icons[event] || "🏅";

}

/* ===========================================
   대표선수
=========================================== */

function toggleFavorite(id){

    const athlete=

        app.athletes.find(

            a=>a.id===id

        );

    if(!athlete)return;

    athlete.favorite=

        !athlete.favorite;

    saveData();

    refreshAthleteModule();

}

/* ===========================================
   체력검사
=========================================== */

function createFitnessData(){

    return{

        grip:0,

        verticalJump:0,

        broadJump:0,

        sprint20m:0,

        beepTest:0,

        vo2max:0,

        flexibility:0,

        agility:0

    };

}

/* ===========================================
   체력정보 추가
=========================================== */

function initializeFitnessData(){

    app.athletes.forEach(

        athlete=>{

            if(!athlete.fitness){

                athlete.fitness=

                createFitnessData();

            }

        }

    );

}

/* ===========================================
   체력기록 저장
=========================================== */

function saveFitnessData(

id,

fitness

){

    const athlete=

    app.athletes.find(

    a=>a.id===id

    );

    if(!athlete)return;

    athlete.fitness={

        ...athlete.fitness,

        ...fitness

    };

    saveData();

    toast(

        "체력기록 저장 완료"

    );

}

/* ===========================================
   평균 BMI
=========================================== */

function getAverageBMI(){

    if(app.athletes.length===0)

    return 0;

    let sum=0;

    app.athletes.forEach(

        athlete=>{

            sum+=Number(

                athlete.bmi||0

            );

        }

    );

    return (

        sum/

        app.athletes.length

    ).toFixed(1);

}

/* ===========================================
   대표선수 가져오기
=========================================== */

function getFavoriteAthletes(){

    return app.athletes.filter(

        athlete=>

        athlete.favorite

    );

}

/* ===========================================
   Export
=========================================== */

window.uploadAthletePhoto=
uploadAthletePhoto;

window.toggleFavorite=
toggleFavorite;

window.saveFitnessData=
saveFitnessData;

window.getAverageBMI=
getAverageBMI;

window.initializeFitnessData=
initializeFitnessData;
/* ===========================================
   athlete.js Part 5
   성장기록 / 체력변화 / 국가대표 기준
=========================================== */

"use strict";

/* ===========================================
   성장 기록 추가
=========================================== */

function addBodyRecord(id, record){

    const athlete = app.athletes.find(

        item => item.id === id

    );

    if(!athlete){

        return;

    }

    if(!athlete.bodyHistory){

        athlete.bodyHistory=[];

    }

    athlete.bodyHistory.push({

        date:new Date().toISOString(),

        height:Number(record.height),

        weight:Number(record.weight),

        bodyFat:Number(record.bodyFat||0),

        muscle:Number(record.muscle||0)

    });

    saveData();

}

/* ===========================================
   성장 기록
=========================================== */

function getBodyHistory(id){

    const athlete=

        app.athletes.find(

            item=>item.id===id

        );

    if(!athlete){

        return [];

    }

    return athlete.bodyHistory || [];

}

/* ===========================================
   국가대표 기준
=========================================== */

const NATIONAL_STANDARD={

    grip:60,

    vo2max:65,

    sprint20m:3.00,

    verticalJump:65,

    broadJump:270,

    beepTest:120,

    flexibility:20,

    balance:95

};

/* ===========================================
   국가대표 비교
=========================================== */

function compareNationalStandard(id){

    const athlete=

        app.athletes.find(

            item=>item.id===id

        );

    if(!athlete){

        return null;

    }

    const fitness=

        athlete.fitness || {};

    return{

        grip:

        fitness.grip>=

        NATIONAL_STANDARD.grip,

        vo2max:

        fitness.vo2max>=

        NATIONAL_STANDARD.vo2max,

        jump:

        fitness.verticalJump>=

        NATIONAL_STANDARD.verticalJump,

        sprint:

        fitness.sprint20m<=

        NATIONAL_STANDARD.sprint20m,

        balance:

        fitness.balance>=

        NATIONAL_STANDARD.balance

    };

}

/* ===========================================
   평균 체력 점수
=========================================== */

function calculateFitnessScore(id){

    const athlete=

        app.athletes.find(

            item=>item.id===id

        );

    if(!athlete){

        return 0;

    }

    const f=

        athlete.fitness || {};

    const values=[

        f.grip||0,

        f.verticalJump||0,

        f.broadJump||0,

        f.vo2max||0,

        f.balance||0

    ];

    const total=

        values.reduce(

            (a,b)=>a+b,

            0

        );

    return Number(

        (

            total/

            values.length

        ).toFixed(1)

    );

}

/* ===========================================
   선수 랭킹
=========================================== */

function getAthleteRanking(){

    return [...app.athletes]

    .sort(

        (a,b)=>{

            return calculateFitnessScore(

                b.id

            )

            -

            calculateFitnessScore(

                a.id

            );

        }

    );

}

/* ===========================================
   Export
=========================================== */

window.addBodyRecord =
addBodyRecord;

window.getBodyHistory =
getBodyHistory;

window.compareNationalStandard =
compareNationalStandard;

window.calculateFitnessScore =
calculateFitnessScore;

window.getAthleteRanking =
getAthleteRanking;