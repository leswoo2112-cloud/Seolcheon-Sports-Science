/* ===========================================
   설천고 스포츠과학 훈련센터 PRO
   app.js Part 1
=========================================== */

"use strict";

/* ===========================================
   APP
=========================================== */

const app = {

    currentPage: "dashboard",

    athletes: [],

    sports: [],

    weights: [],

    poses: [],

    reports: []

};

/* ===========================================
   DOM
=========================================== */

const $ = (id)=>document.getElementById(id);

const $$ = (q)=>document.querySelectorAll(q);

/* ===========================================
   Toast
=========================================== */

function toast(message,type="success"){

    const t=$("#toast");

    if(!t)return;

    t.textContent=message;

    t.className="";

    t.classList.add("show");

    if(type==="error"){

        t.classList.add("error");

    }

    if(type==="success"){

        t.classList.add("success");

    }

    setTimeout(()=>{

        t.classList.remove("show");

    },2500);

}

/* ===========================================
   Page
=========================================== */

function openPage(page){

    app.currentPage=page;

    $$(".page").forEach(p=>{

        p.classList.remove("active");

    });

    const target=$(page+"Page");

    if(target){

        target.classList.add("active");

    }

    $$(".menu").forEach(menu=>{

        menu.classList.remove("active");

    });

    document

    .querySelector(`[data-page="${page}"]`)

    ?.classList.add("active");

}

/* ===========================================
   Menu
=========================================== */

function initializeMenu(){

    $$(".menu").forEach(menu=>{

        menu.onclick=()=>{

            openPage(menu.dataset.page);

        };

    });

}

/* ===========================================
   Clock
=========================================== */

function updateClock(){

    const clock=$("#clock");

    if(!clock)return;

    const now=new Date();

    clock.innerHTML=

    now.toLocaleTimeString(

        "ko-KR"

    );

}

setInterval(updateClock,1000);

/* ===========================================
   Loading
=========================================== */

window.onload=()=>{

    setTimeout(()=>{

        $("#loadingScreen")

        ?.classList.add("hide");

    },1000);

};

/* ===========================================
   Start
=========================================== */

document.addEventListener(

"DOMContentLoaded",

()=>{

    initializeMenu();

    updateClock();

    openPage("dashboard");

});
/* ===========================================
   app.js Part 2
   LocalStorage
=========================================== */

const STORAGE_KEY = "seolcheon_sports_center";

/* ===========================================
   저장
=========================================== */

function saveData(){

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(app)

    );

}

/* ===========================================
   불러오기
=========================================== */

function loadData(){

    const data=

    localStorage.getItem(

        STORAGE_KEY

    );

    if(!data){

        return;

    }

    try{

        const saved=

        JSON.parse(data);

        Object.assign(

            app,

            saved

        );

    }

    catch(error){

        console.error(error);

    }

}

/* ===========================================
   자동 저장
=========================================== */

function autoSave(){

    saveData();

}

/* ===========================================
   30초마다 저장
=========================================== */

setInterval(

autoSave,

30000

);

/* ===========================================
   종료시 저장
=========================================== */

window.addEventListener(

"beforeunload",

saveData

);

/* ===========================================
   Firebase
=========================================== */

const firebaseState={

connected:false,

user:null

};

function updateFirebaseStatus(){

    const status=

    $("#firebaseStatus");

    if(!status)return;

    status.innerHTML=

    firebaseState.connected

    ?

    "🟢 연결됨"

    :

    "🔴 연결안됨";

}

/* ===========================================
   Backup
=========================================== */

function exportBackup(){

    const blob=

    new Blob(

    [

    JSON.stringify(

    app,

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

    "Seolcheon_Backup.json";

    a.click();

}

/* ===========================================
   Restore
=========================================== */

function importBackup(file){

    const reader=

    new FileReader();

    reader.onload=e=>{

        app=

        JSON.parse(

        e.target.result

        );

        saveData();

        location.reload();

    };

    reader.readAsText(file);

}

/* ===========================================
   초기화
=========================================== */

function resetAllData(){

    if(

    !confirm(

    "모든 데이터를 삭제하시겠습니까?"

    )

    ){

    return;

    }

    localStorage.removeItem(

    STORAGE_KEY

    );

    location.reload();

}

/* ===========================================
   시작
=========================================== */

document.addEventListener(

"DOMContentLoaded",

()=>{

    loadData();

    updateFirebaseStatus();

});
/* ===========================================
   app.js Part 3
   Athlete Manager
=========================================== */

/* ===========================================
   UUID
=========================================== */

function createId(){

    return "id-" +

    Date.now() +

    "-" +

    Math.random()

    .toString(36)

    .substring(2,8);

}

/* ===========================================
   Athlete
=========================================== */

function addAthlete(data){

    data.id=createId();

    data.createdAt=

    new Date().toISOString();

    app.athletes.push(data);

    saveData();

    renderAthleteSelect();

}

/* ===========================================
   Delete
=========================================== */

function deleteAthlete(id){

    app.athletes=

    app.athletes.filter(

    athlete=>

    athlete.id!==id

    );

    saveData();

    renderAthleteSelect();

}

/* ===========================================
   Find
=========================================== */

function getAthlete(id){

    return app.athletes.find(

    athlete=>

    athlete.id===id

    );

}

/* ===========================================
   Select Box
=========================================== */

function renderAthleteSelect(){

    const ids=[

    "sportsAthleteSelect",

    "weightAthleteSelect",

    "cameraAthleteSelect",

    "reportAthleteSelect"

    ];

    ids.forEach(id=>{

        const select=

        document.getElementById(id);

        if(!select)return;

        select.innerHTML=

        `<option value="">선수 선택</option>`;

        app.athletes.forEach(

        athlete=>{

            select.innerHTML+=`

<option value="${athlete.id}">

${athlete.name}

</option>

`;

        });

    });

}

/* ===========================================
   Dashboard Count
=========================================== */

function refreshDashboard(){

    const athlete=

    document.getElementById(

    "dashboardAthleteCount"

    );

    const sports=

    document.getElementById(

    "dashboardSportsCount"

    );

    const weight=

    document.getElementById(

    "dashboardWeightCount"

    );

    const pose=

    document.getElementById(

    "dashboardPoseCount"

    );

    if(athlete)

    athlete.innerHTML=

    app.athletes.length;

    if(sports)

    sports.innerHTML=

    app.sports.length;

    if(weight)

    weight.innerHTML=

    app.weights.length;

    if(pose)

    pose.innerHTML=

    app.poses.length;

}

/* ===========================================
   최근훈련
=========================================== */

function refreshRecentTraining(){

    const list=

    document.getElementById(

    "recentTrainingList"

    );

    if(!list)return;

    list.innerHTML="";

    const recent=[

        ...app.sports,

        ...app.weights,

        ...app.poses

    ]

    .sort(

    (a,b)=>

    new Date(b.date)-

    new Date(a.date)

    )

    .slice(0,5);

    if(recent.length===0){

        list.innerHTML=

        "<li>기록이 없습니다.</li>";

        return;

    }

    recent.forEach(item=>{

        list.innerHTML+=`

<li>

<strong>${item.name||item.type}</strong>

<br>

${item.date}

</li>

`;

    });

}

/* ===========================================
   Dashboard Update
=========================================== */

function updateDashboard(){

    refreshDashboard();

    refreshRecentTraining();

}
/* ===========================================
   app.js Part 4
   Athlete CRUD
=========================================== */

/* ===========================================
   Save Athlete
=========================================== */

const saveAthleteButton =
document.getElementById(
"saveAthleteButton"
);

saveAthleteButton?.addEventListener(

"click",

()=>{

const name=

document.getElementById(
"athleteName"
).value.trim();

const gender=

document.getElementById(
"athleteGender"
).value;

const birth=

document.getElementById(
"athleteBirth"
).value;

const event=

document.getElementById(
"athleteEvent"
).value;

const height=

Number(

document.getElementById(
"athleteHeight"
).value

);

const weight=

Number(

document.getElementById(
"athleteWeight"
).value

);

if(name===""){

toast(

"이름을 입력하세요",

"error"

);

return;

}

const athlete={

id:createId(),

name,

gender,

birth,

event,

height,

weight,

created:

new Date()

.toISOString()

};

app.athletes.push(

athlete

);

saveData();

renderAthleteTable();

renderAthleteSelect();

updateDashboard();

toast(

"선수 등록 완료"

);

resetAthleteForm();

}

);

/* ===========================================
   Reset
=========================================== */

function resetAthleteForm(){

document.getElementById(

"athleteName"

).value="";

document.getElementById(

"athleteBirth"

).value="";

document.getElementById(

"athleteEvent"

).value="";

document.getElementById(

"athleteHeight"

).value="";

document.getElementById(

"athleteWeight"

).value="";

}

/* ===========================================
   Table
=========================================== */

function renderAthleteTable(){

const tbody=

document.getElementById(

"athleteTableBody"

);

if(!tbody)return;

tbody.innerHTML="";

app.athletes.forEach(

athlete=>{

tbody.innerHTML+=`

<tr>

<td>${athlete.name}</td>

<td>${athlete.gender}</td>

<td>${athlete.event}</td>

<td>${athlete.height}</td>

<td>${athlete.weight}</td>

<td>

<button

onclick="editAthlete('${athlete.id}')">

수정

</button>

<button

class="danger"

onclick="removeAthlete('${athlete.id}')">

삭제

</button>

</td>

</tr>

`;

}

);

}

/* ===========================================
   Delete
=========================================== */

function removeAthlete(id){

if(

!confirm(

"삭제하시겠습니까?"

)

){

return;

}

app.athletes=

app.athletes.filter(

a=>a.id!==id

);

saveData();

renderAthleteTable();

renderAthleteSelect();

updateDashboard();

toast(

"삭제 완료"

);

}

/* ===========================================
   Edit
=========================================== */

function editAthlete(id){

const athlete=

getAthlete(id);

if(!athlete)return;

document.getElementById(

"athleteName"

).value=

athlete.name;

document.getElementById(

"athleteGender"

).value=

athlete.gender;

document.getElementById(

"athleteBirth"

).value=

athlete.birth;

document.getElementById(

"athleteEvent"

).value=

athlete.event;

document.getElementById(

"athleteHeight"

).value=

athlete.height;

document.getElementById(

"athleteWeight"

).value=

athlete.weight;

removeAthlete(id);

}

/* ===========================================
   Start
=========================================== */

document.addEventListener(

"DOMContentLoaded",

()=>{

renderAthleteTable();

renderAthleteSelect();

});