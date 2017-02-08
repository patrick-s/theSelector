/*
 * Name: Patrick Sappington
 * Assignment: Mobile App /w Cordova #2
 * Date: 11/03/2016
 */

// Global Viarables for future use
var gameArray = [];
var gaID;
var gdID;
var selectedGame;
var clickedID;
var delayTime;
var marginTp = 0;
var textHeight;
var headerBar;
var clientHeight;
var heightMinusBar;
var divPadding;
var theAnswer;
var gameObject = localStorage.getItem("games");
var gamesObj = JSON.parse(gameObject);
var gameString;

// Body of Code
$(document).ready(function () {

    // List games from Local Storage and display.
    for (game in gamesObj) {
        gameString = "<div class='game' id='" + game + "' style='background-image:url(" + gamesObj[game]['image'] + ");'><div class='game_padding' id='" + game + "_padding'><div class='game_text' id='" + game + "_text'>" + gamesObj[game]["game_title"] + "</div></div></div>";
        $("#games").append(gameString);
    }
    
    // Stylize parts that are mainly based on displayed text-size or height of objects that may change.
    textHeight = $(".game_padding").outerHeight();
    headerBar = $("header").outerHeight();
    clientHeight = window.innerHeight;
    heightMinusBar = clientHeight - headerBar;
    divPadding = 200 - textHeight;
    theAnswer = heightMinusBar - textHeight;
    
    // Update Margins and Paddings based on previous calculations.
    document.getElementById("main").style.paddingTop = headerBar + "px";
    document.getElementById("gameOptions").style.marginTop = textHeight + "px";
    
    // On click/tap of game load options and do fancy animations.
    $(".game").click(function () {
        gameArray = gameArr(); // Gran object from local storage
        clickedID = this.id; // I had to keep setting this outside of the when in order for it to be captured
        if (selectedGame == null) { // Check if they already selected a game and are just mashing on keys to make the developer mad.
            // Set clicked game to prevent the above statement from happening
            selectedGame = clickedID;
            window.scrollTo(0, 0); // Scroll to top, non fancy
            delayTime = 0; // Delay time for fancy effect
            
            // For each game, set it as the current ID, run the animate hide function and add to the delay counter.
            for (gaID in gameArray) {
                gdID = gameArray[gaID];
                animateHide(gdID, delayTime);
                delayTime = delayTime + 200;
            }
            // Grab game Title from HTML, because.
            var gameTitle = $("#" + clickedID + "_text").html();
            
            // When the animation is done for the title run the rest
            $.when(animateTitle(gameTitle)).done(function () {
                document.getElementById("main").style.height = heightMinusBar + "px"; // Stop the scrolling, because.
                
                // Grab array of options from the object
                optionArray = gamesObj[selectedGame]["options"];
                
                // Run through options adding to string
                for (gameOptions in optionArray) {
                    optionsString += "<input type='checkbox' name='gameModes' id='check_" + optionArray[gameOptions] + "' checked> <label for='check_" + optionArray[gameOptions] + "'><div class='option'>" + optionArray[gameOptions] + " <span class='removeItem'>&#10003;</span></div></label>";
                }
                
                // Ooutput string, run show game Options and set some z-indexs so they can click it.
                document.getElementById("form").innerHTML = optionsString;
                showGameOptions("gameOptions");
                document.getElementById("gameOptions").style.zIndex = 99;
                document.getElementById("gameTitle").style.zIndex = 99;
            });
            
            // Reset timers, options, optoins string, and the clicked ID.
            delayTime = 0;
            optionsString = "";
            gameOptions = null;
            clickedID = null;
        }
    });
    
    // On the click of the games title in the head
    $("#gameTitle").click(function () {
        // If the a game is auctually selected.
        if (selectedGame !== null) {
            delayTime = 200; // Set delay timer
            document.getElementById("gameOptions").style.display = "hidden"; // Hide game options
            
            // Run through list of games displaying them.
            for (gaID in gameArray) {
                gdID = gameArray[gaID];
                showGame(gdID, delayTime);

                delayTime = delayTime + 200;
            }
            
            // Reset delay timer and selected game.
            delayTime = 0;
            selectedGame = null;
            
            // Do a bunch of HTML and CSS stuff to make it look pretty.
            document.getElementById("form").innerHTML = " ";
            document.getElementById("theAnswer").innerHTML = " ";
            hideGameOptions("gameOptions"); // Hide game Options for real
            deanimateTitle(); // Hide the title, animated style
            
            // More HTML and CSS Stuff
            document.getElementById("main").style.height = "auto";
            document.getElementById("theAnswer").innerHTML = " ";
            document.getElementById("theAnswer").style.height = "0";
            document.getElementById("preSelect").style.opacity = "1";
            document.getElementById("preSelect").style.height = "auto";
            document.getElementById("gameOptions").style.zIndex = 0;
            document.getElementById("gameTitle").style.zIndex = 0;
            document.getElementById("gameTitleText").style.opacity = "0";
        }
    });
    
    // On the submission of the form/options
    $("#submitForm").click(function () {
        // Fancy animate
        $("#preSelect").velocity({opacity: 0, height: 0}, function () {
            // Fancy animate of the answer.
            $("#theAnswer").velocity({height: theAnswer + "px"}, function () {
                randSelected = randSelect(); // Grab answer
                
                // If it wasn't false return the answer
                if (randSelected == false) {
                    randSelected = "No Options Selected";
                } else {
                    randSelected = randSelected.slice(6);
                }
                
                // Display answer on the app
                document.getElementById("theAnswer").innerHTML = "<div class='answer' id='answer'>" + randSelected + "</div>";
                $("#answer").delay(500).fadeIn(750); // Fade it in.
            });
        });
    })
});

// Animate the hide of a specific ID.
function animateHide(gaid, delayTime) {
    $("#" + gaid).delay(delayTime).velocity({opacity: '0'});
}

// Animate tht title with the width, text, and opacity
function animateTitle(gameTitle) {
    return $.when($("#gameTitle").delay(200).velocity({width: '100%'})).done(function () {
        document.getElementById("gameTitleText").innerHTML = gameTitle;
        $("#gameTitleText").velocity({opacity: '1'});
    });
}

// Deanimate the width, text, and opacity
function deanimateTitle() {
    return $.when($("#gameTitle").velocity({width: '0'})).done(function () {
        document.getElementById("gameTitleText").innerHTML = "PLACEHOLDER";
        $("#gameTitleText").velocity({opacity: '0'});
    });
}

// Show games
function showGame(gaid, delayTime) {
    $("#" + gaid).delay(delayTime).velocity({opacity: '1'});
}

// Show options for the game
function showGameOptions(gaid) {
    $("#" + gaid).delay(400).velocity({opacity: '1'});
}

// Hide the game options
function hideGameOptions(gaid) {
    $("#" + gaid).delay(delayTime).velocity({opacity: '0'});
}

// Randomly select option basic edition
function randSelect() {
    var newOptions = []; // Option array for easy use
    
    // For each of the checked items add them to an array
    $("input:checkbox").each(function () {
        var $this = $(this);

        if ($this.is(":checked")) {
            newOptions.push($this.attr("id"));
        }
    });
    
    // Make sure it's more then 0 and not null.
    if (newOptions.length > 0 && newOptions != null) {
        var newArrLength = newOptions.length; // Grab array length
        var returnName = Math.floor((Math.random() * newArrLength) + 1); // Do some math for random number
        returnName--; // The code example added one, I removed one later on because remove the +1 broke it. I think that's what happened.
        
        // Return option
        return newOptions[returnName];
    } else {
        // Return false if those were not true
        return false;
    }
}

// Grab each game and push into an array and return.
function gameArr() {
    var gameArray = [];
    $.each($('.game'), function () {
        gameArray.push(this.id);
    });

    return gameArray;
}