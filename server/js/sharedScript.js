function generateTimeOptions(selectedDate, bookedTimes) {
    const dayOfWeek = selectedDate.getDay();
    const availableTimeSlots = [];
        // console.log(dayOfWeek);

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

        const selectedDateFormat = selectedDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });

        
        // console.log("Booked times: ", bookedTimes);
        console.log("Selected date format:", selectedDateFormat);
        const bookedTimesOnSelectedDate = bookedTimes
            .filter((booking) => {
                console.log("booking.date:",booking.date);
                return booking.date === selectedDateFormat
            })
            .map((booking) => booking.time.toLowerCase());
        // console.log("Booked Times on Selected Date:", bookedTimesOnSelectedDate);

        while (startTime <= endTime) {
            const hours = startTime.getHours();
            const minutes = startTime.getMinutes();
            const AMorPM = hours >= 12 ? "PM" : "AM";
            const hours12 = hours % 12 || 12;

            const timeValue = `${hours12}:${minutes.toString().padStart(2, "0")} ${AMorPM}`;
            const formattedTime = timeValue.toLowerCase();

            if (!bookedTimesOnSelectedDate.includes(formattedTime)) {
                availableTimeSlots.push(timeValue); 
            }
            startTime.setTime(startTime.getTime() + 15 * 60 * 1000); 
        }
        // console.log(timeOptions);
        return availableTimeSlots;
}

function updateAvailableTimes(selectedDateStr, timePicker) {
    const selectedDate = new Date(selectedDateStr);

    const timeDataElement = document.getElementById("timeData");
    const timeDataJSON = timeDataElement.getAttribute("data-time-data");
    const timeData = JSON.parse(timeDataJSON);

    const availableTimeSlots = generateTimeOptions(selectedDate, timeData);
    console.log('Date:', selectedDate, 'Available Times:', availableTimeSlots);
    timePicker.innerHTML = "";
    availableTimeSlots.forEach((timeSlot) => {
        const optionElement = document.createElement("option");
        optionElement.value = timeSlot;
        optionElement.textContent = timeSlot;
        timePicker.appendChild(optionElement);
    });

    // console.log(timeOptions);
    // console.log(selectedDateStr);
}

