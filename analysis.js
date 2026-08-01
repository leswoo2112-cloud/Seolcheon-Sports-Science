/*
=========================================
analysis.js
설천고 스포츠과학센터 PRO
AI Analysis Engine
Version 1.0
=========================================
*/

"use strict";

class AnalysisEngine{

    constructor(){

        this.score=0;

        this.grade="-";

        this.feedback=[];

        this.risk="안전";

        this.nationalScore=92;

        this.exercise="squat";

        this.result={};

    }

    /* =============================== */

    analyze(data){

        this.data=data;

        this.calculateScore();

        this.calculateGrade();

        this.calculateRisk();

        this.generateFeedback();

        this.compareNational();

        return this.result;

    }

    /* =============================== */

    calculateScore(){

        let score=100;

        if(this.data.knee<85){

            score-=8;

        }

        if(this.data.knee>170){

            score-=10;

        }

        if(this.data.hip<75){

            score-=10;

        }

        if(this.data.balance<90){

            score-=8;

        }

        if(this.data.valgus){

            score-=15;

        }

        this.score=Math.max(0,score);

    }

    /* =============================== */

    calculateGrade(){

        if(this.score>=98){

            this.grade="S+";

        }

        else if(this.score>=95){

            this.grade="S";

        }

        else if(this.score>=90){

            this.grade="A+";

        }

        else if(this.score>=85){

            this.grade="A";

        }

        else if(this.score>=80){

            this.grade="B+";

        }

        else if(this.score>=75){

            this.grade="B";

        }

        else{

            this.grade="C";

        }

    }

    /* =============================== */

    calculateRisk(){

        if(this.data.valgus){

            this.risk="높음";

            return;

        }

        if(this.data.balance<85){

            this.risk="주의";

            return;

        }

        this.risk="안전";

    }

}
    /* =============================== */
    /* National Compare */
    /* =============================== */

    compareNational(){

        this.result.national={

            score:

            this.score-

            this.nationalScore,

            percent:

            Math.round(

                this.score/

                this.nationalScore*100

            )

        };

    }

    /* =============================== */
    /* Feedback */
    /* =============================== */

    generateFeedback(){

        this.feedback=[];

        if(this.data.knee>170){

            this.feedback.push({

                title:"깊이 부족",

                message:

                "조금 더 깊게 앉으세요.",

                level:"warning"

            });

        }

        if(this.data.knee<75){

            this.feedback.push({

                title:"과도한 깊이",

                message:

                "조금 올라오세요.",

                level:"warning"

            });

        }

        if(this.data.hip<75){

            this.feedback.push({

                title:"허리",

                message:

                "상체를 조금 세우세요.",

                level:"danger"

            });

        }

        if(this.data.balance<90){

            this.feedback.push({

                title:"밸런스",

                message:

                "좌우 체중을 맞춰주세요.",

                level:"info"

            });

        }

        if(this.data.valgus){

            this.feedback.push({

                title:"무릎",

                message:

                "무릎이 안쪽으로 들어갑니다.",

                level:"danger"

            });

        }

        if(this.feedback.length===0){

            this.feedback.push({

                title:"Excellent",

                message:

                "국가대표 수준입니다.",

                level:"success"

            });

        }

    }

    /* =============================== */
    /* Exercise Standard */
    /* =============================== */

    getExerciseStandard(){

        const standards={

            squat:{

                knee:140,

                hip:120,

                balance:95

            },

            lunge:{

                knee:100,

                hip:115,

                balance:94

            },

            pushup:{

                elbow:90,

                balance:95

            },

            plank:{

                hip:180,

                balance:98

            }

        };

        return standards[

            this.exercise

        ];

    }

    /* =============================== */
    /* Result */
    /* =============================== */

    buildResult(){

        this.result.score=

        this.score;

        this.result.grade=

        this.grade;

        this.result.risk=

        this.risk;

        this.result.feedback=

        this.feedback;

        this.result.exercise=

        this.exercise;

        this.result.timestamp=

        new Date();

    }
        /* =============================== */
    /* Detail Score */
    /* =============================== */

    calculateDetailScore(){

        this.detail={

            depth:20,

            balance:20,

            posture:20,

            stability:20,

            movement:20

        };

        if(this.data.knee>170){

            this.detail.depth-=5;

        }

        if(this.data.knee<80){

            this.detail.depth-=5;

        }

        if(this.data.balance<90){

            this.detail.balance-=6;

        }

        if(this.data.valgus){

            this.detail.stability-=10;

        }

        if(this.data.hip<75){

            this.detail.posture-=8;

        }

        this.result.detail=this.detail;

    }

    /* =============================== */
    /* National Percent */
    /* =============================== */

    calculateNationalPercent(){

        this.result.percent=

        Math.min(

            100,

            Math.round(

                this.score/

                this.nationalScore*

                100

            )

        );

    }

    /* =============================== */
    /* Star Rating */
    /* =============================== */

    calculateStar(){

        let star=1;

        if(this.score>=60) star=2;

        if(this.score>=70) star=3;

        if(this.score>=80) star=4;

        if(this.score>=90) star=5;

        this.result.star=

        "★".repeat(star)+

        "☆".repeat(5-star);

    }

    /* =============================== */
    /* Difficulty */
    /* =============================== */

    calculateDifficulty(){

        const difficulty={

            squat:"상",

            lunge:"중",

            pushup:"중",

            plank:"하"

        };

        this.result.difficulty=

        difficulty[this.exercise]

        ||"중";

    }

    /* =============================== */
    /* Injury Risk */
    /* =============================== */

    calculateJointRisk(){

        this.result.jointRisk={

            knee:"안전",

            hip:"안전",

            ankle:"안전",

            back:"안전"

        };

        if(this.data.valgus){

            this.result.jointRisk.knee=

            "높음";

        }

        if(this.data.balance<90){

            this.result.jointRisk.ankle=

            "주의";

        }

        if(this.data.hip<75){

            this.result.jointRisk.back=

            "주의";

        }

    }

    /* =============================== */
    /* Summary */
    /* =============================== */

    generateSummary(){

        this.result.summary=

        `${this.grade} 등급 · 국가대표 대비 ${this.result.percent}%`;

    }

    /* =============================== */
    /* Update Result */
    /* =============================== */

    finalize(){

        this.calculateDetailScore();

        this.calculateNationalPercent();

        this.calculateStar();

        this.calculateDifficulty();

        this.calculateJointRisk();

        this.generateSummary();

        return this.result;

    }

}
    /* =============================== */
    /* Biathlon Analysis */
    /* =============================== */

    analyzeBiathlon(){

        this.result.biathlon={

            ski:100,

            shooting:100,

            transition:100,

            overall:100

        };

        if(this.data.balance<90){

            this.result.biathlon.ski-=8;

        }

        if(this.data.valgus){

            this.result.biathlon.ski-=12;

        }

        if(this.data.hip<75){

            this.result.biathlon.transition-=10;

        }

        this.result.biathlon.overall=

        Math.round(

            (

                this.result.biathlon.ski+

                this.result.biathlon.shooting+

                this.result.biathlon.transition

            )/3

        );

    }

    /* =============================== */
    /* Roller Ski */
    /* =============================== */

    analyzeRollerSki(){

        this.result.roller={

            balance:this.data.balance,

            knee:this.data.knee,

            hip:this.data.hip,

            score:0

        };

        let score=100;

        if(this.data.balance<92){

            score-=8;

        }

        if(this.data.knee<130){

            score-=6;

        }

        if(this.data.hip<105){

            score-=8;

        }

        this.result.roller.score=score;

    }

    /* =============================== */
    /* Running */
    /* =============================== */

    analyzeRunning(){

        this.result.running={

            posture:100,

            stability:100,

            efficiency:100

        };

        if(this.data.balance<90){

            this.result.running.stability-=10;

        }

        if(this.data.valgus){

            this.result.running.efficiency-=12;

        }

    }

    /* =============================== */
    /* Shooting */
    /* =============================== */

    analyzeShooting(){

        this.result.shooting={

            bodyStability:100,

            shoulder:100,

            balance:100

        };

        if(this.data.balance<95){

            this.result.shooting.balance-=12;

        }

        if(this.data.hip<80){

            this.result.shooting.bodyStability-=10;

        }

    }

    /* =============================== */
    /* College Test */
    /* =============================== */

    analyzeCollege(){

        this.result.college={

            squat:this.score,

            jump:0,

            sprint:0,

            situp:0,

            pushup:0

        };

    }

    /* =============================== */
    /* AI Recommendation */
    /* =============================== */

    generateRecommendation(){

        this.result.recommend=[];

        if(this.data.balance<90){

            this.result.recommend.push(

                "싱글 레그 스쿼트"

            );

        }

        if(this.data.valgus){

            this.result.recommend.push(

                "힙 어브덕션"

            );

        }

        if(this.data.hip<75){

            this.result.recommend.push(

                "코어 안정화"

            );

        }

        if(this.result.recommend.length===0){

            this.result.recommend.push(

                "현재 프로그램 유지"

            );

        }

    }

    /* =============================== */
    /* Full Analysis */
    /* =============================== */

    analyzeAll(){

        this.analyzeBiathlon();

        this.analyzeRollerSki();

        this.analyzeRunning();

        this.analyzeShooting();

        this.analyzeCollege();

        this.generateRecommendation();

        return this.result;

    }
        /* =============================== */
    /* Symmetry Analysis */
    /* =============================== */

    analyzeSymmetry(){

        const leftKnee =
        this.data.leftKnee ?? this.data.knee;

        const rightKnee =
        this.data.rightKnee ?? this.data.knee;

        const leftHip =
        this.data.leftHip ?? this.data.hip;

        const rightHip =
        this.data.rightHip ?? this.data.hip;

        this.result.symmetry = {

            knee:
            Math.abs(leftKnee-rightKnee),

            hip:
            Math.abs(leftHip-rightHip)

        };

        this.result.symmetry.score =

        Math.max(

            0,

            100-

            (

                this.result.symmetry.knee+

                this.result.symmetry.hip

            )

        );

    }

    /* =============================== */
    /* Power Estimate */
    /* =============================== */

    estimatePower(){

        let power=100;

        power+=

        (this.data.knee-130)*0.4;

        power+=

        (this.data.balance-90)*0.6;

        power=

        Math.max(

            0,

            Math.min(

                100,

                Math.round(power)

            )

        );

        this.result.power=power;

    }

    /* =============================== */
    /* Stability */
    /* =============================== */

    calculateStability(){

        let value=100;

        if(this.data.valgus){

            value-=15;

        }

        if(this.data.balance<90){

            value-=10;

        }

        if(this.data.hip<80){

            value-=8;

        }

        this.result.stability=value;

    }

    /* =============================== */
    /* Mobility */
    /* =============================== */

    calculateMobility(){

        this.result.mobility={

            hip:

            Math.min(

                100,

                this.data.hip

            ),

            knee:

            Math.min(

                100,

                this.data.knee

            )

        };

    }

    /* =============================== */
    /* Performance Index */
    /* =============================== */

    calculatePerformanceIndex(){

        this.result.performance=

        Math.round(

            (

                this.score+

                this.result.power+

                this.result.stability+

                this.result.symmetry.score

            )/4

        );

    }

    /* =============================== */
    /* Weekly Trend */
    /* =============================== */

    calculateTrend(history=[]){

        if(history.length<2){

            this.result.trend=0;

            return;

        }

        const first=

        history[0].score;

        const last=

        history[history.length-1].score;

        this.result.trend=

        Math.round(last-first);

    }

    /* =============================== */
    /* Training Plan */
    /* =============================== */

    generateTrainingPlan(){

        this.result.plan=[];

        if(this.result.symmetry.score<90){

            this.result.plan.push({

                title:"좌우 밸런스",

                exercise:

                "싱글레그 스쿼트"

            });

        }

        if(this.result.power<85){

            this.result.plan.push({

                title:"폭발력",

                exercise:

                "박스 점프"

            });

        }

        if(this.result.stability<90){

            this.result.plan.push({

                title:"코어",

                exercise:

                "플랭크"

            });

        }

        if(this.result.plan.length===0){

            this.result.plan.push({

                title:"유지",

                exercise:

                "현재 프로그램 유지"

            });

        }

    }

    /* =============================== */
    /* Final */
    /* =============================== */

    finalizeAnalysis(history=[]){

        this.analyzeSymmetry();

        this.estimatePower();

        this.calculateStability();

        this.calculateMobility();

        this.calculatePerformanceIndex();

        this.calculateTrend(history);

        this.generateTrainingPlan();

        return this.result;

    }

}