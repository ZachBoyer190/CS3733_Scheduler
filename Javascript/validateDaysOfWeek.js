function validateDaysOfWeek(passedInElement){
    var startDateValue = passedInElement.getElementById("startingDate").value;
    var endingDateValue = passedInElement.getElementById("endingDate").value;

    console.log(startDateValue);
    console.log(endingDateValue);
    const Http = new XMLHttpRequest();
    const url = 'https://jsonplaceholder.typicode.com/posts';
    Http.open("GET", url);
    Http.send();
    return null;
}