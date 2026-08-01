/*
=========================================
report.js
설천고 스포츠과학센터 PRO
AI Report Engine
Version 1.0
=========================================
*/

"use strict";

class ReportEngine{

    constructor(){

        this.analysis=null;

        this.athlete=null;

        this.chart=null;

    }

    /* =============================== */

    create(analysis,athlete){

        this.analysis=analysis;

        this.athlete=athlete;

        this.renderSummary();

        this.renderScores();

        this.renderFeedback();

        this.renderRecommendation();

        this.renderNational();

    }

    /* =============================== */

    renderSummary(){

        document.getElementById(

            "reportGrade"

        ).textContent=

        this.analysis.grade;

        document.getElementById(

            "reportScore"

        ).textContent=

        this.analysis.score+"점";

        document.getElementById(

            "reportRisk"

        ).textContent=

        this.analysis.risk;

    }

    /* =============================== */

    renderScores(){

        document.getElementById(

            "depthScore"

        ).textContent=

        this.analysis.detail.depth;

        document.getElementById(

            "balanceScore"

        ).textContent=

        this.analysis.detail.balance;

        document.getElementById(

            "postureScore"

        ).textContent=

        this.analysis.detail.posture;

        document.getElementById(

            "stabilityScore"

        ).textContent=

        this.analysis.detail.stability;

        document.getElementById(

            "movementScore"

        ).textContent=

        this.analysis.detail.movement;

    }

    /* =============================== */

    renderFeedback(){

        const box=

        document.getElementById(

            "reportFeedback"

        );

        box.innerHTML="";

        this.analysis.feedback.forEach(item=>{

            box.innerHTML+=`

            <div class="feedback">

                <h4>${item.title}</h4>

                <p>${item.message}</p>

            </div>

            `;

        });

    }

    /* =============================== */

    renderRecommendation(){

        const box=

        document.getElementById(

            "recommendation"

        );

        box.innerHTML="";

        this.analysis.plan.forEach(item=>{

            box.innerHTML+=`

            <div class="plan">

                <b>${item.title}</b>

                <p>${item.exercise}</p>

            </div>

            `;

        });

    }

    /* =============================== */

    renderNational(){

        document.getElementById(

            "nationalPercent"

        ).textContent=

        this.analysis.percent+"%";

    }

}
    /* =============================== */
    /* Athlete Info */
    /* =============================== */

    renderAthlete(){

        if(!this.athlete){

            return;

        }

        document.getElementById(

            "athleteName"

        ).textContent=

        this.athlete.name;

        document.getElementById(

            "athleteSport"

        ).textContent=

        this.athlete.sport;

        document.getElementById(

            "athleteAge"

        ).textContent=

        this.athlete.age;

        document.getElementById(

            "athleteHeight"

        ).textContent=

        this.athlete.height+" cm";

        document.getElementById(

            "athleteWeight"

        ).textContent=

        this.athlete.weight+" kg";

    }

    /* =============================== */
    /* Date */
    /* =============================== */

    renderDate(){

        const today=

        new Date();

        document.getElementById(

            "reportDate"

        ).textContent=

        today.toLocaleDateString(

            "ko-KR"

        );

    }

    /* =============================== */
    /* Star */
    /* =============================== */

    renderStar(){

        document.getElementById(

            "starScore"

        ).textContent=

        this.analysis.star;

    }

    /* =============================== */
    /* Summary */
    /* =============================== */

    renderSummaryText(){

        document.getElementById(

            "summaryText"

        ).textContent=

        this.analysis.summary;

    }

    /* =============================== */
    /* Chart */
    /* =============================== */

    createChart(){

        const ctx=

        document.getElementById(

            "reportChart"

        );

        if(!ctx){

            return;

        }

        this.chart=

        new Chart(

            ctx,

            {

                type:"radar",

                data:{

                    labels:[

                        "Depth",

                        "Balance",

                        "Posture",

                        "Stability",

                        "Movement"

                    ],

                    datasets:[{

                        label:"AI Score",

                        data:[

                            this.analysis.detail.depth,

                            this.analysis.detail.balance,

                            this.analysis.detail.posture,

                            this.analysis.detail.stability,

                            this.analysis.detail.movement

                        ],

                        fill:true,

                        borderWidth:2

                    }]

                },

                options:{

                    responsive:true,

                    maintainAspectRatio:false,

                    animation:false

                }

            }

        );

    }

    /* =============================== */
    /* National Chart */
    /* =============================== */

    createNationalChart(){

        const ctx=

        document.getElementById(

            "nationalChart"

        );

        if(!ctx){

            return;

        }

        new Chart(

            ctx,

            {

                type:"bar",

                data:{

                    labels:[

                        "선수",

                        "국가대표"

                    ],

                    datasets:[{

                        data:[

                            this.analysis.score,

                            92

                        ]

                    }]

                },

                options:{

                    responsive:true,

                    maintainAspectRatio:false

                }

            }

        );

    }

    /* =============================== */
    /* Update */
    /* =============================== */

    update(){

        this.renderAthlete();

        this.renderDate();

        this.renderStar();

        this.renderSummaryText();

        this.createChart();

        this.createNationalChart();

    }
        /* =============================== */
    /* Export PDF */
    /* =============================== */

    async exportPDF(){

        const target =
        document.getElementById("reportArea");

        if(!target){

            alert("리포트 영역이 없습니다.");

            return;

        }

        const canvas = await html2canvas(

            target,

            {

                scale:2,

                backgroundColor:"#10141d"

            }

        );

        const image = canvas.toDataURL(

            "image/png"

        );

        const pdf = new jspdf.jsPDF(

            "p",

            "mm",

            "a4"

        );

        const width = 190;

        const height =

        canvas.height *

        width /

        canvas.width;

        pdf.addImage(

            image,

            "PNG",

            10,

            10,

            width,

            height

        );

        pdf.save(

            "Seolcheon_Report.pdf"

        );

    }

    /* =============================== */
    /* Print */
    /* =============================== */

    printReport(){

        window.print();

    }

    /* =============================== */
    /* Save JSON */
    /* =============================== */

    downloadJSON(){

        const blob = new Blob(

            [

                JSON.stringify(

                    this.analysis,

                    null,

                    2

                )

            ],

            {

                type:

                "application/json"

            }

        );

        const url =

        URL.createObjectURL(blob);

        const a =

        document.createElement("a");

        a.href = url;

        a.download =

        "analysis.json";

        a.click();

        URL.revokeObjectURL(url);

    }

    /* =============================== */
    /* Monthly Report */
    /* =============================== */

    renderMonthly(history=[]){

        const avg =

        history.length

        ?

        history.reduce(

            (s,v)=>s+v.score,

            0

        )/history.length

        :

        this.analysis.score;

        document.getElementById(

            "monthlyAverage"

        ).textContent=

        avg.toFixed(1);

    }

    /* =============================== */
    /* Performance Badge */
    /* =============================== */

    renderBadge(){

        let badge="🥉";

        if(this.analysis.score>=90){

            badge="🥇";

        }

        else if(this.analysis.score>=80){

            badge="🥈";

        }

        document.getElementById(

            "performanceBadge"

        ).textContent=

        badge;

    }

    /* =============================== */
    /* National Compare Table */
    /* =============================== */

    renderCompareTable(){

        document.getElementById(

            "compareScore"

        ).textContent=

        this.analysis.score;

        document.getElementById(

            "compareNational"

        ).textContent=

        "92";

        document.getElementById(

            "compareGap"

        ).textContent=

        this.analysis.score-92;

    }

    /* =============================== */
    /* AI Comment */
    /* =============================== */

    renderAIComment(){

        let text="";

        if(this.analysis.score>=95){

            text=

            "국가대표 수준의 자세입니다.";

        }

        else if(this.analysis.score>=85){

            text=

            "우수한 자세입니다.";

        }

        else{

            text=

            "기본 자세 교정이 필요합니다.";

        }

        document.getElementById(

            "aiComment"

        ).textContent=text;

    }

    /* =============================== */
    /* Finish */
    /* =============================== */

    finish(history=[]){

        this.update();

        this.renderMonthly(history);

        this.renderBadge();

        this.renderCompareTable();

        this.renderAIComment();

    }

}