var cassette = document.getElementById("cassette");
var addButton = document.getElementById("add_to_playlist");
var playAll = document.getElementById("play_all");
var playlist_container = document.getElementById("playlist_container");
var drive_button = document.getElementById("go_to_drive");
var finish_mix_button = document.getElementById("finish_mix");
var currSongPlayingIndex = 0;
var currAudio = new Audio();
const tapes = [];
const returnedTapes = [];
var playlist = [];
var allUserTapes = [];
let currTape;

class Playlist {
    constructor(name, playlistArr) {
        this.name = name;
        this.playlistArr = playlistArr;
    }
}

class Song {
    constructor(title, m4a) {
        this.title = title;
        this.m4a = m4a;
    }
}

addButton.addEventListener("click", function () {
    if (currTape != undefined) {
        playlist.push(currTape);
        playlist_container.innerHTML += currTape.title + "<br><audio controls> <source src=" + currTape.m4a + "></audio><br>";
    } else {
        alert("No tape in deck!");
    }
})

$(document).ready(function () {
    $("#cassette").droppable({
        drop: function (event, ui) {
            // $(this).addClass("tape");
            let id = ui.draggable.prop('id');
            currTape = returnedTapes[id];
            console.log(currTape);
        },
        out: function () {
            currTape = undefined;
            console.log("out");
        }
    });
});

let submit = document.getElementById("submit");
$("#submit").click(function () {
    removeTapes();
    makeTapes();
    console.log(returnedTapes);
})

function makeDragable() {
    $(".tape").ready(function () {
        $($("#tape_container").children()).draggable({
            containment: $(".tape").parent().parent().parent(),
            snap: "#cassette",
            snapMode: "center",
            stop: function () {
                $("#cassette").css({ "background-color": "rgba(255, 255, 255, 0)" });
            },
            start: function () {
                $(this).addClass("dragging");
                $("#cassette").css({ "background-color": "rgba(255, 255, 255, 0.315)" });
                // $(this).css({ position: 'absolute' });
            }
        });
    });
}

function makeTapes() {
    let container = document.getElementById("tape_container");
    let search = document.getElementById("query").value;
    let url = "https://itunes.apple.com/search?media=music&term=the+" + search + "&limit=3";
    let i = 0;
    console.log(url);

    fetch(url)
        .then(result => result.json())
        .then((output) => {
            if (output.results.length == 0) {
                container.innerHTML += "No songs found.";
            } else {
                output.results.forEach(element => {
                    let label = element.trackName + " by " + element.artistName;
                    if (label.length > 40) {
                        label = label.substring(0, 40) + "...";
                    }
                    container.innerHTML += "<div id='" + i + "' class='tape'><div id='songlabel'>" + label + "</div></div>";
                    i++;
                    returnedTapes.push(new Song(element.trackName, element.previewUrl));
                });
            }
            makeDragable();
        })
        .catch(error => function () {
            console.error(error)
            container.innerHTML += "No songs found.";
        });
}

function removeTapes() {
    document.getElementById("tape_container").innerHTML = "";
    var tapesElems = document.getElementsByClassName("tape");
    console.log(tapesElems);
    Array.from(tapesElems).forEach(element => {
        element.parentNode.removeChild(element)
    });
    while (returnedTapes.length > 0) {
        returnedTapes.pop();
    }
    console.log(returnedTapes);
}

playAll.addEventListener("click", function () {
    currAudio.src = "";
    currAudio.src = playlist[currSongPlayingIndex].m4a;
    currAudio.play();

    console.log(currAudio);
});

currAudio.addEventListener("ended", function () {
    if (currSongPlayingIndex == playlist.length - 1) {
        currSongPlayingIndex = 0;
    } else {
        currSongPlayingIndex++;
    }
    currAudio.src = playlist[currSongPlayingIndex].m4a;
    currAudio.play();
});

finish_mix_button.addEventListener("click", function() {
    if (playlist.length == 0) {
        alert("Mix cannot be empty!");
        return;
    }
    let overlayElem = document.createElement("div");
    overlayElem.id = "overlay";
    overlayElem.style.backgroundColor = "rgba(13, 0, 58, 0.7)";
    overlayElem.style.position = "absolute";
    overlayElem.style.width = "100%";
    overlayElem.style.height = "100%";
    document.body.appendChild(overlayElem);

    let tape = document.createElement('img');
    tape.src = "images/tape.png";
    tape.style.position = "absolute";
    tape.style.margin = "auto";
    tape.style.left = "50%";
    tape.style.top = "15%";
    tape.style.width = "500px";
    tape.style.transform = "translate(-50%, 0)";
    overlayElem.appendChild(tape);

    let textbox = document.createElement("input");
    textbox.setAttribute("type", "text");
    textbox.style.position = "absolute";
    textbox.style.border = "none";
    textbox.style.width = "396px";
    textbox.style.height = "50px";
    textbox.style.left = "50%";
    textbox.style.top = "165px";
    textbox.style.transform = "translate(-50%, 0)";
    textbox.style.fontSize = "25px";
    textbox.style.fontFamily = "Pixel";
    overlayElem.appendChild(textbox);
    
    let finsihButton = document.createElement("button");
    finsihButton.innerHTML = "Name Mix";
    finsihButton.style.position = "absolute";
    finsihButton.style.left = "50%";
    finsihButton.style.top = "450px";
    finsihButton.style.transform = "translate(-50%, 0)";
    overlayElem.appendChild(finsihButton);
    finsihButton.addEventListener("click", function() {
        let title = textbox.value;
        if (title.length == 0) {
            textbox.style.backgroundColor = "rgb(247, 162, 162)";
        } else {
            let newPlaylist = new Playlist(title, [...playlist]);
            allUserTapes.push(newPlaylist);
            while (playlist.length) {
                playlist.pop();
            };
            console.log(allUserTapes);
            console.log(playlist);
            playlist_container.innerHTML = "";
            overlayElem.remove();
            document.getElementById("user_tapes_container").innerHTML += title + "<br>";
        }
    });
});

drive_button.addEventListener("click", function() {
    let container = document.getElementById("container");
    container.innerHTML = "";
    container.style.backgroundImage = "url('images/car.gif')";
    container.style.backgroundSize = "1450px 700px";
    document.body.style.backgroundColor = "rgb(13, 4, 56)";

    let ui_container = document.createElement("div");
    ui_container.id = "ui_container";
    container.appendChild(ui_container);

    let selectTape = document.createElement("select");
    for (let i = 0; i < allUserTapes.length; i++) {
        let option = document.createElement("option");
        option.value = i;
        option.text = allUserTapes[i].name;
        selectTape.appendChild(option);
    }
    ui_container.appendChild(selectTape);

    let playButton = document.createElement("button");
    playButton.innerHTML = "Play selected tape";
    playButton.addEventListener("click", function() {
        playlist = allUserTapes[selectTape.value].playlistArr;
        currAudio.src = "";
        currAudio.src = playlist[currSongPlayingIndex].m4a;
        currAudio.play();
    
        console.log(currAudio);
    })
    ui_container.appendChild(playButton);

    let pauseButton = document.createElement("button");
    pauseButton.innerHTML = "Pause";
    pauseButton.addEventListener("click", function(){
        currAudio.pause();
    })
    ui_container.appendChild(pauseButton);
});