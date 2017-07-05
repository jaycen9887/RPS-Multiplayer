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

//Variables
var player1 = null;
var player1Name = "";
var player1Choice = [];
var player1Wins = 0;
var player1Losses = 0;
var player1Ties = 0;
var player1Comments = [];

var player2 = null;
var player2Name = "";
var player2Choice = [];
var player2Wins = 0;
var player2Losses = 0;
var player2Ties = 0;
var player2Comments = [];

var round = 0;

var bothResponses = 0;

var player;
var players;

var turn = 1;

function play(){
    turn = 1;
    whoAmI();
}

function writePlayerData(player, name, wins, losses, ties, comment){
    database.ref('players/' + player).set({
        name: name,
        wins: wins,
        losses: losses,
        ties: ties,
        comment: comment
    });
}

function whoAmI(){
    if(window.self.name === "player1") {
        console.log("I am " + window.self.name);
    }else if (window.self.name === "player2"){
        console.log("I am " + window.self.name);
    }
}

$("#nameSubmit").on("click", function(e){
    e.preventDefault();
    
    if(player == 1){
        
        player1Name = $("#username").val().trim();
        writePlayerData('Player1', player1Name, player1Wins, player1Losses, player1Ties, player1Comments);
        window.self.name = "player1";
        console.log("Window.self.name: " + window.self.name);
        
    }else {
        player2Name = $("#username").val().trim();
        writePlayerData('Player2', player2Name, player2Wins, player2Losses, player2Ties, player2Comments);
        window.self.name = "player2";
        
    }
    
    if(window.self.name === "player1"){
        $("#input").toggleClass("invisible");
        $("#player1Choices").toggleClass("invisible");
        /*$("#username").toggle("readonly");*/
    }else {
        $("#input").toggleClass("invisible");
        $("#player2Choices").toggleClass("invisible");
       /* $("#username").toggle("readonly");*/
    }
    
    $("#username").empty();

});

$("#chatSubmit").on("click", function(e){
    e.preventDefault();
    if(window.self.name === "player1"){
       player1Comments.push($("#text").val().trim());
        updateComments("Player1", player1Comments);
    }else if(window.self.name === "player2"){
       player2Comments.push($("#text").val().trim());
        updateComments("Player2", player2Comments);
    } 
});

database.ref("players/Player1/comments").on("value", function(snapshot){
     var p = $("<p>");
    //display chat in chatBox 
    if($("#text").val().trim() !== ""){
        p.text($("#text").val().trim());
        $("#chatBox").append(p);
    }
});

database.ref("players/Player2/comments").on("value", function(snapshot){
     var p = $("<p>");
    //display chat in chatBox 
    if($("#text").val().trim() !== ""){
        p.text($("#text").val().trim());
        $("#chatBox").append(p);
    }
});

database.ref("players/").on("value", function(snapshot){
    if(snapshot.child("Player1").exists()){
        console.log("Player 1 exists");
        
        player = 2;
        players = 1;
        player1 = snapshot.val().Player1;
        player2 = snapshot.val().Player2;
        player1Name = player1.name;
        $("#player1Name").text(player1.name);
        
    }else {
        console.log("Player 1 does NOT exist");
        
        player = 1;
        player1Name = "";
        $("#player1Name").text("Enter name above");
         
    }
    
    if(snapshot.child("Player2").exists()){
        console.log("Player 2 exists");
        
        players = 2;
        player2 = snapshot.val().Player2;
        player2Name = player2.name;
        $("#player2Name").text(player2.name);
        
        if(players == 2){
        play();
    }
        
    }else {
        console.log("Player 2 does NOT exist");
   
        player2Name = "";
        $("#player2Name").text("Enter name above");
          
    }
});


 database.ref("players/Player1/rounds").on("value", function(snapshot){
            
    var player1 = snapshot.val().playerChoice;
                        
    player1Choice = player1[round];
    console.log("P1 CHANGED");
});
        
database.ref("players/Player2/rounds").on("value", function(snapshot){
            
    var player2 = snapshot.val().playerChoice;
                        
    player2Choice = player2[round];
            
    console.log("P2 CHANGED");
    console.log(snapshot);
});

function checkWin (p1Choice, p2Choice){
    console.log("Checking Win");
    switch(p1Choice) {
        case "rock":
            switch(p2Choice){
                case "rock":
                    player1Ties++;
                    player2Ties++;
                    console.log("DRAW");
                    return "draw";
                case "paper":
                    player1Losses++;
                    player2Wins++;
                    console.log("Player 2 Wins");
                    return "Player 2 Wins!";
                case "scissors":
                    player1Wins++;
                    player2Losses++;
                    console.log("Player 1 Wins");
                    return "Player 1 Wins!";
            }
            break;
        case "paper":
            switch(p2Choice){
                  case "rock":
                    player1Wins++;
                    player2Losses++;
                    console.log("Player 1 Wins");
                    return "Player 1 Wins!"; 
                case "paper":
                    player1Ties++;
                    player2Ties++;
                    console.log("DRAW");
                    return "draw";
                case "scissors":
                    player1Losses++;
                    player2Wins++;
                    console.log("Player 2 Wins");
                    return "Player 2 Wins!"; 
            }
            break;
        case "scissors":
            switch(p2Choice){
                  case "rock":
                    player1Losses++;
                    player2Wins++;
                    console.log("Player 2 Wins");
                    return "Player 2 Wins!";
                case "paper":
                    player1Wins++;
                    player2Losses++;
                    console.log("Player 1 Wins");
                    return "Player 1 Wins!";
                case "scissors":
                    player1Ties++;
                    player2Ties++;
                    console.log("DRAW");
                    return "draw"; 
            }
            break;
    }
    updateData("Player1", player1Wins, player1Losses, player1Ties);
    
    updateData("Player2", player2Wins, player2Losses, player2Ties);
    
    round++;
}

function updateResponses(responses){
   var statusRef = database.ref("players/");
    var key = statusRef.push().key;
    var update = {};
    update[key] = {
        bothResponses: responses,
    };
    var result = statusRef.update(update);
     
}


function updateData(player, wins, losses, ties){
    var statusRef = database.ref("players/" + player);
    var key = statusRef.push().key;
    var update = {};
    update[key] = {
        wins: wins,
        losses: losses,
        ties: ties
    };
    var result = statusRef.update(update);
    
    
}

function updateComments(player, comments){
   var commentRef = database.ref("players/" + player + "/comments");
    var key = commentRef.push().key;
    var update = {};
    update[key] = {
        comments: comments
    };
    var result = commentRef.update(update);
    
}


$(document).ready(function(){
    
    
    //checks if window was refreshed
   if(performance.navigation.type == 1){
        console.info("This Page is reloaded");
       if(window.self.name == "player1"){
           database.ref().child("players/Player1").remove();
           window.self.name = "";
           console.log("PLAYER ONE!!!!!!!");
       }else if(window.self.name == "player2"){
          database.ref().child("players/Player2").remove();
           window.self.name = "";
       }
       
    }else {
        console.info("This page is not reloaded");
    } 
    
    $(".choice").on("click", function(){ 
   
        if(window.self.name == "player1"){
            player1Choice.push($(this)[0].innerHTML);
            bothResponses++;
            updateResponses(bothResponses);
            database.ref("players/Player1/rounds").set({
               playerChoice: player1Choice
            
            });
            
        }else if(window.self.name == "player2"){
            player2Choice.push($(this)[0].innerHTML);
            bothResponses++;
            updateResponses(bothResponses);
            database.ref("players/Player2/rounds").set({
               playerChoice: player2Choice
            
            });
            
            
        }
        
        database
       
        if(bothResponses === 2){
            checkWin(player1.rounds.playerChoice[round], player2.rounds.playerChoice[round]);
            
            var p = $("<p>");
            p.append(player1.rounds.playerChoice[round]);
            $("#action").append(p);
            p.append(player2.rounds.playerChoice[round]);
            $("#action").append(p);    
        }

    });
  
});



















