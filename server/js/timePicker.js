document.addEventListener("DOMContentLoaded", function() {
    const datePicker = document.getElementById("datePicker");
    const timePicker = document.getElementById("timePicker");

    function generateTimeOptions(selectedDate, bookedTimesOnSelectedDate) {
        const dayOfWeek = selectedDate.getDay();
        // console.log(dayOfWeek);
        const timeOptions = [];

        const startTime = new Date(selectedDate);
        const endTime = new Date(selectedDate);
        endTime.setHours(23, 45, 0); // Set default end time

        if (dayOfWeek === 0) {
            // console.log("sun")
            startTime.setHours(11, 0, 0);
            endTime.setHours(16, 0, 0);
        } else if (dayOfWeek >= 2 && dayOfWeek <= 5) {
            // console.log("tues-f")
            startTime.setHours(10, 0, 0);
            endTime.setHours(16, 0, 0);
        } else if (dayOfWeek === 6) {
            // console.log("sat")
            startTime.setHours(8, 0, 0);
            endTime.setHours(16, 0, 0);
        }

        while (startTime <= endTime) {
            const hours = startTime.getHours();
            const minutes = startTime.getMinutes();
            const AMorPM = hours >= 12 ? "PM" : "AM";
            const hours12 = hours % 12 || 12;

            const timeValue = `${hours12}:${minutes.toString().padStart(2, "0")} ${AMorPM}`;
            const formattedTime = timeValue.toLowerCase();

            if (!bookedTimesOnSelectedDate.includes(formattedTime)) {
                timeOptions.push({
                    value: timeValue,
                    label: timeValue
                });
            }

            startTime.setTime(startTime.getTime() + 15 * 60 * 1000); 
        }
        // console.log(timeOptions);
        return timeOptions;
    }

    function updateAvailableTimes(selectedDateStr) {
        const selectedDate = new Date(selectedDateStr);

        const timeDataElement = document.getElementById("timeData");
        const timeDataJSON = timeDataElement.getAttribute("data-time-data");
        const bookedTimesOnSelectedDate = JSON.parse(timeDataJSON)
            .filter((booking) => booking.date === selectedDateStr)
            .map((booking) => booking.time.toLowerCase());

        console.log("date:", selectedDate, "times:", bookedTimesOnSelectedDate);

        const timeOptions = generateTimeOptions(selectedDate, bookedTimesOnSelectedDate);
        timePicker.innerHTML = "";
        timeOptions.forEach((option) => {
            const optionElement = document.createElement("option");
            optionElement.value = option.value;
            optionElement.textContent = option.label;
            timePicker.appendChild(optionElement);
        });
    }

    function onDatePickerInput() {
        const selectedDateStr = datePicker.value;
        updateAvailableTimes(selectedDateStr);
    }

    updateAvailableTimes(datePicker.value);
    datePicker.addEventListener("input", onDatePickerInput);
});
