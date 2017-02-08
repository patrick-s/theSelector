/*
 * Name: Patrick Sappington
 * Assignment: Mobile App /w Cordova #2
 * Date: 11/03/2016
 */

// Global Viarables
var clickedOption;
var selectedOption;
var gameImage;
var gameOptions;
var headerBar = $("header").outerHeight();
var pictureSource;
var destinationType;


document.addEventListener("deviceready", onDeviceReady, false);

// Camera Stuff on Device Ready
function onDeviceReady() {
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
}

// ****************
// General Functions
// ****************
function ts_listgames() {
    var gameList = localStorage.getItem('games');

    gameList = JSON.parse(gameList);

    return gameList;
}

// Grab and parse list of options for a game
function ts_listoptions(gaID) {
    var optionList = localStorage.getItem('games');

    optionList = JSON.parse(optionList);
    optionList = optionList[gaID]["options"];
    return optionList;
}

// Populate Select boxes on given select ID with games.
function ts_populatelists(liID) {
    var gameList = ts_listgames();

    if (gameList) {

        for (game in gameList) {
            $("#" + liID).append("<option value='" + game + "'>" + gameList[game]["game_title"] + "</option>");
        }
    }
}

// Populate options on given select ID, using the remove option value for game ID.
function ts_populateoptions(liID) {
    var gaID = document.getElementById("removeOptionsGame").value;
    var optionList = ts_listoptions(gaID);

    if (optionList) {

        for (opts in optionList) {
            $("#" + liID).append("<option>" + optionList[opts] + "</option>");
        }
    }
}

// Generate Alert when something happens.
function generateAlert(textAlert){
    document.getElementById("alert").innerHTML = textAlert;
    $.when($("#alert").velocity({opacity: '1'})).done(function () {
        document.getElementById("alert").style.zIndex = 99;
        $("#alert").delay(1000).velocity({opacity: '0'});
    });
}

// Add game to object
function ts_addgame() {
    // Setup viarables
    var getGame = document.getElementById("addGameName").value;
    var gameList = ts_listgames(); // List of games
    var gameObj = {}; // New object incase one does not exist.
    var inArr = false;
    var fillObj = {game_title: "", options: {}, image: "img/blank.jpg"}; // Blank template for new game object.
    var getGame_clean = getGame.replace(/\s+/g, '-').toLowerCase(); // Clean name for selecting from object
    
    // Check if they have added a game before.
    if (!gameList) {
        // First time with new object
        gameObj[getGame_clean] = fillObj; // Filler object
        gameObj[getGame_clean]["game_title"] = getGame; // Real game name
        localStorage.setItem('games', JSON.stringify(gameObj)); // Set LocalStorage with object
        generateAlert("Game Added"); // Generate Alert
    } else {
        // Adding onto current object
        
        // Checking if it's already in the array.
        for (gamesIn in gameList) {
            if (gameList == getGame_clean) {
                inArr = true;
            }
        }
        
        // If it's not in the array, add it, update and generate alert.
        if (inArr !== true) {
            gameList[getGame_clean] = fillObj;
            gameList[getGame_clean]["game_title"] = getGame;
            localStorage.setItem('games', JSON.stringify(gameList));
            generateAlert("Game Added");
        } else {
            // If it is, generate alert letting them know
            generateAlert("Please type a different title.");
        }
    }

    document.getElementById("addGameName").value = "";
}

// Add option to game
function ts_addoption(optionText, gameName) {
    var listGames = ts_listgames(); // Grab list of games
    var getOptions = listGames[gameName]["options"]; // Grab options for selected game
    var optionsNum = 0; // Number tracker for options, it broke before I did this. (I think)
    var inArr = false; // Array Check Holder
    
    // Number options and check if it already exists
    for (gameOptions in getOptions) {
        if (getOptions[gameOptions] == optionText) {
            inArr = true;
        }
        optionsNum++;
    }
    
    // If it doesn't add to object and re-set storage
    if (inArr !== true) {

        listGames[gameName]["options"][optionsNum] = optionText;
        localStorage.setItem('games', JSON.stringify(listGames));
        generateAlert("Option Added");
    } else {
        // If it does exist show error
        generateAlert("Option already exists");
    }
    
    // Reset textbox
    document.getElementById("addOptionName").value = "";

}

// Delete Game Function
function ts_deletegame(gaID) {
    var gameArray = ts_listgames(); // Grab list of games
    delete gameArray[gaID]; // Delete from object
    localStorage.setItem('games', JSON.stringify(gameArray)); // Update object in local Storage
    generateAlert("Game Deleted"); // Show alert
}

// Delete option function
function ts_deleteoption(gaID, gaOP) {
    var gameArray = ts_listgames(); // Grab list of games
    var gameOptions = gameArray[gaID]["options"]; // Grab options from game
    var deleteOP = false; // Check if it even exists holding viarable...I think.
    
    // Loop through options
    for (opts in gameOptions) {
        if (gameOptions[opts] == gaOP) { // If the option is the one they wanted to delete.
            deleteOP = opts; // I found it, grab and store the ID number of the one you want to delete
        }
    }
    
    // If it was found remove it from object and re-set on storage, generate alert.
    if (deleteOP !== false) {
        delete gameArray[gaID]["options"][deleteOP];
        localStorage.setItem('games', JSON.stringify(gameArray));
        generateAlert("Option Deleted");
    }

    ts_reloadoptions(); // Also reload all of the options again.
}

// Check for options
function ts_checkoptions(gaID) {
    var listGames = ts_listgames(); // Grab list
    var gameOptions = listGames[gaID]["options"]; // Grab options
    
    // If it exists, return options else return false.
    if (gameOptions) {
        return gameOptions;
    } else {
        return false;
    }
}

// Check for image
function ts_checkimage(gaID) {
    var listGames = ts_listgames(); // List games
    var gameImage = listGames[gaID]["image"]; // Grab options?
    
    // If the image is found, return it, else return false.
    if (gameImage) {
        return gameImage;
    } else {
        return false;
    }
}

// Image Stuff

// Use built in image gallery to select image.
function ts_add_image() {
    navigator.camera.getPicture(imgSelSuc, imgSelFail, {quality: 75,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 1920,
        targetHeight: 400,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false});
}

// Place image in object and re-set in local Storage, generate alert
function imgSelSuc(imageData) {
    var listGames = ts_listgames();
    var gameName = document.getElementById("addImageGame").value;

    listGames[gameName]["image"] = imageData;
    localStorage.setItem('games', JSON.stringify(listGames));
    generateAlert("Image Added");
    
}

// If it fialed, generate alert saying so.
function imgSelFail(message) {
    generateAlert("Image Failed");
}

// END IMAGE STUFF

// Reload lists, usually when adding/removing/changing items
function ts_reloadlists() {
    document.getElementById("removeGames").innerHTML = "";
    document.getElementById("addOptions").innerHTML = "";
    document.getElementById("removeOptionsGame").innerHTML = "";
    document.getElementById("addImageGame").innerHTML = "";
    ts_populatelists("removeGames");
    ts_populatelists("addOptions");
    ts_populatelists("removeOptionsGame");
    ts_populatelists("addImageGame");
}

// reload optoins, for when it needs reloading.
function ts_reloadoptions() {
    document.getElementById("removeOption").innerHTML = "";
    ts_populateoptions("removeOption");
}

// When document is ready, start the main functions and events
$(document).ready(function () {
    
    // Set headbars and alert margin/paddings
    document.getElementById("main").style.paddingTop = headerBar + "px";
    document.getElementById("alert").style.marginTop = headerBar + "px";
    
    // On click/tap run the add game and reload list functions
    $("#add_game").on('click', function () {
        ts_addgame();
        ts_reloadlists();
    });
    
    // On click/tap grab option and game, load add option and reload option functions
    $("#add_option").on('click', function () {
        clickedOption = document.getElementById("addOptionName").value;
        selectedGame = document.getElementById("addOptions").value;
        ts_addoption(clickedOption, selectedGame);
        ts_reloadoptions();
    });

    // On click/tap run add image function
    $("#addImage").on('click', function () {
        ts_add_image();
    });
    
    // on click/tap run grab the game they wish to remove and remove game function
    $("#remove_game").on('click', function () {
        clickedOption = document.getElementById("removeGames").value;
        ts_deletegame(clickedOption);
        ts_reloadlists();
        ts_reloadoptions();
    });

    // On click/tap run load options when changing game on remove option
    $("#removeOptionsGame").on('change', function () {
        ts_reloadoptions();
    });
    
    // On click/tap grab option and game and run remove option and reload options functions
    $("#remove_option").on('click', function () {
        clickedOption = document.getElementById("removeOptionsGame").value;
        selectedOption = document.getElementById("removeOption").value;
        ts_deleteoption(clickedOption, selectedOption);
        ts_reloadoptions();
    });
    
    // Reload list and options on first run.
    ts_reloadlists();
    ts_reloadoptions();
});

