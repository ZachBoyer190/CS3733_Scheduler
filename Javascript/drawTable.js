
const rowOffset = 2;
const numCol = 6;
const colOffset = 1;
const timeColIndex = 0;
const dateRowIndex = 0;
const dayRowIndex = 0;

function drawTable(){
    let param = getParameter();
    console.log(param);

    let url = 'https://jsonplaceholder.typicode.com/posts';
    $.get(url,function (data, status) {
        createTableFromObject(data);
    });

}

function getParameter(){
    let url = window.location.search;
    let paramString = url.split("?")[1];
    return paramString.split("=")[1];
}

function createTableFromObject(scheduleObject){
    scheduleObject = createScheduleObject();

    let table = document.getElementById("scheduleTable");

    initWeekShown(scheduleObject);
    fillDateRow(table, scheduleObject);
    fillTableWithEmptyCells(table, scheduleObject);
    fillTimeColumn(table, scheduleObject);
    fillTimeSlots(table, scheduleObject);
    // TODO create a text area for putting the booking name
    // TODO create function that actually schedules a meeting
    // TODO add function logic to each button when it is made

}

function fillTableWithEmptyCells(table, schedule){
    let numRows = ((schedule.endTime-schedule.startTime)*6/10)/schedule.deltaTime;

    for(let j = rowOffset; j < numRows+rowOffset; j++){
        let row = table.insertRow();

        for (let h = 0; h < numCol; h++){
            row.insertCell();
        }
    }
}

function fillDateRow(htmlTable, Schedule){
    let j;
    for (j = 0; j < 5; j++){
        htmlTable.rows[dateRowIndex].cells[j+1].innerHTML = generateDateString(Schedule.startDate,j);
    }
}

function generateDateString(startDate, index){
    let currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate()+index);
    let dayString = currentDate.getDate().toString();
    let monthString = (currentDate.getMonth()+1).toString();
    let yearString = currentDate.getFullYear().toString();
    return yearString + "-" + monthString + "-" + dayString ;
}

function fillTimeColumn(htmlTable, schedule){
    let numRows = ((schedule.endTime-schedule.startTime)*6/10)/schedule.deltaTime;
    let hour = 60; // minutes
    let i;
    let currentTime = schedule.startTime;
    for (i = rowOffset; i < numRows+rowOffset; i++) {
        let nonOffsetIndex = i -rowOffset;
        if (nonOffsetIndex !== 0) {
            if (nonOffsetIndex % (hour/schedule.deltaTime) === 0) {
                currentTime += 40 + schedule.deltaTime ;
            } else {
                currentTime += schedule.deltaTime;
            }
        }
        htmlTable.rows[i].cells[timeColIndex].innerHTML = insertCharacter(currentTime.toString(),2,":");
    }
}

function insertCharacter(string, index, character){
    let stringA = string.slice(0,index);
    let stringB = string.slice(index,string.length);
    return stringA + character + stringB;
}

function fillTimeSlots(htmlTable, schedule){

    let currentDates = getCurrentDates(htmlTable);
    let currentTimes = getCurrentTimes(htmlTable);

    for(let k = 0; k < schedule.timeSlots.length; k++){

        let thisTimeSlot = schedule.timeSlots[k];

        let timeSlotDate = new Date(thisTimeSlot.date);
        let timeSlotTime = thisTimeSlot.time;

        let timeSlotCol = getTimeSlotCol(timeSlotDate, currentDates);
        let timeSlotRow = getTimeSlotRow(timeSlotTime, currentTimes);

        if (timeSlotCol === timeColIndex || timeSlotRow === dateRowIndex
            || timeSlotRow === dayRowIndex){
            continue;
        }

        let status = thisTimeSlot.status;
        let cell = htmlTable.rows[timeSlotRow].cells[timeSlotCol];

        switch(status){
            case "open" :
                cell.appendChild(createOpenCell());
                break;

            case "closed" :
                cell.innerHTML = status;
                break;

            case "booked" :
                cell.appendChild(createBookedCell(thisTimeSlot));
                break;
        }

    }
}

function getCurrentDates(htmlTable){
    let currentDates = new Array(5);
    let row = htmlTable.rows[dateRowIndex];
    for (let m = 0; m < currentDates.length; m++){
        currentDates[m] = new Date(row.cells[m+colOffset].innerHTML);
    }
    return currentDates;
}

function getCurrentTimes(htmlTable){
    let currentTimes = [];
    for (let n = 0; n < htmlTable.rows.length - rowOffset; n++) {
        let thisRow = htmlTable.rows[n + rowOffset];
        currentTimes[n] = subtractColon(thisRow.cells[timeColIndex].innerHTML);
    }
    return currentTimes;
}

function getTimeSlotCol(date, currentDates){
    for (let g = 0; g < currentDates.length; g++) {
        if (date.getTime() === currentDates[g].getTime()){
            return g + colOffset;
        }
    }
    return timeColIndex;
}

function getTimeSlotRow(time, currentTimes){
    for (let g = 0; g < currentTimes.length; g++) {
        if (time === currentTimes[g]){
            return g + rowOffset;
        }
    }
    return timeColIndex;
}

function subtractColon(string) {
    let firstString = string.slice(0,2);
    let lastString = string.slice(3,5);
    return firstString + lastString;

}

function createOpenCell(){
    let btn = document.createElement('input');
    btn.type = "button";
    btn.value = "book now";
    return btn;
}

function createBookedCell(thisTimeSlot) {

    let div0 = document.createElement("div");
    let para = document.createTextNode(thisTimeSlot.name);
    div0.appendChild(para);

    let div1 = document.createElement("div");
    let codeField = document.createElement('input');
    codeField.type = "text";
    div1.appendChild(codeField);
    div0.appendChild(div1);

    let div2 = document.createElement("div");
    let cancelBtn = document.createElement('input');
    cancelBtn.type = "button";
    cancelBtn.value = "Cancel Meeting";
    div2.appendChild(cancelBtn);
    div0.appendChild(div2);

    return div0;
}

function initWeekShown(schedule) {
    editCurrentWeekShown(1);
    console.log(schedule.startDate.getTime());
    let millisStart = schedule.startDate.getTime();
    let millisEnd = schedule.endDate.getTime();
    let totalDays = (( millisEnd -millisStart)/(86400000));
    let totalWeeks = Math.ceil(totalDays/5);
    editTotalWeeksShown(totalWeeks);
    updateWeekLabel()
}

function editCurrentWeekShown(newWeek){
    document.getElementById("currentWeek").innerHTML = newWeek.toString();
}

function editTotalWeeksShown(totalWeek){
    let paragraph = document.getElementById("totalWeeks");
    console.log(totalWeek.toString())
    paragraph.innerHTML = totalWeek;

}

function updateWeekLabel(){
    let currentWeek = document.getElementById("currentWeek").innerHTML;
    let totalWeeks = document.getElementById("totalWeeks").innerHTML;
    document.getElementById("weekTag").innerHTML = ("Week " + currentWeek +
        " of " + totalWeeks +" Shown Below");
}

function createScheduleObject(){
    return {
        startDate : new Date("May 5, 2018"),
            endDate : new Date("May 19, 2018"),
        startTime : 1000,
        endTime : 1100,
        deltaTime : 20,
        timeSlots : [
            timeSlot0 = {
                status : "closed",
                time : "1000",
                date : "2018-5-5",
                name : ""},

            timeSlot1 = {
                status : "open",
                time : "1020",
                date : "2018-5-5",
                name : ""},

            timeSlot2 = {
                status : "open",
                time : "1040",
                date : "2018-5-5",
                name : ""},

            timeSlot3 = {
                status : "booked",
                time : "1000",
                date : "2018-5-6",
                name : "Kevin"},

            timeSlot4 = {
                status : "open",
                time : "1020",
                date : "2018-5-6",
                name : ""},

            timeSlot5 = {
                status : "open",
                time : "1040",
                date : "2018-5-6",
                name : ""},

            timeSlot6 = {
                status : "open",
                time : "1000",
                date : "2018-5-7",
                name : ""},

            timeSlot7 = {
                status : "open",
                time : "1020",
                date : "2018-5-7",
                name : ""},

            timeSlot8 = {
                status : "open",
                time : "1040",
                date : "2018-5-7",
                name : ""},

            timeSlot9 = {
                status : "open",
                time : "1000",
                date : "2018-5-8",
                name : ""},

            timeSlot10 = {
                status : "open",
                time : "1020",
                date : "2018-5-8",
                name : ""},

            timeSlot11 = {
                status : "open",
                time : "1040",
                date : "2018-5-8",
                name : ""},

            timeSlot12 = {
                status : "open",
                time : "1000",
                date : "2018-5-9",
                name : ""},

            timeSlot13 = {
                status : "open",
                time : "1020",
                date : "2018-5-9",
                name : ""},

            timeSlot14 = {
                status : "open",
                time : "1040",
                date : "2018-5-9",
                name : ""}
        ]
    };
}