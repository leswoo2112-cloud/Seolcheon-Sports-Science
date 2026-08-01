/*
=========================================
athlete.js
Seolcheon Sports Science Center PRO
Athlete Manager
Version 2.0
=========================================
*/

"use strict";

export class AthleteManager {

    constructor() {

        this.athletes = [];

        this.currentAthlete = null;

    }

    /* ============================== */
    /* Create Athlete */
    /* ============================== */

    create(data) {

        const athlete = {

            id: crypto.randomUUID(),

            name: data.name,

            sport: data.sport,

            gender: data.gender,

            age: data.age,

            height: data.height,

            weight: data.weight,

            team: data.team,

            createdAt: new Date(),

            records: []

        };

        this.athletes.push(athlete);

        return athlete;

    }

    /* ============================== */
    /* Select Athlete */
    /* ============================== */

    select(id) {

        this.currentAthlete =

        this.athletes.find(

            athlete => athlete.id === id

        ) || null;

        return this.currentAthlete;

    }

    /* ============================== */
    /* Add Record */
    /* ============================== */

    addRecord(record) {

        if (!this.currentAthlete) {

            return;

        }

        this.currentAthlete.records.push({

            ...record,

            createdAt: new Date()

        });

    }

    /* ============================== */
    /* Get Latest Record */
    /* ============================== */

    getLatestRecord() {

        if (!this.currentAthlete) {

            return null;

        }

        const records =

        this.currentAthlete.records;

        return records.length

            ? records[records.length - 1]

            : null;

    }

    /* ============================== */
    /* Get Average Score */
    /* ============================== */

    getAverageScore() {

        if (!this.currentAthlete) {

            return 0;

        }

        const records =

        this.currentAthlete.records;

        if (records.length === 0) {

            return 0;

        }

        const total = records.reduce(

            (sum, record) =>

            sum + (record.score || 0),

            0

        );

        return Number(

            (total / records.length).toFixed(1)

        );

    }

}
