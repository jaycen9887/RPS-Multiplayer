 // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDE2q6qYfttgyN19d-26Zx8jHia7k5u-wI",
    authDomain: "rockpaperscissors-bc056.firebaseapp.com",
    databaseURL: "https://rockpaperscissors-bc056.firebaseio.com",
    projectId: "rockpaperscissors-bc056",
    storageBucket: "rockpaperscissors-bc056.appspot.com",
    messagingSenderId: "565278506006"
  };
  firebase.initializeApp(config);

//Reference to the database
var database = firebase.database();
var ref = database.ref();
var playersRef = ref.child("players/");

//Variables
var player1 = null;
var player1Name = "";
var player1Choice = [];
var p1CurrentChoice = "";
var player1Wins = 0;
var player1Losses = 0;
var player1Ties = 0;
var player1Comments = [];
var player1I = 0;

var player2 = null;
var player2Name = "";
var player2Choice = [];
var p2CurrentChoice = "";
var player2Wins = 0;
var player2Losses = 0;
var player2Ties = 0;
var player2Comments = [];
var player2I = 0;

var round = 1;

var bothResponses = 0;

var player;
var players;

var turn = 1;

//functions


//pushes data to the database
function writePlayerData(player, name, wins, losses, ties, comment){
    database.ref('players/' + player).set({
        name: name,
        wins: wins,
        losses: losses,
        ties: ties,
        comment: comment
    });
}


$("#nameSubmit").on("click", function(e){
    e.preventDefault();
    
    //setting up player 1 and pushing data to the database
    if(player == 1){
        
        player1Name = $("#username").val().trim();
        writePlayerData('Player1', player1Name, player1Wins, player1Losses, player1Ties, player1Comments);
        window.self.name = "player1";
        
        //setting up player2 and pushing data to the database
    }else {
        player2Name = $("#username").val().trim();
        writePlayerData('Player2', player2Name, player2Wins, player2Losses, player2Ties, player2Comments);
        window.self.name = "player2";
        
    }
    
    //removes the invisible class from player1Choices
    if(window.self.name === "player1"){
        $("#input").toggleClass("invisible");
        $("#player1Choices").toggleClass("invisible");
        //removes the invisible class from player2Choices
    }else {
        $("#input").toggleClass("invisible");
        $("#player2Choices").toggleClass("invisible");
    }
    
    $("#username").empty();

});

$("#chatSubmit").on("click", function(e){
    e.preventDefault();
    
    //Pushes comment in to player1Comments array then runs the updateComments function
    if(window.self.name === "player1"){
       player1Comments.push($("#text").val().trim());
        player1I++;
        updateComments("Player1", player1Comments);
        
        //Pushes comment in to player2Comments array then runs the updateComments function
    }else if(window.self.name === "player2"){
       player2Comments.push($("#text").val().trim());
        player2I++;
        updateComments("Player2", player2Comments);

    } 
});

function checkWin (p1Choice, p2Choice){
    console.log("Checking Win");
    switch(p1Choice) {
        case "rock":
            switch(p2Choice){
                case "rock":
                    player1Ties++;
                    player2Ties++;
                    if(window.self.name === "player1"){
                        nextRound();
                    }else if(window.self.name === "player2"){
                        nextRound();
                    }
                    break;
                case "paper":
                    player1Losses++;
                    player2Wins++;
                    nextRound();
                    break;
                case "scissors":
                    player1Wins++;
                    player2Losses++;
                    nextRound();
            }
            break;
        case "paper":
            switch(p2Choice){
                  case "rock":
                    player1Wins++;
                    player2Losses++;
                    nextRound(); 
                    break;
                case "paper":
                    player1Ties++;
                    player2Ties++;
                    nextRound();
                    break;
                case "scissors":
                    player1Losses++;
                    player2Wins++;
                    nextRound(); 
            }
            break;
        case "scissors":
            switch(p2Choice){
                  case "rock":
                    player1Losses++;
                    player2Wins++;
                    nextRound();
                    break;
                case "paper":
                    player1Wins++;
                    player2Losses++;
                    nextRound();
                    break;
                case "scissors":
                    player1Ties++;
                    player2Ties++;
                    nextRound(); 
            }
            break;
    }
}

//sets up for the next round
function nextRound (){
    
    //updates the database key Player1
    updateData("Player1", player1Wins, player1Losses, player1Ties);
    
    //updates the database key Player2
    updateData("Player2", player2Wins, player2Losses, player2Ties);

    round++; 
             
    bothResponses = 0;
    
    if(window.self.name === "player1"){
        $("#player1Choices").toggleClass("invisible");
    }
    
    if(window.self.name === "player2"){
       $("#player2Choices").toggleClass("invisible");
    }
    updateResponses(bothResponses);
    updateRounds(round);
}

function updateRounds(rounds){
    playersRef.update({
       "round": rounds 
    });
}

function updateResponses(responses){
    playersRef.update({
       "bothResponses": responses 
    });     
}


function updateData(player, wins, losses, ties){
    var statusRef = playersRef.child(player);
    
    statusRef.update({
        "wins": wins,
        "losses": losses,
        "ties": ties
    });

}

function updateComments(player, comments){
    
   var commentRef = playersRef.child(player);
    
    commentRef.update({
        "comment": comments    
    });
    
}

//database calls

database.ref("players/Player1").on("value", function(snapshot){
    var player1 = snapshot.val();
    var p= $("<p>");
    
    //checks if the window belongs to player1 
    if(window.self.name === "player1"){
        //sets wins,losses,and ties for player1
        player1Wins = player1.wins;
        player1Losses = player1.losses;
        player1Ties = player1.ties;
        
        $("#player1Stats").html("W:" + player1.wins + " L:" + player1.losses + " T:" + player1.ties);
    }
    if (window.self.name === "player2"){
        player1Wins = player1.wins;
        player1Losses = player1.losses;
        player1Ties = player1.ties;

        $("#player1Stats").html("W:" + player1.wins + " L:" + player1.losses + " T:" + player1.ties);
    }

});

database.ref("players/Player2").on("value", function(snapshot){

    var player2 = snapshot.val();

    console.log(player2);
    if(window.self.name === "player1"){
        player2Wins = player2.wins;
        player2Losses = player2.losses;
        player2Ties = player2.ties;

        $("#player2Stats").html("W:" + player2.wins + " L:" + player2.losses + " T:" + player2.ties);
    }
    if (window.self.name === "player2"){
        player2Wins = player2.wins;
        player2Losses = player2.losses;
        player2Ties = player2.ties;
        
        $("#player2Stats").html("W:" + player2.wins + " L:" + player2.losses + " T:" + player2.ties);
    }
});

database.ref("players/Player1/comment").on("value", function(snapshot){
    var comment = snapshot.val()[player1I];
    var p = $("<p>");
    p.addClass("player1Comment");
    //display chat in chatBox 
    if(comment !== ""){
        p.text(comment);
        $("#chatBox").append(p);
        if (window.self.name === "player1"){
            $(".player1Comment").css({"background-color": "#0079BF", "width": "100%", "color": "white"});
        }else {
            $(".player1Comment").css({"color": "#0079BF", "background-color": "white"});
        }
        player1I++;
    }
    window.setInterval(function(){
        var el = $("#chatBox");
        el.scrollTop = el.scrollHeight;
    }, 5000);
});

database.ref("players/Player2/comment").on("value", function(snapshot){
    var comment = snapshot.val()[player2I];
    var p = $("<p>");
    p.addClass("player2Comment");
    //display chat in chatBox 
    if(comment !== ""){
        p.text(comment);
        $("#chatBox").append(p);
        if (window.self.name === "player2"){
            $(".player2Comment").css({"background-color": "#0079BF", "width": "100%", "color": "white"});
        }else {
            $(".player2Comment").css({"color": "#0079BF", "background-color": "white"});
        }
        player2I++;
    }
    window.setInterval(function(){
        var el = $("#chatBox");
        el.scrollTop = el.scrollHeight;
    }, 5000);
    
});

database.ref("players/").on("value", function(snapshot){
    if(snapshot.child("Player1").exists()){
        
        player = 2;
        players = 1;
        player1 = snapshot.val().Player1;
        player2 = snapshot.val().Player2;
        player1Name = player1.name;
        $("#player1Name").text(player1.name);
        
    }else { 
        player = 1;
        player1Name = "";
        $("#player1Name").text("Enter name above");
    }
    
    if(snapshot.child("Player2").exists()){
        players = 2;
        player2 = snapshot.val().Player2;
        player2Name = player2.name;
        $("#player2Name").text(player2.name);
        player2Name = player2.name;
    }else {
        player2Name = "";
        $("#player2Name").text("Enter name above"); 
    }
});



database.ref("players/bothResponses").on("value", function(snapshot){
   console.log(snapshot.val()); 
    bothResponses = snapshot.val(); 
    if(bothResponses === 2){
            checkWin(p1CurrentChoice, p2CurrentChoice);
            
            var p1 = $("<p>");
            p1.addClass("p1");
            var p2 = $("<p>");
            p2.addClass("p2")
            p1.append(p1CurrentChoice);
            $("#action").append(p1);
            p2.append(p2CurrentChoice);
            $("#action").append(p2);    
        }
});

 database.ref("players/Player1/rounds").on("value", function(snapshot){
            
    var player1 = snapshot.val().playerChoice;
                        
    p1CurrentChoice = player1[round];
});
        
database.ref("players/Player2/rounds").on("value", function(snapshot){
            
    var player2 = snapshot.val().playerChoice;
                        
    p2CurrentChoice = player2[round];
    
});



database.ref("players/round").on("value", function(snapshot){
   $("#round").text(snapshot.val()); 
});

$(document).ready(function(){
    updateRounds(round);
    
    //checks if window was refreshed
   if(performance.navigation.type == 1){
       database.ref().child("players/bothResponses").remove();
       database.ref().child("players/round").remove();
       if(window.self.name == "player1"){
           database.ref().child("players/Player1").remove();
           window.self.name = "";
       }else if(window.self.name == "player2"){
          database.ref().child("players/Player2").remove();
           window.self.name = "";
       }
       
    }
    
    $(".choice").on("click", function(){ 
   
        if(window.self.name == "player1"){
            var answer = $(this)[0].attributes[1].nodeValue;
            player1Choice.push(answer);
            bothResponses++;
            updateResponses(bothResponses);
            database.ref("players/Player1/rounds").set({
               playerChoice: player1Choice
            
            });
            
            $("#player1Choices").toggleClass("invisible");
            
        }else if(window.self.name == "player2"){
            var answer = $(this)[0].attributes[1].nodeValue;
            player2Choice.push(answer);
            bothResponses++;
            updateResponses(bothResponses);
            database.ref("players/Player2/rounds").set({
               playerChoice: player2Choice
            
            });
            
            $("#player2Choices").toggleClass("invisible");
        }
    });
});



















