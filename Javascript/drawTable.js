// TODO change table filling order to create full table empty and then fill in each row and column
// TODO adjust table filling function to insert based on date and time rather than index

function drawTable(){
    const param = getParameter();
    console.log(param);

    const url = 'https://jsonplaceholder.typicode.com/posts';
    $.get(url,function (data, status) {
        createTableFromObject(data);
    });

}

function getParameter(){
    const url = window.location.search;
    const paramString = url.split("?")[1];
    return paramString.split("=")[1];
}

function createTableFromObject(scheduleObject){
    scheduleObject = {
        startDate : new Date("May 5, 2018"),
        endDate : new Date("May 19, 2018"),
        startTime : 1000,
        endTime : 1100,
        deltaTime : 20,
        timeSlots : ["open", "closed", "booked", "open", "closed", "booked", "open",
            "closed", "booked", "open", "closed", "booked", "open", "closed", "booked"]
    };
    var table = document.getElementById("scheduleTable");

    initWeekShown(scheduleObject);
    fillTimeColumn(table, scheduleObject);
    fillDateRow(table, scheduleObject);
    fillTimeSlots(table, scheduleObject);
    // TODO create function that actually schedules a meeting
    // TODO add function logic to each button when it is made



    
}

function fillTimeColumn(htmlTable, schedule){
    const numRows = ((schedule.endTime-schedule.startTime)*6/10)/schedule.deltaTime;
    const hour = 60; // minutes
    var i;
    var currentTime = schedule.startTime;
    for (i = 0; i < numRows; i++) {

        if (i != 0) {
            if (i % (hour/schedule.deltaTime) == 0) {
                currentTime += 40 + schedule.deltaTime ;
            } else {
                currentTime += schedule.deltaTime;
            }
        }
        var row = htmlTable.insertRow();
        var cell = row.insertCell();
        const rowString = insertCharacter(currentTime.toString(),2,":");
        cell.innerHTML = rowString;
    }
}

function insertCharacter(string, index, character){
    const stringA = string.slice(0,index);
    const stringB = string.slice(index,string.length);
    return stringA + character + stringB;
}

function fillDateRow(htmlTable, Schedule){
    var j;
    for (j = 0; j < 5; j++){
        htmlTable.rows[0].cells[j+1].innerHTML = generateDateString(Schedule.startDate,j);
    }
}
function generateDateString(startDate, index){
    var currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate()+index);
    const dayString = currentDate.getDate().toString();
    const monthString = (currentDate.getMonth()+1).toString();
    const yearString = currentDate.getFullYear().toString();
    return yearString + "-" + monthString + "-" + dayString ;
}

function fillTimeSlots(htmlTable, schedule){
    const rowOffset = 2;
    const colOffset = 1;

    const currentDates = new Array(5);
    const row = htmlTable.rows[0];
    for (var m = 0; m < currentDates.length; m++){
        currentDates[m] = new Date(row.cells[m+1].innerHTML);
    }

    const currentTimes = new Array();
    for (var n = 0; n < htmlTable.rows.length - rowOffset; n++){
        const thisRow = htmlTable.rows[n+rowOffset];
        currentTimes[n] = subtractColon(thisRow.cells[0].innerHTML);
    }


    const numRows = ((schedule.endTime-schedule.startTime)*6/10)/schedule.deltaTime;

    var k;
    for(k = 0; k < schedule.timeSlots.length; k++){


        const rowWithoutOffset = (k % numRows);
        const row = rowWithoutOffset + rowOffset;
        const col = ((k - rowWithoutOffset) / numRows) + colOffset;
        const status = getTimeSlotStatus(schedule.timeSlots[k]);
        var cell = htmlTable.rows[row].insertCell();

        switch(status){
            case "open" :

                var btn = document.createElement('input');
                btn.type = "button";
                btn.value = "book now";
                cell.appendChild(btn);
                break;
            case "closed" :

                cell.innerHTML = status;
                break;
            case "booked" :
                var para = document.createTextNode(getTimeSlotName());
                cell.appendChild(para);

                var div = document.createElement("div");
                var codeField = document.createElement('input');
                codeField.type = "text";
                div.appendChild(codeField);

                var cancelBtn = document.createElement('input');
                cancelBtn.type = "button";
                cancelBtn.value = "Cancel Meeting";
                div.appendChild(cancelBtn);


                cell.appendChild(div);
                break;
        }

    }
}

function subtractColon(string) {
    const firstString = string.slice(0,2);
    const lastString = string.slice(3,5);
    return firstString + lastString;

}

function getTimeSlotStatus(timeSlot){
    return timeSlot;
}

function getTimeSlotName(){
    return "Joe";
}

function initWeekShown(schedule) {
    editCurrentWeekShown(1);
    console.log(schedule.startDate.getTime());
    const millisStart = schedule.startDate.getTime();
    const millisEnd = schedule.endDate.getTime();
    const totalDays = (( millisEnd -millisStart)/(86400000));
    const totalWeeks = Math.ceil(totalDays/5);
    editTotalWeeksShown(totalWeeks);
    updateWeekLabel()
}
function editCurrentWeekShown(newWeek){
    document.getElementById("currentWeek").innerHTML = newWeek.toString();
}

function editTotalWeeksShown(totalWeek){
    var paragraph = document.getElementById("totalWeeks");
    console.log(totalWeek.toString())
    paragraph.innerHTML = totalWeek;

}

function updateWeekLabel(){
    const currentWeek = document.getElementById("currentWeek").innerHTML;
    const totalWeeks = document.getElementById("totalWeeks").innerHTML;
    document.getElementById("weekTag").innerHTML = ("Week " + currentWeek +
        " of " + totalWeeks +" Shown Below");
}