const currentDate = document.querySelector(".current-date");
const daysTag = document.querySelector(".days");
const prevNextIcon = document.querySelectorAll(".icons span");
const dateForm = document.getElementById("homeForm");
const selectedDateInput = document.getElementById("selectedDateInput");

let date = new Date();
let currYear = date.getFullYear();
let currMonth = date.getMonth();

const months = ["January", "February", "March", "April", "May", "June", "July", 
                "August", "September", "October", "November", "December"];

let selectedDate = null;

const hourRange = {
    Monday: { open: null, close: null },
    Tuesday: { open: "10:00 AM", close: "04:00 PM" },
    Wednesday: { open: "10:00 AM", close: "04:00 PM" },
    Thursday: { open: "10:00 AM", close: "04:00 PM" },
    Friday: { open: "10:00 AM", close: "04:00 PM" },
    Saturday: { open: "08:00 AM", close: "04:00 PM" },
    Sunday: { open: "11:00 AM", close: "04:00 PM" },
};

const updateFormTime = (selectedDay) => {
    const { open, close } = hourRange[selectedDay];
    if (!open || !close) {
        console.log("Closed");
        return;
    }

    const [openTime, openPeriod] = open.split(" ");
    const [openHour, openMinute] = open.split(":");
    const [closeTime, closePeriod] = close.split(" ");
    const [closeHour, closeMinute] = close.split(":");

    const startTime = new Date();
    startTime.setHours(parseInt(openHour), parseInt(openMinute), 0, 0);
    if (openMinute === "PM") {
        startTime.setHours(startTime.getHours() + 12);
    }

    const endTime = new Date();
    endTime.setHours(parseInt(closeHour), parseInt(closeMinute), 0, 0);
    if (closePeriod === "PM") {
        endTime.setHours(endTime.getHours() + 12);
    }

    const timeStep = 15;
    const timesArray = [];

    for (let currentTime = new Date(startTime); currentTime <= endTime; currentTime.setMinutes(currentTime.getMinutes() + timeStep)) {
        const formattedTime = currentTime.toLocaleString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
        timesArray.push(formattedTime);
    }

    console.log(timesArray);
}

const renderCalendar = () => {
    date = new Date(currYear, currMonth, 1);

    let firstDayOfMonth = date.getDay();
    let lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate();
    let lastDayOfMonth = new Date(currYear, currMonth, lastDateOfMonth).getDay();
    let lastDateOfLastMonth = new Date(currYear, currMonth, 0).getDate();
    let liTag = "";

    for (let i = firstDayOfMonth; i > 0; i--) {
        liTag += `<li class="inactive">${lastDateOfLastMonth - i + 1}</li>`;
    }

    for (let i = 1; i <= lastDateOfMonth; i++) {
        let isSelected = selectedDate && i === selectedDate.getDate() &&
                         currMonth === selectedDate.getMonth() &&
                         currYear === selectedDate.getFullYear();
        liTag += `<li class="${isSelected ? "active" : ""}">${i}</li>`;
    }

    for (let i = lastDayOfMonth; i < 6; i++) {
        liTag += `<li class="inactive">${i - lastDayOfMonth + 1}</li>`;
    }

    currentDate.innerText = `${months[currMonth]} ${currYear}`
    daysTag.innerHTML = liTag;

    const dayElements = daysTag.querySelectorAll("li");
    dayElements.forEach((dayElement) => {
        dayElement.addEventListener("click", () => {
            dayElements.forEach((el) => {
                el.classList.remove("active");
            });

            if (!dayElement.classList.contains("inactive")) {
                dayElement.classList.add("active");
                selectedDate = new Date(currYear, currMonth, parseInt(dayElement.innerText));
                selectedDateInput.value = formatDate(selectedDate);
                const selectedDay = selectedDate.toLocaleString("en-US", { weekday: "long" });
                console.log(selectedDay);
                updateFormTime(selectedDay);
            }
        });
    });
}

const formatDate = (date) => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
};

dateForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const selectedDate = selectedDateInput.value;
    console.log(selectedDate);
});



renderCalendar();

prevNextIcon.forEach(icon => {
    icon.addEventListener("click", () => {
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

        if (currMonth < 0 || currMonth > 11) {
            date = new Date(currYear, currMonth);
            currYear = date.getFullYear();
            currMonth = date.getMonth();
        } else {
            date = new Date();
        }

        renderCalendar();
    });
});