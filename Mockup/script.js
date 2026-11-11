const completedCourses = [
    { code: "CS 1301", name: "Introduction to Programming", credits: 3 },
    { code: "MATH 1201", name: "College Algebra", credits: 3 },
    { code: "ENG 101", name: "Composition", credits: 3 },
    { code: "CS 2303", name: "Data Structures", credits: 3 },
    { code: "MATH 2201", name: "Discrete Mathematics", credits: 3 }
];

const remainingCourses = [
    { code: "CS 3301", name: "Algorithms", credits: 3 },
    { code: "CS 3402", name: "Operating Systems", credits: 3 },
    { code: "CS 3500", name: "Database Systems", credits: 3 },
    { code: "CS 4100", name: "Senior Capstone", credits: 3 },
    { code: "CS  Elective", name: "Computer Science Elective", credits: 3 }
];

const availableCourses = [...remainingCourses];


const semesterPlans = {
    "Spring 2027": [],
    "Fall 2027": [],
    "Spring 2028": []
};
const modal = document.getElementById("course-modal");
const modalTitle = document.getElementById("modal-title");
const modalCourseList = document.getElementById("modal-course-list");

function openCourseModal(title, courses) {
    modalTitle.textContent = title;
    modalCourseList.replaceChildren();

    courses.forEach(course => {
        const card = document.createElement("div");
        card.className = "course-card";

        const courseTitle = document.createElement("h3");
        courseTitle.textContent = `${course.code} - ${course.name}`;

        const details = document.createElement("p");
        details.textContent = `${course.credits} credits`;

        card.append(courseTitle, details);
        modalCourseList.appendChild(card);
    });

    modal.classList.remove("hidden");
}

function displayPreview(courses, listId) {
    const list = document.getElementById(listId);

    courses.slice(0, 3).forEach(course => {
        const card = document.createElement("div");
        card.className = "course-card";

        const title = document.createElement("h3");
        title.textContent = `${course.code} - ${course.name}`;

        const details = document.createElement("p");
        details.textContent = `${course.credits} credits`;

        card.append(title, details);
        list.appendChild(card);
    });
}

function showAvailableCourses() {
    const list = document.getElementById("available-courses");

    list.replaceChildren();

    availableCourses.forEach(course => {
        const card = document.createElement("div");
        card.className = "course-card";
        card.draggable = true;

        card.innerHTML = `
            <h4>${course.code} - ${course.name}</h4>
            <p>${course.credits} credits</p>
        `;

        card.addEventListener("dragstart", event => {
            event.dataTransfer.setData("text/plain", course.code);
        });

        list.appendChild(card);
    });

}

function showSemesterCourses() {
    const list = document.getElementById("semester-courses");
    const semester = document.getElementById("semester-choose").value;

    list.replaceChildren();

    semesterPlans[semester].forEach(course => {
        const card = document.createElement("div");
        card.className = "course-card";

        const title = document.createElement("h3");
        title.textContent = `${course.code} - ${course.name}`;

        const details = document.createElement("p");
        details.textContent = `${course.credits} credits`;

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";

        removeButton.addEventListener("click", function() {
            
            semesterPlans[semester] = semesterPlans[semester].filter(
                c => c.code !== course.code
            );

            availableCourses.push(course);

            showAvailableCourses();
            showSemesterCourses();
        });

        card.append(title, details, removeButton);
        list.appendChild(card);
    });
}

displayPreview(completedCourses, "completed-preview");
displayPreview(remainingCourses, "remaining-preview");

document.getElementById("completed-button")
    .addEventListener("click", function() {
        openCourseModal("Completed Courses", completedCourses);
    });

document.getElementById("remaining-button")
    .addEventListener("click", function() {
        openCourseModal("Remaining Courses", remainingCourses);
    });

document.getElementById("close-modal")
    .addEventListener("click", function() {
        modal.classList.add("hidden");
    });

showAvailableCourses();

const semesterList = document.getElementById("semester-courses");
const semesterChoose = document.getElementById("semester-choose");

semesterList.addEventListener("dragover", function(event) {
    event.preventDefault();
    semesterList.classList.add("drag-over");
});

semesterList.addEventListener("dragleave", function() {
    semesterList.classList.remove("drag-over");
});

semesterList.addEventListener("drop", function(event) {
    event.preventDefault();
    semesterList.classList.remove("drag-over");

    const courseCode = event.dataTransfer.getData("text/plain");
    const courseIndex = availableCourses.findIndex(
        course => course.code === courseCode
    );

    if (courseIndex === -1) {
        return;
    }

    const course = availableCourses[courseIndex];
    const semester = semesterChoose.value;

    semesterPlans[semester].push(course);

    availableCourses.splice(courseIndex, 1);

    showAvailableCourses();
    showSemesterCourses();
});

semesterChoose.addEventListener("change", function() {
    showSemesterCourses();
});

showSemesterCourses();