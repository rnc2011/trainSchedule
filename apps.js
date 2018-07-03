// Initialize Firebase
var config = {
    apiKey: "AIzaSyDKwTx1bJlrlBajDJC0gBP-QoEfByHAmIQ",
    authDomain: "train-project-29575.firebaseapp.com",
    databaseURL: "https://train-project-29575.firebaseio.com",
    projectId: "train-project-29575",
    storageBucket: "",
    messagingSenderId: "199242302688"
  };
firebase.initializeApp(config);

var database = firebase.database();

var trainName;
var destinationName;
var ftTime;
var frequency;
var nextArrival;
var minutesAway;
var currentTime = moment().format("HH:mm");
//console.log(moment(currentTime).format("hh:mm"));
console.log(currentTime);
console.log(moment())


$("#submit").on("click", function (event) {
    // Don't refresh the page!
    event.preventDefault();

    trainName = $("#tName").val().trim();
    destinationName = $("#dName").val().trim();
    ftTime = $("#ftTime").val().trim();
    frequency = $("#frequency").val().trim();
    console.log(trainName, destinationName, frequency, ftTime);
    var ftTimeC = moment(ftTime, "HH:mm").subtract(1, "years");
    console.log(ftTimeC);
    var frequencyC = parseInt(frequency);
    //frequencyC = moment.duration(frequencyC).asMinutes();
    console.log(frequencyC);

    var diffTime = moment().diff(moment(ftTimeC), "minutes");
    console.log("Difference in time :" + diffTime);

    var tRemainder = diffTime % frequencyC;
    console.log(tRemainder);

    var tMinutesTillTrain = frequencyC - tRemainder;
    console.log("Minutes Til Next Train: " + tMinutesTillTrain);

    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("Arrival Time: " + moment(nextTrain).format("hh:mm"));
    

    database.ref().push({
        trainName: trainName,
        destination: destinationName,
        ftTime: ftTime,
        nextTrain: moment(nextTrain).format("hh:mm"),
        minutesAway: tMinutesTillTrain,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });



});

// database.ref("/delcie").on("value", function(snapshot){
//     console.log(snapshot.val());
// })
database.ref().on("child_added", function (childSnapshot) {

    // Log everything that's coming out of snapshot
    console.log(childSnapshot.val().trainName);
    console.log(childSnapshot.val().destination);
    console.log(childSnapshot.val().frequency);
    console.log(childSnapshot.val().ftTime);

});

database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function (snapshot) {
    // Change the HTML to reflect
    var newRow = $("<tr>");
    newRow.append($("<td>").text(snapshot.val().trainName));
    newRow.append($("<td>").text(snapshot.val().destination));
    newRow.append($("<td>").text(snapshot.val().frequency));
    newRow.append($("<td>").text(snapshot.val().nextTrain));
    newRow.append($("<td>").text(snapshot.val().minutesAway));
    //newRow.append($("<td>").text(snapshot.val().total));
    newRow.appendTo($("tbody"));
});

console.log(moment().format("MMM Do YY"));
console.log(moment().format("DD/MM/YY hh:mm A"));