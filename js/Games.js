var melodleGames = [

    {
        "id": "1",
        "pitches": "E4,E4,F4,G4,G4,F4,E4,D4",
        "rhythm": "4n,4n,4n,4n,4n,4n,4n,4n",
        "tempo": 100,
        "composer": "Beethoven",
        "uploader": "Baroque82",
        "date": "2022-05-26",
        "key": "C"
    },
    {
        "id": "2",
        "pitches": "C4,C4,D4,C4,F4,E4",
        "rhythm": "8n+16n,16n,4n,4n,4n,2n",
        "tempo": 100,
        "composer": "Traditional",
        "uploader": "Baroque82",
        "date": "2022-05-27",
        "key": "C"
    },
    {
        "id": "3",
        "pitches": "C4,C4,G4,G4,A4,A4,G4",
        "rhythm": "4n,4n,4n,4n,4n,4n,2n",
        "tempo": 100,
        "composer": "Mozart",
        "uploader": "Baroque82",
        "date": "2022-05-28",
        "key": "C"
    },
    {
        "id": "4",
        "pitches": "C5,E5,F#5,A5,G5,E5,C5",
        "rhythm": "4n+8n,4n,4n,8n,4n+8n,4n,4n",
        "tempo": 120,
        "composer": "Elfman",
        "uploader": "Baroque82",
        "date": "2022-05-29",
        "key": "G"
    },
    {
        "id": "5",
        "pitches": "C4,E4,F4,G4,C4,E4,F4,G4",
        "rhythm": "4n,4n,4n,1n+4n,4n,4n,4n,1n+4n",
        "tempo": 120,
        "composer": "Traditional",
        "uploader": "Baroque82",
        "date": "2022-05-30",
        "key": "C"
    },
    {
        "id": "6",
        "pitches": "G4,A4,G4,F4,E4,F4,G4",
        "rhythm": "4n+8n,8n,4n,4n,4n,4n,2n",
        "tempo": 120,
        "composer": "Traditional",
        "uploader": "Piemaster77",
        "date": "2022-05-31",
        "key": "C"
    },
    {
        "id": "7",
        "pitches": "G4,G4,G4,D#4,F4,F4,F4,D4",
        "rhythm": "8n,8n,8n,2n,8n,8n,8n,2n",
        "tempo": 120,
        "composer": "Beethoven",
        "uploader": "Piemaster77",
        "date": "2022-06-01",
        "key": "Eb"
    },
    {
        "id": "8",
        "pitches": "G4,B4,D5,G5,A4,F#5,G5,G4,G4",
        "rhythm": "8n,8n,8n,8n,8n,8n,4n,4n,4n",
        "tempo": 120,
        "composer": "Bach",
        "uploader": "Piemaster77",
        "date": "2022-06-02",
        "key": "G"
    }
]

var gameList = {};
var gameNumber = melodleGames.length - 1;
var currGame = melodleGames[gameNumber];
var gameRhythm = currGame['rhythm'].split(",");
var gamePitches = currGame['pitches'].split(",");
var gameTempo = currGame['tempo'];
var tryNumber = 0;
var maxTries = 6;
var boxIndex = 0;
var currPage = "Play";
var gameWon = false;
var green = '#ccffcc';
var yellow = '#ffffcc';
var gray = 'cccccc';

function populateGameList() {
    currPage = "Play";
    //var gameListHtml = ``;
    for (let i = 0; i < (melodleGames.length - 1); i++) {
        let tmp = melodleGames[i];
        gameList[tmp['id']] = tmp['date'];
        $('#gameSelect').append($('<option>', { value: tmp['id'], text: tmp['id'] + ": " + tmp['date'] }));
        //gameListHtml += `<option value="${tmp['id']}">${tmp['date']}</option>`;
    }
    tmp = melodleGames[melodleGames.length - 1];
    gameList[tmp['id']] = tmp['date'];
    $('#gameSelect').append($('<option>', { value: tmp['id'], text: tmp['id'] + ": " + tmp['date'] }));
    $("#gameSelect").val(tmp['id']).change();
    //gameListHtml += `<option value="${tmp['id']}" selected>${tmp['date']}</option>`;
    //document.getElementById('gameSelect').innerHTML = gameListHtml;
}

function colorBoxes() {
    let correct = 0;
    for (let i = 0; i < gamePitches.length; i++) {
        let boxij = "box" + i + tryNumber;
        let tmp = document.getElementById(boxij).innerText;
        if (tmp == gamePitches[i]) {
            $('#' + boxij)[0].style['background-color'] = green;
            correct++;
        } else {
            $('#' + boxij)[0].style['background-color'] = gray;
        }
    }
    if (correct >= gamePitches.length) {
        gameWon = true;
        gameEnd();
    } else {
        
    }

}

function gameEnd() {
    if (gameWon) {
        document.getElementById('gameEndText').innerHTML = `<h1>You Won!</h1>`;
    } else {
        document.getElementById('gameEndText').innerHTML = `<h1>Try Again</h1>`;
    }
}
