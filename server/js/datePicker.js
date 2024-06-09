jQuery(document).ready(function($) {
    // Define an array of dates to be disabled
    var disabledDays = [1]; // 0 represents Sunday, 1 represents Monday, and so on

    var disabledDates = [
        '01-01', // New Year's Day (Month-Day format: MM-DD)
        '12-25', // December 25th
        '12-26', // December 26th
        getEasterSundayDate(), // Easter Sunday (calculated dynamically)
        '07-04', // July 4th
        getThanksgivingDate(), // Thanksgiving Day (calculated dynamically)
        getDayAfterThanksgivingDate() // Day after Thanksgiving (calculated dynamically)
    ];

    $('input[type=date]').each(function() {
        var currentDate = new Date();
        var year = currentDate.getFullYear();
        var month = String(currentDate.getMonth() + 1).padStart(2, '0');
        var day = String(currentDate.getDate()).padStart(2, '0');
        var formattedDate = `${month}/${day}/${year}`;


        while (!isDateEnabled(formattedDate)) {
            currentDate.setDate(currentDate.getDate() + 1);
            year = currentDate.getFullYear();
            month = String(currentDate.getMonth() + 1).padStart(2, '0');
            day = String(currentDate.getDate()).padStart(2, '0');
            formattedDate = `${month}/${day}/${year}`;
        }

        $(this)
            .clone()
            .attr('type', 'text')
            .attr('placeholder', 'Please Click Here to Select a Date')
            .insertAfter(this)
            .datepicker({
                minDate: 0, // Set minimum date to today
                beforeShowDay: function(date) {
                    // Format the date as MM-DD
                    var formattedDate = $.datepicker.formatDate('mm-dd', date);
                    // Check if the day of the week is in the disabledDays array
                    var day = date.getDay();
                    if (disabledDays.indexOf(day) !== -1 || disabledDates.indexOf(formattedDate) !== -1) {
                        return [false];
                    }
                    return [true];
                },
                onSelect: function(dateText, inst) {
                    // console.log("Calendar input event fired");
                    $(this).val(dateText);
                    // console.log("Selected Date:", dateText);
                    updateAvailableTimes(dateText, timePicker);
                    // console.log("after function");
                }
            })
            .prev()
            .remove();
    });

    // Function to check if the date is enabled (not in disabledDates or disabledDays)
    function isDateEnabled(dateString) {
        var date = new Date(dateString);
        var day = date.getDay();
        var formattedDate = $.datepicker.formatDate('mm-dd', date);
        return disabledDays.indexOf(day) === -1 && disabledDates.indexOf(formattedDate) === -1;
    }

    // Function to calculate Easter Sunday date for the current year
    function getEasterSundayDate() {
        var currentYear = new Date().getFullYear();
        var a = currentYear % 19;
        var b = Math.floor(currentYear / 100);
        var c = currentYear % 100;
        var d = Math.floor(b / 4);
        var e = b % 4;
        var f = Math.floor((b + 8) / 25);
        var g = Math.floor((b - f + 1) / 3);
        var h = (19 * a + b - d - g + 15) % 30;
        var i = Math.floor(c / 4);
        var k = c % 4;
        var l = (32 + 2 * e + 2 * i - h - k) % 7;
        var m = Math.floor((a + 11 * h + 22 * l) / 451);
        var month = Math.floor((h + l - 7 * m + 114) / 31); // Month (3 = March, 4 = April)
        var day = ((h + l - 7 * m + 114) % 31) + 1; // Day
        return ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2);    }

    // Function to calculate Thanksgiving Day date for the current year
    function getThanksgivingDate() {
        var currentYear = new Date().getFullYear();
        var novemberFirstDay = new Date(currentYear, 10, 1);
        var dayOfWeek = novemberFirstDay.getDay();
        var daysUntilThanksgiving = (4 - dayOfWeek + 7) % 7 + 21;
        var thanksgivingDate = new Date(currentYear, 10, daysUntilThanksgiving);
        var month = thanksgivingDate.getMonth() + 1; // Month (0-indexed)
        var day = thanksgivingDate.getDate(); // Day
        return ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2);
    }

    // Function to calculate the day after Thanksgiving date for the current year
    function getDayAfterThanksgivingDate() {
        var currentYear = new Date().getFullYear();
        var novemberFirstDay = new Date(currentYear, 10, 1);
        var dayOfWeek = novemberFirstDay.getDay();
        var daysUntilDayAfterThanksgiving = (5 - dayOfWeek + 7) % 7 + 21;
        var dayAfterThanksgivingDate = new Date(currentYear, 10, daysUntilDayAfterThanksgiving + 1);
        var month = dayAfterThanksgivingDate.getMonth() + 1; // Month (0-indexed)
        var day = dayAfterThanksgivingDate.getDate(); // Day
        return ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2);
    }
});

// 
// document.addEventListener('DOMContentLoaded', function() {
//     const disabledDays = [0, 1];
//     const disabledDates = [
//         '01-01',
//         '12-25',
//         '12-26',
//         getEasterSundayDate(),
//         '07-04',
//         getThanksgivingDate(),
//         getDayAfterThanksgivingDate()
//     ];

//     const dateInputs = document.querySelectorAll('input[type="date"]');
//     dateInputs.forEach(function(input) {
//         const currentDate = new Date();
//         const year = currentDate.getFullYear();
//         const month = String(currentDate.getMonth() + 1).padStart(2, '0');
//         const day = String(currentDate.getDate()).padStart(2, '0');
//         const formattedDate = `${month}/${day}/${year}`;

//         while (!isDateEnabled(formattedDate)) {
//             currentDate.setDate(currentDate.getDate() + 1);
//             year = currentDate.getFullYear();
//             month = String(currentDate.getMonth() + 1).padStart(2, '0');
//             day = String(currentDate.getDate()).padStart(2, '0');
//             formattedDate = `${month}/${day}/${year}`;
//         }

//         const textInput = document.createElement('input');
//         textInput.type = 'text';
//         textInput.placeholder = 'Please Click Here to Select a Date';
//         input.parentNode.insertBefore(textInput, input.nextSibling);

//         input.min = formattedDate;

//         input.addEventListener('input', function() {
//             textInput.value = input.value;
//             updateAvailableTimes(input.value, timePicker);
//         });

//         input.remove();
//     });

//     function isDateEnabled(dateString) {
//         const date = new Date(dateString);
//         const day = date.getDay();
//         const formattedDate = formatDate(date);
//         return disabledDays.indexOf(day) === -1 && disabledDates.indexOf(formattedDate) === -1;
//     }

//     function formatDate(date) {
//         const month = String(date.getMonth() + 1).padStart(2, '0');
//         const day = String(date.getDate()).padStart(2, '0');
//         return `${month}-${day}`;
//     }

//     function getEasterSundayDate() {
//         const currentYear = new Date().getFullYear();
//         const a = currentYear % 19;
//         const b = Math.floor(currentYear / 100);
//         const c = currentYear % 100;
//         const d = Math.floor(b / 4);
//         const e = b % 4;
//         const f = Math.floor((b + 8) / 25);
//         const g = Math.floor((b - f + 1) / 3);
//         const h = (19 * a + b - d - g + 15) % 30;
//         const i = Math.floor(c / 4);
//         const k = c % 4;
//         const l = (32 + 2 * e + 2 * i - h - k) % 7;
//         const m = Math.floor((a + 11 * h + 22 * l) / 451);
//         const month = Math.floor((h + l - 7 * m + 114) / 31); // Month (3 = March, 4 = April)
//         const day = ((h + l - 7 * m + 114) % 31) + 1; // Day
//         return ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2);
//     }

//     function getThanksgivingDate() {
//         const currentYear = new Date().getFullYear();
//         const novemberFirstDay = new Date(currentYear, 10, 1);
//         const dayOfWeek = novemberFirstDay.getDay();
//         const daysUntilThanksgiving = (4 - dayOfWeek + 7) % 7 + 21;
//         const thanksgivingDate = new Date(currentYear, 10, daysUntilThanksgiving);
//         const month = thanksgivingDate.getMonth() + 1; // Month (0-indexed)
//         const day = thanksgivingDate.getDate(); // Day
//         return ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2);
//     }

//     function getDayAfterThanksgivingDate() {
//         const currentYear = new Date().getFullYear();
//         const novemberFirstDay = new Date(currentYear, 10, 1);
//         const dayOfWeek = novemberFirstDay.getDay();
//         const daysUntilDayAfterThanksgiving = (5 - dayOfWeek + 7) % 7 + 21;
//         const dayAfterThanksgivingDate = new Date(currentYear, 10, daysUntilDayAfterThanksgiving + 1);
//         const month = dayAfterThanksgivingDate.getMonth() + 1; // Month (0-indexed)
//         const day = dayAfterThanksgivingDate.getDate(); // Day
//         return ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2);
//     }
// });