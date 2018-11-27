function validateDaysOfWeek(){

    const startDateValue = new Date(document.createCalendar.startingDate.value);
    const endingDateValue = new Date(document.createCalendar.endingDate.value);

    const startingTime = parseInt(document.createCalendar.startingTime.value);
    const endingTime = parseInt(document.createCalendar.endingTime.value);


    if (startDateValue > endingDateValue){
        document.getElementById("errorString").innerHTML = "Ending date entered is before starting date";
        console.log("incorrect date")
        return false;
    }

    const condition1 = startingTime >= endingTime;
    const condition2 = startDateValue.getTime() === endingDateValue.getTime() ;
    if (condition1 && condition2){
        document.getElementById("errorString").innerHTML = "Ending time entered is before starting time";
        console.log("incorrect time")
        return false;
    }

    if (startDateValue.getDay() === 5 || startDateValue.getDay() === 6 ||
        endingDateValue.getDay() === 5 || endingDateValue.getDay() === 6){
            document.getElementById("errorString").innerHTML = "Schedule cannot start or end on weekend";
            console.log("incorrect day of the week")
            return false;
    }

    const startDateValueString = document.createCalendar.startingDate.value;
    const endingDateValueString = document.createCalendar.endingDate.value;


    const startingTimeString = document.createCalendar.startingTime.value;
    const endingTimeString = document.createCalendar.endingTime.value;

    const timeStep = document.createCalendar.meetingLength.value;


    const sentObject = {
        "newSchedule"
    :
        [
            {"startDate": startDateValueString},
            {"endDate": endingDateValueString},
            {"startTime": startingTimeString},
            {"endTIme": endingTimeString},
            {"timeDelta": timeStep}
        ]
    }
    ;

    const url = 'https://jsonplaceholder.typicode.com/posts';
    $.post(url,JSON.stringify(sentObject),function(data,status){
        const newScheduleID = data;

        let redirectURL = "viewSchedule.html";

        redirectURL = redirectURL + "?scheduleID=" + "12345";//+ newScheduleID;

        window.location.href = redirectURL;
    });

    document.getElementById("errorString").innerHTML = "Request Sent";
}