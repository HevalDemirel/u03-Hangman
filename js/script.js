// En lista av ord för spelet
const wordList = ["CHAS", "ACADEMY", "HANGMAN", "JAVASCRIPT", "HTML", "CSS"];

// Variabel för det valda ordet
let selectedWord;

// Variabel som håller reda på antalet gissningar
let guesses = 0;

// Variabel för bildkälla för hängmanskoden
let hangmanImg;

// Variabel för meddelandehållare
let msgHolderEl;

// Knapp för att starta spelet
let startGameBtnEl;

// Knappar för bokstäver
let letterButtonEls;

// Rutor för bokstäverna
let letterBoxEls;

/* Funktion för att starta spelet, här väljs ett slumpmässigt ord när vi anropar selectWord(), detta tilldelas
selectWord, createletterboxes som också är en funktion körs och skapar HTML element för bokstav i det valda ordet,
Letterbuttonels queryselectorn där representerar bokstäverna i knaparna som tilldelas varibaler, 
det är också en händelselysnare med som läggs till på alla bokstavknappar som anroppar funktion guessLetter när man klickar.
Vidare är det id hangmnan som tilldelas variabeln hangmanIMg, msgHolderEl är referensen till elementet med id Message som hämtas och tilldelas varibalen
och startGameBtnEl  som är startknappen som inaktiveras för att man inte ska starta om spelet mitt i */
function startGame() {
  selectedWord = selectWord();
  createLetterBoxes(selectedWord);
  letterButtonEls = document.querySelectorAll("#letterButtons button");
  letterButtonEls.forEach((button) => {
    button.addEventListener("click", guessLetter);
  });
  hangmanImg = document.getElementById("hangman");
  msgHolderEl = document.getElementById("message");
  startGameBtnEl.disabled = true;
}

/* Funktion för att slumpa fram ett ord, selectWord som väljer en slumpmässig ord från wordLsit och returnerar ordet.
Jag använder math.random för att returnera ett tal mellan 0-1 sedan används math.floor för att avrunda till närmaste heltal.
Worldlist.length kombineras med math.random och math.floor för att användas som ett index och välja ett ord från wordlist.
return wordlist och randomindex genererar ett slumpmässigt ord från vår array med ord.*/
function selectWord() {
  const randomIndex = Math.floor(Math.random() * wordList.length);
  return wordList[randomIndex];
}

/* Här har vi en funktion som används för att skapa en serie HTML element som ska representera bokstäver.
 Först har vi han funktion som i sin block hämtar en referens till elementen med id som är letterboxes. 
 vi tömmmer innehållet på rad 57, sedan använder vi en for loop som skapar och lägger till textrutor för varje bokstav
 i ordet. För varje bokstav så skapas en li och en input. input elementet blir barn element till list elementet. Nu skapas ett antal textrutor
 som är varje bokstav i ordet. */
function createLetterBoxes(word) {
  letterBoxEls = document.getElementById("letterBoxes").getElementsByTagName("ul")[0];
  letterBoxEls.innerHTML = "";
  for (let i = 0; i < word.length; i++) {
    const li = document.createElement("li");
    const input = document.createElement("input");
    input.type = "text";
    input.disabled = true;
    input.value = "";
    li.appendChild(input);
    letterBoxEls.appendChild(li);
  }
}

/*Funktion för att hantera gissningar av bokstäver.
Här hämtar vi den gissade bokstaven och bokstäverna i det hemliga ordet. Vi itererar över bokstäverna
i ordet för att kolla om gissningen är rätt, detta gör vi i våran första if sats. OM det blir en matchning
mellan bokstaven och en bokstav i ordet så kommer värdet att sättas motsvarande inputelementet och correctguess blir true. 
  I nästa if sats hanteras felgissningar. Om gissningen är fel och correctguess fortfranade är false så ökar guesses
  och en ny ritning i bilden tillämpas. Skulle guesses === 6 så avslutas spelet. I den tredje if satsen 
  kollar vi om alla bokstäver i ordet har gissats och ifall det har hänt så blir handleEndgame true och spelaren vinner. 
  I rad 103 så inaktiveras knappen som är rätt gissad så att man inte kan klicka på den igen. */
function guessLetter(event) {
  const guessedLetter = event.target.value;
  const lettersInWord = selectedWord.split("");
  let correctGuess = false;

  lettersInWord.forEach((letter, index) => {
    if (letter === guessedLetter) {
      letterBoxEls.children[index].firstElementChild.value = guessedLetter;
      correctGuess = true;
    }
  });

  if (!correctGuess) {
    guesses++;
    hangmanImg.src = `images/h${guesses}.png`;
    if (guesses === 6) {
      handleEndGame(false);
    }
  }

  if ([...letterBoxEls.children].every((li) => li.firstElementChild.value !== "")) {
    handleEndGame(true);
  }

  event.target.disabled = true;
}

/* Funktion för att hantera slutet av spelet. Här kontrollerar vi om spelet är vunnet eller förlorat.
Vi ändrar ordet till Stringen Grattis du vann eller Tyvärr du förlorade ordet var (Ordet som man skulle gissat fram).
Vi aktiverar sedan bokstakvsknapparna för att förbereda för en ny omgång. 
Sist så aktiverar vi Vi startGameBtn för att möjliggöra en ny omgång.  */
function handleEndGame(isWin) {
  if (isWin) {
    msgHolderEl.textContent = "Grattis, du vann!";
  } else {
    msgHolderEl.textContent = "Tyvärr, du förlorade! Ordet var " + selectedWord;
  }
  toggleLetterButtons(true);
  startGameBtnEl.disabled = false;
}

/* Funktion för att aktivera/inaktivera bokstavsknapparna.
genom denna funktion så kontrollerar vi begränsningen av knapparna, när vi vill använda dom. Vi innaktiverar alla
knappar samtidig.*/
function toggleLetterButtons(isDisabled) {
  letterButtonEls.forEach((button) => {
    button.disabled = isDisabled;
  });
}

/* Funktion för att återställa spelet. 
Vi återställer det hemliga ordet, gissningar och bilden genom rad selectword till hangman img.
MsgHolderel.Textcontent tar bort texten i meddelenande rutan. Vidare återställer vi textrutorna med createletterboxes
för att förbereda för ett nytt ord. 
*/
function resetGame() {
  selectedWord = "";
  guesses = 0;
  hangmanImg.src = "images/h0.png";
  msgHolderEl.textContent = "";
  toggleLetterButtons(false);
  createLetterBoxes("");
  startGame();
}

/*Eventlyssnare för att starta spelet när sidan laddas.
Här använder vi document.addeventlistener för att lyssna på click för att starta spelet. */
document.addEventListener("DOMContentLoaded", function () {
  startGameBtnEl = document.getElementById("startGameBtn");
  startGameBtnEl.addEventListener("click", startGame);

  /* Eventlyssnare för att återställa spelet när knappen klickas.
  Här återståller vi spelet så att vi kan starta en ny runda.  */
  const resetGameBtnEl = document.getElementById("resetGameBtn");
  resetGameBtnEl.addEventListener("click", resetGame);
});
