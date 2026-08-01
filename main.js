/* =========================================
   설천고 스포츠과학센터 PRO
   main.js Part 1
   기본 시스템·메뉴·저장 기능
========================================= */

"use strict";

/* =========================================
   기본 설정
========================================= */

const STORAGE_KEY = "seolcheonSportsScienceProV2";

const app = {
    version: "2.0.0",

    athletes: [],
    sportsRecords: [],
    trainingRecords: [],
    liveAnalyses: [],
    videoAnalyses: [],
    collegeRecords: [],
    nationalComparisons: [],
    reports: [],

    settings: {
        selectedSport: "",
        selectedMovement: ""
    }
};

/* =========================================
   DOM 도우미
========================================= */

function $(id) {
    return document.getElementById(id);
}

function $all(selector) {
    return [...document.querySelectorAll(selector)];
}

/* =========================================
   안전한 문자 처리
========================================= */

function escapeHTML(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

/* =========================================
   ID 생성
========================================= */

function createId(prefix = "item") {
    const randomPart = Math.random()
        .toString(36)
        .slice(2, 9);

    return `${prefix}-${Date.now()}-${randomPart}`;
}

/* =========================================
   날짜
========================================= */

function getTodayString() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function formatDate(dateValue) {
    if (!dateValue) {
        return "-";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return String(dateValue);
    }

    return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    });
}

function formatDateTime(dateValue) {
    if (!dateValue) {
        return "-";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return String(dateValue);
    }

    return date.toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    });
}

/* =========================================
   Toast
========================================= */

let toastTimer = null;

function showToast(message, type = "success") {
    const toast = $("toast");

    if (!toast) {
        return;
    }

    clearTimeout(toastTimer);

    toast.textContent = message;
    toast.className = "toast";
    toast.classList.add("show");
    toast.classList.add(type);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

/* =========================================
   저장
========================================= */

function saveAppData() {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(app)
        );

        updateStorageStatus(true);

        return true;
    } catch (error) {
        console.error("데이터 저장 오류:", error);

        updateStorageStatus(false);

        return false;
    }
}

/* =========================================
   불러오기
========================================= */

function loadAppData() {
    const savedText = localStorage.getItem(STORAGE_KEY);

    if (!savedText) {
        updateStorageStatus(true);
        return;
    }

    try {
        const savedData = JSON.parse(savedText);

        if (!savedData || typeof savedData !== "object") {
            throw new Error("올바르지 않은 저장 데이터입니다.");
        }

        if (Array.isArray(savedData.athletes)) {
            app.athletes = savedData.athletes;
        }

        if (Array.isArray(savedData.sportsRecords)) {
            app.sportsRecords = savedData.sportsRecords;
        }

        if (Array.isArray(savedData.trainingRecords)) {
            app.trainingRecords = savedData.trainingRecords;
        }

        if (Array.isArray(savedData.liveAnalyses)) {
            app.liveAnalyses = savedData.liveAnalyses;
        }

        if (Array.isArray(savedData.videoAnalyses)) {
            app.videoAnalyses = savedData.videoAnalyses;
        }

        if (Array.isArray(savedData.collegeRecords)) {
            app.collegeRecords = savedData.collegeRecords;
        }

        if (Array.isArray(savedData.nationalComparisons)) {
            app.nationalComparisons =
                savedData.nationalComparisons;
        }

        if (Array.isArray(savedData.reports)) {
            app.reports = savedData.reports;
        }

        if (
            savedData.settings &&
            typeof savedData.settings === "object"
        ) {
            app.settings = {
                ...app.settings,
                ...savedData.settings
            };
        }

        updateStorageStatus(true);
    } catch (error) {
        console.error("데이터 불러오기 오류:", error);

        updateStorageStatus(false);

        showToast(
            "저장 데이터를 불러오지 못했습니다.",
            "error"
        );
    }
}

/* =========================================
   저장 상태
========================================= */

function updateStorageStatus(isConnected) {
    const dot = $("storageStatus");
    const text = $("storageStatusText");

    if (!dot || !text) {
        return;
    }

    if (isConnected) {
        dot.style.background = "#22c55e";
        text.textContent = "기기 저장 정상";
    } else {
        dot.style.background = "#ef4444";
        text.textContent = "저장 오류";
    }
}

/* =========================================
   페이지 정보
========================================= */

const pageInformation = {
    dashboard: {
        title: "대시보드",
        eyebrow: "SPORTS SCIENCE CENTER"
    },

    athletes: {
        title: "선수 등록·관리",
        eyebrow: "ATHLETE MANAGEMENT"
    },

    sports: {
        title: "전체 스포츠 종목",
        eyebrow: "ALL SPORTS"
    },

    college: {
        title: "체대입시",
        eyebrow: "PHYSICAL EDUCATION ENTRANCE"
    },

    liveAnalysis: {
        title: "실시간 분석",
        eyebrow: "LIVE POSE ANALYSIS"
    },

    videoAnalysis: {
        title: "녹화 영상 분석",
        eyebrow: "RECORDED VIDEO ANALYSIS"
    },

    training: {
        title: "훈련 기록",
        eyebrow: "TRAINING RECORD"
    },

    national: {
        title: "국가대표급 비교",
        eyebrow: "NATIONAL LEVEL COMPARISON"
    },

    reports: {
        title: "AI 리포트",
        eyebrow: "AI REPORT"
    },

    ranking: {
        title: "선수 랭킹",
        eyebrow: "ATHLETE RANKING"
    },

    settings: {
        title: "설정·백업",
        eyebrow: "SETTINGS"
    }
};

/* =========================================
   페이지 이동
========================================= */

function openPage(pageName) {
    const page = $(`${pageName}Page`);

    if (!page) {
        console.warn(`페이지를 찾을 수 없습니다: ${pageName}`);
        return;
    }

    $all(".page").forEach((item) => {
        item.classList.remove("active");
    });

    page.classList.add("active");

    $all(".menu-button").forEach((button) => {
        button.classList.toggle(
            "active",
            button.dataset.page === pageName
        );
    });

    const information = pageInformation[pageName];

    if (information) {
        const pageTitle = $("pageTitle");
        const pageEyebrow = $("pageEyebrow");

        if (pageTitle) {
            pageTitle.textContent = information.title;
        }

        if (pageEyebrow) {
            pageEyebrow.textContent = information.eyebrow;
        }

        document.title =
            `${information.title} | 설천고 스포츠과학센터 PRO`;
    }

    closeMobileSidebar();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    refreshPage(pageName);
}

/* =========================================
   페이지별 새로고침
========================================= */

function refreshPage(pageName) {
    switch (pageName) {
        case "dashboard":
            updateDashboard();
            break;

        case "athletes":
            renderAthleteTable();
            break;

        case "sports":
            renderSportsCategories();
            break;

        case "college":
            renderAthleteSelects();
            updateCollegeDashboard();
            break;

        case "liveAnalysis":
            renderAthleteSelects();
            break;

        case "videoAnalysis":
            renderAthleteSelects();
            break;

        case "training":
            renderAthleteSelects();
            renderTrainingRecords();
            break;

        case "national":
            renderAthleteSelects();
            break;

        case "reports":
            renderAthleteSelects();
            break;

        case "ranking":
            renderRanking();
            break;

        case "settings":
            break;

        default:
            break;
    }
}

/* =========================================
   메뉴 이벤트
========================================= */

function initializeNavigation() {
    $all(".menu-button").forEach((button) => {
        button.addEventListener("click", () => {
            openPage(button.dataset.page);
        });
    });

    $all("[data-open-page]").forEach((button) => {
        button.addEventListener("click", () => {
            openPage(button.dataset.openPage);
        });
    });
}

/* =========================================
   모바일 메뉴
========================================= */

function openMobileSidebar() {
    $("sidebar")?.classList.add("open");
    $("sidebarOverlay")?.classList.add("show");
}

function closeMobileSidebar() {
    $("sidebar")?.classList.remove("open");
    $("sidebarOverlay")?.classList.remove("show");
}

function initializeMobileSidebar() {
    $("mobileMenuButton")?.addEventListener(
        "click",
        openMobileSidebar
    );

    $("sidebarOverlay")?.addEventListener(
        "click",
        closeMobileSidebar
    );

    window.addEventListener("resize", () => {
        if (window.innerWidth > 1024) {
            closeMobileSidebar();
        }
    });
}

/* =========================================
   시계
========================================= */

function updateClock() {
    const now = new Date();

    const clock = $("clock");
    const todayDate = $("todayDate");

    if (clock) {
        clock.textContent = now.toLocaleTimeString(
            "ko-KR",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false
            }
        );
    }

    if (todayDate) {
        todayDate.textContent = now.toLocaleDateString(
            "ko-KR",
            {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "short"
            }
        );
    }
}

/* =========================================
   초기 날짜 입력
========================================= */

function setDefaultDates() {
    const today = getTodayString();

    const trainingDate = $("trainingDateInput");

    if (trainingDate && !trainingDate.value) {
        trainingDate.value = today;
    }
}

/* =========================================
   분석 개수
========================================= */

function getTotalAnalysisCount() {
    return (
        app.liveAnalyses.length +
        app.videoAnalyses.length
    );
}

/* =========================================
   최근 활동 생성
========================================= */

function getRecentActivities() {
    const athleteActivities = app.athletes.map((athlete) => ({
        type: "선수 등록",
        title: `${athlete.name} 선수 등록`,
        date:
            athlete.createdAt ||
            athlete.updatedAt ||
            new Date().toISOString()
    }));

    const trainingActivities =
        app.trainingRecords.map((record) => ({
            type: "훈련 기록",
            title:
                `${record.athleteName || "선수"} · ` +
                `${record.name || record.type || "훈련"}`,
            date:
                record.createdAt ||
                record.date ||
                new Date().toISOString()
        }));

    const liveActivities =
        app.liveAnalyses.map((analysis) => ({
            type: "실시간 분석",
            title:
                `${analysis.athleteName || "선수"} · ` +
                `${analysis.movement || "동작 분석"}`,
            date:
                analysis.createdAt ||
                new Date().toISOString()
        }));

    const videoActivities =
        app.videoAnalyses.map((analysis) => ({
            type: "영상 분석",
            title:
                `${analysis.athleteName || "선수"} · ` +
                `${analysis.movement || "영상 분석"}`,
            date:
                analysis.createdAt ||
                new Date().toISOString()
        }));

    return [
        ...athleteActivities,
        ...trainingActivities,
        ...liveActivities,
        ...videoActivities
    ]
        .sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        })
        .slice(0, 8);
}

/* =========================================
   대시보드
========================================= */

function updateDashboard() {
    const athleteCount = $("dashboardAthleteCount");
    const sportsCount = $("dashboardSportsCount");
    const analysisCount = $("dashboardAnalysisCount");
    const reportCount = $("dashboardReportCount");

    if (athleteCount) {
        athleteCount.textContent = app.athletes.length;
    }

    if (sportsCount) {
        sportsCount.textContent =
            app.sportsRecords.length +
            app.trainingRecords.length;
    }

    if (analysisCount) {
        analysisCount.textContent =
            getTotalAnalysisCount();
    }

    if (reportCount) {
        reportCount.textContent = app.reports.length;
    }

    renderRecentActivities();
}

/* =========================================
   최근 활동
========================================= */

function renderRecentActivities() {
    const container = $("recentActivityList");

    if (!container) {
        return;
    }

    const activities = getRecentActivities();

    if (activities.length === 0) {
        container.className = "empty-state";
        container.textContent =
            "아직 저장된 활동이 없습니다.";

        return;
    }

    container.className = "activity-list";

    container.innerHTML = activities
        .map((activity) => {
            return `
                <article class="activity-item">
                    <div>
                        <strong>
                            ${escapeHTML(activity.title)}
                        </strong>

                        <small>
                            ${escapeHTML(activity.type)}
                        </small>
                    </div>

                    <time>
                        ${escapeHTML(
                            formatDateTime(activity.date)
                        )}
                    </time>
                </article>
            `;
        })
        .join("");
}

/* =========================================
   전체 화면 새로고침
========================================= */

function refreshAllScreens() {
    updateDashboard();
    renderAthleteTable();
    renderAthleteSelects();
    renderTrainingRecords();
    updateCollegeDashboard();
    renderRanking();
}

/* =========================================
   자동 저장
========================================= */

setInterval(() => {
    saveAppData();
}, 30000);

window.addEventListener("beforeunload", () => {
    saveAppData();
});

/* =========================================
   시작
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    loadAppData();

    initializeNavigation();
    initializeMobileSidebar();

    updateClock();
    setInterval(updateClock, 1000);

    setDefaultDates();

    refreshAllScreens();

    openPage("dashboard");

    setTimeout(() => {
        $("loadingScreen")?.classList.add("hide");
    }, 700);
});
/* =========================================
   설천고 스포츠과학센터 PRO
   main.js Part 2
   선수 등록·수정·삭제
========================================= */

/* =========================================
   선수 찾기
========================================= */

function getAthleteById(athleteId) {
    return app.athletes.find((athlete) => {
        return athlete.id === athleteId;
    });
}

/* =========================================
   선수 이름 가져오기
========================================= */

function getAthleteName(athleteId) {
    const athlete = getAthleteById(athleteId);

    return athlete?.name || "선수 정보 없음";
}

/* =========================================
   숫자 입력 변환
========================================= */

function parseOptionalNumber(value) {
    if (value === "" || value === null || value === undefined) {
        return null;
    }

    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : null;
}

/* =========================================
   선수 입력값 가져오기
========================================= */

function getAthleteFormData() {
    return {
        name: $("athleteNameInput")?.value.trim() || "",

        gender:
            $("athleteGenderInput")?.value ||
            "선택 안 함",

        birth:
            $("athleteBirthInput")?.value ||
            "",

        team:
            $("athleteTeamInput")?.value.trim() ||
            "",

        sport:
            $("athleteSportInput")?.value ||
            "기타",

        detail:
            $("athleteDetailInput")?.value.trim() ||
            "",

        height: parseOptionalNumber(
            $("athleteHeightInput")?.value
        ),

        weight: parseOptionalNumber(
            $("athleteWeightInput")?.value
        ),

        memo:
            $("athleteMemoInput")?.value.trim() ||
            ""
    };
}

/* =========================================
   선수 입력 검사
========================================= */

function validateAthleteData(data) {
    if (!data.name) {
        showToast(
            "선수 이름을 입력하세요.",
            "error"
        );

        $("athleteNameInput")?.focus();

        return false;
    }

    if (
        data.height !== null &&
        (data.height < 50 || data.height > 250)
    ) {
        showToast(
            "신장은 50cm 이상 250cm 이하로 입력하세요.",
            "error"
        );

        $("athleteHeightInput")?.focus();

        return false;
    }

    if (
        data.weight !== null &&
        (data.weight < 10 || data.weight > 300)
    ) {
        showToast(
            "체중은 10kg 이상 300kg 이하로 입력하세요.",
            "error"
        );

        $("athleteWeightInput")?.focus();

        return false;
    }

    return true;
}

/* =========================================
   선수 저장
========================================= */

function saveAthlete(event) {
    event.preventDefault();

    const data = getAthleteFormData();

    if (!validateAthleteData(data)) {
        return;
    }

    const editId =
        $("athleteEditId")?.value || "";

    const now =
        new Date().toISOString();

    if (editId) {
        const athlete =
            getAthleteById(editId);

        if (!athlete) {
            showToast(
                "수정할 선수를 찾지 못했습니다.",
                "error"
            );

            resetAthleteForm();

            return;
        }

        Object.assign(
            athlete,
            data,
            {
                updatedAt: now
            }
        );

        showToast(
            "선수 정보가 수정되었습니다."
        );
    } else {
        app.athletes.push({
            id: createId("athlete"),

            ...data,

            createdAt: now,
            updatedAt: now
        });

        showToast(
            "선수가 등록되었습니다."
        );
    }

    saveAppData();

    resetAthleteForm();
    refreshAllScreens();
}

/* =========================================
   선수 수정 시작
========================================= */

function startAthleteEdit(athleteId) {
    const athlete =
        getAthleteById(athleteId);

    if (!athlete) {
        showToast(
            "선수 정보를 찾지 못했습니다.",
            "error"
        );

        return;
    }

    $("athleteEditId").value =
        athlete.id;

    $("athleteNameInput").value =
        athlete.name || "";

    $("athleteGenderInput").value =
        athlete.gender || "선택 안 함";

    $("athleteBirthInput").value =
        athlete.birth || "";

    $("athleteTeamInput").value =
        athlete.team || "";

    $("athleteSportInput").value =
        athlete.sport || "기타";

    $("athleteDetailInput").value =
        athlete.detail || "";

    $("athleteHeightInput").value =
        athlete.height ?? "";

    $("athleteWeightInput").value =
        athlete.weight ?? "";

    $("athleteMemoInput").value =
        athlete.memo || "";

    const saveButton =
        $("saveAthleteButton");

    const cancelButton =
        $("cancelAthleteEditButton");

    if (saveButton) {
        saveButton.textContent =
            "선수 정보 수정";
    }

    if (cancelButton) {
        cancelButton.hidden = false;
    }

    $("athleteNameInput")?.focus();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

/* =========================================
   선수 입력 초기화
========================================= */

function resetAthleteForm() {
    $("athleteForm")?.reset();

    const editInput =
        $("athleteEditId");

    if (editInput) {
        editInput.value = "";
    }

    const sportInput =
        $("athleteSportInput");

    if (sportInput) {
        sportInput.value =
            "바이애슬론";
    }

    const genderInput =
        $("athleteGenderInput");

    if (genderInput) {
        genderInput.value =
            "남자";
    }

    const saveButton =
        $("saveAthleteButton");

    if (saveButton) {
        saveButton.textContent =
            "선수 저장";
    }

    const cancelButton =
        $("cancelAthleteEditButton");

    if (cancelButton) {
        cancelButton.hidden = true;
    }
}

/* =========================================
   선수 삭제
========================================= */

function deleteAthlete(athleteId) {
    const athlete =
        getAthleteById(athleteId);

    if (!athlete) {
        showToast(
            "선수 정보를 찾지 못했습니다.",
            "error"
        );

        return;
    }

    const confirmed = confirm(
        `${athlete.name} 선수와 연결된 기록을 모두 삭제하시겠습니까?`
    );

    if (!confirmed) {
        return;
    }

    app.athletes = app.athletes.filter(
        (item) => item.id !== athleteId
    );

    app.trainingRecords =
        app.trainingRecords.filter(
            (record) =>
                record.athleteId !== athleteId
        );

    app.sportsRecords =
        app.sportsRecords.filter(
            (record) =>
                record.athleteId !== athleteId
        );

    app.liveAnalyses =
        app.liveAnalyses.filter(
            (analysis) =>
                analysis.athleteId !== athleteId
        );

    app.videoAnalyses =
        app.videoAnalyses.filter(
            (analysis) =>
                analysis.athleteId !== athleteId
        );

    app.collegeRecords =
        app.collegeRecords.filter(
            (record) =>
                record.athleteId !== athleteId
        );

    app.nationalComparisons =
        app.nationalComparisons.filter(
            (comparison) =>
                comparison.athleteId !== athleteId
        );

    app.reports =
        app.reports.filter(
            (report) =>
                report.athleteId !== athleteId
        );

    saveAppData();

    resetAthleteForm();
    refreshAllScreens();

    showToast(
        "선수와 연결 기록이 삭제되었습니다."
    );
}

/* =========================================
   선수 신체 정보 표시
========================================= */

function formatAthleteMeasurement(
    value,
    unit
) {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "-";
    }

    return `${value}${unit}`;
}

/* =========================================
   선수 표
========================================= */

function renderAthleteTable() {
    const tableBody =
        $("athleteTableBody");

    const count =
        $("athleteListCount");

    if (count) {
        count.textContent =
            `${app.athletes.length}명`;
    }

    if (!tableBody) {
        return;
    }

    if (app.athletes.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    class="table-empty">
                    등록된 선수가 없습니다.
                </td>
            </tr>
        `;

        return;
    }

    tableBody.innerHTML = app.athletes
        .map((athlete) => {
            return `
                <tr>
                    <td>
                        <strong>
                            ${escapeHTML(athlete.name)}
                        </strong>

                        ${
                            athlete.team
                                ? `
                                    <br>
                                    <small>
                                        ${escapeHTML(athlete.team)}
                                    </small>
                                `
                                : ""
                        }
                    </td>

                    <td>
                        ${escapeHTML(
                            athlete.sport || "-"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            athlete.detail || "-"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            formatAthleteMeasurement(
                                athlete.height,
                                "cm"
                            )
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            formatAthleteMeasurement(
                                athlete.weight,
                                "kg"
                            )
                        )}
                    </td>

                    <td>
                        <button
                            type="button"
                            data-athlete-action="edit"
                            data-athlete-id="${escapeHTML(
                                athlete.id
                            )}">
                            수정
                        </button>

                        <button
                            type="button"
                            class="danger"
                            data-athlete-action="delete"
                            data-athlete-id="${escapeHTML(
                                athlete.id
                            )}">
                            삭제
                        </button>
                    </td>
                </tr>
            `;
        })
        .join("");
}

/* =========================================
   선수 선택창
========================================= */

function renderAthleteSelects() {
    const selects =
        $all(".athlete-select");

    selects.forEach((select) => {
        const previousValue =
            select.value;

        const options = [
            `<option value="">선수 선택</option>`,

            ...app.athletes.map(
                (athlete) => {
                    return `
                        <option value="${escapeHTML(
                            athlete.id
                        )}">
                            ${escapeHTML(
                                athlete.name
                            )}
                            ${
                                athlete.sport
                                    ? ` · ${escapeHTML(
                                        athlete.sport
                                    )}`
                                    : ""
                            }
                        </option>
                    `;
                }
            )
        ];

        select.innerHTML =
            options.join("");

        const previousExists =
            app.athletes.some(
                (athlete) =>
                    athlete.id ===
                    previousValue
            );

        if (previousExists) {
            select.value =
                previousValue;
        }
    });
}

/* =========================================
   선수 표 버튼 이벤트
========================================= */

function handleAthleteTableClick(event) {
    const button = event.target.closest(
        "[data-athlete-action]"
    );

    if (!button) {
        return;
    }

    const athleteId =
        button.dataset.athleteId;

    const action =
        button.dataset.athleteAction;

    if (action === "edit") {
        startAthleteEdit(athleteId);
    }

    if (action === "delete") {
        deleteAthlete(athleteId);
    }
}

/* =========================================
   선수 기능 시작
========================================= */

function initializeAthleteManagement() {
    $("athleteForm")?.addEventListener(
        "submit",
        saveAthlete
    );

    $("cancelAthleteEditButton")
        ?.addEventListener(
            "click",
            resetAthleteForm
        );

    $("athleteTableBody")
        ?.addEventListener(
            "click",
            handleAthleteTableClick
        );
}

/* =========================================
   선수 기능 초기화
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {
        initializeAthleteManagement();
        renderAthleteTable();
        renderAthleteSelects();
    }
);
/* =========================================
   설천고 스포츠과학센터 PRO
   main.js Part 3
   전체 스포츠 종목·세부 동작
========================================= */

/* =========================================
   스포츠 종목 데이터
========================================= */

const SPORTS_DATABASE = [
    {
        id: "biathlon",
        name: "바이애슬론",
        icon: "🎿",
        description: "스키 주행과 사격 동작 분석",
        movements: [
            "프리스타일 주행",
            "클래식 주행",
            "더블폴링",
            "오르막 주행",
            "내리막 자세",
            "평지 스케이팅",
            "코너링",
            "출발 동작",
            "스프린트 주행",
            "복사 사격 자세",
            "입사 사격 자세",
            "호흡 안정",
            "방아쇠 당기기",
            "사격 후 출발",
            "롤러스키 주행"
        ]
    },

    {
        id: "cross-country-skiing",
        name: "크로스컨트리 스키",
        icon: "⛷️",
        description: "클래식·스케이팅 기술 분석",
        movements: [
            "클래식 다이애고널",
            "더블폴링",
            "킥 더블폴링",
            "V1 스케이팅",
            "V2 스케이팅",
            "V2 얼터네이트",
            "오르막 주행",
            "내리막 자세",
            "코너링",
            "출발 동작",
            "스프린트",
            "롤러스키"
        ]
    },

    {
        id: "track-field",
        name: "육상",
        icon: "🏃",
        description: "달리기·도약·투척 분석",
        movements: [
            "단거리 출발",
            "100m 달리기",
            "200m 달리기",
            "400m 달리기",
            "중거리 달리기",
            "장거리 달리기",
            "허들",
            "계주 배턴 전달",
            "제자리멀리뛰기",
            "멀리뛰기",
            "높이뛰기",
            "세단뛰기",
            "포환던지기",
            "창던지기",
            "원반던지기"
        ]
    },

    {
        id: "soccer",
        name: "축구",
        icon: "⚽",
        description: "킥·드리블·민첩성 분석",
        movements: [
            "인사이드 패스",
            "인스텝 킥",
            "슈팅",
            "프리킥",
            "드리블",
            "방향 전환",
            "헤딩",
            "스프린트",
            "수비 자세",
            "태클",
            "골키퍼 다이빙",
            "골키퍼 킥"
        ]
    },

    {
        id: "basketball",
        name: "농구",
        icon: "🏀",
        description: "슈팅·드리블·점프 분석",
        movements: [
            "점프슛",
            "3점슛",
            "자유투",
            "레이업",
            "플로터",
            "드리블",
            "크로스오버",
            "패스",
            "리바운드 점프",
            "수비 자세",
            "방향 전환",
            "스프린트"
        ]
    },

    {
        id: "volleyball",
        name: "배구",
        icon: "🏐",
        description: "서브·스파이크·블로킹 분석",
        movements: [
            "언더핸드 패스",
            "오버핸드 토스",
            "스파이크",
            "점프 서브",
            "플로터 서브",
            "블로킹",
            "리시브",
            "수비 자세",
            "어프로치 스텝",
            "점프 착지"
        ]
    },

    {
        id: "baseball",
        name: "야구",
        icon: "⚾",
        description: "투구·타격·수비 동작 분석",
        movements: [
            "투구",
            "와인드업",
            "세트 포지션",
            "타격",
            "스윙 궤적",
            "번트",
            "송구",
            "포구",
            "도루 출발",
            "주루",
            "포수 송구",
            "수비 자세"
        ]
    },

    {
        id: "handball",
        name: "핸드볼",
        icon: "🤾",
        description: "점프슛·패스·수비 분석",
        movements: [
            "점프슛",
            "스탠딩 슛",
            "사이드 슛",
            "패스",
            "드리블",
            "페인트 동작",
            "수비 자세",
            "블로킹",
            "속공",
            "골키퍼 방어"
        ]
    },

    {
        id: "swimming",
        name: "수영",
        icon: "🏊",
        description: "영법별 자세와 스트로크 분석",
        movements: [
            "자유형",
            "배영",
            "평영",
            "접영",
            "스타트",
            "턴",
            "돌핀킥",
            "스트로크",
            "호흡 타이밍",
            "수중 자세"
        ]
    },

    {
        id: "taekwondo",
        name: "태권도",
        icon: "🥋",
        description: "발차기·품새·균형 분석",
        movements: [
            "앞차기",
            "돌려차기",
            "옆차기",
            "뒤차기",
            "후려차기",
            "나래차기",
            "품새",
            "겨루기 스텝",
            "방어 자세",
            "회전 동작"
        ]
    },

    {
        id: "judo",
        name: "유도",
        icon: "🥋",
        description: "메치기·균형·낙법 분석",
        movements: [
            "업어치기",
            "허리후리기",
            "밭다리후리기",
            "안다리후리기",
            "배대뒤치기",
            "잡기 자세",
            "균형 무너뜨리기",
            "전방 낙법",
            "후방 낙법",
            "측방 낙법"
        ]
    },

    {
        id: "wrestling",
        name: "레슬링",
        icon: "🤼",
        description: "태클·방어·중심 이동 분석",
        movements: [
            "싱글렉 태클",
            "더블렉 태클",
            "태클 방어",
            "그라운드 자세",
            "브리지",
            "들어올리기",
            "회전 동작",
            "중심 이동",
            "스탠스",
            "스프롤"
        ]
    },

    {
        id: "boxing",
        name: "복싱",
        icon: "🥊",
        description: "펀치·스텝·방어 자세 분석",
        movements: [
            "잽",
            "스트레이트",
            "훅",
            "어퍼컷",
            "원투",
            "풋워크",
            "위빙",
            "더킹",
            "가드 자세",
            "회피 동작"
        ]
    },

    {
        id: "badminton",
        name: "배드민턴",
        icon: "🏸",
        description: "스윙·스텝·점프 분석",
        movements: [
            "클리어",
            "스매시",
            "드롭",
            "헤어핀",
            "드라이브",
            "서브",
            "백핸드",
            "풋워크",
            "점프 스매시",
            "수비 자세"
        ]
    },

    {
        id: "tennis",
        name: "테니스",
        icon: "🎾",
        description: "스트로크·서브·풋워크 분석",
        movements: [
            "포핸드",
            "백핸드",
            "서브",
            "발리",
            "스매시",
            "슬라이스",
            "탑스핀",
            "풋워크",
            "리턴",
            "준비 자세"
        ]
    },

    {
        id: "table-tennis",
        name: "탁구",
        icon: "🏓",
        description: "스윙·회전·풋워크 분석",
        movements: [
            "포핸드 드라이브",
            "백핸드 드라이브",
            "포핸드 커트",
            "백핸드 커트",
            "서브",
            "리시브",
            "스매시",
            "플릭",
            "풋워크",
            "준비 자세"
        ]
    },

    {
        id: "golf",
        name: "골프",
        icon: "🏌️",
        description: "스윙 단계와 체중 이동 분석",
        movements: [
            "어드레스",
            "테이크백",
            "백스윙",
            "다운스윙",
            "임팩트",
            "팔로스루",
            "드라이버 스윙",
            "아이언 스윙",
            "퍼팅",
            "체중 이동"
        ]
    },

    {
        id: "archery",
        name: "양궁",
        icon: "🏹",
        description: "조준·균형·릴리스 분석",
        movements: [
            "스탠스",
            "활 들기",
            "당기기",
            "앵커링",
            "조준",
            "릴리스",
            "팔로스루",
            "어깨 정렬",
            "상체 균형",
            "호흡 안정"
        ]
    },

    {
        id: "shooting",
        name: "사격",
        icon: "🎯",
        description: "자세·조준·방아쇠 동작 분석",
        movements: [
            "소총 입사",
            "소총 복사",
            "소총 슬사",
            "권총 자세",
            "조준",
            "호흡 조절",
            "방아쇠 당기기",
            "반동 제어",
            "상체 균형",
            "사격 후 유지"
        ]
    },

    {
        id: "cycling",
        name: "사이클",
        icon: "🚴",
        description: "페달링·자세·출력 동작 분석",
        movements: [
            "로드 페달링",
            "트랙 페달링",
            "스프린트",
            "업힐",
            "다운힐",
            "코너링",
            "댄싱",
            "출발",
            "상체 자세",
            "무릎 정렬"
        ]
    },

    {
        id: "rowing",
        name: "조정",
        icon: "🚣",
        description: "스트로크와 전신 협응 분석",
        movements: [
            "캐치",
            "드라이브",
            "피니시",
            "리커버리",
            "스트로크 연결",
            "상체 각도",
            "다리 밀기",
            "팔 당기기",
            "리듬",
            "실내 로잉"
        ]
    },

    {
        id: "gymnastics",
        name: "체조",
        icon: "🤸",
        description: "균형·회전·착지 분석",
        movements: [
            "물구나무서기",
            "앞구르기",
            "뒤구르기",
            "측전",
            "핸드스프링",
            "공중회전",
            "도마 도움닫기",
            "철봉 스윙",
            "평균대 균형",
            "착지"
        ]
    },

    {
        id: "weightlifting",
        name: "역도",
        icon: "🏋️",
        description: "인상·용상과 관절 정렬 분석",
        movements: [
            "인상",
            "클린",
            "저크",
            "클린앤저크",
            "퍼스트 풀",
            "세컨드 풀",
            "캐치",
            "오버헤드 자세",
            "프론트 스쿼트",
            "리프팅 착지"
        ]
    },

    {
        id: "strength-training",
        name: "웨이트트레이닝",
        icon: "💪",
        description: "근력 운동 자세와 반복 분석",
        movements: [
            "백 스쿼트",
            "프론트 스쿼트",
            "데드리프트",
            "벤치프레스",
            "오버헤드 프레스",
            "바벨 로우",
            "런지",
            "불가리안 스플릿 스쿼트",
            "풀업",
            "푸시업",
            "힙 스러스트",
            "파워 클린"
        ]
    },

    {
        id: "functional-training",
        name: "기능성 훈련",
        icon: "⚡",
        description: "코어·민첩성·플라이오메트릭 분석",
        movements: [
            "플랭크",
            "사이드 플랭크",
            "버드독",
            "데드버그",
            "박스 점프",
            "버피",
            "스케이터 점프",
            "사다리 훈련",
            "콘 방향 전환",
            "메디신볼 던지기",
            "밸런스 훈련",
            "싱글레그 스쿼트"
        ]
    },

    {
        id: "physical-education-entrance",
        name: "체대입시",
        icon: "🎓",
        description: "대학 실기 종목별 기록·자세 분석",
        movements: [
            "제자리멀리뛰기",
            "서전트 점프",
            "10m 왕복달리기",
            "20m 왕복달리기",
            "100m 달리기",
            "좌전굴",
            "배근력",
            "악력",
            "윗몸일으키기",
            "메디신볼 던지기",
            "농구 드리블",
            "농구 레이업",
            "축구 드리블",
            "핸드볼 던지기",
            "수영",
            "체조"
        ]
    },

    {
        id: "other",
        name: "기타 종목",
        icon: "➕",
        description: "목록에 없는 스포츠 동작 분석",
        movements: [
            "기본 자세",
            "달리기",
            "점프",
            "착지",
            "회전",
            "던지기",
            "스윙",
            "균형",
            "민첩성",
            "사용자 지정 동작"
        ]
    }
];

/* =========================================
   스포츠 찾기
========================================= */

function getSportById(sportId) {
    return SPORTS_DATABASE.find((sport) => {
        return sport.id === sportId;
    });
}

function getSportByName(sportName) {
    return SPORTS_DATABASE.find((sport) => {
        return sport.name === sportName;
    });
}

/* =========================================
   종목 카드 렌더링
========================================= */

function renderSportsCategories() {
    const container =
        $("sportsCategoryList");

    if (!container) {
        return;
    }

    container.innerHTML =
        SPORTS_DATABASE.map((sport) => {
            const isActive =
                app.settings.selectedSport ===
                sport.id;

            return `
                <button
                    type="button"
                    class="sport-category-button ${
                        isActive ? "active" : ""
                    }"
                    data-sport-id="${escapeHTML(
                        sport.id
                    )}">

                    <span class="sport-category-icon">
                        ${escapeHTML(sport.icon)}
                    </span>

                    <div>
                        <strong>
                            ${escapeHTML(sport.name)}
                        </strong>

                        <small>
                            ${escapeHTML(
                                sport.description
                            )}
                        </small>
                    </div>

                </button>
            `;
        }).join("");

    renderSelectedSportMovements();
}

/* =========================================
   종목 선택
========================================= */

function selectSport(sportId) {
    const sport =
        getSportById(sportId);

    if (!sport) {
        showToast(
            "스포츠 종목을 찾지 못했습니다.",
            "error"
        );

        return;
    }

    app.settings.selectedSport =
        sport.id;

    app.settings.selectedMovement = "";

    saveAppData();

    renderSportsCategories();

    setAnalysisSportSelection(
        sport.id,
        ""
    );
}

/* =========================================
   세부 동작 표시
========================================= */

function renderSelectedSportMovements() {
    const title =
        $("selectedSportTitle");

    const container =
        $("selectedSportMovements");

    if (!title || !container) {
        return;
    }

    const sport =
        getSportById(
            app.settings.selectedSport
        );

    if (!sport) {
        title.textContent =
            "종목을 선택하세요";

        container.className =
            "movement-grid empty-state";

        container.textContent =
            "스포츠 종목을 선택하면 세부 분석 동작이 표시됩니다.";

        return;
    }

    title.textContent =
        `${sport.icon} ${sport.name}`;

    container.className =
        "movement-grid";

    container.innerHTML =
        sport.movements.map((movement) => {
            const isActive =
                app.settings.selectedMovement ===
                movement;

            return `
                <button
                    type="button"
                    class="movement-button ${
                        isActive ? "active" : ""
                    }"
                    data-movement-name="${escapeHTML(
                        movement
                    )}">
                    ${escapeHTML(movement)}
                </button>
            `;
        }).join("");
}

/* =========================================
   세부 동작 선택
========================================= */

function selectMovement(movementName) {
    const sport =
        getSportById(
            app.settings.selectedSport
        );

    if (
        !sport ||
        !sport.movements.includes(movementName)
    ) {
        showToast(
            "세부 동작을 찾지 못했습니다.",
            "error"
        );

        return;
    }

    app.settings.selectedMovement =
        movementName;

    saveAppData();

    renderSelectedSportMovements();

    setAnalysisSportSelection(
        sport.id,
        movementName
    );

    showToast(
        `${sport.name} · ${movementName} 선택 완료`
    );
}

/* =========================================
   종목 카드 클릭
========================================= */

function handleSportsCategoryClick(event) {
    const button = event.target.closest(
        "[data-sport-id]"
    );

    if (!button) {
        return;
    }

    selectSport(
        button.dataset.sportId
    );
}

/* =========================================
   동작 버튼 클릭
========================================= */

function handleMovementClick(event) {
    const button = event.target.closest(
        "[data-movement-name]"
    );

    if (!button) {
        return;
    }

    selectMovement(
        button.dataset.movementName
    );
}

/* =========================================
   종목 선택창 목록
========================================= */

function renderSportSelect(
    select,
    includePlaceholder = true
) {
    if (!select) {
        return;
    }

    const previousValue =
        select.value;

    const options = [];

    if (includePlaceholder) {
        options.push(
            `<option value="">종목 선택</option>`
        );
    }

    SPORTS_DATABASE.forEach((sport) => {
        options.push(`
            <option value="${escapeHTML(
                sport.id
            )}">
                ${escapeHTML(sport.name)}
            </option>
        `);
    });

    select.innerHTML =
        options.join("");

    if (
        previousValue &&
        getSportById(previousValue)
    ) {
        select.value =
            previousValue;
    }
}

/* =========================================
   세부 동작 선택창 목록
========================================= */

function renderMovementSelect(
    sportSelect,
    movementSelect,
    placeholder = "동작 선택"
) {
    if (!sportSelect || !movementSelect) {
        return;
    }

    const sport =
        getSportById(sportSelect.value);

    const previousValue =
        movementSelect.value;

    if (!sport) {
        movementSelect.innerHTML = `
            <option value="">
                ${escapeHTML(placeholder)}
            </option>
        `;

        movementSelect.disabled = true;

        return;
    }

    movementSelect.disabled = false;

    movementSelect.innerHTML = [
        `
            <option value="">
                ${escapeHTML(placeholder)}
            </option>
        `,

        ...sport.movements.map(
            (movement) => {
                return `
                    <option value="${escapeHTML(
                        movement
                    )}">
                        ${escapeHTML(movement)}
                    </option>
                `;
            }
        )
    ].join("");

    if (
        previousValue &&
        sport.movements.includes(previousValue)
    ) {
        movementSelect.value =
            previousValue;
    }
}

/* =========================================
   분석 화면 종목 연결
========================================= */

const ANALYSIS_SELECT_GROUPS = [
    {
        sportId: "liveSportSelect",
        movementId: "liveMovementSelect",
        placeholder: "동작 선택"
    },

    {
        sportId: "videoSportSelect",
        movementId: "videoMovementSelect",
        placeholder: "동작 선택"
    },

    {
        sportId: "nationalSportSelect",
        movementId: "nationalMovementSelect",
        placeholder: "세부 항목 선택"
    }
];

/* =========================================
   분석 종목 선택 초기화
========================================= */

function initializeAnalysisSportSelects() {
    ANALYSIS_SELECT_GROUPS.forEach(
        (group) => {
            const sportSelect =
                $(group.sportId);

            const movementSelect =
                $(group.movementId);

            if (
                !sportSelect ||
                !movementSelect
            ) {
                return;
            }

            renderSportSelect(
                sportSelect,
                true
            );

            renderMovementSelect(
                sportSelect,
                movementSelect,
                group.placeholder
            );

            sportSelect.addEventListener(
                "change",
                () => {
                    renderMovementSelect(
                        sportSelect,
                        movementSelect,
                        group.placeholder
                    );
                }
            );
        }
    );

    renderRankingSportFilter();
}

/* =========================================
   선택 종목을 분석 화면에 반영
========================================= */

function setAnalysisSportSelection(
    sportId,
    movementName
) {
    ANALYSIS_SELECT_GROUPS.forEach(
        (group) => {
            const sportSelect =
                $(group.sportId);

            const movementSelect =
                $(group.movementId);

            if (
                !sportSelect ||
                !movementSelect
            ) {
                return;
            }

            sportSelect.value =
                sportId;

            renderMovementSelect(
                sportSelect,
                movementSelect,
                group.placeholder
            );

            const sport =
                getSportById(sportId);

            if (
                sport &&
                sport.movements.includes(
                    movementName
                )
            ) {
                movementSelect.value =
                    movementName;
            }
        }
    );
}

/* =========================================
   랭킹 종목 필터
========================================= */

function renderRankingSportFilter() {
    const filter =
        $("rankingSportFilter");

    if (!filter) {
        return;
    }

    const previousValue =
        filter.value || "전체";

    filter.innerHTML = [
        `<option value="전체">전체 종목</option>`,

        ...SPORTS_DATABASE.map((sport) => {
            return `
                <option value="${escapeHTML(
                    sport.id
                )}">
                    ${escapeHTML(sport.name)}
                </option>
            `;
        })
    ].join("");

    if (
        previousValue === "전체" ||
        getSportById(previousValue)
    ) {
        filter.value =
            previousValue;
    }
}

/* =========================================
   선수 등록 종목 선택창 동기화
========================================= */

function renderAthleteSportInput() {
    const select =
        $("athleteSportInput");

    if (!select) {
        return;
    }

    const previousValue =
        select.value ||
        "바이애슬론";

    select.innerHTML =
        SPORTS_DATABASE.map((sport) => {
            return `
                <option value="${escapeHTML(
                    sport.name
                )}">
                    ${escapeHTML(sport.name)}
                </option>
            `;
        }).join("");

    if (
        getSportByName(previousValue)
    ) {
        select.value =
            previousValue;
    } else {
        select.value =
            "바이애슬론";
    }
}

/* =========================================
   스포츠 기능 시작
========================================= */

function initializeSportsManagement() {
    $("sportsCategoryList")
        ?.addEventListener(
            "click",
            handleSportsCategoryClick
        );

    $("selectedSportMovements")
        ?.addEventListener(
            "click",
            handleMovementClick
        );

    initializeAnalysisSportSelects();

    renderAthleteSportInput();

    if (
        app.settings.selectedSport &&
        getSportById(
            app.settings.selectedSport
        )
    ) {
        setAnalysisSportSelection(
            app.settings.selectedSport,
            app.settings.selectedMovement
        );
    }
}

/* =========================================
   스포츠 기능 초기화
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {
        initializeSportsManagement();
        renderSportsCategories();
    }
);
/* =========================================
   설천고 스포츠과학센터 PRO
   main.js Part 4
   훈련 기록 저장·삭제·목록
========================================= */

/* =========================================
   훈련 입력값
========================================= */

function getTrainingFormData() {
    const athleteId =
        $("trainingAthleteSelect")?.value || "";

    const athlete =
        getAthleteById(athleteId);

    return {
        athleteId,

        athleteName:
            athlete?.name || "",

        type:
            $("trainingTypeInput")?.value ||
            "스포츠 훈련",

        name:
            $("trainingNameInput")?.value.trim() ||
            "",

        date:
            $("trainingDateInput")?.value ||
            getTodayString(),

        duration: parseOptionalNumber(
            $("trainingDurationInput")?.value
        ),

        intensity:
            $("trainingIntensityInput")?.value ||
            "보통",

        memo:
            $("trainingMemoInput")?.value.trim() ||
            ""
    };
}

/* =========================================
   훈련 입력 검사
========================================= */

function validateTrainingData(data) {
    if (!data.athleteId) {
        showToast(
            "훈련 기록을 저장할 선수를 선택하세요.",
            "error"
        );

        $("trainingAthleteSelect")?.focus();

        return false;
    }

    if (!getAthleteById(data.athleteId)) {
        showToast(
            "선수 정보를 찾지 못했습니다.",
            "error"
        );

        return false;
    }

    if (!data.name) {
        showToast(
            "훈련 종목을 입력하세요.",
            "error"
        );

        $("trainingNameInput")?.focus();

        return false;
    }

    if (!data.date) {
        showToast(
            "훈련 날짜를 입력하세요.",
            "error"
        );

        $("trainingDateInput")?.focus();

        return false;
    }

    if (
        data.duration !== null &&
        (
            data.duration < 0 ||
            data.duration > 1440
        )
    ) {
        showToast(
            "훈련 시간은 0분 이상 1440분 이하로 입력하세요.",
            "error"
        );

        $("trainingDurationInput")?.focus();

        return false;
    }

    return true;
}

/* =========================================
   훈련 기록 저장
========================================= */

function saveTrainingRecord() {
    const data =
        getTrainingFormData();

    if (!validateTrainingData(data)) {
        return;
    }

    const now =
        new Date().toISOString();

    app.trainingRecords.push({
        id: createId("training"),

        ...data,

        createdAt: now,
        updatedAt: now
    });

    saveAppData();

    resetTrainingForm();
    refreshAllScreens();

    showToast(
        "훈련 기록이 저장되었습니다."
    );
}

/* =========================================
   훈련 입력 초기화
========================================= */

function resetTrainingForm() {
    const selectedAthleteId =
        $("trainingAthleteSelect")?.value || "";

    const typeInput =
        $("trainingTypeInput");

    const nameInput =
        $("trainingNameInput");

    const dateInput =
        $("trainingDateInput");

    const durationInput =
        $("trainingDurationInput");

    const intensityInput =
        $("trainingIntensityInput");

    const memoInput =
        $("trainingMemoInput");

    if (typeInput) {
        typeInput.value =
            "스포츠 훈련";
    }

    if (nameInput) {
        nameInput.value = "";
    }

    if (dateInput) {
        dateInput.value =
            getTodayString();
    }

    if (durationInput) {
        durationInput.value = "";
    }

    if (intensityInput) {
        intensityInput.value =
            "보통";
    }

    if (memoInput) {
        memoInput.value = "";
    }

    if ($("trainingAthleteSelect")) {
        $("trainingAthleteSelect").value =
            selectedAthleteId;
    }
}

/* =========================================
   훈련 기록 찾기
========================================= */

function getTrainingRecordById(recordId) {
    return app.trainingRecords.find(
        (record) =>
            record.id === recordId
    );
}

/* =========================================
   훈련 기록 삭제
========================================= */

function deleteTrainingRecord(recordId) {
    const record =
        getTrainingRecordById(recordId);

    if (!record) {
        showToast(
            "훈련 기록을 찾지 못했습니다.",
            "error"
        );

        return;
    }

    const confirmed = confirm(
        `${record.athleteName || "선수"}의 ` +
        `"${record.name}" 훈련 기록을 삭제하시겠습니까?`
    );

    if (!confirmed) {
        return;
    }

    app.trainingRecords =
        app.trainingRecords.filter(
            (item) =>
                item.id !== recordId
        );

    saveAppData();
    refreshAllScreens();

    showToast(
        "훈련 기록이 삭제되었습니다."
    );
}

/* =========================================
   훈련 강도 표시
========================================= */

function getIntensityLabel(intensity) {
    const labels = {
        낮음: "🟢 낮음",
        보통: "🔵 보통",
        높음: "🟠 높음",
        최고강도: "🔴 최고강도"
    };

    return labels[intensity] ||
        intensity ||
        "-";
}

/* =========================================
   훈련 기록 목록
========================================= */

function renderTrainingRecords() {
    const container =
        $("trainingRecordList");

    if (!container) {
        return;
    }

    const selectedAthleteId =
        $("trainingAthleteSelect")?.value || "";

    let records = [
        ...app.trainingRecords
    ];

    if (selectedAthleteId) {
        records = records.filter(
            (record) =>
                record.athleteId ===
                selectedAthleteId
        );
    }

    records.sort((a, b) => {
        const dateDifference =
            new Date(b.date) -
            new Date(a.date);

        if (dateDifference !== 0) {
            return dateDifference;
        }

        return (
            new Date(b.createdAt) -
            new Date(a.createdAt)
        );
    });

    if (records.length === 0) {
        container.className =
            "empty-state";

        container.textContent =
            selectedAthleteId
                ? "선택한 선수의 훈련 기록이 없습니다."
                : "저장된 훈련 기록이 없습니다.";

        return;
    }

    container.className =
        "training-record-list";

    container.innerHTML =
        records.map((record) => {
            const durationText =
                record.duration !== null &&
                record.duration !== undefined
                    ? `${record.duration}분`
                    : "시간 미입력";

            return `
                <article class="training-record-item">

                    <div class="panel-heading">

                        <div>
                            <strong>
                                ${escapeHTML(
                                    record.name ||
                                    "훈련"
                                )}
                            </strong>

                            <small>
                                ${escapeHTML(
                                    record.athleteName ||
                                    getAthleteName(
                                        record.athleteId
                                    )
                                )}
                            </small>
                        </div>

                        <button
                            type="button"
                            class="danger-button"
                            data-training-delete-id="${escapeHTML(
                                record.id
                            )}">
                            삭제
                        </button>

                    </div>

                    ${
                        record.memo
                            ? `
                                <p>
                                    ${escapeHTML(
                                        record.memo
                                    )}
                                </p>
                            `
                            : ""
                    }

                    <div class="training-record-meta">

                        <span>
                            📅 ${escapeHTML(
                                formatDate(record.date)
                            )}
                        </span>

                        <span>
                            🏷️ ${escapeHTML(
                                record.type || "-"
                            )}
                        </span>

                        <span>
                            ⏱️ ${escapeHTML(
                                durationText
                            )}
                        </span>

                        <span>
                            ${escapeHTML(
                                getIntensityLabel(
                                    record.intensity
                                )
                            )}
                        </span>

                    </div>

                </article>
            `;
        }).join("");
}

/* =========================================
   선수별 훈련 통계
========================================= */

function getAthleteTrainingRecords(
    athleteId
) {
    return app.trainingRecords.filter(
        (record) =>
            record.athleteId === athleteId
    );
}

function getAthleteTrainingCount(
    athleteId
) {
    return getAthleteTrainingRecords(
        athleteId
    ).length;
}

function getAthleteTotalTrainingMinutes(
    athleteId
) {
    return getAthleteTrainingRecords(
        athleteId
    ).reduce(
        (total, record) => {
            const duration =
                Number(record.duration);

            return Number.isFinite(duration)
                ? total + duration
                : total;
        },
        0
    );
}

/* =========================================
   훈련 목록 버튼
========================================= */

function handleTrainingRecordClick(event) {
    const deleteButton =
        event.target.closest(
            "[data-training-delete-id]"
        );

    if (!deleteButton) {
        return;
    }

    deleteTrainingRecord(
        deleteButton.dataset.trainingDeleteId
    );
}

/* =========================================
   훈련 기능 시작
========================================= */

function initializeTrainingManagement() {
    $("saveTrainingButton")
        ?.addEventListener(
            "click",
            saveTrainingRecord
        );

    $("trainingRecordList")
        ?.addEventListener(
            "click",
            handleTrainingRecordClick
        );

    $("trainingAthleteSelect")
        ?.addEventListener(
            "change",
            renderTrainingRecords
        );
}

/* =========================================
   훈련 기능 초기화
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {
        initializeTrainingManagement();
        renderTrainingRecords();
    }
);
/* =========================================
   설천고 스포츠과학센터 PRO
   main.js Part 5
   체대입시 기록·목표 달성률·자동 분석
========================================= */

/* =========================================
   체대입시 종목 설정
========================================= */

const COLLEGE_EVENT_CONFIG = {
    "제자리멀리뛰기": {
        unit: "cm",
        better: "higher"
    },

    "10m 왕복달리기": {
        unit: "초",
        better: "lower"
    },

    "20m 왕복달리기": {
        unit: "초",
        better: "lower"
    },

    "100m 달리기": {
        unit: "초",
        better: "lower"
    },

    "좌전굴": {
        unit: "cm",
        better: "higher"
    },

    "배근력": {
        unit: "kg",
        better: "higher"
    },

    "윗몸일으키기": {
        unit: "회",
        better: "higher"
    },

    "메디신볼 던지기": {
        unit: "m",
        better: "higher"
    },

    "농구": {
        unit: "점",
        better: "higher"
    },

    "축구": {
        unit: "점",
        better: "higher"
    },

    "기타": {
        unit: "",
        better: "higher"
    }
};

/* =========================================
   체대입시 종목 정보
========================================= */

function getCollegeEventConfig(eventName) {
    return COLLEGE_EVENT_CONFIG[eventName] || {
        unit: "",
        better: "higher"
    };
}

/* =========================================
   목표 달성률 계산
========================================= */

function calculateCollegeAchievement(
    currentRecord,
    goalRecord,
    betterDirection
) {
    const current = Number(currentRecord);
    const goal = Number(goalRecord);

    if (
        !Number.isFinite(current) ||
        !Number.isFinite(goal) ||
        current <= 0 ||
        goal <= 0
    ) {
        return 0;
    }

    let percent = 0;

    if (betterDirection === "lower") {
        percent = (goal / current) * 100;
    } else {
        percent = (current / goal) * 100;
    }

    return Math.max(
        0,
        Math.min(150, percent)
    );
}

/* =========================================
   예상 환산점수
========================================= */

function calculateCollegeExpectedScore(
    achievementPercent
) {
    const percent =
        Number(achievementPercent);

    if (!Number.isFinite(percent)) {
        return 0;
    }

    return Math.max(
        0,
        Math.min(
            100,
            Math.round(percent)
        )
    );
}

/* =========================================
   체대입시 등급
========================================= */

function getCollegeGrade(percent) {
    if (percent >= 110) {
        return "S";
    }

    if (percent >= 100) {
        return "A";
    }

    if (percent >= 90) {
        return "B";
    }

    if (percent >= 80) {
        return "C";
    }

    if (percent >= 70) {
        return "D";
    }

    return "준비 필요";
}

/* =========================================
   기록 차이 계산
========================================= */

function calculateCollegeGap(
    currentRecord,
    goalRecord,
    betterDirection
) {
    const current = Number(currentRecord);
    const goal = Number(goalRecord);

    if (
        !Number.isFinite(current) ||
        !Number.isFinite(goal)
    ) {
        return 0;
    }

    if (betterDirection === "lower") {
        return current - goal;
    }

    return goal - current;
}

/* =========================================
   체대입시 입력값
========================================= */

function getCollegeFormData() {
    const athleteId =
        $("collegeAthleteSelect")?.value || "";

    const athlete =
        getAthleteById(athleteId);

    const eventName =
        $("collegeEventInput")?.value ||
        "기타";

    const eventConfig =
        getCollegeEventConfig(eventName);

    const currentRecord =
        parseOptionalNumber(
            $("collegeCurrentRecordInput")?.value
        );

    const goalRecord =
        parseOptionalNumber(
            $("collegeGoalRecordInput")?.value
        );

    const achievementPercent =
        calculateCollegeAchievement(
            currentRecord,
            goalRecord,
            eventConfig.better
        );

    return {
        athleteId,

        athleteName:
            athlete?.name || "",

        collegeName:
            $("collegeNameInput")
                ?.value.trim() || "",

        department:
            $("collegeDepartmentInput")
                ?.value.trim() || "",

        eventName,

        currentRecord,

        goalRecord,

        unit:
            eventConfig.unit,

        betterDirection:
            eventConfig.better,

        achievementPercent:
            Number(
                achievementPercent.toFixed(1)
            ),

        expectedScore:
            calculateCollegeExpectedScore(
                achievementPercent
            ),

        grade:
            getCollegeGrade(
                achievementPercent
            )
    };
}

/* =========================================
   체대입시 입력 검사
========================================= */

function validateCollegeData(data) {
    if (!data.athleteId) {
        showToast(
            "체대입시 기록을 저장할 선수를 선택하세요.",
            "error"
        );

        $("collegeAthleteSelect")?.focus();

        return false;
    }

    if (!getAthleteById(data.athleteId)) {
        showToast(
            "선수 정보를 찾지 못했습니다.",
            "error"
        );

        return false;
    }

    if (!data.collegeName) {
        showToast(
            "목표 대학을 입력하세요.",
            "error"
        );

        $("collegeNameInput")?.focus();

        return false;
    }

    if (!data.department) {
        showToast(
            "목표 학과를 입력하세요.",
            "error"
        );

        $("collegeDepartmentInput")?.focus();

        return false;
    }

    if (
        data.currentRecord === null ||
        data.currentRecord <= 0
    ) {
        showToast(
            "현재 기록을 올바르게 입력하세요.",
            "error"
        );

        $("collegeCurrentRecordInput")?.focus();

        return false;
    }

    if (
        data.goalRecord === null ||
        data.goalRecord <= 0
    ) {
        showToast(
            "목표 기록을 올바르게 입력하세요.",
            "error"
        );

        $("collegeGoalRecordInput")?.focus();

        return false;
    }

    return true;
}

/* =========================================
   체대입시 기록 저장
========================================= */

function saveCollegeRecord() {
    const data =
        getCollegeFormData();

    if (!validateCollegeData(data)) {
        return;
    }

    const now =
        new Date().toISOString();

    app.collegeRecords.push({
        id: createId("college"),

        ...data,

        createdAt: now,
        updatedAt: now
    });

    saveAppData();

    updateCollegeDashboard();
    renderCollegeResult();
    updateDashboard();

    showToast(
        "체대입시 기록이 저장되었습니다."
    );
}

/* =========================================
   선수별 체대입시 기록
========================================= */

function getCollegeRecordsByAthlete(
    athleteId
) {
    return app.collegeRecords.filter(
        (record) =>
            record.athleteId === athleteId
    );
}

/* =========================================
   선택된 선수 최신 기록
========================================= */

function getLatestCollegeRecord(
    athleteId
) {
    return getCollegeRecordsByAthlete(
        athleteId
    )
        .sort((a, b) => {
            return (
                new Date(b.createdAt) -
                new Date(a.createdAt)
            );
        })[0] || null;
}

/* =========================================
   전체 체대입시 평균 달성률
========================================= */

function getAverageCollegeAchievement() {
    if (
        app.collegeRecords.length === 0
    ) {
        return 0;
    }

    const total =
        app.collegeRecords.reduce(
            (sum, record) => {
                const value =
                    Number(
                        record.achievementPercent
                    );

                return Number.isFinite(value)
                    ? sum + value
                    : sum;
            },
            0
        );

    return total /
        app.collegeRecords.length;
}

/* =========================================
   전체 예상 점수 평균
========================================= */

function getAverageCollegeScore() {
    if (
        app.collegeRecords.length === 0
    ) {
        return 0;
    }

    const total =
        app.collegeRecords.reduce(
            (sum, record) => {
                const value =
                    Number(record.expectedScore);

                return Number.isFinite(value)
                    ? sum + value
                    : sum;
            },
            0
        );

    return Math.round(
        total /
        app.collegeRecords.length
    );
}

/* =========================================
   목표 대학 개수
========================================= */

function getCollegeTargetCount() {
    const targets =
        new Set(
            app.collegeRecords
                .map((record) => {
                    return record.collegeName;
                })
                .filter(Boolean)
        );

    return targets.size;
}

/* =========================================
   체대입시 대시보드
========================================= */

function updateCollegeDashboard() {
    const targetCount =
        $("collegeTargetCount");

    const recordCount =
        $("collegeRecordCount");

    const goalPercent =
        $("collegeGoalPercent");

    const expectedScore =
        $("collegeExpectedScore");

    if (targetCount) {
        targetCount.textContent =
            getCollegeTargetCount();
    }

    if (recordCount) {
        recordCount.textContent =
            app.collegeRecords.length;
    }

    if (goalPercent) {
        goalPercent.textContent =
            `${Math.round(
                getAverageCollegeAchievement()
            )}%`;
    }

    if (expectedScore) {
        expectedScore.textContent =
            getAverageCollegeScore();
    }

    renderCollegeResult();
}

/* =========================================
   체대입시 피드백
========================================= */

function createCollegeFeedback(record) {
    const percent =
        Number(
            record.achievementPercent
        );

    const config =
        getCollegeEventConfig(
            record.eventName
        );

    const gap =
        calculateCollegeGap(
            record.currentRecord,
            record.goalRecord,
            config.better
        );

    const absoluteGap =
        Math.abs(gap).toFixed(2);

    if (percent >= 110) {
        return {
            title: "목표 기록 초과 달성",
            message:
                "현재 기록이 목표 기준을 충분히 넘어섰습니다. " +
                "기록 유지와 실전 안정성 훈련에 집중하세요.",
            status: "우수"
        };
    }

    if (percent >= 100) {
        return {
            title: "목표 기록 달성",
            message:
                "목표 기록에 도달했습니다. " +
                "실전에서 같은 기록을 반복할 수 있도록 일관성을 높이세요.",
            status: "달성"
        };
    }

    if (percent >= 90) {
        return {
            title: "목표 기록 근접",
            message:
                `목표까지 약 ${absoluteGap}${record.unit} 차이입니다. ` +
                "기술 완성도와 반복 훈련을 조금 더 높이면 목표 달성이 가능합니다.",
            status: "근접"
        };
    }

    if (percent >= 80) {
        return {
            title: "보완 훈련 필요",
            message:
                `목표까지 약 ${absoluteGap}${record.unit} 차이입니다. ` +
                "주 2~3회 종목별 집중 훈련과 기초 체력 보강이 필요합니다.",
            status: "보완"
        };
    }

    return {
        title: "기초 능력 향상 필요",
        message:
            `목표까지 약 ${absoluteGap}${record.unit} 차이입니다. ` +
            "기본 동작, 근력, 순발력 또는 유연성부터 단계적으로 강화하세요.",
        status: "준비"
    };
}

/* =========================================
   최신 체대입시 결과 표시
========================================= */

function renderCollegeResult() {
    const container =
        $("collegeResultArea");

    if (!container) {
        return;
    }

    const selectedAthleteId =
        $("collegeAthleteSelect")?.value || "";

    let record = null;

    if (selectedAthleteId) {
        record =
            getLatestCollegeRecord(
                selectedAthleteId
            );
    } else {
        record = [...app.collegeRecords]
            .sort((a, b) => {
                return (
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
                );
            })[0] || null;
    }

    if (!record) {
        container.className =
            "empty-state";

        container.textContent =
            selectedAthleteId
                ? "선택한 선수의 체대입시 기록이 없습니다."
                : "체대입시 정보를 입력하면 결과가 표시됩니다.";

        return;
    }

    const feedback =
        createCollegeFeedback(record);

    container.className = "";

    container.innerHTML = `
        <div class="analysis-score-grid">

            <div class="analysis-score-card">
                <span>선수</span>
                <strong>
                    ${escapeHTML(
                        record.athleteName ||
                        getAthleteName(
                            record.athleteId
                        )
                    )}
                </strong>
            </div>

            <div class="analysis-score-card">
                <span>목표 달성률</span>
                <strong>
                    ${escapeHTML(
                        `${record.achievementPercent}%`
                    )}
                </strong>
            </div>

            <div class="analysis-score-card">
                <span>예상 환산점수</span>
                <strong>
                    ${escapeHTML(
                        `${record.expectedScore}점`
                    )}
                </strong>
            </div>

            <div class="analysis-score-card">
                <span>현재 등급</span>
                <strong>
                    ${escapeHTML(record.grade)}
                </strong>
            </div>

        </div>

        <div class="feedback-box">

            <h3>
                ${escapeHTML(
                    feedback.title
                )}
            </h3>

            <div>
                <p>
                    <strong>목표 대학:</strong>
                    ${escapeHTML(
                        record.collegeName
                    )}
                </p>

                <p>
                    <strong>목표 학과:</strong>
                    ${escapeHTML(
                        record.department
                    )}
                </p>

                <p>
                    <strong>실기 종목:</strong>
                    ${escapeHTML(
                        record.eventName
                    )}
                </p>

                <p>
                    <strong>현재 기록:</strong>
                    ${escapeHTML(
                        `${record.currentRecord}${record.unit}`
                    )}
                </p>

                <p>
                    <strong>목표 기록:</strong>
                    ${escapeHTML(
                        `${record.goalRecord}${record.unit}`
                    )}
                </p>

                <br>

                <p>
                    ${escapeHTML(
                        feedback.message
                    )}
                </p>
            </div>

        </div>

        <div class="form-actions">

            <button
                type="button"
                class="danger-button"
                data-college-delete-id="${escapeHTML(
                    record.id
                )}">
                이 기록 삭제
            </button>

        </div>
    `;
}

/* =========================================
   체대입시 기록 삭제
========================================= */

function deleteCollegeRecord(recordId) {
    const record =
        app.collegeRecords.find(
            (item) =>
                item.id === recordId
        );

    if (!record) {
        showToast(
            "체대입시 기록을 찾지 못했습니다.",
            "error"
        );

        return;
    }

    const confirmed = confirm(
        `${record.athleteName} 선수의 ` +
        `${record.eventName} 기록을 삭제하시겠습니까?`
    );

    if (!confirmed) {
        return;
    }

    app.collegeRecords =
        app.collegeRecords.filter(
            (item) =>
                item.id !== recordId
        );

    saveAppData();

    updateCollegeDashboard();
    updateDashboard();

    showToast(
        "체대입시 기록이 삭제되었습니다."
    );
}

/* =========================================
   체대입시 결과 버튼
========================================= */

function handleCollegeResultClick(event) {
    const deleteButton =
        event.target.closest(
            "[data-college-delete-id]"
        );

    if (!deleteButton) {
        return;
    }

    deleteCollegeRecord(
        deleteButton.dataset.collegeDeleteId
    );
}

/* =========================================
   체대입시 선수 변경
========================================= */

function handleCollegeAthleteChange() {
    renderCollegeResult();
}

/* =========================================
   체대입시 기능 시작
========================================= */

function initializeCollegeManagement() {
    $("saveCollegeRecordButton")
        ?.addEventListener(
            "click",
            saveCollegeRecord
        );

    $("collegeAthleteSelect")
        ?.addEventListener(
            "change",
            handleCollegeAthleteChange
        );

    $("collegeResultArea")
        ?.addEventListener(
            "click",
            handleCollegeResultClick
        );
}

/* =========================================
   체대입시 기능 초기화
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {
        initializeCollegeManagement();
        updateCollegeDashboard();
    }
);
/* =========================================
   설천고 스포츠과학센터 PRO
   main.js Part 6
   실시간 카메라·MediaPipe 자세 인식
========================================= */

/* =========================================
   실시간 분석 상태
========================================= */

const liveAnalysisState = {
    stream: null,
    pose: null,
    animationFrameId: null,

    running: false,
    processing: false,

    latestLandmarks: null,
    latestAngles: null,

    score: 0,
    grade: "-",
    risk: "대기",
    repetitionCount: 0,

    repetitionStage: "준비",
    startedAt: null
};

/* =========================================
   숫자 범위 제한
========================================= */

function clampNumber(
    value,
    minimum,
    maximum
) {
    return Math.min(
        maximum,
        Math.max(minimum, value)
    );
}

/* =========================================
   각도 계산
========================================= */

function calculateJointAngle(
    pointA,
    pointB,
    pointC
) {
    if (
        !pointA ||
        !pointB ||
        !pointC
    ) {
        return null;
    }

    const radians =
        Math.atan2(
            pointC.y - pointB.y,
            pointC.x - pointB.x
        ) -
        Math.atan2(
            pointA.y - pointB.y,
            pointA.x - pointB.x
        );

    let angle =
        Math.abs(
            radians * 180 / Math.PI
        );

    if (angle > 180) {
        angle = 360 - angle;
    }

    return Number(
        angle.toFixed(1)
    );
}

/* =========================================
   두 점 사이 거리
========================================= */

function calculatePointDistance(
    pointA,
    pointB
) {
    if (!pointA || !pointB) {
        return 0;
    }

    const xDifference =
        pointA.x - pointB.x;

    const yDifference =
        pointA.y - pointB.y;

    return Math.sqrt(
        xDifference ** 2 +
        yDifference ** 2
    );
}

/* =========================================
   랜드마크 신뢰도
========================================= */

function isLandmarkVisible(
    landmark,
    minimumVisibility = 0.45
) {
    if (!landmark) {
        return false;
    }

    const visibility =
        landmark.visibility;

    if (
        visibility === undefined ||
        visibility === null
    ) {
        return true;
    }

    return visibility >= minimumVisibility;
}

/* =========================================
   관절 각도 생성
========================================= */

function createLiveJointAngles(
    landmarks
) {
    if (
        !Array.isArray(landmarks) ||
        landmarks.length < 33
    ) {
        return null;
    }

    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];

    const leftElbow = landmarks[13];
    const rightElbow = landmarks[14];

    const leftWrist = landmarks[15];
    const rightWrist = landmarks[16];

    const leftHip = landmarks[23];
    const rightHip = landmarks[24];

    const leftKnee = landmarks[25];
    const rightKnee = landmarks[26];

    const leftAnkle = landmarks[27];
    const rightAnkle = landmarks[28];

    const requiredLandmarks = [
        leftShoulder,
        rightShoulder,
        leftElbow,
        rightElbow,
        leftWrist,
        rightWrist,
        leftHip,
        rightHip,
        leftKnee,
        rightKnee,
        leftAnkle,
        rightAnkle
    ];

    const visibleCount =
        requiredLandmarks.filter(
            (landmark) =>
                isLandmarkVisible(landmark)
        ).length;

    if (visibleCount < 8) {
        return null;
    }

    return {
        leftElbow:
            calculateJointAngle(
                leftShoulder,
                leftElbow,
                leftWrist
            ),

        rightElbow:
            calculateJointAngle(
                rightShoulder,
                rightElbow,
                rightWrist
            ),

        leftShoulder:
            calculateJointAngle(
                leftElbow,
                leftShoulder,
                leftHip
            ),

        rightShoulder:
            calculateJointAngle(
                rightElbow,
                rightShoulder,
                rightHip
            ),

        leftHip:
            calculateJointAngle(
                leftShoulder,
                leftHip,
                leftKnee
            ),

        rightHip:
            calculateJointAngle(
                rightShoulder,
                rightHip,
                rightKnee
            ),

        leftKnee:
            calculateJointAngle(
                leftHip,
                leftKnee,
                leftAnkle
            ),

        rightKnee:
            calculateJointAngle(
                rightHip,
                rightKnee,
                rightAnkle
            )
    };
}

/* =========================================
   실시간 점수 계산
========================================= */

function calculateLivePoseScore(
    landmarks,
    angles
) {
    if (
        !Array.isArray(landmarks) ||
        !angles
    ) {
        return 0;
    }

    const visibilityValues =
        landmarks
            .filter((landmark) => {
                return (
                    landmark &&
                    Number.isFinite(
                        landmark.visibility
                    )
                );
            })
            .map((landmark) => {
                return landmark.visibility;
            });

    const averageVisibility =
        visibilityValues.length > 0
            ? visibilityValues.reduce(
                (sum, value) =>
                    sum + value,
                0
            ) / visibilityValues.length
            : 0.7;

    const kneeDifference =
        Math.abs(
            angles.leftKnee -
            angles.rightKnee
        );

    const hipDifference =
        Math.abs(
            angles.leftHip -
            angles.rightHip
        );

    const shoulderDifference =
        Math.abs(
            angles.leftShoulder -
            angles.rightShoulder
        );

    const elbowDifference =
        Math.abs(
            angles.leftElbow -
            angles.rightElbow
        );

    const symmetryPenalty =
        kneeDifference * 0.28 +
        hipDifference * 0.22 +
        shoulderDifference * 0.18 +
        elbowDifference * 0.12;

    const visibilityScore =
        averageVisibility * 100;

    const score =
        visibilityScore -
        symmetryPenalty;

    return Math.round(
        clampNumber(
            score,
            0,
            100
        )
    );
}

/* =========================================
   등급 계산
========================================= */

function getAnalysisGrade(score) {
    const numericScore =
        Number(score);

    if (numericScore >= 95) {
        return "S";
    }

    if (numericScore >= 90) {
        return "A+";
    }

    if (numericScore >= 85) {
        return "A";
    }

    if (numericScore >= 80) {
        return "B+";
    }

    if (numericScore >= 70) {
        return "B";
    }

    if (numericScore >= 60) {
        return "C";
    }

    return "D";
}

/* =========================================
   부상 위험 계산
========================================= */

function calculateLiveRisk(
    score,
    angles
) {
    if (!angles) {
        return "측정 불가";
    }

    const kneeDifference =
        Math.abs(
            angles.leftKnee -
            angles.rightKnee
        );

    const hipDifference =
        Math.abs(
            angles.leftHip -
            angles.rightHip
        );

    const shoulderDifference =
        Math.abs(
            angles.leftShoulder -
            angles.rightShoulder
        );

    if (
        score < 55 ||
        kneeDifference >= 35 ||
        hipDifference >= 35
    ) {
        return "높음";
    }

    if (
        score < 75 ||
        kneeDifference >= 20 ||
        hipDifference >= 20 ||
        shoulderDifference >= 25
    ) {
        return "주의";
    }

    return "낮음";
}

/* =========================================
   반복 횟수 계산
========================================= */

function updateLiveRepetitionCount(
    angles
) {
    if (!angles) {
        return;
    }

    const movement =
        $("liveMovementSelect")?.value || "";

    const averageKneeAngle =
        (
            angles.leftKnee +
            angles.rightKnee
        ) / 2;

    const lowerBodyMovements = [
        "백 스쿼트",
        "프론트 스쿼트",
        "런지",
        "불가리안 스플릿 스쿼트",
        "싱글레그 스쿼트",
        "제자리멀리뛰기",
        "서전트 점프",
        "박스 점프",
        "점프 착지"
    ];

    if (
        !lowerBodyMovements.includes(
            movement
        )
    ) {
        liveAnalysisState.repetitionStage =
            "측정 중";

        return;
    }

    if (
        averageKneeAngle < 105 &&
        liveAnalysisState.repetitionStage !==
            "내려감"
    ) {
        liveAnalysisState.repetitionStage =
            "내려감";
    }

    if (
        averageKneeAngle > 155 &&
        liveAnalysisState.repetitionStage ===
            "내려감"
    ) {
        liveAnalysisState.repetitionCount += 1;

        liveAnalysisState.repetitionStage =
            "올라옴";
    }
}

/* =========================================
   피드백 생성
========================================= */

function createLiveFeedback(
    score,
    risk,
    angles
) {
    if (!angles) {
        return {
            className: "feedback-warning",
            message:
                "전신이 화면 안에 보이도록 카메라에서 조금 떨어져 주세요."
        };
    }

    const kneeDifference =
        Math.abs(
            angles.leftKnee -
            angles.rightKnee
        );

    const hipDifference =
        Math.abs(
            angles.leftHip -
            angles.rightHip
        );

    const shoulderDifference =
        Math.abs(
            angles.leftShoulder -
            angles.rightShoulder
        );

    const messages = [];

    if (kneeDifference >= 20) {
        messages.push(
            "좌우 무릎 각도 차이가 큽니다. 양쪽 무릎의 움직임을 맞춰 주세요."
        );
    }

    if (hipDifference >= 20) {
        messages.push(
            "골반 좌우 움직임이 다릅니다. 몸의 중심을 가운데에 유지하세요."
        );
    }

    if (shoulderDifference >= 25) {
        messages.push(
            "양쪽 어깨 높이와 팔 움직임의 균형을 확인하세요."
        );
    }

    if (messages.length === 0) {
        if (score >= 85) {
            messages.push(
                "좌우 균형이 안정적입니다. 현재 동작을 일정하게 유지하세요."
            );
        } else {
            messages.push(
                "동작이 인식되고 있습니다. 전신이 선명하게 보이도록 자세를 유지하세요."
            );
        }
    }

    let className =
        "feedback-positive";

    if (risk === "주의") {
        className =
            "feedback-warning";
    }

    if (risk === "높음") {
        className =
            "feedback-danger";
    }

    return {
        className,
        message: messages.join(" ")
    };
}

/* =========================================
   캔버스 크기 맞춤
========================================= */

function resizeLiveCanvas() {
    const video =
        $("liveVideo");

    const canvas =
        $("livePoseCanvas");

    if (!video || !canvas) {
        return;
    }

    const width =
        video.videoWidth ||
        video.clientWidth ||
        1280;

    const height =
        video.videoHeight ||
        video.clientHeight ||
        720;

    if (canvas.width !== width) {
        canvas.width = width;
    }

    if (canvas.height !== height) {
        canvas.height = height;
    }
}

/* =========================================
   자세 결과 그리기
========================================= */

function drawLivePoseResults(results) {
    const canvas =
        $("livePoseCanvas");

    if (!canvas) {
        return;
    }

    resizeLiveCanvas();

    const context =
        canvas.getContext("2d");

    if (!context) {
        return;
    }

    context.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    if (!results?.poseLandmarks) {
        return;
    }

    if (
        typeof drawConnectors ===
            "function" &&
        typeof POSE_CONNECTIONS !==
            "undefined"
    ) {
        drawConnectors(
            context,
            results.poseLandmarks,
            POSE_CONNECTIONS,
            {
                color: "#60a5fa",
                lineWidth: 4
            }
        );
    }

    if (
        typeof drawLandmarks ===
        "function"
    ) {
        drawLandmarks(
            context,
            results.poseLandmarks,
            {
                color: "#f8fafc",
                fillColor: "#2563eb",
                lineWidth: 2,
                radius: 4
            }
        );
    }
}

/* =========================================
   관절 각도 화면 표시
========================================= */

function renderLiveAngles(angles) {
    const container =
        $("liveAngleList");

    if (!container) {
        return;
    }

    if (!angles) {
        container.textContent =
            "전신 관절을 인식하는 중입니다.";

        return;
    }

    const angleItems = [
        ["왼쪽 팔꿈치", angles.leftElbow],
        ["오른쪽 팔꿈치", angles.rightElbow],
        ["왼쪽 어깨", angles.leftShoulder],
        ["오른쪽 어깨", angles.rightShoulder],
        ["왼쪽 골반", angles.leftHip],
        ["오른쪽 골반", angles.rightHip],
        ["왼쪽 무릎", angles.leftKnee],
        ["오른쪽 무릎", angles.rightKnee]
    ];

    container.innerHTML = `
        <div class="angle-value-list">
            ${angleItems.map(
                ([name, angle]) => {
                    return `
                        <div class="angle-value-item">
                            <span>
                                ${escapeHTML(name)}
                            </span>

                            <strong>
                                ${
                                    angle === null
                                        ? "-"
                                        : `${escapeHTML(
                                            angle
                                        )}°`
                                }
                            </strong>
                        </div>
                    `;
                }
            ).join("")}
        </div>
    `;
}

/* =========================================
   실시간 분석 화면 업데이트
========================================= */

function updateLiveAnalysisDisplay() {
    const scoreElement =
        $("liveScore");

    const gradeElement =
        $("liveGrade");

    const riskElement =
        $("liveRisk");

    const repetitionElement =
        $("liveRepetitionCount");

    if (scoreElement) {
        scoreElement.textContent =
            liveAnalysisState.score;
    }

    if (gradeElement) {
        gradeElement.textContent =
            liveAnalysisState.grade;
    }

    if (riskElement) {
        riskElement.textContent =
            liveAnalysisState.risk;
    }

    if (repetitionElement) {
        repetitionElement.textContent =
            liveAnalysisState.repetitionCount;
    }

    renderLiveAngles(
        liveAnalysisState.latestAngles
    );

    const feedbackContainer =
        $("liveFeedback");

    if (feedbackContainer) {
        const feedback =
            createLiveFeedback(
                liveAnalysisState.score,
                liveAnalysisState.risk,
                liveAnalysisState.latestAngles
            );

        feedbackContainer.className =
            feedback.className;

        feedbackContainer.textContent =
            feedback.message;
    }
}

/* =========================================
   MediaPipe 결과 처리
========================================= */

function handleLivePoseResults(results) {
    drawLivePoseResults(results);

    const landmarks =
        results?.poseLandmarks || null;

    liveAnalysisState.latestLandmarks =
        landmarks;

    const angles =
        createLiveJointAngles(
            landmarks
        );

    liveAnalysisState.latestAngles =
        angles;

    if (!angles) {
        liveAnalysisState.score = 0;
        liveAnalysisState.grade = "-";
        liveAnalysisState.risk =
            "측정 중";

        updateLiveAnalysisDisplay();

        return;
    }

    const score =
        calculateLivePoseScore(
            landmarks,
            angles
        );

    liveAnalysisState.score =
        score;

    liveAnalysisState.grade =
        getAnalysisGrade(score);

    liveAnalysisState.risk =
        calculateLiveRisk(
            score,
            angles
        );

    updateLiveRepetitionCount(
        angles
    );

    updateLiveAnalysisDisplay();
}

/* =========================================
   MediaPipe 초기화
========================================= */

function createLivePoseModel() {
    if (
        typeof Pose ===
        "undefined"
    ) {
        throw new Error(
            "MediaPipe Pose 라이브러리를 불러오지 못했습니다."
        );
    }

    const pose = new Pose({
        locateFile: (file) => {
            return (
                "https://cdn.jsdelivr.net/npm/" +
                "@mediapipe/pose/" +
                file
            );
        }
    });

    pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        smoothSegmentation: false,
        minDetectionConfidence: 0.55,
        minTrackingConfidence: 0.55
    });

    pose.onResults(
        handleLivePoseResults
    );

    return pose;
}

/* =========================================
   분석 반복 실행
========================================= */

async function runLivePoseLoop() {
    if (!liveAnalysisState.running) {
        return;
    }

    const video =
        $("liveVideo");

    if (
        !video ||
        video.readyState < 2
    ) {
        liveAnalysisState.animationFrameId =
            requestAnimationFrame(
                runLivePoseLoop
            );

        return;
    }

    if (
        !liveAnalysisState.processing &&
        liveAnalysisState.pose
    ) {
        liveAnalysisState.processing =
            true;

        try {
            await liveAnalysisState.pose.send({
                image: video
            });
        } catch (error) {
            console.error(
                "실시간 자세 분석 오류:",
                error
            );
        } finally {
            liveAnalysisState.processing =
                false;
        }
    }

    if (liveAnalysisState.running) {
        liveAnalysisState.animationFrameId =
            requestAnimationFrame(
                runLivePoseLoop
            );
    }
}

/* =========================================
   분석 선택 검사
========================================= */

function validateLiveAnalysisSelection() {
    const athleteId =
        $("liveAthleteSelect")?.value || "";

    const sportId =
        $("liveSportSelect")?.value || "";

    const movement =
        $("liveMovementSelect")?.value || "";

    if (!athleteId) {
        showToast(
            "분석할 선수를 선택하세요.",
            "error"
        );

        $("liveAthleteSelect")?.focus();

        return false;
    }

    if (!sportId) {
        showToast(
            "스포츠 종목을 선택하세요.",
            "error"
        );

        $("liveSportSelect")?.focus();

        return false;
    }

    if (!movement) {
        showToast(
            "분석할 세부 동작을 선택하세요.",
            "error"
        );

        $("liveMovementSelect")?.focus();

        return false;
    }

    return true;
}

/* =========================================
   실시간 상태 초기화
========================================= */

function resetLiveAnalysisState() {
    liveAnalysisState.latestLandmarks =
        null;

    liveAnalysisState.latestAngles =
        null;

    liveAnalysisState.score = 0;
    liveAnalysisState.grade = "-";
    liveAnalysisState.risk = "대기";

    liveAnalysisState.repetitionCount =
        0;

    liveAnalysisState.repetitionStage =
        "준비";

    liveAnalysisState.startedAt = null;

    updateLiveAnalysisDisplay();
}

/* =========================================
   카메라 시작
========================================= */

async function startLiveCamera() {
    if (liveAnalysisState.running) {
        showToast(
            "카메라가 이미 실행 중입니다.",
            "error"
        );

        return;
    }

    if (
        !validateLiveAnalysisSelection()
    ) {
        return;
    }

    if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
    ) {
        showToast(
            "이 브라우저는 카메라 기능을 지원하지 않습니다.",
            "error"
        );

        return;
    }

    const video =
        $("liveVideo");

    if (!video) {
        showToast(
            "카메라 화면을 찾지 못했습니다.",
            "error"
        );

        return;
    }

    try {
        resetLiveAnalysisState();

        const stream =
            await navigator.mediaDevices
                .getUserMedia({
                    audio: false,

                    video: {
                        facingMode: currentFacingMode,

                        width: {
                            ideal: 1280
                        },

                        height: {
                            ideal: 720
                        }
                    }
                });

        liveAnalysisState.stream =
            stream;

        video.srcObject =
            stream;

        await video.play();

        resizeLiveCanvas();

        if (!liveAnalysisState.pose) {
            liveAnalysisState.pose =
                createLivePoseModel();
        }

        liveAnalysisState.running =
            true;

        liveAnalysisState.startedAt =
            new Date().toISOString();

        $("liveCameraPlaceholder")
            ?.classList.add("hidden");

        const startButton =
            $("startLiveCameraButton");

        const stopButton =
            $("stopLiveCameraButton");

        const captureButton =
            $("captureLiveButton");

        const saveButton =
            $("saveLiveAnalysisButton");

        if (startButton) {
            startButton.disabled = true;
        }

        if (stopButton) {
            stopButton.disabled = false;
        }

        if (captureButton) {
            captureButton.disabled = false;
        }

        if (saveButton) {
            saveButton.disabled = false;
        }

        runLivePoseLoop();

        showToast(
            "실시간 카메라 분석을 시작했습니다."
        );
    } catch (error) {
        console.error(
            "카메라 시작 오류:",
            error
        );

        stopLiveCamera(false);

        let errorMessage =
            "카메라를 시작하지 못했습니다.";

        if (
            error?.name ===
            "NotAllowedError"
        ) {
            errorMessage =
                "카메라 사용 권한을 허용해 주세요.";
        }

        if (
            error?.name ===
            "NotFoundError"
        ) {
            errorMessage =
                "사용 가능한 카메라를 찾지 못했습니다.";
        }

        if (
            error?.name ===
            "NotReadableError"
        ) {
            errorMessage =
                "다른 앱에서 카메라를 사용 중인지 확인하세요.";
        }

        showToast(
            errorMessage,
            "error"
        );
    }
}

/* =========================================
   카메라 종료
========================================= */

function stopLiveCamera(
    showMessage = true
) {
    liveAnalysisState.running =
        false;

    liveAnalysisState.processing =
        false;

    if (
        liveAnalysisState.animationFrameId
    ) {
        cancelAnimationFrame(
            liveAnalysisState.animationFrameId
        );

        liveAnalysisState.animationFrameId =
            null;
    }

    if (liveAnalysisState.stream) {
        liveAnalysisState.stream
            .getTracks()
            .forEach((track) => {
                track.stop();
            });

        liveAnalysisState.stream =
            null;
    }

    const video =
        $("liveVideo");

    if (video) {
        video.pause();
        video.srcObject = null;
    }

    const canvas =
        $("livePoseCanvas");

    const context =
        canvas?.getContext("2d");

    if (canvas && context) {
        context.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );
    }

    $("liveCameraPlaceholder")
        ?.classList.remove("hidden");

    const startButton =
        $("startLiveCameraButton");

    const stopButton =
        $("stopLiveCameraButton");

    const captureButton =
        $("captureLiveButton");

    const saveButton =
        $("saveLiveAnalysisButton");

    if (startButton) {
        startButton.disabled = false;
    }

    if (stopButton) {
        stopButton.disabled = true;
    }

    if (captureButton) {
        captureButton.disabled = true;
    }

    if (saveButton) {
        saveButton.disabled =
            liveAnalysisState.score <= 0;
    }

    if (showMessage) {
        showToast(
            "실시간 카메라를 종료했습니다."
        );
    }
}

/* =========================================
   실시간 화면 캡처
========================================= */

function captureLiveAnalysisImage() {
    const video =
        $("liveVideo");

    const poseCanvas =
        $("livePoseCanvas");

    if (
        !video ||
        !poseCanvas ||
        !liveAnalysisState.running
    ) {
        showToast(
            "먼저 카메라 분석을 시작하세요.",
            "error"
        );

        return;
    }

    const captureCanvas =
        document.createElement("canvas");

    captureCanvas.width =
        video.videoWidth ||
        poseCanvas.width;

    captureCanvas.height =
        video.videoHeight ||
        poseCanvas.height;

    const context =
        captureCanvas.getContext("2d");

    if (!context) {
        showToast(
            "화면 캡처를 생성하지 못했습니다.",
            "error"
        );

        return;
    }

    context.drawImage(
        video,
        0,
        0,
        captureCanvas.width,
        captureCanvas.height
    );

    context.drawImage(
        poseCanvas,
        0,
        0,
        captureCanvas.width,
        captureCanvas.height
    );

    captureCanvas.toBlob(
        (blob) => {
            if (!blob) {
                showToast(
                    "캡처 파일 생성에 실패했습니다.",
                    "error"
                );

                return;
            }

            const url =
                URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                `실시간_자세분석_${Date.now()}.png`;

            document.body.appendChild(link);

            link.click();
            link.remove();

            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 1000);

            showToast(
                "분석 화면을 캡처했습니다."
            );
        },
        "image/png"
    );
}

/* =========================================
   분석 시간 계산
========================================= */

function getLiveAnalysisDuration() {
    if (!liveAnalysisState.startedAt) {
        return 0;
    }

    const started =
        new Date(
            liveAnalysisState.startedAt
        ).getTime();

    const now =
        Date.now();

    if (
        !Number.isFinite(started)
    ) {
        return 0;
    }

    return Math.max(
        0,
        Math.round(
            (now - started) / 1000
        )
    );
}

/* =========================================
   실시간 분석 저장
========================================= */

function saveLiveAnalysis() {
    const athleteId =
        $("liveAthleteSelect")?.value || "";

    const sportId =
        $("liveSportSelect")?.value || "";

    const movement =
        $("liveMovementSelect")?.value || "";

    const athlete =
        getAthleteById(athleteId);

    const sport =
        getSportById(sportId);

    if (
        !athlete ||
        !sport ||
        !movement
    ) {
        showToast(
            "선수와 종목, 동작을 모두 선택하세요.",
            "error"
        );

        return;
    }

    if (
        !liveAnalysisState.latestAngles ||
        liveAnalysisState.score <= 0
    ) {
        showToast(
            "저장할 자세 분석 결과가 없습니다.",
            "error"
        );

        return;
    }

    const feedback =
        createLiveFeedback(
            liveAnalysisState.score,
            liveAnalysisState.risk,
            liveAnalysisState.latestAngles
        );

    const now =
        new Date().toISOString();

    app.liveAnalyses.push({
        id: createId("live-analysis"),

        athleteId:
            athlete.id,

        athleteName:
            athlete.name,

        sportId:
            sport.id,

        sportName:
            sport.name,

        movement,

        score:
            liveAnalysisState.score,

        grade:
            liveAnalysisState.grade,

        risk:
            liveAnalysisState.risk,

        repetitionCount:
            liveAnalysisState.repetitionCount,

        angles: {
            ...liveAnalysisState.latestAngles
        },

        feedback:
            feedback.message,

        durationSeconds:
            getLiveAnalysisDuration(),

        createdAt: now,
        updatedAt: now
    });

    saveAppData();
    refreshAllScreens();

    showToast(
        "실시간 분석 결과가 저장되었습니다."
    );
}

/* =========================================
   페이지 이동 시 카메라 종료
========================================= */

function stopCameraWhenLeavingPage() {
    $all(".menu-button").forEach(
        (button) => {
            button.addEventListener(
                "click",
                () => {
                    if (
                        button.dataset.page !==
                            "liveAnalysis" &&
                        liveAnalysisState.running
                    ) {
                        stopLiveCamera(false);
                    }
                }
            );
        }
    );

    $all("[data-open-page]").forEach(
        (button) => {
            button.addEventListener(
                "click",
                () => {
                    if (
                        button.dataset.openPage !==
                            "liveAnalysis" &&
                        liveAnalysisState.running
                    ) {
                        stopLiveCamera(false);
                    }
                }
            );
        }
    );
}

/* =========================================
   실시간 분석 기능 시작
========================================= */

function initializeLiveAnalysis() {
    $("startLiveCameraButton")
        ?.addEventListener(
            "click",
            startLiveCamera
        );

    $("stopLiveCameraButton")
        ?.addEventListener(
            "click",
            () => {
                stopLiveCamera(true);
            }
        );

    $("captureLiveButton")
        ?.addEventListener(
            "click",
            captureLiveAnalysisImage
        );

    $("saveLiveAnalysisButton")
        ?.addEventListener(
            "click",
            saveLiveAnalysis
        );

    window.addEventListener(
        "resize",
        resizeLiveCanvas
    );

    window.addEventListener(
        "pagehide",
        () => {
            stopLiveCamera(false);
        }
    );

    stopCameraWhenLeavingPage();

    resetLiveAnalysisState();
}

/* =========================================
   실시간 분석 초기화
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {
        initializeLiveAnalysis();
    }
);
/* =========================================
   설천고 스포츠과학센터 PRO
   main.js Part 7
   녹화 영상 업로드·자세 분석
========================================= */

/* =========================================
   영상 분석 상태
========================================= */

const videoAnalysisState = {
    fileUrl: null,
    pose: null,

    running: false,
    processing: false,
    paused: false,

    animationFrameId: null,

    latestLandmarks: null,
    latestAngles: null,

    scoreHistory: [],
    angleHistory: [],

    averageScore: 0,
    grade: "-",
    risk: "대기",
    progress: 0,

    startedAt: null,
    completedAt: null,

    chart: null
};

/* =========================================
   영상 분석 상태 초기화
========================================= */

function resetVideoAnalysisState() {
    videoAnalysisState.running = false;
    videoAnalysisState.processing = false;
    videoAnalysisState.paused = false;

    videoAnalysisState.latestLandmarks = null;
    videoAnalysisState.latestAngles = null;

    videoAnalysisState.scoreHistory = [];
    videoAnalysisState.angleHistory = [];

    videoAnalysisState.averageScore = 0;
    videoAnalysisState.grade = "-";
    videoAnalysisState.risk = "대기";
    videoAnalysisState.progress = 0;

    videoAnalysisState.startedAt = null;
    videoAnalysisState.completedAt = null;

    updateVideoAnalysisDisplay();
    updateVideoAnalysisChart();
}

/* =========================================
   영상 캔버스 크기
========================================= */

function resizeVideoCanvas() {
    const video = $("uploadedVideo");
    const canvas = $("videoPoseCanvas");

    if (!video || !canvas) {
        return;
    }

    const width =
        video.videoWidth ||
        video.clientWidth ||
        1280;

    const height =
        video.videoHeight ||
        video.clientHeight ||
        720;

    if (canvas.width !== width) {
        canvas.width = width;
    }

    if (canvas.height !== height) {
        canvas.height = height;
    }
}

/* =========================================
   영상 자세 결과 그리기
========================================= */

function drawVideoPoseResults(results) {
    const canvas = $("videoPoseCanvas");

    if (!canvas) {
        return;
    }

    resizeVideoCanvas();

    const context =
        canvas.getContext("2d");

    if (!context) {
        return;
    }

    context.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    if (!results?.poseLandmarks) {
        return;
    }

    if (
        typeof drawConnectors === "function" &&
        typeof POSE_CONNECTIONS !== "undefined"
    ) {
        drawConnectors(
            context,
            results.poseLandmarks,
            POSE_CONNECTIONS,
            {
                color: "#60a5fa",
                lineWidth: 4
            }
        );
    }

    if (
        typeof drawLandmarks === "function"
    ) {
        drawLandmarks(
            context,
            results.poseLandmarks,
            {
                color: "#f8fafc",
                fillColor: "#2563eb",
                lineWidth: 2,
                radius: 4
            }
        );
    }
}

/* =========================================
   영상 결과 처리
========================================= */

function handleVideoPoseResults(results) {
    drawVideoPoseResults(results);

    const landmarks =
        results?.poseLandmarks || null;

    videoAnalysisState.latestLandmarks =
        landmarks;

    const angles =
        createLiveJointAngles(
            landmarks
        );

    videoAnalysisState.latestAngles =
        angles;

    if (!angles) {
        updateVideoAnalysisDisplay();
        return;
    }

    const score =
        calculateLivePoseScore(
            landmarks,
            angles
        );

    const risk =
        calculateLiveRisk(
            score,
            angles
        );

    const video =
        $("uploadedVideo");

    const currentTime =
        Number(video?.currentTime || 0);

    videoAnalysisState.scoreHistory.push({
        time:
            Number(
                currentTime.toFixed(2)
            ),

        score
    });

    videoAnalysisState.angleHistory.push({
        time:
            Number(
                currentTime.toFixed(2)
            ),

        leftKnee:
            angles.leftKnee,

        rightKnee:
            angles.rightKnee,

        leftHip:
            angles.leftHip,

        rightHip:
            angles.rightHip,

        leftShoulder:
            angles.leftShoulder,

        rightShoulder:
            angles.rightShoulder
    });

    const scores =
        videoAnalysisState.scoreHistory
            .map((item) => item.score)
            .filter(Number.isFinite);

    if (scores.length > 0) {
        const total =
            scores.reduce(
                (sum, value) =>
                    sum + value,
                0
            );

        videoAnalysisState.averageScore =
            Math.round(
                total / scores.length
            );
    }

    videoAnalysisState.grade =
        getAnalysisGrade(
            videoAnalysisState.averageScore
        );

    const riskPriority = {
        대기: 0,
        낮음: 1,
        주의: 2,
        높음: 3,
        "측정 불가": 0
    };

    if (
        riskPriority[risk] >
        riskPriority[
            videoAnalysisState.risk
        ]
    ) {
        videoAnalysisState.risk =
            risk;
    }

    updateVideoAnalysisDisplay();
}

/* =========================================
   영상용 MediaPipe 생성
========================================= */

function createVideoPoseModel() {
    if (
        typeof Pose === "undefined"
    ) {
        throw new Error(
            "MediaPipe Pose 라이브러리를 불러오지 못했습니다."
        );
    }

    const pose = new Pose({
        locateFile: (file) => {
            return (
                "https://cdn.jsdelivr.net/npm/" +
                "@mediapipe/pose/" +
                file
            );
        }
    });

    pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        smoothSegmentation: false,
        minDetectionConfidence: 0.55,
        minTrackingConfidence: 0.55
    });

    pose.onResults(
        handleVideoPoseResults
    );

    return pose;
}

/* =========================================
   영상 파일 선택
========================================= */

function handleVideoFileSelection(event) {
    const file =
        event.target.files?.[0];

    if (!file) {
        return;
    }

    if (
        !file.type.startsWith("video/")
    ) {
        showToast(
            "영상 파일만 선택할 수 있습니다.",
            "error"
        );

        event.target.value = "";

        return;
    }

    stopVideoAnalysis(false);

    if (videoAnalysisState.fileUrl) {
        URL.revokeObjectURL(
            videoAnalysisState.fileUrl
        );
    }

    const fileUrl =
        URL.createObjectURL(file);

    videoAnalysisState.fileUrl =
        fileUrl;

    const video =
        $("uploadedVideo");

    if (!video) {
        showToast(
            "영상 화면을 찾지 못했습니다.",
            "error"
        );

        return;
    }

    video.src = fileUrl;
    video.load();

    resetVideoAnalysisState();

    $("videoPlaceholder")
        ?.classList.add("hidden");

    const startButton =
        $("startVideoAnalysisButton");

    const pauseButton =
        $("pauseVideoAnalysisButton");

    const saveButton =
        $("saveVideoAnalysisButton");

    if (startButton) {
        startButton.disabled = false;
    }

    if (pauseButton) {
        pauseButton.disabled = true;
        pauseButton.textContent =
            "일시정지";
    }

    if (saveButton) {
        saveButton.disabled = true;
    }

    showToast(
        "분석할 영상이 선택되었습니다."
    );
}

/* =========================================
   영상 분석 선택 검사
========================================= */

function validateVideoAnalysisSelection() {
    const athleteId =
        $("videoAthleteSelect")?.value || "";

    const sportId =
        $("videoSportSelect")?.value || "";

    const movement =
        $("videoMovementSelect")?.value || "";

    const video =
        $("uploadedVideo");

    if (!athleteId) {
        showToast(
            "분석할 선수를 선택하세요.",
            "error"
        );

        $("videoAthleteSelect")?.focus();

        return false;
    }

    if (!sportId) {
        showToast(
            "스포츠 종목을 선택하세요.",
            "error"
        );

        $("videoSportSelect")?.focus();

        return false;
    }

    if (!movement) {
        showToast(
            "분석할 세부 동작을 선택하세요.",
            "error"
        );

        $("videoMovementSelect")?.focus();

        return false;
    }

    if (
        !videoAnalysisState.fileUrl ||
        !video?.src
    ) {
        showToast(
            "분석할 영상을 먼저 선택하세요.",
            "error"
        );

        return false;
    }

    return true;
}

/* =========================================
   영상 진행률 계산
========================================= */

function updateVideoProgress() {
    const video =
        $("uploadedVideo");

    if (
        !video ||
        !Number.isFinite(video.duration) ||
        video.duration <= 0
    ) {
        videoAnalysisState.progress = 0;
        return;
    }

    const percent =
        (
            video.currentTime /
            video.duration
        ) * 100;

    videoAnalysisState.progress =
        Math.round(
            clampNumber(
                percent,
                0,
                100
            )
        );
}

/* =========================================
   영상 분석 반복
========================================= */

async function runVideoPoseLoop() {
    if (!videoAnalysisState.running) {
        return;
    }

    const video =
        $("uploadedVideo");

    if (!video) {
        stopVideoAnalysis(false);
        return;
    }

    if (
        video.ended ||
        video.currentTime >= video.duration
    ) {
        completeVideoAnalysis();
        return;
    }

    if (
        videoAnalysisState.paused ||
        video.paused
    ) {
        videoAnalysisState.animationFrameId =
            requestAnimationFrame(
                runVideoPoseLoop
            );

        return;
    }

    if (
        video.readyState >= 2 &&
        !videoAnalysisState.processing &&
        videoAnalysisState.pose
    ) {
        videoAnalysisState.processing =
            true;

        try {
            await videoAnalysisState.pose.send({
                image: video
            });
        } catch (error) {
            console.error(
                "영상 자세 분석 오류:",
                error
            );
        } finally {
            videoAnalysisState.processing =
                false;
        }
    }

    updateVideoProgress();
    updateVideoAnalysisDisplay();

    if (videoAnalysisState.running) {
        videoAnalysisState.animationFrameId =
            requestAnimationFrame(
                runVideoPoseLoop
            );
    }
}

/* =========================================
   영상 분석 시작
========================================= */

async function startVideoAnalysis() {
    if (
        !validateVideoAnalysisSelection()
    ) {
        return;
    }

    if (videoAnalysisState.running) {
        if (videoAnalysisState.paused) {
            toggleVideoAnalysisPause();
        }

        return;
    }

    const video =
        $("uploadedVideo");

    if (!video) {
        return;
    }

    try {
        if (
            video.currentTime >=
            video.duration
        ) {
            video.currentTime = 0;
        }

        resetVideoAnalysisState();

        if (!videoAnalysisState.pose) {
            videoAnalysisState.pose =
                createVideoPoseModel();
        }

        videoAnalysisState.running =
            true;

        videoAnalysisState.startedAt =
            new Date().toISOString();

        await video.play();

        resizeVideoCanvas();

        const startButton =
            $("startVideoAnalysisButton");

        const pauseButton =
            $("pauseVideoAnalysisButton");

        const saveButton =
            $("saveVideoAnalysisButton");

        if (startButton) {
            startButton.disabled = true;
        }

        if (pauseButton) {
            pauseButton.disabled = false;
            pauseButton.textContent =
                "일시정지";
        }

        if (saveButton) {
            saveButton.disabled = true;
        }

        runVideoPoseLoop();

        showToast(
            "녹화 영상 분석을 시작했습니다."
        );
    } catch (error) {
        console.error(
            "영상 분석 시작 오류:",
            error
        );

        stopVideoAnalysis(false);

        showToast(
            "영상을 재생하거나 분석하지 못했습니다.",
            "error"
        );
    }
}

/* =========================================
   영상 분석 일시정지
========================================= */

function toggleVideoAnalysisPause() {
    if (!videoAnalysisState.running) {
        return;
    }

    const video =
        $("uploadedVideo");

    const pauseButton =
        $("pauseVideoAnalysisButton");

    if (!video) {
        return;
    }

    videoAnalysisState.paused =
        !videoAnalysisState.paused;

    if (videoAnalysisState.paused) {
        video.pause();

        if (pauseButton) {
            pauseButton.textContent =
                "계속 분석";
        }

        showToast(
            "영상 분석을 일시정지했습니다."
        );
    } else {
        video.play().catch((error) => {
            console.error(
                "영상 재생 오류:",
                error
            );
        });

        if (pauseButton) {
            pauseButton.textContent =
                "일시정지";
        }

        showToast(
            "영상 분석을 계속합니다."
        );
    }
}

/* =========================================
   영상 분석 완료
========================================= */

function completeVideoAnalysis() {
    const video =
        $("uploadedVideo");

    videoAnalysisState.running = false;
    videoAnalysisState.paused = false;
    videoAnalysisState.progress = 100;

    videoAnalysisState.completedAt =
        new Date().toISOString();

    if (video) {
        video.pause();
    }

    if (
        videoAnalysisState.animationFrameId
    ) {
        cancelAnimationFrame(
            videoAnalysisState.animationFrameId
        );

        videoAnalysisState.animationFrameId =
            null;
    }

    const startButton =
        $("startVideoAnalysisButton");

    const pauseButton =
        $("pauseVideoAnalysisButton");

    const saveButton =
        $("saveVideoAnalysisButton");

    if (startButton) {
        startButton.disabled = false;
        startButton.textContent =
            "다시 분석";
    }

    if (pauseButton) {
        pauseButton.disabled = true;
        pauseButton.textContent =
            "일시정지";
    }

    if (saveButton) {
        saveButton.disabled =
            videoAnalysisState.scoreHistory
                .length === 0;
    }

    updateVideoAnalysisDisplay();
    updateVideoAnalysisChart();

    showToast(
        "녹화 영상 분석이 완료되었습니다."
    );
}

/* =========================================
   영상 분석 중지
========================================= */

function stopVideoAnalysis(
    showMessage = true
) {
    videoAnalysisState.running = false;
    videoAnalysisState.paused = false;
    videoAnalysisState.processing = false;

    if (
        videoAnalysisState.animationFrameId
    ) {
        cancelAnimationFrame(
            videoAnalysisState.animationFrameId
        );

        videoAnalysisState.animationFrameId =
            null;
    }

    const video =
        $("uploadedVideo");

    if (video) {
        video.pause();
    }

    const pauseButton =
        $("pauseVideoAnalysisButton");

    if (pauseButton) {
        pauseButton.disabled = true;
        pauseButton.textContent =
            "일시정지";
    }

    if (showMessage) {
        showToast(
            "영상 분석을 중지했습니다."
        );
    }
}

/* =========================================
   영상 분석 피드백
========================================= */

function createVideoAnalysisFeedback() {
    const score =
        videoAnalysisState.averageScore;

    const risk =
        videoAnalysisState.risk;

    const sampleCount =
        videoAnalysisState.scoreHistory
            .length;

    if (sampleCount === 0) {
        return (
            "자세가 충분히 인식되지 않았습니다. " +
            "전신이 보이고 밝은 영상을 사용하세요."
        );
    }

    const angleHistory =
        videoAnalysisState.angleHistory;

    const kneeDifferences =
        angleHistory.map((item) => {
            return Math.abs(
                item.leftKnee -
                item.rightKnee
            );
        });

    const averageKneeDifference =
        kneeDifferences.length > 0
            ? kneeDifferences.reduce(
                (sum, value) =>
                    sum + value,
                0
            ) / kneeDifferences.length
            : 0;

    const messages = [];

    messages.push(
        `총 ${sampleCount}개의 자세 프레임을 분석했습니다.`
    );

    if (score >= 85) {
        messages.push(
            "전체적인 자세 안정성과 좌우 균형이 우수합니다."
        );
    } else if (score >= 70) {
        messages.push(
            "기본 자세는 양호하지만 일부 구간의 균형 보완이 필요합니다."
        );
    } else {
        messages.push(
            "관절 정렬과 중심 이동을 단계적으로 교정할 필요가 있습니다."
        );
    }

    if (averageKneeDifference >= 20) {
        messages.push(
            "영상 전체에서 좌우 무릎 각도 차이가 반복적으로 나타났습니다."
        );
    }

    if (risk === "높음") {
        messages.push(
            "위험도가 높은 구간은 강도를 낮추고 지도자와 자세를 확인하세요."
        );
    } else if (risk === "주의") {
        messages.push(
            "피로 시 자세가 무너지지 않도록 반복 횟수와 강도를 조절하세요."
        );
    }

    return messages.join(" ");
}

/* =========================================
   영상 분석 화면 업데이트
========================================= */

function updateVideoAnalysisDisplay() {
    const scoreElement =
        $("videoScore");

    const gradeElement =
        $("videoGrade");

    const progressElement =
        $("videoProgress");

    const riskElement =
        $("videoRisk");

    const feedbackElement =
        $("videoFeedback");

    if (scoreElement) {
        scoreElement.textContent =
            videoAnalysisState.averageScore;
    }

    if (gradeElement) {
        gradeElement.textContent =
            videoAnalysisState.grade;
    }

    if (progressElement) {
        progressElement.textContent =
            `${videoAnalysisState.progress}%`;
    }

    if (riskElement) {
        riskElement.textContent =
            videoAnalysisState.risk;
    }

    if (feedbackElement) {
        feedbackElement.textContent =
            createVideoAnalysisFeedback();
    }
}

/* =========================================
   각도 그래프 데이터 정리
========================================= */

function getReducedVideoAngleHistory(
    maximumPoints = 80
) {
    const history =
        videoAnalysisState.angleHistory;

    if (
        history.length <= maximumPoints
    ) {
        return history;
    }

    const step =
        Math.ceil(
            history.length /
            maximumPoints
        );

    return history.filter(
        (_, index) =>
            index % step === 0
    );
}

/* =========================================
   영상 각도 그래프
========================================= */

function updateVideoAnalysisChart() {
    const canvas =
        $("videoAngleChart");

    if (
        !canvas ||
        typeof Chart === "undefined"
    ) {
        return;
    }

    const history =
        getReducedVideoAngleHistory();

    const labels =
        history.map((item) => {
            return `${item.time.toFixed(1)}초`;
        });

    const datasets = [
        {
            label: "왼쪽 무릎",
            data:
                history.map(
                    (item) =>
                        item.leftKnee
                ),

            borderWidth: 2,
            tension: 0.25,
            pointRadius: 0
        },

        {
            label: "오른쪽 무릎",
            data:
                history.map(
                    (item) =>
                        item.rightKnee
                ),

            borderWidth: 2,
            tension: 0.25,
            pointRadius: 0
        },

        {
            label: "왼쪽 골반",
            data:
                history.map(
                    (item) =>
                        item.leftHip
                ),

            borderWidth: 2,
            tension: 0.25,
            pointRadius: 0
        },

        {
            label: "오른쪽 골반",
            data:
                history.map(
                    (item) =>
                        item.rightHip
                ),

            borderWidth: 2,
            tension: 0.25,
            pointRadius: 0
        }
    ];

    if (videoAnalysisState.chart) {
        videoAnalysisState.chart.data.labels =
            labels;

        videoAnalysisState.chart.data.datasets =
            datasets;

        videoAnalysisState.chart.update();

        return;
    }

    videoAnalysisState.chart =
        new Chart(
            canvas,
            {
                type: "line",

                data: {
                    labels,
                    datasets
                },

                options: {
                    responsive: true,
                    maintainAspectRatio: false,

                    animation: false,

                    interaction: {
                        intersect: false,
                        mode: "index"
                    },

                    scales: {
                        y: {
                            min: 0,
                            max: 180,

                            title: {
                                display: true,
                                text: "관절 각도(°)"
                            }
                        },

                        x: {
                            ticks: {
                                maxTicksLimit: 10
                            }
                        }
                    },

                    plugins: {
                        legend: {
                            position: "bottom"
                        }
                    }
                }
            }
        );
}

/* =========================================
   영상 분석 저장
========================================= */

function saveVideoAnalysis() {
    const athleteId =
        $("videoAthleteSelect")?.value || "";

    const sportId =
        $("videoSportSelect")?.value || "";

    const movement =
        $("videoMovementSelect")?.value || "";

    const athlete =
        getAthleteById(athleteId);

    const sport =
        getSportById(sportId);

    if (
        !athlete ||
        !sport ||
        !movement
    ) {
        showToast(
            "선수와 종목, 동작을 모두 선택하세요.",
            "error"
        );

        return;
    }

    if (
        videoAnalysisState.scoreHistory
            .length === 0
    ) {
        showToast(
            "저장할 영상 분석 결과가 없습니다.",
            "error"
        );

        return;
    }

    const video =
        $("uploadedVideo");

    const now =
        new Date().toISOString();

    app.videoAnalyses.push({
        id:
            createId(
                "video-analysis"
            ),

        athleteId:
            athlete.id,

        athleteName:
            athlete.name,

        sportId:
            sport.id,

        sportName:
            sport.name,

        movement,

        score:
            videoAnalysisState.averageScore,

        grade:
            videoAnalysisState.grade,

        risk:
            videoAnalysisState.risk,

        feedback:
            createVideoAnalysisFeedback(),

        videoDurationSeconds:
            Number(
                video?.duration || 0
            ),

        analyzedFrameCount:
            videoAnalysisState.scoreHistory
                .length,

        scoreHistory:
            videoAnalysisState.scoreHistory
                .slice(0, 500),

        angleHistory:
            getReducedVideoAngleHistory(
                150
            ),

        createdAt: now,
        updatedAt: now
    });

    saveAppData();
    refreshAllScreens();

    showToast(
        "녹화 영상 분석 결과가 저장되었습니다."
    );
}

/* =========================================
   페이지 이동 시 영상 중지
========================================= */

function stopVideoWhenLeavingPage() {
    $all(".menu-button").forEach(
        (button) => {
            button.addEventListener(
                "click",
                () => {
                    if (
                        button.dataset.page !==
                            "videoAnalysis" &&
                        videoAnalysisState.running
                    ) {
                        stopVideoAnalysis(false);
                    }
                }
            );
        }
    );

    $all("[data-open-page]").forEach(
        (button) => {
            button.addEventListener(
                "click",
                () => {
                    if (
                        button.dataset.openPage !==
                            "videoAnalysis" &&
                        videoAnalysisState.running
                    ) {
                        stopVideoAnalysis(false);
                    }
                }
            );
        }
    );
}

/* =========================================
   영상 이벤트
========================================= */

function initializeVideoAnalysis() {
    $("videoFileInput")
        ?.addEventListener(
            "change",
            handleVideoFileSelection
        );

    $("startVideoAnalysisButton")
        ?.addEventListener(
            "click",
            startVideoAnalysis
        );

    $("pauseVideoAnalysisButton")
        ?.addEventListener(
            "click",
            toggleVideoAnalysisPause
        );

    $("saveVideoAnalysisButton")
        ?.addEventListener(
            "click",
            saveVideoAnalysis
        );

    $("uploadedVideo")
        ?.addEventListener(
            "loadedmetadata",
            () => {
                resizeVideoCanvas();
                updateVideoProgress();
                updateVideoAnalysisDisplay();
            }
        );

    $("uploadedVideo")
        ?.addEventListener(
            "ended",
            () => {
                if (
                    videoAnalysisState.running
                ) {
                    completeVideoAnalysis();
                }
            }
        );

    $("uploadedVideo")
        ?.addEventListener(
            "seeked",
            () => {
                updateVideoProgress();
                updateVideoAnalysisDisplay();
            }
        );

    window.addEventListener(
        "resize",
        resizeVideoCanvas
    );

    window.addEventListener(
        "pagehide",
        () => {
            stopVideoAnalysis(false);

            if (
                videoAnalysisState.fileUrl
            ) {
                URL.revokeObjectURL(
                    videoAnalysisState.fileUrl
                );
            }
        }
    );

    stopVideoWhenLeavingPage();
    resetVideoAnalysisState();
}

/* =========================================
   영상 분석 초기화
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {
        initializeVideoAnalysis();
    }
);
/* =========================================
   설천고 스포츠과학센터 PRO
   main.js Part 8
   국가대표급 참고 비교 분석
========================================= */

/* =========================================
   국가대표급 참고 기준
========================================= */

const NATIONAL_LEVEL_STANDARDS = {
    default: {
        score: 92,
        symmetry: 90,
        stability: 90,
        technique: 92
    },

    biathlon: {
        score: 94,
        symmetry: 91,
        stability: 94,
        technique: 94
    },

    "cross-country-skiing": {
        score: 94,
        symmetry: 92,
        stability: 92,
        technique: 94
    },

    "track-field": {
        score: 93,
        symmetry: 91,
        stability: 90,
        technique: 93
    },

    soccer: {
        score: 92,
        symmetry: 89,
        stability: 91,
        technique: 92
    },

    basketball: {
        score: 92,
        symmetry: 90,
        stability: 91,
        technique: 92
    },

    volleyball: {
        score: 92,
        symmetry: 90,
        stability: 92,
        technique: 92
    },

    baseball: {
        score: 92,
        symmetry: 87,
        stability: 90,
        technique: 93
    },

    handball: {
        score: 92,
        symmetry: 89,
        stability: 91,
        technique: 92
    },

    swimming: {
        score: 94,
        symmetry: 94,
        stability: 91,
        technique: 94
    },

    taekwondo: {
        score: 93,
        symmetry: 90,
        stability: 93,
        technique: 94
    },

    judo: {
        score: 92,
        symmetry: 89,
        stability: 94,
        technique: 93
    },

    wrestling: {
        score: 92,
        symmetry: 88,
        stability: 94,
        technique: 93
    },

    boxing: {
        score: 92,
        symmetry: 87,
        stability: 92,
        technique: 93
    },

    badminton: {
        score: 92,
        symmetry: 88,
        stability: 91,
        technique: 93
    },

    tennis: {
        score: 92,
        symmetry: 87,
        stability: 91,
        technique: 93
    },

    "table-tennis": {
        score: 92,
        symmetry: 88,
        stability: 92,
        technique: 93
    },

    golf: {
        score: 94,
        symmetry: 91,
        stability: 94,
        technique: 95
    },

    archery: {
        score: 95,
        symmetry: 94,
        stability: 96,
        technique: 95
    },

    shooting: {
        score: 95,
        symmetry: 93,
        stability: 96,
        technique: 95
    },

    cycling: {
        score: 93,
        symmetry: 94,
        stability: 91,
        technique: 93
    },

    rowing: {
        score: 94,
        symmetry: 94,
        stability: 92,
        technique: 94
    },

    gymnastics: {
        score: 95,
        symmetry: 94,
        stability: 95,
        technique: 96
    },

    weightlifting: {
        score: 94,
        symmetry: 93,
        stability: 95,
        technique: 95
    },

    "strength-training": {
        score: 92,
        symmetry: 92,
        stability: 93,
        technique: 92
    },

    "functional-training": {
        score: 92,
        symmetry: 92,
        stability: 92,
        technique: 92
    },

    "physical-education-entrance": {
        score: 90,
        symmetry: 89,
        stability: 90,
        technique: 90
    },

    other: {
        score: 90,
        symmetry: 90,
        stability: 90,
        technique: 90
    }
};

/* =========================================
   분석 기록 통합
========================================= */

function getAllPoseAnalyses() {
    return [
        ...app.liveAnalyses.map((analysis) => ({
            ...analysis,
            analysisType: "실시간 분석"
        })),

        ...app.videoAnalyses.map((analysis) => ({
            ...analysis,
            analysisType: "영상 분석"
        }))
    ];
}

/* =========================================
   선수·종목별 분석 기록
========================================= */

function getAthleteSportAnalyses(
    athleteId,
    sportId,
    movement = ""
) {
    return getAllPoseAnalyses()
        .filter((analysis) => {
            if (
                analysis.athleteId !== athleteId ||
                analysis.sportId !== sportId
            ) {
                return false;
            }

            if (
                movement &&
                analysis.movement !== movement
            ) {
                return false;
            }

            return true;
        })
        .sort((a, b) => {
            return (
                new Date(b.createdAt) -
                new Date(a.createdAt)
            );
        });
}

/* =========================================
   좌우 대칭 점수
========================================= */

function calculateSymmetryScoreFromAngles(
    angles
) {
    if (!angles) {
        return 0;
    }

    const pairs = [
        [
            Number(angles.leftElbow),
            Number(angles.rightElbow)
        ],

        [
            Number(angles.leftShoulder),
            Number(angles.rightShoulder)
        ],

        [
            Number(angles.leftHip),
            Number(angles.rightHip)
        ],

        [
            Number(angles.leftKnee),
            Number(angles.rightKnee)
        ]
    ].filter(([left, right]) => {
        return (
            Number.isFinite(left) &&
            Number.isFinite(right)
        );
    });

    if (pairs.length === 0) {
        return 0;
    }

    const averageDifference =
        pairs.reduce(
            (sum, [left, right]) => {
                return (
                    sum +
                    Math.abs(left - right)
                );
            },
            0
        ) / pairs.length;

    return Math.round(
        clampNumber(
            100 - averageDifference * 1.7,
            0,
            100
        )
    );
}

/* =========================================
   영상 분석 평균 대칭 점수
========================================= */

function calculateVideoSymmetryScore(
    angleHistory
) {
    if (
        !Array.isArray(angleHistory) ||
        angleHistory.length === 0
    ) {
        return 0;
    }

    const scores = angleHistory
        .map((item) => {
            return calculateSymmetryScoreFromAngles({
                leftShoulder:
                    item.leftShoulder,

                rightShoulder:
                    item.rightShoulder,

                leftHip:
                    item.leftHip,

                rightHip:
                    item.rightHip,

                leftKnee:
                    item.leftKnee,

                rightKnee:
                    item.rightKnee
            });
        })
        .filter((score) => {
            return score > 0;
        });

    if (scores.length === 0) {
        return 0;
    }

    return Math.round(
        scores.reduce(
            (sum, score) =>
                sum + score,
            0
        ) / scores.length
    );
}

/* =========================================
   위험도 기반 안정성 점수
========================================= */

function calculateStabilityScore(
    analysis
) {
    const riskScores = {
        낮음: 94,
        주의: 75,
        높음: 50,
        대기: 65,
        "측정 중": 65,
        "측정 불가": 50
    };

    const riskScore =
        riskScores[analysis.risk] ?? 65;

    const analysisScore =
        Number(analysis.score) || 0;

    return Math.round(
        clampNumber(
            riskScore * 0.55 +
            analysisScore * 0.45,
            0,
            100
        )
    );
}

/* =========================================
   기술 점수
========================================= */

function calculateTechniqueScore(
    analysis,
    symmetryScore,
    stabilityScore
) {
    const analysisScore =
        Number(analysis.score) || 0;

    return Math.round(
        clampNumber(
            analysisScore * 0.55 +
            symmetryScore * 0.2 +
            stabilityScore * 0.25,
            0,
            100
        )
    );
}

/* =========================================
   개별 분석 평가값
========================================= */

function createAnalysisMetrics(
    analysis
) {
    let symmetryScore = 0;

    if (
        Array.isArray(
            analysis.angleHistory
        )
    ) {
        symmetryScore =
            calculateVideoSymmetryScore(
                analysis.angleHistory
            );
    } else {
        symmetryScore =
            calculateSymmetryScoreFromAngles(
                analysis.angles
            );
    }

    if (symmetryScore === 0) {
        symmetryScore =
            Math.round(
                clampNumber(
                    Number(analysis.score) - 5,
                    0,
                    100
                )
            );
    }

    const stabilityScore =
        calculateStabilityScore(
            analysis
        );

    const techniqueScore =
        calculateTechniqueScore(
            analysis,
            symmetryScore,
            stabilityScore
        );

    return {
        score:
            Number(analysis.score) || 0,

        symmetry:
            symmetryScore,

        stability:
            stabilityScore,

        technique:
            techniqueScore
    };
}

/* =========================================
   여러 분석 평균
========================================= */

function calculateAverageMetrics(
    analyses
) {
    if (
        !Array.isArray(analyses) ||
        analyses.length === 0
    ) {
        return {
            score: 0,
            symmetry: 0,
            stability: 0,
            technique: 0
        };
    }

    const metrics =
        analyses.map(
            createAnalysisMetrics
        );

    const total =
        metrics.reduce(
            (sum, item) => {
                return {
                    score:
                        sum.score +
                        item.score,

                    symmetry:
                        sum.symmetry +
                        item.symmetry,

                    stability:
                        sum.stability +
                        item.stability,

                    technique:
                        sum.technique +
                        item.technique
                };
            },
            {
                score: 0,
                symmetry: 0,
                stability: 0,
                technique: 0
            }
        );

    return {
        score:
            Math.round(
                total.score /
                metrics.length
            ),

        symmetry:
            Math.round(
                total.symmetry /
                metrics.length
            ),

        stability:
            Math.round(
                total.stability /
                metrics.length
            ),

        technique:
            Math.round(
                total.technique /
                metrics.length
            )
    };
}

/* =========================================
   국가대표급 기준 가져오기
========================================= */

function getNationalStandard(
    sportId
) {
    return (
        NATIONAL_LEVEL_STANDARDS[
            sportId
        ] ||
        NATIONAL_LEVEL_STANDARDS.default
    );
}

/* =========================================
   국가대표급 대비 비율
========================================= */

function calculateNationalPercent(
    athleteMetrics,
    standard
) {
    const categories = [
        "score",
        "symmetry",
        "stability",
        "technique"
    ];

    const percentages =
        categories.map((category) => {
            const athleteValue =
                Number(
                    athleteMetrics[
                        category
                    ]
                ) || 0;

            const standardValue =
                Number(
                    standard[
                        category
                    ]
                ) || 1;

            return (
                athleteValue /
                standardValue
            ) * 100;
        });

    const average =
        percentages.reduce(
            (sum, value) =>
                sum + value,
            0
        ) / percentages.length;

    return Math.round(
        clampNumber(
            average,
            0,
            120
        )
    );
}

/* =========================================
   국가대표급 비교 등급
========================================= */

function getNationalComparisonGrade(
    percent
) {
    if (percent >= 105) {
        return "국가대표급 이상";
    }

    if (percent >= 100) {
        return "국가대표급";
    }

    if (percent >= 95) {
        return "국가대표급 근접";
    }

    if (percent >= 88) {
        return "엘리트 상위";
    }

    if (percent >= 80) {
        return "엘리트";
    }

    if (percent >= 70) {
        return "선수 성장 단계";
    }

    return "기초 보완 단계";
}

/* =========================================
   국가대표급 목표 차이
========================================= */

function calculateNationalGap(
    athleteMetrics,
    standard
) {
    const scoreGap =
        Math.max(
            0,
            standard.score -
            athleteMetrics.score
        );

    const symmetryGap =
        Math.max(
            0,
            standard.symmetry -
            athleteMetrics.symmetry
        );

    const stabilityGap =
        Math.max(
            0,
            standard.stability -
            athleteMetrics.stability
        );

    const techniqueGap =
        Math.max(
            0,
            standard.technique -
            athleteMetrics.technique
        );

    const averageGap =
        (
            scoreGap +
            symmetryGap +
            stabilityGap +
            techniqueGap
        ) / 4;

    if (averageGap <= 0) {
        return "기준 도달";
    }

    return `${averageGap.toFixed(1)}점`;
}

/* =========================================
   종합 위험도
========================================= */

function getOverallAnalysisRisk(
    analyses
) {
    if (
        !Array.isArray(analyses) ||
        analyses.length === 0
    ) {
        return "측정 불가";
    }

    if (
        analyses.some(
            (analysis) =>
                analysis.risk === "높음"
        )
    ) {
        return "높음";
    }

    if (
        analyses.some(
            (analysis) =>
                analysis.risk === "주의"
        )
    ) {
        return "주의";
    }

    return "낮음";
}

/* =========================================
   강점과 약점 찾기
========================================= */

function findMetricStrengthsAndWeaknesses(
    athleteMetrics,
    standard
) {
    const metricNames = {
        score: "종합 자세 점수",
        symmetry: "좌우 대칭성",
        stability: "동작 안정성",
        technique: "기술 완성도"
    };

    const values =
        Object.keys(metricNames)
            .map((key) => {
                const current =
                    athleteMetrics[key];

                const target =
                    standard[key];

                return {
                    key,
                    name:
                        metricNames[key],

                    current,
                    target,

                    percent:
                        target > 0
                            ? (
                                current /
                                target
                            ) * 100
                            : 0,

                    gap:
                        target -
                        current
                };
            })
            .sort((a, b) => {
                return (
                    b.percent -
                    a.percent
                );
            });

    return {
        strongest:
            values[0],

        weakest:
            values[
                values.length - 1
            ],

        all:
            values
    };
}

/* =========================================
   국가대표급 비교 피드백
========================================= */

function createNationalFeedback(
    result
) {
    const {
        athleteName,
        sportName,
        movement,
        percent,
        grade,
        metrics,
        standard,
        risk,
        analysisCount
    } = result;

    const comparison =
        findMetricStrengthsAndWeaknesses(
            metrics,
            standard
        );

    const messages = [];

    messages.push(
        `${athleteName} 선수의 ${sportName} · ${movement} 분석 결과입니다.`
    );

    messages.push(
        `총 ${analysisCount}개의 저장된 자세 분석을 기준으로 국가대표급 참고 기준 대비 ${percent}%입니다.`
    );

    messages.push(
        `현재 평가 단계는 "${grade}"입니다.`
    );

    if (
        comparison.strongest.percent >= 100
    ) {
        messages.push(
            `${comparison.strongest.name}은 참고 기준에 도달했거나 넘어섰습니다.`
        );
    } else {
        messages.push(
            `현재 가장 강한 항목은 ${comparison.strongest.name}입니다.`
        );
    }

    if (
        comparison.weakest.gap > 0
    ) {
        messages.push(
            `${comparison.weakest.name}은 기준까지 약 ${comparison.weakest.gap.toFixed(1)}점 보완이 필요합니다.`
        );
    }

    if (risk === "높음") {
        messages.push(
            "일부 분석에서 높은 부상 위험이 감지되었습니다. 운동 강도를 낮추고 지도자와 자세를 확인하세요."
        );
    } else if (risk === "주의") {
        messages.push(
            "피로하거나 반복 횟수가 늘어날 때 자세가 무너질 가능성이 있으므로 안정성 훈련을 함께 진행하세요."
        );
    } else {
        messages.push(
            "현재 분석에서는 큰 위험 신호가 적습니다. 좋은 자세를 반복해서 유지하는 훈련이 필요합니다."
        );
    }

    return messages.join(" ");
}

/* =========================================
   국가대표급 비교 그래프 상태
========================================= */

let nationalComparisonChart = null;

/* =========================================
   국가대표급 비교 그래프
========================================= */

function renderNationalComparisonChart(
    athleteMetrics,
    standard
) {
    const canvas =
        $("nationalComparisonChart");

    if (
        !canvas ||
        typeof Chart === "undefined"
    ) {
        return;
    }

    const data = {
        labels: [
            "종합 점수",
            "좌우 대칭성",
            "안정성",
            "기술 완성도"
        ],

        datasets: [
            {
                label: "선수 현재 수준",

                data: [
                    athleteMetrics.score,
                    athleteMetrics.symmetry,
                    athleteMetrics.stability,
                    athleteMetrics.technique
                ],

                borderWidth: 2,
                pointRadius: 4
            },

            {
                label: "국가대표급 참고 기준",

                data: [
                    standard.score,
                    standard.symmetry,
                    standard.stability,
                    standard.technique
                ],

                borderWidth: 2,
                pointRadius: 4
            }
        ]
    };

    if (nationalComparisonChart) {
        nationalComparisonChart.data =
            data;

        nationalComparisonChart.update();

        return;
    }

    nationalComparisonChart =
        new Chart(
            canvas,
            {
                type: "radar",

                data,

                options: {
                    responsive: true,
                    maintainAspectRatio: false,

                    scales: {
                        r: {
                            min: 0,
                            max: 100,

                            beginAtZero: true,

                            ticks: {
                                stepSize: 20
                            }
                        }
                    },

                    plugins: {
                        legend: {
                            position: "bottom"
                        }
                    }
                }
            }
        );
}

/* =========================================
   국가대표급 결과 화면 초기화
========================================= */

function resetNationalComparisonDisplay() {
    if ($("nationalPercent")) {
        $("nationalPercent")
            .textContent = "0%";
    }

    if ($("nationalGrade")) {
        $("nationalGrade")
            .textContent = "-";
    }

    if ($("nationalGap")) {
        $("nationalGap")
            .textContent = "-";
    }

    if ($("nationalRisk")) {
        $("nationalRisk")
            .textContent = "대기";
    }

    const feedback =
        $("nationalFeedback");

    if (feedback) {
        feedback.className =
            "empty-state";

        feedback.textContent =
            "선수와 종목을 선택한 뒤 비교 분석을 실행하세요.";
    }
}

/* =========================================
   국가대표급 비교 실행
========================================= */

function runNationalComparison() {
    const athleteId =
        $("nationalAthleteSelect")
            ?.value || "";

    const sportId =
        $("nationalSportSelect")
            ?.value || "";

    const movement =
        $("nationalMovementSelect")
            ?.value || "";

    if (!athleteId) {
        showToast(
            "비교할 선수를 선택하세요.",
            "error"
        );

        $("nationalAthleteSelect")
            ?.focus();

        return;
    }

    if (!sportId) {
        showToast(
            "스포츠 종목을 선택하세요.",
            "error"
        );

        $("nationalSportSelect")
            ?.focus();

        return;
    }

    if (!movement) {
        showToast(
            "세부 종목이나 동작을 선택하세요.",
            "error"
        );

        $("nationalMovementSelect")
            ?.focus();

        return;
    }

    const athlete =
        getAthleteById(athleteId);

    const sport =
        getSportById(sportId);

    if (!athlete || !sport) {
        showToast(
            "선수 또는 종목 정보를 찾지 못했습니다.",
            "error"
        );

        return;
    }

    const analyses =
        getAthleteSportAnalyses(
            athleteId,
            sportId,
            movement
        );

    if (analyses.length === 0) {
        resetNationalComparisonDisplay();

        const feedback =
            $("nationalFeedback");

        if (feedback) {
            feedback.className =
                "empty-state";

            feedback.textContent =
                "선택한 선수·종목·동작의 저장된 분석 결과가 없습니다. 실시간 분석이나 영상 분석을 먼저 저장하세요.";
        }

        showToast(
            "비교할 분석 기록이 없습니다.",
            "error"
        );

        return;
    }

    const metrics =
        calculateAverageMetrics(
            analyses
        );

    const standard =
        getNationalStandard(
            sportId
        );

    const percent =
        calculateNationalPercent(
            metrics,
            standard
        );

    const grade =
        getNationalComparisonGrade(
            percent
        );

    const gap =
        calculateNationalGap(
            metrics,
            standard
        );

    const risk =
        getOverallAnalysisRisk(
            analyses
        );

    const result = {
        athleteId:
            athlete.id,

        athleteName:
            athlete.name,

        sportId:
            sport.id,

        sportName:
            sport.name,

        movement,

        metrics,

        standard,

        percent,

        grade,

        gap,

        risk,

        analysisCount:
            analyses.length,

        feedback: "",

        createdAt:
            new Date().toISOString()
    };

    result.feedback =
        createNationalFeedback(
            result
        );

    if ($("nationalPercent")) {
        $("nationalPercent")
            .textContent =
                `${percent}%`;
    }

    if ($("nationalGrade")) {
        $("nationalGrade")
            .textContent =
                grade;
    }

    if ($("nationalGap")) {
        $("nationalGap")
            .textContent =
                gap;
    }

    if ($("nationalRisk")) {
        $("nationalRisk")
            .textContent =
                risk;
    }

    const feedback =
        $("nationalFeedback");

    if (feedback) {
        feedback.className = "";

        feedback.innerHTML = `
            <div class="feedback-box">
                <h3>
                    ${escapeHTML(grade)}
                </h3>

                <div>
                    ${escapeHTML(
                        result.feedback
                    )}
                </div>
            </div>

            <div class="angle-value-list">

                <div class="angle-value-item">
                    <span>종합 자세 점수</span>

                    <strong>
                        ${escapeHTML(
                            metrics.score
                        )} / ${escapeHTML(
                            standard.score
                        )}
                    </strong>
                </div>

                <div class="angle-value-item">
                    <span>좌우 대칭성</span>

                    <strong>
                        ${escapeHTML(
                            metrics.symmetry
                        )} / ${escapeHTML(
                            standard.symmetry
                        )}
                    </strong>
                </div>

                <div class="angle-value-item">
                    <span>동작 안정성</span>

                    <strong>
                        ${escapeHTML(
                            metrics.stability
                        )} / ${escapeHTML(
                            standard.stability
                        )}
                    </strong>
                </div>

                <div class="angle-value-item">
                    <span>기술 완성도</span>

                    <strong>
                        ${escapeHTML(
                            metrics.technique
                        )} / ${escapeHTML(
                            standard.technique
                        )}
                    </strong>
                </div>

            </div>
        `;
    }

    renderNationalComparisonChart(
        metrics,
        standard
    );

    saveNationalComparison(
        result
    );

    showToast(
        "국가대표급 비교 분석이 완료되었습니다."
    );
}

/* =========================================
   국가대표급 비교 결과 저장
========================================= */

function saveNationalComparison(
    result
) {
    const existingIndex =
        app.nationalComparisons
            .findIndex((item) => {
                return (
                    item.athleteId ===
                        result.athleteId &&
                    item.sportId ===
                        result.sportId &&
                    item.movement ===
                        result.movement
                );
            });

    const savedResult = {
        id:
            existingIndex >= 0
                ? app.nationalComparisons[
                    existingIndex
                ].id
                : createId(
                    "national-comparison"
                ),

        ...result,

        updatedAt:
            new Date().toISOString()
    };

    if (existingIndex >= 0) {
        app.nationalComparisons[
            existingIndex
        ] = savedResult;
    } else {
        app.nationalComparisons.push(
            savedResult
        );
    }

    saveAppData();
    updateDashboard();
}

/* =========================================
   선수의 최신 국가대표급 비교
========================================= */

function getLatestNationalComparison(
    athleteId
) {
    return app.nationalComparisons
        .filter((comparison) => {
            return (
                comparison.athleteId ===
                athleteId
            );
        })
        .sort((a, b) => {
            return (
                new Date(
                    b.updatedAt ||
                    b.createdAt
                ) -
                new Date(
                    a.updatedAt ||
                    a.createdAt
                )
            );
        })[0] || null;
}

/* =========================================
   국가대표 비교 기능 시작
========================================= */

function initializeNationalComparison() {
    $("runNationalComparisonButton")
        ?.addEventListener(
            "click",
            runNationalComparison
        );

    $("nationalAthleteSelect")
        ?.addEventListener(
            "change",
            resetNationalComparisonDisplay
        );

    $("nationalSportSelect")
        ?.addEventListener(
            "change",
            resetNationalComparisonDisplay
        );

    $("nationalMovementSelect")
        ?.addEventListener(
            "change",
            resetNationalComparisonDisplay
        );

    resetNationalComparisonDisplay();
}

/* =========================================
   국가대표 비교 초기화
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {
        initializeNationalComparison();
    }
);
/* =========================================
   설천고 스포츠과학센터 PRO
   main.js Part 9
   AI 리포트·성장 그래프·PDF 저장
========================================= */

/* =========================================
   리포트 그래프 상태
========================================= */

let reportGrowthChart = null;

/* =========================================
   선수 전체 분석 기록
========================================= */

function getAthleteAllAnalyses(athleteId) {
    return getAllPoseAnalyses()
        .filter((analysis) => {
            return analysis.athleteId === athleteId;
        })
        .sort((a, b) => {
            return (
                new Date(a.createdAt) -
                new Date(b.createdAt)
            );
        });
}

/* =========================================
   선수 평균 분석 점수
========================================= */

function getAthleteAverageAnalysisScore(
    athleteId
) {
    const analyses =
        getAthleteAllAnalyses(athleteId);

    if (analyses.length === 0) {
        return 0;
    }

    const total =
        analyses.reduce(
            (sum, analysis) => {
                const score =
                    Number(analysis.score);

                return Number.isFinite(score)
                    ? sum + score
                    : sum;
            },
            0
        );

    return Math.round(
        total / analyses.length
    );
}

/* =========================================
   선수 종합 위험도
========================================= */

function getAthleteOverallRisk(athleteId) {
    const analyses =
        getAthleteAllAnalyses(athleteId);

    return getOverallAnalysisRisk(
        analyses
    );
}

/* =========================================
   선수 분석 종목 목록
========================================= */

function getAthleteAnalyzedSports(
    athleteId
) {
    const sportNames =
        getAthleteAllAnalyses(athleteId)
            .map((analysis) => {
                return analysis.sportName;
            })
            .filter(Boolean);

    return [...new Set(sportNames)];
}

/* =========================================
   선수 강점 종목
========================================= */

function getAthleteBestSport(athleteId) {
    const analyses =
        getAthleteAllAnalyses(athleteId);

    if (analyses.length === 0) {
        return null;
    }

    const sportScores = {};

    analyses.forEach((analysis) => {
        const sportName =
            analysis.sportName ||
            "기타 종목";

        if (!sportScores[sportName]) {
            sportScores[sportName] = [];
        }

        sportScores[sportName].push(
            Number(analysis.score) || 0
        );
    });

    const averages =
        Object.entries(sportScores)
            .map(([sportName, scores]) => {
                const total =
                    scores.reduce(
                        (sum, score) =>
                            sum + score,
                        0
                    );

                return {
                    sportName,

                    averageScore:
                        Math.round(
                            total /
                            scores.length
                        )
                };
            })
            .sort((a, b) => {
                return (
                    b.averageScore -
                    a.averageScore
                );
            });

    return averages[0] || null;
}

/* =========================================
   최근 분석 점수 변화
========================================= */

function getAthleteScoreTrend(athleteId) {
    const analyses =
        getAthleteAllAnalyses(athleteId);

    if (analyses.length < 2) {
        return {
            difference: 0,
            direction: "유지",
            firstScore:
                analyses[0]?.score || 0,
            lastScore:
                analyses[0]?.score || 0
        };
    }

    const recentAnalyses =
        analyses.slice(-6);

    const middleIndex =
        Math.ceil(
            recentAnalyses.length / 2
        );

    const firstGroup =
        recentAnalyses.slice(
            0,
            middleIndex
        );

    const secondGroup =
        recentAnalyses.slice(
            middleIndex
        );

    const firstAverage =
        firstGroup.reduce(
            (sum, analysis) => {
                return (
                    sum +
                    (Number(analysis.score) || 0)
                );
            },
            0
        ) / firstGroup.length;

    const secondAverage =
        secondGroup.length > 0
            ? secondGroup.reduce(
                (sum, analysis) => {
                    return (
                        sum +
                        (Number(
                            analysis.score
                        ) || 0)
                    );
                },
                0
            ) / secondGroup.length
            : firstAverage;

    const difference =
        Number(
            (
                secondAverage -
                firstAverage
            ).toFixed(1)
        );

    let direction = "유지";

    if (difference >= 2) {
        direction = "향상";
    }

    if (difference <= -2) {
        direction = "하락";
    }

    return {
        difference,
        direction,
        firstScore:
            Math.round(firstAverage),
        lastScore:
            Math.round(secondAverage)
    };
}

/* =========================================
   선수 종합 리포트 데이터
========================================= */

function createAthleteReportData(
    athleteId
) {
    const athlete =
        getAthleteById(athleteId);

    if (!athlete) {
        return null;
    }

    const analyses =
        getAthleteAllAnalyses(
            athleteId
        );

    const trainingRecords =
        getAthleteTrainingRecords(
            athleteId
        );

    const collegeRecords =
        getCollegeRecordsByAthlete(
            athleteId
        );

    const latestNational =
        getLatestNationalComparison(
            athleteId
        );

    const averageScore =
        getAthleteAverageAnalysisScore(
            athleteId
        );

    const grade =
        analyses.length > 0
            ? getAnalysisGrade(
                averageScore
            )
            : "-";

    const bestSport =
        getAthleteBestSport(
            athleteId
        );

    const trend =
        getAthleteScoreTrend(
            athleteId
        );

    const risk =
        getAthleteOverallRisk(
            athleteId
        );

    return {
        athlete,

        analyses,

        trainingRecords,

        collegeRecords,

        averageScore,

        grade,

        analysisCount:
            analyses.length,

        trainingCount:
            trainingRecords.length,

        trainingMinutes:
            getAthleteTotalTrainingMinutes(
                athleteId
            ),

        nationalPercent:
            latestNational?.percent || 0,

        nationalGrade:
            latestNational?.grade || "-",

        collegeAverage:
            collegeRecords.length > 0
                ? Math.round(
                    collegeRecords.reduce(
                        (sum, record) => {
                            return (
                                sum +
                                (
                                    Number(
                                        record
                                            .achievementPercent
                                    ) || 0
                                )
                            );
                        },
                        0
                    ) /
                    collegeRecords.length
                )
                : 0,

        analyzedSports:
            getAthleteAnalyzedSports(
                athleteId
            ),

        bestSport,

        trend,

        risk
    };
}

/* =========================================
   AI 종합 피드백
========================================= */

function createReportFeedback(
    reportData
) {
    const {
        athlete,
        averageScore,
        analysisCount,
        trainingCount,
        trainingMinutes,
        nationalPercent,
        collegeAverage,
        bestSport,
        trend,
        risk
    } = reportData;

    const sections = [];

    sections.push(`
        <div class="feedback-box">
            <h3>선수 종합 평가</h3>

            <div>
                <p>
                    <strong>
                        ${escapeHTML(athlete.name)}
                    </strong>
                    선수는 현재 총
                    <strong>
                        ${escapeHTML(analysisCount)}
                    </strong>
                    건의 자세 분석과
                    <strong>
                        ${escapeHTML(trainingCount)}
                    </strong>
                    건의 훈련 기록이 저장되어 있습니다.
                </p>

                <p>
                    평균 AI 자세 점수는
                    <strong>
                        ${escapeHTML(averageScore)}점
                    </strong>
                    입니다.
                </p>
            </div>
        </div>
    `);

    let scoreMessage = "";

    if (averageScore >= 90) {
        scoreMessage =
            "동작의 안정성과 좌우 균형이 매우 우수합니다. 실전에서도 같은 자세를 반복하는 능력을 강화하세요.";
    } else if (averageScore >= 80) {
        scoreMessage =
            "전체적인 자세 완성도가 높습니다. 약한 구간을 세밀하게 교정하면 상위 수준으로 발전할 수 있습니다.";
    } else if (averageScore >= 70) {
        scoreMessage =
            "기본 동작은 안정적이지만 피로 시 자세가 흔들릴 가능성이 있습니다. 중심 안정성과 반복 정확도를 강화하세요.";
    } else if (averageScore > 0) {
        scoreMessage =
            "기초 자세와 관절 정렬을 먼저 안정시키는 것이 필요합니다. 낮은 강도에서 정확한 동작을 반복하세요.";
    } else {
        scoreMessage =
            "저장된 자세 분석이 없습니다. 실시간 분석이나 녹화 영상 분석을 먼저 진행하세요.";
    }

    sections.push(`
        <div class="feedback-box">
            <h3>자세 분석 평가</h3>

            <div>
                <p>
                    ${escapeHTML(scoreMessage)}
                </p>

                <p>
                    최근 점수 흐름:
                    <strong>
                        ${escapeHTML(
                            trend.direction
                        )}
                    </strong>

                    ${
                        trend.difference !== 0
                            ? `
                                (
                                ${trend.difference > 0
                                    ? "+"
                                    : ""
                                }${escapeHTML(
                                    trend.difference
                                )}점
                                )
                            `
                            : ""
                    }
                </p>
            </div>
        </div>
    `);

    let trainingMessage = "";

    if (trainingCount === 0) {
        trainingMessage =
            "훈련 기록이 없습니다. 운동 시간, 강도, 세트와 컨디션을 꾸준히 저장하면 성장 분석의 정확도가 높아집니다.";
    } else if (trainingMinutes >= 600) {
        trainingMessage =
            "누적 훈련량이 충분합니다. 과훈련을 피하기 위해 회복과 수면 상태도 함께 확인하세요.";
    } else {
        trainingMessage =
            "현재 훈련 기록을 꾸준히 유지하면서 종목 기술 훈련과 근력·코어 훈련을 균형 있게 진행하세요.";
    }

    sections.push(`
        <div class="feedback-box">
            <h3>훈련 분석</h3>

            <div>
                <p>
                    누적 기록 훈련 시간:
                    <strong>
                        ${escapeHTML(
                            trainingMinutes
                        )}분
                    </strong>
                </p>

                <p>
                    ${escapeHTML(
                        trainingMessage
                    )}
                </p>
            </div>
        </div>
    `);

    if (bestSport) {
        sections.push(`
            <div class="feedback-box">
                <h3>강점 종목</h3>

                <div>
                    <p>
                        현재 저장된 분석 중 가장 높은 평균 점수를 기록한 종목은
                        <strong>
                            ${escapeHTML(
                                bestSport.sportName
                            )}
                        </strong>
                        입니다.
                    </p>

                    <p>
                        해당 종목 평균 점수:
                        <strong>
                            ${escapeHTML(
                                bestSport.averageScore
                            )}점
                        </strong>
                    </p>
                </div>
            </div>
        `);
    }

    if (nationalPercent > 0) {
        sections.push(`
            <div class="feedback-box">
                <h3>국가대표급 참고 비교</h3>

                <div>
                    <p>
                        최근 국가대표급 참고 기준 대비
                        <strong>
                            ${escapeHTML(
                                nationalPercent
                            )}%
                        </strong>
                        수준입니다.
                    </p>

                    <p>
                        국가대표급 기준은 공식 선발 결과가 아닌 프로그램 내부 참고 지표입니다.
                    </p>
                </div>
            </div>
        `);
    }

    if (collegeAverage > 0) {
        sections.push(`
            <div class="feedback-box">
                <h3>체대입시 분석</h3>

                <div>
                    <p>
                        저장된 체대입시 종목의 평균 목표 달성률은
                        <strong>
                            ${escapeHTML(
                                collegeAverage
                            )}%
                        </strong>
                        입니다.
                    </p>
                </div>
            </div>
        `);
    }

    let riskMessage = "";

    if (risk === "높음") {
        riskMessage =
            "일부 분석에서 높은 위험 신호가 확인되었습니다. 통증이 있거나 자세가 무너질 경우 운동을 중단하고 지도자나 의료 전문가에게 확인받으세요.";
    } else if (risk === "주의") {
        riskMessage =
            "일부 동작에서 좌우 불균형이나 안정성 저하가 나타났습니다. 운동 강도와 반복 횟수를 조절하세요.";
    } else if (risk === "낮음") {
        riskMessage =
            "현재 저장된 분석에서는 큰 위험 신호가 적습니다. 준비운동과 회복을 유지하세요.";
    } else {
        riskMessage =
            "위험도를 평가할 분석 기록이 부족합니다.";
    }

    sections.push(`
        <div class="feedback-box">
            <h3>부상 위험 참고</h3>

            <div>
                <p>
                    현재 위험도:
                    <strong>
                        ${escapeHTML(risk)}
                    </strong>
                </p>

                <p>
                    ${escapeHTML(
                        riskMessage
                    )}
                </p>
            </div>
        </div>
    `);

    return sections.join("");
}

/* =========================================
   리포트 성장 그래프 데이터
========================================= */

function getReportChartData(analyses) {
    const maximumPoints = 30;

    let reducedAnalyses =
        [...analyses];

    if (
        reducedAnalyses.length >
        maximumPoints
    ) {
        const step =
            Math.ceil(
                reducedAnalyses.length /
                maximumPoints
            );

        reducedAnalyses =
            reducedAnalyses.filter(
                (_, index) => {
                    return index % step === 0;
                }
            );
    }

    return {
        labels:
            reducedAnalyses.map(
                (analysis) => {
                    return formatDate(
                        analysis.createdAt
                    );
                }
            ),

        scores:
            reducedAnalyses.map(
                (analysis) => {
                    return (
                        Number(
                            analysis.score
                        ) || 0
                    );
                }
            ),

        movements:
            reducedAnalyses.map(
                (analysis) => {
                    return (
                        analysis.movement ||
                        "동작 분석"
                    );
                }
            )
    };
}

/* =========================================
   성장 그래프 표시
========================================= */

function renderReportGrowthChart(
    analyses
) {
    const canvas =
        $("reportGrowthChart");

    if (
        !canvas ||
        typeof Chart === "undefined"
    ) {
        return;
    }

    const chartData =
        getReportChartData(
            analyses
        );

    const data = {
        labels:
            chartData.labels,

        datasets: [
            {
                label: "AI 자세 점수",

                data:
                    chartData.scores,

                borderWidth: 3,
                tension: 0.25,
                pointRadius: 4,
                pointHoverRadius: 6,
                fill: false
            }
        ]
    };

    if (reportGrowthChart) {
        reportGrowthChart.data =
            data;

        reportGrowthChart.update();

        return;
    }

    reportGrowthChart =
        new Chart(
            canvas,
            {
                type: "line",

                data,

                options: {
                    responsive: true,
                    maintainAspectRatio: false,

                    interaction: {
                        intersect: false,
                        mode: "index"
                    },

                    scales: {
                        y: {
                            min: 0,
                            max: 100,

                            title: {
                                display: true,
                                text: "AI 점수"
                            }
                        },

                        x: {
                            ticks: {
                                maxTicksLimit: 8
                            }
                        }
                    },

                    plugins: {
                        title: {
                            display: true,
                            text: "자세 분석 점수 변화"
                        },

                        legend: {
                            position: "bottom"
                        },

                        tooltip: {
                            callbacks: {
                                afterLabel(context) {
                                    return (
                                        chartData
                                            .movements[
                                                context
                                                    .dataIndex
                                            ] ||
                                        ""
                                    );
                                }
                            }
                        }
                    }
                }
            }
        );
}

/* =========================================
   빈 리포트 표시
========================================= */

function resetReportDisplay() {
    if ($("reportAverageScore")) {
        $("reportAverageScore")
            .textContent = "0";
    }

    if ($("reportOverallGrade")) {
        $("reportOverallGrade")
            .textContent = "-";
    }

    if ($("reportTrainingCount")) {
        $("reportTrainingCount")
            .textContent = "0";
    }

    if ($("reportNationalPercent")) {
        $("reportNationalPercent")
            .textContent = "0%";
    }

    const feedback =
        $("reportFeedback");

    if (feedback) {
        feedback.className =
            "empty-state";

        feedback.textContent =
            "선수를 선택하고 리포트를 생성하세요.";
    }

    renderReportGrowthChart([]);
}

/* =========================================
   리포트 저장
========================================= */

function saveGeneratedReport(
    reportData
) {
    const existingIndex =
        app.reports.findIndex(
            (report) => {
                return (
                    report.athleteId ===
                    reportData.athlete.id
                );
            }
        );

    const now =
        new Date().toISOString();

    const report = {
        id:
            existingIndex >= 0
                ? app.reports[
                    existingIndex
                ].id
                : createId("report"),

        athleteId:
            reportData.athlete.id,

        athleteName:
            reportData.athlete.name,

        averageScore:
            reportData.averageScore,

        grade:
            reportData.grade,

        analysisCount:
            reportData.analysisCount,

        trainingCount:
            reportData.trainingCount,

        nationalPercent:
            reportData.nationalPercent,

        risk:
            reportData.risk,

        createdAt:
            existingIndex >= 0
                ? app.reports[
                    existingIndex
                ].createdAt
                : now,

        updatedAt: now
    };

    if (existingIndex >= 0) {
        app.reports[
            existingIndex
        ] = report;
    } else {
        app.reports.push(report);
    }

    saveAppData();
    updateDashboard();
}

/* =========================================
   리포트 생성
========================================= */

function createAthleteReport() {
    const athleteId =
        $("reportAthleteSelect")
            ?.value || "";

    if (!athleteId) {
        showToast(
            "리포트를 생성할 선수를 선택하세요.",
            "error"
        );

        $("reportAthleteSelect")
            ?.focus();

        return;
    }

    const reportData =
        createAthleteReportData(
            athleteId
        );

    if (!reportData) {
        showToast(
            "선수 정보를 찾지 못했습니다.",
            "error"
        );

        return;
    }

    if ($("reportAverageScore")) {
        $("reportAverageScore")
            .textContent =
                reportData.averageScore;
    }

    if ($("reportOverallGrade")) {
        $("reportOverallGrade")
            .textContent =
                reportData.grade;
    }

    if ($("reportTrainingCount")) {
        $("reportTrainingCount")
            .textContent =
                reportData.trainingCount;
    }

    if ($("reportNationalPercent")) {
        $("reportNationalPercent")
            .textContent =
                `${reportData
                    .nationalPercent}%`;
    }

    const feedback =
        $("reportFeedback");

    if (feedback) {
        feedback.className = "";

        feedback.innerHTML =
            createReportFeedback(
                reportData
            );
    }

    renderReportGrowthChart(
        reportData.analyses
    );

    saveGeneratedReport(
        reportData
    );

    showToast(
        "AI 리포트가 생성되었습니다."
    );
}

/* =========================================
   PDF 저장 전 검사
========================================= */

function printAthleteReport() {
    const athleteId =
        $("reportAthleteSelect")
            ?.value || "";

    if (!athleteId) {
        showToast(
            "먼저 선수를 선택하고 리포트를 생성하세요.",
            "error"
        );

        return;
    }

    const reportData =
        createAthleteReportData(
            athleteId
        );

    if (!reportData) {
        showToast(
            "출력할 리포트를 찾지 못했습니다.",
            "error"
        );

        return;
    }

    createAthleteReport();

    setTimeout(() => {
        window.print();
    }, 150);
}

/* =========================================
   선수 선택 변경
========================================= */

function handleReportAthleteChange() {
    resetReportDisplay();
}

/* =========================================
   AI 리포트 기능 시작
========================================= */

function initializeReportManagement() {
    $("createReportButton")
        ?.addEventListener(
            "click",
            createAthleteReport
        );

    $("printReportButton")
        ?.addEventListener(
            "click",
            printAthleteReport
        );

    $("reportAthleteSelect")
        ?.addEventListener(
            "change",
            handleReportAthleteChange
        );

    resetReportDisplay();
}

/* =========================================
   AI 리포트 초기화
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {
        initializeReportManagement();
    }
);
/* =========================================
   설천고 스포츠과학센터 PRO
   main.js Part 10
   선수 랭킹·백업·복원·초기화
========================================= */

/* =========================================
   선수 랭킹 점수 계산
========================================= */

function calculateAthleteRankingScore(
    athleteId,
    sportFilter = "전체"
) {
    let analyses =
        getAthleteAllAnalyses(
            athleteId
        );

    if (sportFilter !== "전체") {
        analyses = analyses.filter(
            (analysis) =>
                analysis.sportId ===
                sportFilter
        );
    }

    if (analyses.length === 0) {
        return {
            score: 0,
            averageScore: 0,
            analysisCount: 0,
            trainingCount: 0,
            nationalPercent: 0,
            grade: "-"
        };
    }

    const averageScore =
        Math.round(
            analyses.reduce(
                (sum, analysis) => {
                    return (
                        sum +
                        (
                            Number(
                                analysis.score
                            ) || 0
                        )
                    );
                },
                0
            ) / analyses.length
        );

    const trainingCount =
        getAthleteTrainingCount(
            athleteId
        );

    let nationalComparisons =
        app.nationalComparisons.filter(
            (comparison) =>
                comparison.athleteId ===
                athleteId
        );

    if (sportFilter !== "전체") {
        nationalComparisons =
            nationalComparisons.filter(
                (comparison) =>
                    comparison.sportId ===
                    sportFilter
            );
    }

    const nationalPercent =
        nationalComparisons.length > 0
            ? Math.round(
                nationalComparisons.reduce(
                    (sum, comparison) => {
                        return (
                            sum +
                            (
                                Number(
                                    comparison.percent
                                ) || 0
                            )
                        );
                    },
                    0
                ) /
                nationalComparisons.length
            )
            : 0;

    const analysisBonus =
        Math.min(
            10,
            analyses.length * 0.7
        );

    const trainingBonus =
        Math.min(
            8,
            trainingCount * 0.3
        );

    const nationalBonus =
        nationalPercent > 0
            ? Math.min(
                12,
                nationalPercent * 0.12
            )
            : 0;

    const rankingScore =
        Math.round(
            clampNumber(
                averageScore * 0.75 +
                analysisBonus +
                trainingBonus +
                nationalBonus,
                0,
                120
            )
        );

    return {
        score:
            rankingScore,

        averageScore,

        analysisCount:
            analyses.length,

        trainingCount,

        nationalPercent,

        grade:
            getRankingGrade(
                rankingScore
            )
    };
}

/* =========================================
   랭킹 등급
========================================= */

function getRankingGrade(score) {
    const numericScore =
        Number(score);

    if (numericScore >= 105) {
        return "S+";
    }

    if (numericScore >= 95) {
        return "S";
    }

    if (numericScore >= 88) {
        return "A+";
    }

    if (numericScore >= 80) {
        return "A";
    }

    if (numericScore >= 70) {
        return "B";
    }

    if (numericScore >= 60) {
        return "C";
    }

    if (numericScore > 0) {
        return "D";
    }

    return "-";
}

/* =========================================
   랭킹 생성
========================================= */

function createAthleteRanking(
    sportFilter = "전체"
) {
    return app.athletes
        .map((athlete) => {
            const result =
                calculateAthleteRankingScore(
                    athlete.id,
                    sportFilter
                );

            return {
                athlete,
                ...result
            };
        })
        .filter((item) => {
            return item.analysisCount > 0;
        })
        .sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score;
            }

            if (
                b.averageScore !==
                a.averageScore
            ) {
                return (
                    b.averageScore -
                    a.averageScore
                );
            }

            return (
                b.analysisCount -
                a.analysisCount
            );
        });
}

/* =========================================
   랭킹 화면
========================================= */

function renderRanking() {
    const container =
        $("rankingList");

    if (!container) {
        return;
    }

    const sportFilter =
        $("rankingSportFilter")
            ?.value || "전체";

    const ranking =
        createAthleteRanking(
            sportFilter
        );

    if (ranking.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                ${
                    sportFilter === "전체"
                        ? "랭킹에 표시할 분석 데이터가 없습니다."
                        : "선택한 종목의 분석 데이터가 없습니다."
                }
            </div>
        `;

        return;
    }

    container.innerHTML =
        ranking.map(
            (item, index) => {
                const athlete =
                    item.athlete;

                const sportText =
                    sportFilter === "전체"
                        ? athlete.sport || "종목 미지정"
                        : getSportById(
                            sportFilter
                        )?.name || "선택 종목";

                return `
                    <article class="ranking-item">

                        <div class="ranking-position">
                            ${index + 1}
                        </div>

                        <div class="ranking-athlete">

                            <strong>
                                ${escapeHTML(
                                    athlete.name
                                )}
                            </strong>

                            <small>
                                ${escapeHTML(
                                    sportText
                                )}
                                · 분석
                                ${escapeHTML(
                                    item.analysisCount
                                )}건
                                · 훈련
                                ${escapeHTML(
                                    item.trainingCount
                                )}건
                            </small>

                        </div>

                        <div class="ranking-score">
                            ${escapeHTML(
                                item.score
                            )}점
                        </div>

                        <div class="ranking-grade">
                            ${escapeHTML(
                                item.grade
                            )}
                        </div>

                    </article>
                `;
            }
        ).join("");
}

/* =========================================
   백업 데이터 생성
========================================= */

function createBackupData() {
    return {
        application:
            "Seolcheon Sports Science Center PRO",

        version:
            app.version,

        exportedAt:
            new Date().toISOString(),

        data: {
            athletes:
                app.athletes,

            sportsRecords:
                app.sportsRecords,

            trainingRecords:
                app.trainingRecords,

            liveAnalyses:
                app.liveAnalyses,

            videoAnalyses:
                app.videoAnalyses,

            collegeRecords:
                app.collegeRecords,

            nationalComparisons:
                app.nationalComparisons,

            reports:
                app.reports,

            settings:
                app.settings
        }
    };
}

/* =========================================
   백업 파일 저장
========================================= */

function exportBackupFile() {
    try {
        const backupData =
            createBackupData();

        const jsonText =
            JSON.stringify(
                backupData,
                null,
                2
            );

        const blob =
            new Blob(
                [jsonText],
                {
                    type:
                        "application/json;charset=utf-8"
                }
            );

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;

        link.download =
            `설천고_스포츠과학센터_백업_${getTodayString()}.json`;

        document.body.appendChild(link);

        link.click();
        link.remove();

        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 1000);

        showToast(
            "백업 파일을 저장했습니다."
        );
    } catch (error) {
        console.error(
            "백업 파일 생성 오류:",
            error
        );

        showToast(
            "백업 파일을 만들지 못했습니다.",
            "error"
        );
    }
}

/* =========================================
   백업 데이터 검사
========================================= */

function validateBackupData(
    parsedData
) {
    if (
        !parsedData ||
        typeof parsedData !== "object"
    ) {
        return false;
    }

    const data =
        parsedData.data ||
        parsedData;

    if (
        !data ||
        typeof data !== "object"
    ) {
        return false;
    }

    const arrayKeys = [
        "athletes",
        "sportsRecords",
        "trainingRecords",
        "liveAnalyses",
        "videoAnalyses",
        "collegeRecords",
        "nationalComparisons",
        "reports"
    ];

    const hasValidArray =
        arrayKeys.some((key) => {
            return Array.isArray(data[key]);
        });

    return hasValidArray;
}

/* =========================================
   백업 데이터 적용
========================================= */

function applyBackupData(
    parsedData
) {
    const data =
        parsedData.data ||
        parsedData;

    app.athletes =
        Array.isArray(data.athletes)
            ? data.athletes
            : [];

    app.sportsRecords =
        Array.isArray(
            data.sportsRecords
        )
            ? data.sportsRecords
            : [];

    app.trainingRecords =
        Array.isArray(
            data.trainingRecords
        )
            ? data.trainingRecords
            : [];

    app.liveAnalyses =
        Array.isArray(
            data.liveAnalyses
        )
            ? data.liveAnalyses
            : [];

    app.videoAnalyses =
        Array.isArray(
            data.videoAnalyses
        )
            ? data.videoAnalyses
            : [];

    app.collegeRecords =
        Array.isArray(
            data.collegeRecords
        )
            ? data.collegeRecords
            : [];

    app.nationalComparisons =
        Array.isArray(
            data.nationalComparisons
        )
            ? data.nationalComparisons
            : [];

    app.reports =
        Array.isArray(data.reports)
            ? data.reports
            : [];

    app.settings = {
        selectedSport: "",
        selectedMovement: "",

        ...(
            data.settings &&
            typeof data.settings ===
                "object"
                ? data.settings
                : {}
        )
    };
}

/* =========================================
   백업 불러오기
========================================= */

function importBackupFile(event) {
    const input =
        event.target;

    const file =
        input.files?.[0];

    if (!file) {
        return;
    }

    const reader =
        new FileReader();

    reader.onload = () => {
        try {
            const parsedData =
                JSON.parse(
                    String(reader.result)
                );

            if (
                !validateBackupData(
                    parsedData
                )
            ) {
                throw new Error(
                    "지원하지 않는 백업 파일입니다."
                );
            }

            const confirmed =
                confirm(
                    "현재 저장된 데이터를 백업 파일 내용으로 교체하시겠습니까?"
                );

            if (!confirmed) {
                input.value = "";
                return;
            }

            stopLiveCamera(false);
            stopVideoAnalysis(false);

            applyBackupData(
                parsedData
            );

            saveAppData();

            resetAthleteForm();
            resetLiveAnalysisState();
            resetVideoAnalysisState();
            resetNationalComparisonDisplay();
            resetReportDisplay();

            renderAthleteSportInput();
            initializeAnalysisSportSelects();

            refreshAllScreens();
            renderSportsCategories();
            renderRankingSportFilter();

            openPage("dashboard");

            showToast(
                "백업 데이터를 불러왔습니다."
            );
        } catch (error) {
            console.error(
                "백업 불러오기 오류:",
                error
            );

            showToast(
                "올바른 백업 파일이 아닙니다.",
                "error"
            );
        } finally {
            input.value = "";
        }
    };

    reader.onerror = () => {
        showToast(
            "백업 파일을 읽지 못했습니다.",
            "error"
        );

        input.value = "";
    };

    reader.readAsText(file);
}

/* =========================================
   전체 데이터 초기화
========================================= */

function resetAllApplicationData() {
    const firstConfirmed =
        confirm(
            "선수 정보와 모든 분석·훈련 기록을 삭제하시겠습니까?"
        );

    if (!firstConfirmed) {
        return;
    }

    const secondConfirmed =
        confirm(
            "삭제된 데이터는 백업 파일이 없으면 복구할 수 없습니다. 정말 초기화하시겠습니까?"
        );

    if (!secondConfirmed) {
        return;
    }

    stopLiveCamera(false);
    stopVideoAnalysis(false);

    app.athletes = [];
    app.sportsRecords = [];
    app.trainingRecords = [];
    app.liveAnalyses = [];
    app.videoAnalyses = [];
    app.collegeRecords = [];
    app.nationalComparisons = [];
    app.reports = [];

    app.settings = {
        selectedSport: "",
        selectedMovement: ""
    };

    localStorage.removeItem(
        STORAGE_KEY
    );

    resetAthleteForm();
    resetLiveAnalysisState();
    resetVideoAnalysisState();
    resetNationalComparisonDisplay();
    resetReportDisplay();

    refreshAllScreens();
    renderSportsCategories();
    renderRankingSportFilter();

    openPage("dashboard");

    updateStorageStatus(true);

    showToast(
        "전체 데이터가 초기화되었습니다."
    );
}

/* =========================================
   설정 기능 초기화
========================================= */

function initializeSettingsManagement() {
    $("exportBackupButton")
        ?.addEventListener(
            "click",
            exportBackupFile
        );

    $("importBackupInput")
        ?.addEventListener(
            "change",
            importBackupFile
        );

    $("resetAllDataButton")
        ?.addEventListener(
            "click",
            resetAllApplicationData
        );
}

/* =========================================
   랭킹 기능 초기화
========================================= */

function initializeRankingManagement() {
    $("refreshRankingButton")
        ?.addEventListener(
            "click",
            () => {
                renderRanking();

                showToast(
                    "선수 랭킹을 새로고침했습니다."
                );
            }
        );

    $("rankingSportFilter")
        ?.addEventListener(
            "change",
            renderRanking
        );
}

/* =========================================
   Part 10 시작
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {
        initializeRankingManagement();
        initializeSettingsManagement();

        renderRanking();
    }
);
/* =========================================
   설천고 스포츠과학센터 PRO
   main.js Part 11
   최종 연결·오류 방지·마무리
========================================= */

/* =========================================
   안전한 함수 실행
========================================= */

function safelyRun(
    functionName,
    callback
) {
    try {
        if (typeof callback === "function") {
            callback();
        }
    } catch (error) {
        console.error(
            `${functionName} 실행 오류:`,
            error
        );
    }
}

/* =========================================
   데이터 배열 안전 검사
========================================= */

function normalizeApplicationData() {
    const arrayKeys = [
        "athletes",
        "sportsRecords",
        "trainingRecords",
        "liveAnalyses",
        "videoAnalyses",
        "collegeRecords",
        "nationalComparisons",
        "reports"
    ];

    arrayKeys.forEach((key) => {
        if (!Array.isArray(app[key])) {
            app[key] = [];
        }
    });

    if (
        !app.settings ||
        typeof app.settings !== "object"
    ) {
        app.settings = {
            selectedSport: "",
            selectedMovement: ""
        };
    }

    if (
        typeof app.settings.selectedSport !==
        "string"
    ) {
        app.settings.selectedSport = "";
    }

    if (
        typeof app.settings.selectedMovement !==
        "string"
    ) {
        app.settings.selectedMovement = "";
    }
}

/* =========================================
   오래된 선수 데이터 보완
========================================= */

function normalizeAthleteData() {
    app.athletes = app.athletes
        .filter((athlete) => {
            return (
                athlete &&
                typeof athlete === "object"
            );
        })
        .map((athlete) => {
            const now =
                new Date().toISOString();

            return {
                id:
                    athlete.id ||
                    createId("athlete"),

                name:
                    String(
                        athlete.name || "이름 없음"
                    ),

                gender:
                    athlete.gender ||
                    "선택 안 함",

                birth:
                    athlete.birth || "",

                team:
                    athlete.team || "",

                sport:
                    athlete.sport || "기타",

                detail:
                    athlete.detail || "",

                height:
                    parseOptionalNumber(
                        athlete.height
                    ),

                weight:
                    parseOptionalNumber(
                        athlete.weight
                    ),

                memo:
                    athlete.memo || "",

                createdAt:
                    athlete.createdAt || now,

                updatedAt:
                    athlete.updatedAt ||
                    athlete.createdAt ||
                    now
            };
        });
}

/* =========================================
   연결 기록 선수 이름 복구
========================================= */

function repairConnectedRecordNames() {
    const recordCollections = [
        app.trainingRecords,
        app.liveAnalyses,
        app.videoAnalyses,
        app.collegeRecords,
        app.nationalComparisons,
        app.reports
    ];

    recordCollections.forEach(
        (records) => {
            records.forEach((record) => {
                if (!record?.athleteId) {
                    return;
                }

                const athlete =
                    getAthleteById(
                        record.athleteId
                    );

                if (
                    athlete &&
                    !record.athleteName
                ) {
                    record.athleteName =
                        athlete.name;
                }
            });
        }
    );
}

/* =========================================
   선택값 유효성 검사
========================================= */

function normalizeSelectedSport() {
    const selectedSport =
        app.settings.selectedSport;

    if (
        selectedSport &&
        !getSportById(selectedSport)
    ) {
        app.settings.selectedSport = "";
        app.settings.selectedMovement = "";

        return;
    }

    if (!selectedSport) {
        app.settings.selectedMovement = "";
        return;
    }

    const sport =
        getSportById(selectedSport);

    if (
        app.settings.selectedMovement &&
        !sport.movements.includes(
            app.settings.selectedMovement
        )
    ) {
        app.settings.selectedMovement = "";
    }
}

/* =========================================
   버튼 초기 상태
========================================= */

function initializeButtonStates() {
    const liveStopButton =
        $("stopLiveCameraButton");

    const liveCaptureButton =
        $("captureLiveButton");

    const liveSaveButton =
        $("saveLiveAnalysisButton");

    const videoStartButton =
        $("startVideoAnalysisButton");

    const videoPauseButton =
        $("pauseVideoAnalysisButton");

    const videoSaveButton =
        $("saveVideoAnalysisButton");

    if (liveStopButton) {
        liveStopButton.disabled = true;
    }

    if (liveCaptureButton) {
        liveCaptureButton.disabled = true;
    }

    if (liveSaveButton) {
        liveSaveButton.disabled = true;
    }

    if (
        videoStartButton &&
        !videoAnalysisState.fileUrl
    ) {
        videoStartButton.disabled = true;
    }

    if (videoPauseButton) {
        videoPauseButton.disabled = true;
    }

    if (videoSaveButton) {
        videoSaveButton.disabled = true;
    }
}

/* =========================================
   메뉴 버튼 키보드 지원
========================================= */

function initializeKeyboardNavigation() {
    $all(".menu-button").forEach(
        (button) => {
            button.addEventListener(
                "keydown",
                (event) => {
                    if (
                        event.key !== "Enter" &&
                        event.key !== " "
                    ) {
                        return;
                    }

                    event.preventDefault();

                    openPage(
                        button.dataset.page
                    );
                }
            );
        }
    );

    document.addEventListener(
        "keydown",
        (event) => {
            if (event.key !== "Escape") {
                return;
            }

            closeMobileSidebar();

            if (
                liveAnalysisState.running
            ) {
                stopLiveCamera(false);
            }

            if (
                videoAnalysisState.running
            ) {
                stopVideoAnalysis(false);
            }
        }
    );
}

/* =========================================
   선택창 중복 이벤트 방지
========================================= */

function safelyRefreshAnalysisSelects() {
    ANALYSIS_SELECT_GROUPS.forEach(
        (group) => {
            const sportSelect =
                $(group.sportId);

            const movementSelect =
                $(group.movementId);

            if (
                !sportSelect ||
                !movementSelect
            ) {
                return;
            }

            const selectedSport =
                sportSelect.value;

            const selectedMovement =
                movementSelect.value;

            renderSportSelect(
                sportSelect,
                true
            );

            if (
                selectedSport &&
                getSportById(selectedSport)
            ) {
                sportSelect.value =
                    selectedSport;
            }

            renderMovementSelect(
                sportSelect,
                movementSelect,
                group.placeholder
            );

            const sport =
                getSportById(
                    sportSelect.value
                );

            if (
                sport &&
                sport.movements.includes(
                    selectedMovement
                )
            ) {
                movementSelect.value =
                    selectedMovement;
            }
        }
    );
}

/* =========================================
   전체 화면 최종 렌더링
========================================= */

function finalRenderApplication() {
    safelyRun(
        "선수 표 렌더링",
        renderAthleteTable
    );

    safelyRun(
        "선수 선택창 렌더링",
        renderAthleteSelects
    );

    safelyRun(
        "스포츠 종목 렌더링",
        renderSportsCategories
    );

    safelyRun(
        "분석 선택창 렌더링",
        safelyRefreshAnalysisSelects
    );

    safelyRun(
        "훈련 기록 렌더링",
        renderTrainingRecords
    );

    safelyRun(
        "체대입시 화면 렌더링",
        updateCollegeDashboard
    );

    safelyRun(
        "선수 랭킹 렌더링",
        renderRanking
    );

    safelyRun(
        "대시보드 렌더링",
        updateDashboard
    );

    safelyRun(
        "랭킹 필터 렌더링",
        renderRankingSportFilter
    );
}

/* =========================================
   화면 크기 변경 처리
========================================= */

let resizeTimer = null;

function handleApplicationResize() {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
        safelyRun(
            "실시간 캔버스 조절",
            resizeLiveCanvas
        );

        safelyRun(
            "영상 캔버스 조절",
            resizeVideoCanvas
        );

        if (
            window.innerWidth > 1024
        ) {
            closeMobileSidebar();
        }

        if (reportGrowthChart) {
            reportGrowthChart.resize();
        }

        if (nationalComparisonChart) {
            nationalComparisonChart.resize();
        }

        if (videoAnalysisState.chart) {
            videoAnalysisState.chart.resize();
        }
    }, 150);
}

/* =========================================
   페이지 숨김 처리
========================================= */

function handlePageVisibilityChange() {
    if (!document.hidden) {
        return;
    }

    if (liveAnalysisState.running) {
        stopLiveCamera(false);
    }

    if (
        videoAnalysisState.running &&
        !videoAnalysisState.paused
    ) {
        toggleVideoAnalysisPause();
    }
}

/* =========================================
   비정상 영상 URL 정리
========================================= */

function cleanupVideoObjectUrl() {
    if (!videoAnalysisState.fileUrl) {
        return;
    }

    URL.revokeObjectURL(
        videoAnalysisState.fileUrl
    );

    videoAnalysisState.fileUrl = null;
}

/* =========================================
   최종 데이터 저장
========================================= */

function saveBeforeApplicationClose() {
    safelyRun(
        "카메라 종료",
        () => {
            stopLiveCamera(false);
        }
    );

    safelyRun(
        "영상 분석 종료",
        () => {
            stopVideoAnalysis(false);
        }
    );

    safelyRun(
        "최종 데이터 저장",
        saveAppData
    );

    cleanupVideoObjectUrl();
}

/* =========================================
   라이브러리 상태 확인
========================================= */

function checkExternalLibraries() {
    const missingLibraries = [];

    if (
        typeof Chart === "undefined"
    ) {
        missingLibraries.push(
            "Chart.js"
        );
    }

    if (
        typeof Pose === "undefined"
    ) {
        missingLibraries.push(
            "MediaPipe Pose"
        );
    }

    if (
        typeof drawConnectors ===
        "undefined"
    ) {
        missingLibraries.push(
            "MediaPipe Drawing Utils"
        );
    }

    if (
        missingLibraries.length > 0
    ) {
        console.warn(
            "불러오지 못한 외부 라이브러리:",
            missingLibraries.join(", ")
        );

        showToast(
            "일부 분석 라이브러리를 불러오지 못했습니다.",
            "error"
        );

        return false;
    }

    return true;
}

/* =========================================
   로딩 화면 강제 종료
========================================= */

function forceCloseLoadingScreen() {
    const loadingScreen =
        $("loadingScreen");

    if (!loadingScreen) {
        return;
    }

    loadingScreen.classList.add("hide");

    setTimeout(() => {
        loadingScreen.style.display =
            "none";
    }, 500);
}

/* =========================================
   전역 오류 처리
========================================= */

window.addEventListener(
    "error",
    (event) => {
        console.error(
            "페이지 실행 오류:",
            event.error ||
            event.message
        );
    }
);

window.addEventListener(
    "unhandledrejection",
    (event) => {
        console.error(
            "비동기 실행 오류:",
            event.reason
        );
    }
);

/* =========================================
   최종 초기화
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {
        safelyRun(
            "앱 데이터 정리",
            () => {
                normalizeApplicationData();
                normalizeAthleteData();
                repairConnectedRecordNames();
                normalizeSelectedSport();
            }
        );

        safelyRun(
            "버튼 상태 설정",
            initializeButtonStates
        );

        safelyRun(
            "키보드 기능 설정",
            initializeKeyboardNavigation
        );

        safelyRun(
            "전체 화면 렌더링",
            finalRenderApplication
        );

        safelyRun(
            "외부 라이브러리 확인",
            checkExternalLibraries
        );

        safelyRun(
            "최종 데이터 저장",
            saveAppData
        );

        window.addEventListener(
            "resize",
            handleApplicationResize
        );

        document.addEventListener(
            "visibilitychange",
            handlePageVisibilityChange
        );

        window.addEventListener(
            "pagehide",
            saveBeforeApplicationClose
        );

        setTimeout(
            forceCloseLoadingScreen,
            1000
        );

        console.log(
            "설천고 스포츠과학센터 PRO 초기화 완료"
        );
    }
);
/* ===========================================
   Camera Switch
=========================================== */

async function switchCamera() {

    currentFacingMode =
        currentFacingMode === "user"
            ? "environment"
            : "user";

    stopLiveCamera(false);

    setTimeout(async () => {

        await startLiveCamera();

    }, 300);

}

document
.getElementById("switchCameraButton")
?.addEventListener(
    "click",
    switchCamera
);