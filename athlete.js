/* ==========================================
   Athlete Module
========================================== */

"use strict";

const Athlete={

    selected:null

};

/* ==========================================
   Initialize
========================================== */

document.addEventListener(

    "DOMContentLoaded",

    initializeAthlete

);

function initializeAthlete(){

    $("#saveAthleteButton")

    ?.addEventListener(

        "click",

        addAthlete

    );

}

/* ==========================================
   Add Athlete
========================================== */

function addAthlete(){

    const athlete={

        id:Date.now(),

        name:$("#athleteName").value.trim(),

        gender:$("#athleteGender").value,

        birth:$("#athleteBirth").value,

        sport:$("#athleteSport").value,

        height:Number(

            $("#athleteHeight").value

        ),

        weight:Number(

            $("#athleteWeight").value

        ),

        created:new Date().toLocaleString()

    };

    if(!athlete.name){

        showToast(

            "이름을 입력하세요.",

            "error"

        );

        return;

    }

    App.athletes.push(athlete);

    saveStorage();

    renderAthleteTable();

    updateDashboard();

    clearAthleteForm();

    showToast("선수 등록 완료");

}

/* ==========================================
   Render
========================================== */

function renderAthleteTable(){

    const tbody=

        $("#athleteTableBody");

    if(!tbody) return;

    tbody.innerHTML="";

    App.athletes.forEach(athlete=>{

        const tr=document.createElement("tr");

        tr.innerHTML=`

<td>${athlete.name}</td>

<td>${athlete.sport}</td>

<td>${athlete.height}</td>

<td>${athlete.weight}</td>

<td>

<button onclick="editAthlete(${athlete.id})">

수정

</button>

<button onclick="deleteAthlete(${athlete.id})">

삭제

</button>

</td>

`;

        tbody.appendChild(tr);

    });

}

/* ==========================================
   Clear
========================================== */

function clearAthleteForm(){

    $("#athleteName").value="";

    $("#athleteBirth").value="";

    $("#athleteHeight").value="";

    $("#athleteWeight").value="";

}
/* ==========================================
   Edit Athlete
========================================== */

function editAthlete(id){

    const athlete=App.athletes.find(

        item=>item.id===id

    );

    if(!athlete) return;

    Athlete.selected=id;

    $("#athleteName").value=athlete.name;
    $("#athleteGender").value=athlete.gender;
    $("#athleteBirth").value=athlete.birth;
    $("#athleteSport").value=athlete.sport;
    $("#athleteHeight").value=athlete.height;
    $("#athleteWeight").value=athlete.weight;

    $("#saveAthleteButton").textContent="선수 수정";

}

/* ==========================================
   Update Athlete
========================================== */

function updateAthlete(){

    const athlete=App.athletes.find(

        item=>item.id===Athlete.selected

    );

    if(!athlete) return;

    athlete.name=$("#athleteName").value.trim();
    athlete.gender=$("#athleteGender").value;
    athlete.birth=$("#athleteBirth").value;
    athlete.sport=$("#athleteSport").value;
    athlete.height=Number($("#athleteHeight").value);
    athlete.weight=Number($("#athleteWeight").value);

    saveStorage();

    renderAthleteTable();

    clearAthleteForm();

    Athlete.selected=null;

    $("#saveAthleteButton").textContent="선수 등록";

    showToast("선수 정보 수정 완료");

}

/* ==========================================
   Delete Athlete
========================================== */

function deleteAthlete(id){

    if(!confirm("선수를 삭제하시겠습니까?")){

        return;

    }

    App.athletes=App.athletes.filter(

        athlete=>athlete.id!==id

    );

    saveStorage();

    renderAthleteTable();

    updateDashboard();

    showToast("선수 삭제 완료");

}

/* ==========================================
   Search Athlete
========================================== */

function searchAthlete(keyword){

    keyword=keyword.toLowerCase();

    const result=

        App.athletes.filter(

            athlete=>

            athlete.name

            .toLowerCase()

            .includes(keyword)

        );

    renderSearchResult(result);

}

function renderSearchResult(list){

    const tbody=$("#athleteTableBody");

    tbody.innerHTML="";

    list.forEach(athlete=>{

        const tr=document.createElement("tr");

        tr.innerHTML=`

<td>${athlete.name}</td>
<td>${athlete.sport}</td>
<td>${athlete.height}</td>
<td>${athlete.weight}</td>

<td>

<button onclick="editAthlete(${athlete.id})">

수정

</button>

<button onclick="deleteAthlete(${athlete.id})">

삭제

</button>

</td>

`;

        tbody.appendChild(tr);

    });

}
/* ==========================================
   Athlete Detail
========================================== */

function openAthleteDetail(id){

    const athlete=

        App.athletes.find(

            item=>item.id===id

        );

    if(!athlete) return;

    Athlete.selected=id;

    const records=

        App.analysis.filter(

            item=>

            item.athleteId===id

        );

    const best=

        records.length

        ? Math.max(

            ...records.map(

                item=>item.score

            )

        )

        : 0;

    const average=

        records.length

        ? Math.round(

            records.reduce(

                (sum,item)=>

                sum+item.score,

                0

            )/

            records.length

        )

        : 0;

    openModal(

        athlete.name,

        `

        <div class="athlete-detail">

            <h3>${athlete.sport}</h3>

            <br>

            <p>성별 : ${athlete.gender}</p>

            <p>신장 : ${athlete.height} cm</p>

            <p>체중 : ${athlete.weight} kg</p>

            <p>등록일 : ${athlete.created}</p>

            <br>

            <h3>기록</h3>

            <p>최고 AI 점수 : ${best}</p>

            <p>평균 AI 점수 : ${average}</p>

            <p>분석 횟수 : ${records.length}</p>

        </div>

        `

    );

}

/* ==========================================
   Athlete Image
========================================== */

function saveAthletePhoto(

    athleteId,

    base64

){

    const athlete=

        App.athletes.find(

            item=>item.id===athleteId

        );

    if(!athlete) return;

    athlete.photo=base64;

    saveStorage();

}

/* ==========================================
   Last Score
========================================== */

function getLastScore(id){

    const records=

        App.analysis.filter(

            item=>

            item.athleteId===id

        );

    if(records.length===0){

        return 0;

    }

    return records[

        records.length-1

    ].score;

}

/* ==========================================
   Athlete Statistics
========================================== */

function getAthleteStatistics(id){

    const records=

        App.analysis.filter(

            item=>

            item.athleteId===id

        );

    if(records.length===0){

        return null;

    }

    return{

        best:

            Math.max(

                ...records.map(

                    item=>item.score

                )

            ),

        worst:

            Math.min(

                ...records.map(

                    item=>item.score

                )

            ),

        average:

            Math.round(

                records.reduce(

                    (sum,item)=>

                    sum+item.score,

                    0

                )/

                records.length

            ),

        total:

            records.length

    };

}

/* ==========================================
   Export
========================================== */

window.AthleteModule={

    addAthlete,

    updateAthlete,

    deleteAthlete,

    searchAthlete,

    openAthleteDetail,

    getAthleteStatistics

};

console.log(

    "👤 Athlete Module Loaded"

);