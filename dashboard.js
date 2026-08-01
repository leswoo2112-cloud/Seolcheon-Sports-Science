/*
=========================================
dashboard.js
설천고 스포츠과학센터 PRO
Dashboard Engine
Version 1.0
=========================================
*/

"use strict";

export class Dashboard{

    constructor(firebase){

        this.firebase=firebase;

        this.stats={

            athletes:0,

            trainings:0,

            reports:0,

            averageScore:0,

            nationalPercent:0

        };

    }

    /* ============================== */

    async initialize(){

        await this.loadStatistics();

        this.renderCards();

        this.renderClock();

    }

    /* ============================== */

    async loadStatistics(){

        const info=

        await this.firebase.getDashboardInfo();

        this.stats.athletes=

        info.athleteCount;

        this.stats.trainings=

        info.trainingCount;

        this.stats.reports=

        info.reportCount;

    }

    /* ============================== */

    renderCards(){

        document.getElementById(

            "dashboardAthletes"

        ).textContent=

        this.stats.athletes;

        document.getElementById(

            "dashboardTraining"

        ).textContent=

        this.stats.trainings;

        document.getElementById(

            "dashboardReports"

        ).textContent=

        this.stats.reports;

    }

    /* ============================== */

    renderClock(){

        const update=()=>{

            const now=new Date();

            document.getElementById(

                "dashboardClock"

            ).textContent=

            now.toLocaleTimeString("ko-KR");

        };

        update();

        setInterval(update,1000);

    }

    /* ============================== */

    setAverageScore(score){

        this.stats.averageScore=score;

        document.getElementById(

            "averageScore"

        ).textContent=

        score.toFixed(1);

    }

    /* ============================== */

    setNationalPercent(percent){

        this.stats.nationalPercent=percent;

        document.getElementById(

            "nationalPercent"

        ).textContent=

        percent+"%";

    }

}
    /* ============================== */
    /* Recent Analysis */
    /* ============================== */

    async loadRecentAnalysis(){

        const reports =

        await this.firebase.loadReports();

        this.recentReports =

        reports
        .sort((a,b)=>

            new Date(b.createdAt)-

            new Date(a.createdAt)

        )
        .slice(0,5);

        this.renderRecent();

    }

    /* ============================== */

    renderRecent(){

        const list =

        document.getElementById(

            "recentAnalysis"

        );

        if(!list) return;

        list.innerHTML="";

        this.recentReports.forEach(item=>{

            const row=

            document.createElement("div");

            row.className=

            "recent-item";

            row.innerHTML=`

                <div>${item.name??"선수"}</div>

                <div>${item.score}점</div>

                <div>${item.grade}</div>

            `;

            list.appendChild(row);

        });

    }

    /* ============================== */
    /* Today's Training */
    /* ============================== */

    async loadTodayTraining(){

        const training=

        await this.firebase.loadTraining();

        const today=

        new Date()

        .toLocaleDateString();

        this.todayTraining=

        training.filter(item=>{

            if(!item.createdAt) return false;

            const date=

            item.createdAt

            .toDate()

            .toLocaleDateString();

            return date===today;

        });

        document.getElementById(

            "todayTraining"

        ).textContent=

        this.todayTraining.length;

    }

    /* ============================== */
    /* Average Score */
    /* ============================== */

    async calculateAverage(){

        const reports=

        await this.firebase.loadReports();

        if(reports.length===0){

            return;

        }

        const avg=

        reports.reduce(

            (sum,item)=>

            sum+(item.score||0),

            0

        )/reports.length;

        this.setAverageScore(avg);

    }

    /* ============================== */
    /* Dashboard Refresh */
    /* ============================== */

    async refresh(){

        await this.loadStatistics();

        await this.loadRecentAnalysis();

        await this.loadTodayTraining();

        await this.calculateAverage();

        this.renderCards();

    }

    /* ============================== */
    /* Auto Refresh */
    /* ============================== */

    startAutoRefresh(){

        this.refresh();

        setInterval(()=>{

            this.refresh();

        },30000);

    }

}
    /* ============================== */
    /* Weather Card */
    /* ============================== */

    async updateWeather(weather){

        if(!weather) return;

        document.getElementById(
            "weatherTemp"
        ).textContent=
        weather.temp+"°C";

        document.getElementById(
            "weatherStatus"
        ).textContent=
        weather.status;

    }

    /* ============================== */
    /* Athlete Ranking */
    /* ============================== */

    async renderRanking(){

        const reports=

        await this.firebase.loadReports();

        reports.sort(

            (a,b)=>

            (b.score||0)-

            (a.score||0)

        );

        const list=

        document.getElementById(

            "rankingList"

        );

        if(!list) return;

        list.innerHTML="";

        reports.slice(0,10).forEach(

            (item,index)=>{

                const row=

                document.createElement("div");

                row.className=

                "ranking-item";

                row.innerHTML=`

                    <span>#${index+1}</span>

                    <span>${item.name??"선수"}</span>

                    <span>${item.score}</span>

                `;

                list.appendChild(row);

            }

        );

    }

    /* ============================== */
    /* Today Schedule */
    /* ============================== */

    renderSchedule(schedule=[]){

        const list=

        document.getElementById(

            "todaySchedule"

        );

        if(!list) return;

        list.innerHTML="";

        schedule.forEach(item=>{

            const div=

            document.createElement("div");

            div.className="schedule-item";

            div.innerHTML=`

                <strong>${item.time}</strong>

                <span>${item.title}</span>

            `;

            list.appendChild(div);

        });

    }

    /* ============================== */
    /* Notification */
    /* ============================== */

    showNotification(message){

        const box=

        document.getElementById(

            "dashboardNotification"

        );

        if(!box) return;

        box.textContent=message;

        box.classList.add("show");

        setTimeout(()=>{

            box.classList.remove("show");

        },3000);

    }

    /* ============================== */
    /* Dashboard Theme */
    /* ============================== */

    changeTheme(theme){

        document.body.dataset.theme=

        theme;

    }

    /* ============================== */
    /* Full Refresh */
    /* ============================== */

    async reload(){

        await this.refresh();

        await this.renderRanking();

    }

}