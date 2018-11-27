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
        endDate : new Date("May 20, 2018"),
        startTime : 1000,
        endTime : 1600,
        deltaTime : 20,
        timeSlots : [1,2,3,4]
    };
    var table = document.getElementById("scheduleTable");

    fillTimeColumn(table, scheduleObject);
    fillDateRow(table, scheduleObject);

    

    
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
        const rowString = insertCharacter(currentTime.toString(),2,":");
        row.innerHTML = rowString;
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
    return monthString + "/" + dayString + "/" + yearString;
}