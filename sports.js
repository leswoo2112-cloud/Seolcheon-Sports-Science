/*
=========================================
sports.js
설천고 스포츠과학센터 PRO
Sports Engine
Version 2.0
=========================================
*/

"use strict";

export class SportsEngine{

    constructor(){

        this.category="winter";

        this.currentSport="biathlon";

        this.sports={

            winter:[

                "바이애슬론",
                "크로스컨트리",
                "알파인",
                "스노보드",
                "프리스타일",
                "스키점프",
                "노르딕복합",
                "봅슬레이",
                "스켈레톤",
                "루지",
                "컬링",
                "쇼트트랙",
                "스피드스케이팅",
                "피겨"

            ],

            summer:[

                "육상",
                "축구",
                "농구",
                "배구",
                "핸드볼",
                "유도",
                "태권도",
                "레슬링",
                "수영",
                "사격",
                "양궁",
                "체조",
                "테니스",
                "배드민턴",
                "탁구"

            ],

            college:[

                "100m",
                "50m",
                "제자리멀리뛰기",
                "서전트점프",
                "메디신볼",
                "좌전굴",
                "윗몸일으키기",
                "턱걸이",
                "배근력",
                "악력"

            ]

        };

    }

    /* ========================= */

    setCategory(category){

        this.category=category;

        this.render();

    }

    /* ========================= */

    render(){

        const list=

        document.getElementById(

            "sportsList"

        );

        if(!list){

            return;

        }

        list.innerHTML="";

        this.sports[

            this.category

        ].forEach(name=>{

            const card=

            document.createElement("div");

            card.className=

            "sport-card";

            card.textContent=name;

            card.onclick=()=>{

                this.selectSport(name);

            };

            list.appendChild(card);

        });

    }

    /* ========================= */

    selectSport(name){

        this.currentSport=name;

        document.getElementById(

            "selectedSport"

        ).textContent=name;

    }

}
    /* ========================= */
    /* National Standard */
    /* ========================= */

    loadNationalStandard(){

        this.standard={

            "바이애슬론":{

                balance:95,

                knee:140,

                hip:120

            },

            "크로스컨트리":{

                balance:94,

                knee:135,

                hip:118

            },

            "사격":{

                balance:99,

                stability:98

            },

            "육상":{

                balance:93,

                knee:138,

                hip:118

            }

        };

    }

    /* ========================= */
    /* Get Standard */
    /* ========================= */

    getStandard(){

        return this.standard[

            this.currentSport

        ]||null;

    }

    /* ========================= */
    /* Analyze */
    /* ========================= */

    analyze(data){

        const standard=

        this.getStandard();

        if(!standard){

            return null;

        }

        return{

            balance:

            data.balance-

            (standard.balance||0),

            knee:

            data.knee-

            (standard.knee||0),

            hip:

            data.hip-

            (standard.hip||0)

        };

    }

    /* ========================= */
    /* Sport Icon */
    /* ========================= */

    getSportIcon(){

        const icons={

            "바이애슬론":"🎿",

            "크로스컨트리":"⛷️",

            "사격":"🎯",

            "육상":"🏃",

            "농구":"🏀",

            "축구":"⚽",

            "배구":"🏐",

            "수영":"🏊",

            "태권도":"🥋",

            "유도":"🥋"

        };

        return icons[

            this.currentSport

        ]||"🏅";

    }

    /* ========================= */
    /* Update Header */
    /* ========================= */

    updateHeader(){

        document.getElementById(

            "selectedSport"

        ).innerHTML=

        this.getSportIcon()+

        " "+this.currentSport;

    }

    /* ========================= */
    /* Change Sport */
    /* ========================= */

    selectSport(name){

        this.currentSport=name;

        this.updateHeader();

    }

    /* ========================= */
    /* Recommendation */
    /* ========================= */

    recommend(){

        switch(this.currentSport){

            case "바이애슬론":

                return [

                    "더블폴링",

                    "사격 안정화",

                    "인터벌"

                ];

            case "사격":

                return [

                    "균형",

                    "호흡",

                    "코어"

                ];

            case "육상":

                return [

                    "스프린트",

                    "점프",

                    "스타트"

                ];

            default:

                return [

                    "기본훈련"

                ];

        }

    }
        /* ========================= */
    /* Training Menu */
    /* ========================= */

    getTrainingMenu(){

        const menu={

            "바이애슬론":[

                "롤러스키",

                "사격",

                "인터벌",

                "근력",

                "회복"

            ],

            "크로스컨트리":[

                "더블폴링",

                "업힐",

                "다운힐",

                "롱디스턴스"

            ],

            "사격":[

                "입사",

                "격발",

                "호흡",

                "조준"

            ],

            "육상":[

                "스타트",

                "가속",

                "최고속도",

                "피니시"

            ]

        };

        return menu[this.currentSport] || [];

    }

    /* ========================= */
    /* Injury Risk */
    /* ========================= */

    calculateInjuryRisk(data){

        let risk="낮음";

        if(data.valgus){

            risk="높음";

        }

        else if(data.balance<90){

            risk="보통";

        }

        return risk;

    }

    /* ========================= */
    /* Training Load */
    /* ========================= */

    calculateTrainingLoad(duration,rpe){

        const load=duration*rpe;

        return{

            load,

            level:

            load<200

            ?"낮음"

            :

            load<400

            ?"보통"

            :

            "높음"

        };

    }

    /* ========================= */
    /* Calories */
    /* ========================= */

    estimateCalories(weight,time){

        const met={

            "바이애슬론":11,

            "크로스컨트리":10,

            "육상":9,

            "농구":8,

            "축구":8,

            "웨이트":6

        };

        const value=

        met[this.currentSport]||7;

        return Math.round(

            value*

            weight*

            time/

            60

        );

    }

    /* ========================= */
    /* Heart Rate Zone */
    /* ========================= */

    calculateHeartRate(age){

        const max=220-age;

        return{

            zone1:Math.round(max*0.6),

            zone2:Math.round(max*0.7),

            zone3:Math.round(max*0.8),

            zone4:Math.round(max*0.9),

            zone5:max

        };

    }

    /* ========================= */
    /* Training Result */
    /* ========================= */

    createTrainingResult(data){

        return{

            sport:this.currentSport,

            standard:this.getStandard(),

            recommendation:this.recommend(),

            injuryRisk:

            this.calculateInjuryRisk(data),

            analysis:

            this.analyze(data)

        };

    }
        /* ========================= */
    /* Motion Analysis */
    /* ========================= */

    analyzeMotion(landmarks){

        if(!landmarks){

            return null;

        }

        const result={

            posture:0,

            balance:0,

            efficiency:0,

            symmetry:0

        };

        result.posture=

        this.calculatePostureScore(

            landmarks

        );

        result.balance=

        this.calculateBalanceScore(

            landmarks

        );

        result.efficiency=

        this.calculateEfficiency(

            landmarks

        );

        result.symmetry=

        this.calculateSymmetry(

            landmarks

        );

        return result;

    }

    /* ========================= */

    calculatePostureScore(

        landmarks

    ){

        let score=100;

        const shoulder=

        Math.abs(

            landmarks[11].y-

            landmarks[12].y

        );

        if(shoulder>0.03){

            score-=10;

        }

        return score;

    }

    /* ========================= */

    calculateBalanceScore(

        landmarks

    ){

        let score=100;

        const hip=

        Math.abs(

            landmarks[23].y-

            landmarks[24].y

        );

        if(hip>0.02){

            score-=10;

        }

        return score;

    }

    /* ========================= */

    calculateEfficiency(

        landmarks

    ){

        let score=100;

        const knee=

        Math.abs(

            landmarks[25].x-

            landmarks[26].x

        );

        if(knee>0.08){

            score-=8;

        }

        return score;

    }

    /* ========================= */

    calculateSymmetry(

        landmarks

    ){

        let score=100;

        const shoulder=

        Math.abs(

            landmarks[11].x-

            landmarks[12].x

        );

        if(shoulder>0.15){

            score-=10;

        }

        return score;

    }

    /* ========================= */
    /* AI Comment */
    /* ========================= */

    generateComment(score){

        if(score>=95){

            return "국가대표 수준의 움직임입니다.";

        }

        if(score>=85){

            return "우수한 움직임입니다.";

        }

        if(score>=75){

            return "기본 자세는 좋지만 개선이 필요합니다.";

        }

        return "기본 자세 교정이 필요합니다.";

    }

    /* ========================= */
    /* Complete */
    /* ========================= */

    completeAnalysis(

        landmarks,

        athlete

    ){

        const motion=

        this.analyzeMotion(

            landmarks

        );

        return{

            athlete,

            sport:

            this.currentSport,

            motion,

            comment:

            this.generateComment(

                motion.posture

            ),

            createdAt:

            new Date()

        };

    }

}