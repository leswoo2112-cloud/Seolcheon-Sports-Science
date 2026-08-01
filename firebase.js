/*
=========================================
firebase.js
설천고 스포츠과학센터 PRO
Firebase Engine
=========================================
*/

"use strict";

import { initializeApp } from
"https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";

import {

    getFirestore,

    collection,

    addDoc,

    getDocs,

    doc,

    updateDoc,

    deleteDoc,

    serverTimestamp

} from
"https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const firebaseConfig={

    apiKey:"YOUR_API_KEY",

    authDomain:"YOUR_PROJECT.firebaseapp.com",

    projectId:"YOUR_PROJECT",

    storageBucket:"YOUR_PROJECT.appspot.com",

    messagingSenderId:"",

    appId:""

};

const app=

initializeApp(firebaseConfig);

export const db=

getFirestore(app);

export class FirebaseManager{

    constructor(){

        this.playerCollection=

        "athletes";

        this.analysisCollection=

        "analysis";

    }

    /* ============================== */

    async saveAthlete(data){

        return await addDoc(

            collection(

                db,

                this.playerCollection

            ),

            {

                ...data,

                createdAt:

                serverTimestamp()

            }

        );

    }

    /* ============================== */

    async saveAnalysis(data){

        return await addDoc(

            collection(

                db,

                this.analysisCollection

            ),

            {

                ...data,

                createdAt:

                serverTimestamp()

            }

        );

    }

    /* ============================== */

    async loadAthletes(){

        const snap=

        await getDocs(

            collection(

                db,

                this.playerCollection

            )

        );

        return snap.docs.map(

            d=>({

                id:d.id,

                ...d.data()

            })

        );

    }

}
    /* ============================== */
    /* Update Athlete */
    /* ============================== */

    async updateAthlete(id,data){

        const ref=

        doc(

            db,

            this.playerCollection,

            id

        );

        await updateDoc(

            ref,

            data

        );

    }

    /* ============================== */
    /* Delete Athlete */
    /* ============================== */

    async deleteAthlete(id){

        const ref=

        doc(

            db,

            this.playerCollection,

            id

        );

        await deleteDoc(

            ref

        );

    }

    /* ============================== */
    /* Search Athlete */
    /* ============================== */

    async searchAthlete(keyword){

        const athletes=

        await this.loadAthletes();

        return athletes.filter(item=>

            item.name

            ?.toLowerCase()

            .includes(

                keyword.toLowerCase()

            )

        );

    }

    /* ============================== */
    /* Save Training */
    /* ============================== */

    async saveTraining(data){

        return await addDoc(

            collection(

                db,

                "training"

            ),

            {

                ...data,

                createdAt:

                serverTimestamp()

            }

        );

    }

    /* ============================== */
    /* Load Training */
    /* ============================== */

    async loadTraining(){

        const snap=

        await getDocs(

            collection(

                db,

                "training"

            )

        );

        return snap.docs.map(doc=>({

            id:doc.id,

            ...doc.data()

        }));

    }

    /* ============================== */
    /* Save Report */
    /* ============================== */

    async saveReport(data){

        return await addDoc(

            collection(

                db,

                "reports"

            ),

            {

                ...data,

                createdAt:

                serverTimestamp()

            }

        );

    }

    /* ============================== */
    /* Load Reports */
    /* ============================== */

    async loadReports(){

        const snap=

        await getDocs(

            collection(

                db,

                "reports"

            )

        );

        return snap.docs.map(doc=>({

            id:doc.id,

            ...doc.data()

        }));

    }

    /* ============================== */
    /* Favorite Athlete */
    /* ============================== */

    async favoriteAthlete(id){

        const ref=

        doc(

            db,

            this.playerCollection,

            id

        );

        await updateDoc(

            ref,

            {

                favorite:true

            }

        );

    }

    /* ============================== */
    /* Remove Favorite */
    /* ============================== */

    async unfavoriteAthlete(id){

        const ref=

        doc(

            db,

            this.playerCollection,

            id

        );

        await updateDoc(

            ref,

            {

                favorite:false

            }

        );

    }

    /* ============================== */
    /* Dashboard Count */
    /* ============================== */

    async getDashboardInfo(){

        const athletes=

        await this.loadAthletes();

        const trainings=

        await this.loadTraining();

        const reports=

        await this.loadReports();

        return{

            athleteCount:

            athletes.length,

            trainingCount:

            trainings.length,

            reportCount:

            reports.length

        };

    }

}