import words from './words.json' assert { type: 'json' }

const height = 6;
const width = 5;


let row = 0;
let col = 0;

let gameOver = false;
let word = words[Math.floor(Math.random() * words.length)].toUpperCase();
console.log(word);

window.onload = function() {
    init()
}

function init() {
    for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
            let tile = document.createElement("span");
            tile.id = r.toString() + '-' + c.toString();
            tile.classList.add("tile");
            tile.innerText = "";
            document.getElementById("board").appendChild(tile);
            // console.log(c);
            // console.log(tile);
        }
    }

    let keyboard = [
        ["Й", "Ц", "У", "К", "Е", "Н", "Г", "Ш", "Щ", "З", "Х", "Ъ"], 
        ["Ф", "Ы", "В", "А", "П", "Р", "О", "Л", "Д", "Ж", "Э", "⌫"], 
        ["Я", "Ч", "С", "М", "И", "Т", "Ь", "Б", "Ю", "Enter", " "]
    ];

    for (let i = 0; i < keyboard.length; i++) {
        let currRow = keyboard[i]
        let keyboardRow = document.createElement("div");
        keyboardRow.classList.add("keyboard-row");

        for (let j = 0; j < currRow.length; j++) {
            let keyTile = document.createElement("div")

            let key = currRow[j]
            keyTile.innerText = key;
            if (key === "Enter") {
                keyTile.id = "Enter"
            } else if (key === "⌫") {
                keyTile.id = "Backspace"
            } else if ("А" <= key && key <= "Я") {
                keyTile.id = key
            }

            keyTile.addEventListener("click", proccessKey);
            

            if (key === "Enter") {
                keyTile.classList.add("enter-key-tile")
            } else {
                keyTile.classList.add("key-tile")
            }
            keyboardRow.appendChild(keyTile);
        }
        document.body.appendChild(keyboardRow);
    }

    document.addEventListener("keyup", (evt) => {
        proccessInput(evt)
    })
}

function proccessKey() {
    let evt = {"key" : this.id}
    proccessInput(evt)
}



function proccessInput(evt) {
    if (gameOver) return;
    
    
    if ("А" <= evt.key && evt.key <= "Я" || "а" <= evt.key && evt.key <= "я") {
         if (col < width) {
            let currTile = document.getElementById(row.toString() + '-' + col.toString())
            
         if (currTile.innerText === "") {
            currTile.innerText = evt.key.toUpperCase();
            col += 1;
            console.log(currTile);
         }  
        }
    } else if (evt.key === "Backspace") {
        if (0 < col && col <= width) {
            col -= 1
        }
        let currTile = document.getElementById(row.toString() + '-' + col.toString())
        currTile.innerText = "";
    } else if (evt.key === "Enter") {
        update()
    }
    if (!gameOver && row === height) {
        gameOver = true;
        document.getElementById("answer").innerText = `Не повезло, или может, ты - тупица, правильное слово: ${word}`;
    }
}

function update() {
    let guess = "";
    document.getElementById("answer").innerText = "";

    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString()) 
        let letter = currTile.innerText;
        guess += letter;
    }

    guess = guess.toLowerCase();
    console.log(guess);

    if (!words.includes(guess)) {
        document.getElementById("answer").innerText = "Такого слова не существует, лошара";
        return;
    }

    let correct = 0;

    let letterCount = {};
    for (let i = 0; i < word.length; i++) {
        let letter = word[i];

        if (letterCount[letterCount]) {
            letterCount[letter] += 1;
        } else {
            letterCount[letter] = 1;
        }
    }

    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText;

        if (word[c] === letter) {
            currTile.classList.add("correct");

            let keyTile = document.getElementById(letter);
            keyTile.classList.remove("present");
            keyTile.classList.add("correct");

            correct += 1;
            letterCount[letter] -= 1;
        }

        if (correct === width) {
            document.getElementById("answer").innerText = "Браво, сученька. Ткни Enter, чтобы играть ещё";
            gameOver = true;

            document.addEventListener("keyup", (evt) => {
                if (evt.code === "Enter" || evt.key === "Enter") {
                    location.reload();
                }
            })
        }
    }

    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText;

        if (!currTile.classList.contains("correct")) {
            if (word.includes(letter) && letterCount[letter] > 0) {
                currTile.classList.add("present");
                let keyTile = document.getElementById(letter);
                if (!keyTile.classList.contains("correct")) {
                    keyTile.classList.add("present");
                } 
                letterCount[letter] -= 1;
            } else {
                currTile.classList.add("absent");
                let keyTile = document.getElementById(letter);
                keyTile.classList.add("absent")
            }
        }
    }

    row += 1;
    col = 0;
}


