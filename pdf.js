/* ==========================================
   PDF Module
========================================== */

"use strict";

const PDFReport = {

    title: "Seolcheon Sports Science Center",

    author: "SSPRO",

    version: "3.0"

};

/* ==========================================
   Export PDF
========================================== */

async function exportAnalysisPDF(){

    const doc = new jspdf.jsPDF({

        orientation:"portrait",

        unit:"mm",

        format:"a4"

    });

    doc.setFontSize(20);

    doc.text(

        "Sports Science Report",

        20,

        20

    );

    doc.setFontSize(12);

    doc.text(

        "Athlete : " +

        ($("#athleteName")?.value || "-"),

        20,

        35

    );

    doc.text(

        "Sport : " +

        Analysis.sport,

        20,

        45

    );

    doc.text(

        "Date : " +

        new Date().toLocaleString(),

        20,

        55

    );

    doc.line(

        20,

        60,

        190,

        60

    );

    addScoreSection(doc);

    addAnalysisSection(doc);

    addRecommendationSection(doc);

    doc.save(

        "Sports_Report.pdf"

    );

}
/* ==========================================
   Score Section
========================================== */

function addScoreSection(doc){

    doc.setFontSize(16);

    doc.text("AI Analysis",20,75);

    doc.setFontSize(11);

    doc.text(

        "AI Score : "+Analysis.score,

        25,

        90

    );

    doc.text(

        "Balance : "+Analysis.balance,

        25,

        100

    );

    doc.text(

        "Posture : "+Analysis.posture,

        25,

        110

    );

    doc.text(

        "Stability : "+Analysis.stability,

        25,

        120

    );

}

/* ==========================================
   National Compare
========================================== */

function addAnalysisSection(doc){

    doc.setFontSize(16);

    doc.text(

        "National Comparison",

        20,

        145

    );

    const compare=

        compareScore();

    doc.setFontSize(11);

    doc.text(

        "National : "+compare.score+"%",

        25,

        160

    );

    doc.text(

        "Balance : "+compare.balance+"%",

        25,

        170

    );

    doc.text(

        "Posture : "+compare.posture+"%",

        25,

        180

    );

    doc.text(

        "Stability : "+compare.stability+"%",

        25,

        190

    );

}

/* ==========================================
   Recommendation
========================================== */

function addRecommendationSection(doc){

    doc.setFontSize(16);

    doc.text(

        "AI Coach",

        20,

        215

    );

    doc.setFontSize(11);

    const coach=

        createRecommendation();

    let y=230;

    coach.forEach(item=>{

        doc.text(

            "• "+item.title+

            " : "+item.description,

            25,

            y

        );

        y+=10;

    });

}
/* ==========================================
   Chart Image
========================================== */

function addChartToPDF(doc){

    if(!reportChart) return;

    const image=

        reportChart.toBase64Image();

    doc.addImage(

        image,

        "PNG",

        20,

        20,

        170,

        80

    );

}

/* ==========================================
   Athlete Photo
========================================== */

function addAthletePhoto(doc){

    const athlete=

        App.athletes.find(

            a=>a.id===Athlete.selected

        );

    if(!athlete) return;

    if(!athlete.photo) return;

    doc.addImage(

        athlete.photo,

        "JPEG",

        150,

        20,

        35,

        45

    );

}

/* ==========================================
   QR Code
========================================== */

function addQRCode(doc){

    const canvas=

        document.querySelector("#qrCanvas");

    if(!canvas) return;

    const img=

        canvas.toDataURL("image/png");

    doc.addImage(

        img,

        "PNG",

        155,

        245,

        30,

        30

    );

}

/* ==========================================
   Signature
========================================== */

function addSignature(doc){

    doc.setFontSize(10);

    doc.text(

        "Seolcheon Sports Science Center",

        20,

        285

    );

    doc.text(

        "AI Analysis System V3",

        20,

        291

    );

}

/* ==========================================
   Final Export
========================================== */

async function createPDF(){

    const doc=

        new jspdf.jsPDF();

    addChartToPDF(doc);

    addAthletePhoto(doc);

    addScoreSection(doc);

    addAnalysisSection(doc);

    addRecommendationSection(doc);

    addQRCode(doc);

    addSignature(doc);

    doc.save(

        "SportsScienceReport.pdf"

    );

}