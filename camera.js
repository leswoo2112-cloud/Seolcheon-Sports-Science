/*
=====================================================
camera.js
설천고 스포츠과학센터 PRO
Version 3.0
=====================================================
*/

"use strict";

class CameraManager {

    constructor() {

        /* DOM */

        this.video =
            document.getElementById("cameraVideo");

        this.canvas =
            document.getElementById("poseCanvas");

        this.ctx =
            this.canvas.getContext("2d");

        this.captureCanvas =
            document.getElementById("captureCanvas");

        this.captureCtx =
            this.captureCanvas.getContext("2d");

        /* MediaPipe */

        this.pose = null;

        this.camera = null;

        /* Status */

        this.running = false;

        this.landmarks = [];

        this.results = null;

        /* Pose */

        this.kneeAngle = 0;

        this.hipAngle = 0;

        this.ankleAngle = 0;

        this.elbowAngle = 0;

        this.shoulderAngle = 0;

        /* Analysis */

        this.score = 0;

        this.grade = "-";

        this.feedback = [];

        this.exercise = "squat";

        this.direction = "SIDE";

        /* Counter */

        this.rep = 0;

        this.stage = "UP";

        /* FPS */

        this.frame = 0;

        this.fps = 0;

        this.lastTime = performance.now();

    }

    /* ==================================== */

    async initialize() {

        this.pose = new Pose({

            locateFile: file =>

                `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`

        });

        this.pose.setOptions({

            modelComplexity: 2,

            smoothLandmarks: true,

            enableSegmentation: false,

            minDetectionConfidence: 0.7,

            minTrackingConfidence: 0.7

        });

        this.pose.onResults(

            this.onResults.bind(this)

        );

    }

    /* ==================================== */

    async start() {

        if (this.running) return;

        this.camera = new Camera(

            this.video,

            {

                onFrame: async () => {

                    await this.pose.send({

                        image: this.video

                    });

                },

                width: 1280,

                height: 720

            }

        );

        await this.camera.start();

        this.running = true;

    }

    /* ==================================== */

    stop() {

        if (!this.running) return;

        this.video.srcObject

            ?.getTracks()

            .forEach(track => track.stop());

        this.running = false;

    }

    /* ==================================== */

    onResults(results) {

        this.results = results;

        this.landmarks =

            results.poseLandmarks || [];

        this.render();

    }

    /* ==================================== */

    render() {

        if (!this.results) return;

        this.ctx.clearRect(

            0,

            0,

            this.canvas.width,

            this.canvas.height

        );

        this.ctx.drawImage(

            this.results.image,

            0,

            0,

            this.canvas.width,

            this.canvas.height

        );

        if (this.landmarks.length === 0)

            return;

        this.drawSkeleton();

        this.updateFPS();

    }

}
    /* ==================================== */
    /* Skeleton */
    /* ==================================== */

    drawSkeleton() {

        drawConnectors(

            this.ctx,

            this.landmarks,

            POSE_CONNECTIONS,

            {

                color: "#00E5FF",

                lineWidth: 4

            }

        );

        drawLandmarks(

            this.ctx,

            this.landmarks,

            {

                color: "#FFD54A",

                radius: 5

            }

        );

        this.drawGrid();

        this.drawCenterLine();

        this.drawJointNames();

    }

    /* ==================================== */
    /* Grid */
    /* ==================================== */

    drawGrid() {

        const w = this.canvas.width;

        const h = this.canvas.height;

        this.ctx.save();

        this.ctx.strokeStyle =

            "rgba(255,255,255,0.08)";

        this.ctx.lineWidth = 1;

        for (let x = 0; x < w; x += 50) {

            this.ctx.beginPath();

            this.ctx.moveTo(x, 0);

            this.ctx.lineTo(x, h);

            this.ctx.stroke();

        }

        for (let y = 0; y < h; y += 50) {

            this.ctx.beginPath();

            this.ctx.moveTo(0, y);

            this.ctx.lineTo(w, y);

            this.ctx.stroke();

        }

        this.ctx.restore();

    }

    /* ==================================== */
    /* Center Line */
    /* ==================================== */

    drawCenterLine() {

        const w = this.canvas.width;

        const h = this.canvas.height;

        this.ctx.save();

        this.ctx.strokeStyle =

            "#00BFFF";

        this.ctx.lineWidth = 2;

        this.ctx.beginPath();

        this.ctx.moveTo(w / 2, 0);

        this.ctx.lineTo(w / 2, h);

        this.ctx.stroke();

        this.ctx.restore();

    }

    /* ==================================== */
    /* Joint Names */
    /* ==================================== */

    drawJointNames() {

        const names = {

            11: "L Shoulder",
            12: "R Shoulder",

            13: "L Elbow",
            14: "R Elbow",

            15: "L Wrist",
            16: "R Wrist",

            23: "L Hip",
            24: "R Hip",

            25: "L Knee",
            26: "R Knee",

            27: "L Ankle",
            28: "R Ankle"

        };

        this.ctx.save();

        this.ctx.font =

            "13px Arial";

        this.ctx.fillStyle =

            "#FFFFFF";

        Object.keys(names).forEach(id => {

            const p = this.landmarks[id];

            if (!p) return;

            this.ctx.fillText(

                names[id],

                p.x * this.canvas.width + 10,

                p.y * this.canvas.height

            );

        });

        this.ctx.restore();

    }

    /* ==================================== */
    /* FPS */
    /* ==================================== */

    updateFPS() {

        this.frame++;

        const now = performance.now();

        if (now - this.lastTime >= 1000) {

            this.fps = this.frame;

            this.frame = 0;

            this.lastTime = now;

            const fps =

                document.getElementById(

                    "fpsValue"

                );

            if (fps) {

                fps.textContent =

                    this.fps + " FPS";

            }

        }

    }
        /* ==================================== */
    /* Angle Calculation */
    /* ==================================== */

    calculateAngle(a, b, c) {

        const radians =

            Math.atan2(

                c.y - b.y,

                c.x - b.x

            ) -

            Math.atan2(

                a.y - b.y,

                a.x - b.x

            );

        let angle =

            Math.abs(

                radians * 180 / Math.PI

            );

        if (angle > 180) {

            angle = 360 - angle;

        }

        return Math.round(angle);

    }

    /* ==================================== */

    updateAngles() {

        const lm = this.landmarks;

        this.kneeAngle = this.calculateAngle(

            lm[24],

            lm[26],

            lm[28]

        );

        this.hipAngle = this.calculateAngle(

            lm[12],

            lm[24],

            lm[26]

        );

        this.ankleAngle = this.calculateAngle(

            lm[26],

            lm[28],

            lm[32]

        );

        this.elbowAngle = this.calculateAngle(

            lm[12],

            lm[14],

            lm[16]

        );

        this.shoulderAngle = this.calculateAngle(

            lm[14],

            lm[12],

            lm[24]

        );

        this.drawAngle(

            lm[26],

            this.kneeAngle

        );

        this.drawAngle(

            lm[24],

            this.hipAngle

        );

        this.drawAngle(

            lm[28],

            this.ankleAngle

        );

        this.drawAngle(

            lm[14],

            this.elbowAngle

        );

        this.drawAngle(

            lm[12],

            this.shoulderAngle

        );

    }

    /* ==================================== */

    drawAngle(point, value) {

        if (!point) return;

        const x = point.x * this.canvas.width;

        const y = point.y * this.canvas.height;

        this.ctx.beginPath();

        this.ctx.fillStyle = "#008CFF";

        this.ctx.arc(

            x,

            y,

            18,

            0,

            Math.PI * 2

        );

        this.ctx.fill();

        this.ctx.fillStyle = "#FFFFFF";

        this.ctx.font =

            "bold 13px Arial";

        this.ctx.fillText(

            value + "°",

            x - 16,

            y - 24

        );

    }

    /* ==================================== */
    /* Center Of Mass */
    /* ==================================== */

    calculateCOM() {

        const ids = [

            11,

            12,

            23,

            24

        ];

        let x = 0;

        let y = 0;

        ids.forEach(id => {

            x += this.landmarks[id].x;

            y += this.landmarks[id].y;

        });

        this.com = {

            x: x / ids.length,

            y: y / ids.length

        };

        this.drawCOM();

    }

    /* ==================================== */

    drawCOM() {

        const x =

            this.com.x *

            this.canvas.width;

        const y =

            this.com.y *

            this.canvas.height;

        this.ctx.beginPath();

        this.ctx.fillStyle = "#FFD700";

        this.ctx.arc(

            x,

            y,

            10,

            0,

            Math.PI * 2

        );

        this.ctx.fill();

    }

    /* ==================================== */
    /* Direction */
    /* ==================================== */

    detectDirection() {

        const left =

            this.landmarks[11];

        const right =

            this.landmarks[12];

        const diff =

            Math.abs(

                left.x - right.x

            );

        this.direction =

            diff < 0.12

                ? "SIDE"

                : "FRONT";

        const el =

            document.getElementById(

                "cameraDirection"

            );

        if (el) {

            el.textContent =

                this.direction;

        }

    }

    /* ==================================== */

    updatePose() {

        if (

            this.landmarks.length === 0

        ) {

            return;

        }

        this.updateAngles();

        this.calculateCOM();

        this.detectDirection();

    }
        /* ==================================== */
    /* Balance */
    /* ==================================== */

    calculateBalance() {

        const leftHip = this.landmarks[23];
        const rightHip = this.landmarks[24];

        const diff = Math.abs(leftHip.y - rightHip.y);

        this.balance = Math.max(
            0,
            100 - diff * 1000
        );

        const el = document.getElementById("balanceValue");

        if (el) {

            el.textContent =
                this.balance.toFixed(1) + "%";

        }

    }

    /* ==================================== */
    /* Knee Valgus */
    /* ==================================== */

    detectValgus() {

        const knee = this.landmarks[26];
        const ankle = this.landmarks[28];

        this.valgus = knee.x < ankle.x;

        const el = document.getElementById("valgusValue");

        if (el) {

            el.textContent =
                this.valgus
                    ? "⚠ 위험"
                    : "정상";

        }

    }

    /* ==================================== */
    /* Squat Counter */
    /* ==================================== */

    detectSquat() {

        if (

            this.kneeAngle < 90 &&

            this.stage === "UP"

        ) {

            this.stage = "DOWN";

        }

        if (

            this.kneeAngle > 165 &&

            this.stage === "DOWN"

        ) {

            this.stage = "UP";

            this.rep++;

        }

    }

    /* ==================================== */
    /* Lunge Counter */
    /* ==================================== */

    detectLunge() {

        if (

            this.kneeAngle < 95 &&

            this.stage === "UP"

        ) {

            this.stage = "DOWN";

        }

        if (

            this.kneeAngle > 160 &&

            this.stage === "DOWN"

        ) {

            this.stage = "UP";

            this.rep++;

        }

    }

    /* ==================================== */
    /* Push Up Counter */
    /* ==================================== */

    detectPushUp() {

        if (

            this.elbowAngle < 90 &&

            this.stage === "UP"

        ) {

            this.stage = "DOWN";

        }

        if (

            this.elbowAngle > 160 &&

            this.stage === "DOWN"

        ) {

            this.stage = "UP";

            this.rep++;

        }

    }

    /* ==================================== */
    /* Plank */
    /* ==================================== */

    detectPlank() {

        if (this.hipAngle > 165) {

            if (!this.plankStart) {

                this.plankStart = Date.now();

            }

            const sec = Math.floor(

                (Date.now() - this.plankStart)

                / 1000

            );

            const timer =

                document.getElementById(

                    "plankTime"

                );

            if (timer) {

                timer.textContent =

                    sec + "초";

            }

        } else {

            this.plankStart = null;

        }

    }

    /* ==================================== */
    /* Exercise */
    /* ==================================== */

    detectExercise() {

        switch (this.exercise) {

            case "squat":

                this.detectSquat();

                break;

            case "lunge":

                this.detectLunge();

                break;

            case "pushup":

                this.detectPushUp();

                break;

            case "plank":

                this.detectPlank();

                break;

        }

        const rep =

            document.getElementById(

                "repCount"

            );

        if (rep) {

            rep.textContent =

                this.rep;

        }

    }

    /* ==================================== */
    /* Update Analysis */
    /* ==================================== */

    updateAnalysis() {

        this.calculateBalance();

        this.detectValgus();

        this.detectExercise();

    }
        /* ==================================== */
    /* AI Score */
    /* ==================================== */

    calculateScore() {

        let score = 100;

        if (this.kneeAngle < 80) score -= 8;
        if (this.kneeAngle > 170) score -= 10;

        if (this.hipAngle < 70) score -= 12;

        if (this.balance < 90) score -= 10;

        if (this.valgus) score -= 15;

        this.score = Math.max(0, score);

    }

    /* ==================================== */
    /* Grade */
    /* ==================================== */

    calculateGrade() {

        if (this.score >= 98) return "S+";
        if (this.score >= 95) return "S";
        if (this.score >= 90) return "A+";
        if (this.score >= 85) return "A";
        if (this.score >= 80) return "B+";
        if (this.score >= 75) return "B";
        if (this.score >= 70) return "C";

        return "D";

    }

    /* ==================================== */
    /* Feedback */
    /* ==================================== */

    generateFeedback() {

        this.feedback = [];

        if (this.kneeAngle > 170) {

            this.feedback.push({
                type: "warning",
                title: "깊이가 부족합니다.",
                message: "조금 더 깊게 앉아보세요."
            });

        }

        if (this.kneeAngle < 75) {

            this.feedback.push({
                type: "warning",
                title: "깊이가 너무 깊습니다.",
                message: "조금 올라오세요."
            });

        }

        if (this.hipAngle < 70) {

            this.feedback.push({
                type: "danger",
                title: "허리 각도",
                message: "상체를 조금 더 세우세요."
            });

        }

        if (this.valgus) {

            this.feedback.push({
                type: "danger",
                title: "무릎 붕괴",
                message: "무릎이 안쪽으로 모입니다."
            });

        }

        if (this.balance < 90) {

            this.feedback.push({
                type: "info",
                title: "좌우 밸런스",
                message: "양발에 체중을 균등하게 주세요."
            });

        }

        if (this.feedback.length === 0) {

            this.feedback.push({

                type: "success",

                title: "Excellent",

                message: "국가대표 수준의 자세입니다."

            });

        }

    }

    /* ==================================== */
    /* Update Feedback */
    /* ==================================== */

    renderFeedback() {

        const list =

        document.getElementById(

            "feedbackList"

        );

        if (!list) return;

        list.innerHTML = "";

        this.feedback.forEach(item => {

            const div =

            document.createElement("div");

            div.className =

            "feedback-card " + item.type;

            div.innerHTML = `

                <strong>${item.title}</strong>

                <p>${item.message}</p>

            `;

            list.appendChild(div);

        });

    }

    /* ==================================== */
    /* National Standard */
    /* ==================================== */

    compareNational() {

        this.standard = {

            knee: 140,

            hip: 118,

            score: 92

        };

        this.compare = {

            knee:

            this.kneeAngle -

            this.standard.knee,

            hip:

            this.hipAngle -

            this.standard.hip,

            score:

            this.score -

            this.standard.score

        };

    }

    /* ==================================== */
    /* Dashboard */
    /* ==================================== */

    updateDashboard() {

        this.calculateScore();

        this.grade =

        this.calculateGrade();

        this.generateFeedback();

        this.compareNational();

        this.renderFeedback();

        document.getElementById("poseScore").textContent =
        this.score;

        document.getElementById("poseGrade").textContent =
        this.grade;

        document.getElementById("nationalScore").textContent =
        this.compare.score > 0
        ? "+" + this.compare.score
        : this.compare.score;

    }
        /* ==================================== */
    /* Video Manager */
    /* ==================================== */

    initializeVideo() {

        this.videoFile = null;

        this.videoPlayer =
        document.getElementById(
            "analysisVideo"
        );

        this.videoInput =
        document.getElementById(
            "videoInput"
        );

        this.progress =
        document.getElementById(
            "analysisProgress"
        );

        if (this.videoInput) {

            this.videoInput.addEventListener(

                "change",

                this.loadVideo.bind(this)

            );

        }

    }

    /* ==================================== */

    loadVideo(event) {

        const file =

        event.target.files[0];

        if (!file) return;

        this.videoFile = file;

        this.videoPlayer.src =

        URL.createObjectURL(file);

    }

    /* ==================================== */

    async startVideo() {

        if (!this.videoFile) return;

        this.videoPlayer.currentTime = 0;

        this.videoRunning = true;

        await this.videoPlayer.play();

    }

    /* ==================================== */

    stopVideo() {

        this.videoRunning = false;

        this.videoPlayer.pause();

    }

    /* ==================================== */

    bindVideoEvents() {

        this.videoPlayer.addEventListener(

            "timeupdate",

            this.processVideo.bind(this)

        );

    }

    /* ==================================== */

    async processVideo() {

        if (!this.videoRunning) return;

        await this.pose.send({

            image:

            this.videoPlayer

        });

        const progress =

        Math.round(

            this.videoPlayer.currentTime /

            this.videoPlayer.duration * 100

        );

        if (this.progress) {

            this.progress.value =

            progress;

        }

        if (

            this.videoPlayer.currentTime >=

            this.videoPlayer.duration

        ) {

            this.stopVideo();

        }

    }

    /* ==================================== */
    /* Capture */
    /* ==================================== */

    captureFrame() {

        this.captureCanvas.width =

        this.video.videoWidth;

        this.captureCanvas.height =

        this.video.videoHeight;

        this.captureCtx.drawImage(

            this.video,

            0,

            0

        );

        return this.captureCanvas.toDataURL(

            "image/png"

        );

    }

    /* ==================================== */

    downloadCapture() {

        const img =

        this.captureFrame();

        const a =

        document.createElement(

            "a"

        );

        a.href = img;

        a.download =

        "capture.png";

        a.click();

    }

    /* ==================================== */
    /* History */
    /* ==================================== */

    saveFrameData() {

        this.analysisData.push({

            time:

            this.videoPlayer.currentTime,

            score:

            this.score,

            knee:

            this.kneeAngle,

            hip:

            this.hipAngle,

            balance:

            this.balance,

            grade:

            this.grade

        });

    }

    /* ==================================== */

    clearHistory() {

        this.analysisData = [];

    }

    /* ==================================== */
    /* Export JSON */
    /* ==================================== */

    exportJSON() {

        const blob =

        new Blob(

            [

                JSON.stringify(

                    this.analysisData,

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

        URL.createObjectURL(

            blob

        );

        const a =

        document.createElement(

            "a"

        );

        a.href = url;

        a.download =

        "analysis.json";

        a.click();

        URL.revokeObjectURL(

            url

        );

    }
        /* ==================================== */
    /* Chart */
    /* ==================================== */

    initializeChart() {

        const canvas =
        document.getElementById("angleChart");

        if (!canvas) return;

        this.chartData = {

            labels: [],

            knee: [],

            hip: [],

            score: []

        };

        this.chart = new Chart(

            canvas.getContext("2d"),

            {

                type: "line",

                data: {

                    labels: this.chartData.labels,

                    datasets: [

                        {

                            label: "Knee",

                            data: this.chartData.knee,

                            borderColor: "#00BFFF",

                            borderWidth: 2,

                            tension: .3

                        },

                        {

                            label: "Hip",

                            data: this.chartData.hip,

                            borderColor: "#00FFAA",

                            borderWidth: 2,

                            tension: .3

                        },

                        {

                            label: "Score",

                            data: this.chartData.score,

                            borderColor: "#FFD700",

                            borderWidth: 2,

                            tension: .3

                        }

                    ]

                },

                options: {

                    responsive: true,

                    animation: false,

                    maintainAspectRatio: false

                }

            }

        );

    }

    /* ==================================== */

    updateChart() {

        if (!this.chart) return;

        this.chartData.labels.push(

            new Date().toLocaleTimeString()

        );

        this.chartData.knee.push(

            this.kneeAngle

        );

        this.chartData.hip.push(

            this.hipAngle

        );

        this.chartData.score.push(

            this.score

        );

        while (

            this.chartData.labels.length > 60

        ) {

            this.chartData.labels.shift();

            this.chartData.knee.shift();

            this.chartData.hip.shift();

            this.chartData.score.shift();

        }

        this.chart.update("none");

    }

    /* ==================================== */
    /* PDF */
    /* ==================================== */

    async exportPDF() {

        const element =

        document.getElementById(

            "reportArea"

        );

        if (!element) return;

        const canvas =

        await html2canvas(

            element

        );

        const image =

        canvas.toDataURL(

            "image/png"

        );

        const pdf =

        new jspdf.jsPDF(

            "p",

            "mm",

            "a4"

        );

        pdf.addImage(

            image,

            "PNG",

            10,

            10,

            190,

            120

        );

        pdf.save(

            "analysis.pdf"

        );

    }

    /* ==================================== */
    /* Firebase */
    /* ==================================== */

    async uploadAnalysis() {

        if (

            typeof addDoc ===

            "undefined"

        ) {

            return;

        }

        await addDoc(

            collection(

                db,

                "analysis"

            ),

            this.exportReport()

        );

    }

    /* ==================================== */

    exportReport() {

        return {

            score: this.score,

            grade: this.grade,

            reps: this.rep,

            exercise: this.exercise,

            knee: this.kneeAngle,

            hip: this.hipAngle,

            ankle: this.ankleAngle,

            shoulder: this.shoulderAngle,

            balance: this.balance,

            valgus: this.valgus,

            feedback: this.feedback,

            createdAt:

            new Date()

        };

    }

    /* ==================================== */

    resetAnalysis() {

        this.rep = 0;

        this.score = 0;

        this.feedback = [];

        this.stage = "UP";

        this.analysisData = [];

    }

}
/* ==================================== */
/* Initialize */
/* ==================================== */

async init(){

    await this.initialize();

    this.initializeChart();

    this.initializeVideo();

    this.bindVideoEvents();

    this.registerEvents();

}

/* ==================================== */
/* Events */
/* ==================================== */

registerEvents(){

    document.getElementById(

        "startCamera"

    )?.addEventListener(

        "click",

        ()=>{

            this.start();

        }

    );

    document.getElementById(

        "stopCamera"

    )?.addEventListener(

        "click",

        ()=>{

            this.stop();

        }

    );

    document.getElementById(

        "captureButton"

    )?.addEventListener(

        "click",

        ()=>{

            this.downloadCapture();

        }

    );

    document.getElementById(

        "videoStart"

    )?.addEventListener(

        "click",

        ()=>{

            this.startVideo();

        }

    );

    document.getElementById(

        "exportPdf"

    )?.addEventListener(

        "click",

        ()=>{

            this.exportPDF();

        }

    );

}

/* ==================================== */
/* Main Update */
/* ==================================== */

update(){

    if(

        this.landmarks.length===0

    ){

        return;

    }

    this.updatePose();

    this.updateAnalysis();

    this.updateDashboard();

    this.updateChart();

}

/* ==================================== */
/* Override Render */
/* ==================================== */

render(){

    if(!this.results){

        return;

    }

    this.ctx.clearRect(

        0,

        0,

        this.canvas.width,

        this.canvas.height

    );

    this.ctx.drawImage(

        this.results.image,

        0,

        0,

        this.canvas.width,

        this.canvas.height

    );

    if(

        this.landmarks.length===0

    ){

        return;

    }

    this.drawSkeleton();

    this.update();

    this.updateFPS();

}

/* ==================================== */
/* Reset */
/* ==================================== */

reset(){

    this.rep=0;

    this.stage="UP";

    this.score=0;

    this.grade="-";

    this.feedback=[];

    this.analysisData=[];

}

/* ==================================== */
/* Destroy */
/* ==================================== */

destroy(){

    this.stop();

    this.chart?.destroy();

    this.analysisData=[];

}

/* ==================================== */
/* Create */
/* ==================================== */

const cameraManager=

new CameraManager();

window.addEventListener(

    "load",

    ()=>{

        cameraManager.init();

    }

);

window.cameraManager=

cameraManager;