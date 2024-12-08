// could not figure out user session so it just refreshes every time
// think that's fine, it's a personal website designed to just stay open in your browser

// online site:
// it's hard to want to remember every moment, because that is impossible
// over time, your memories will distort and fade if you do not revisit them often
// the more you add to the website, the harder it is to dig through and find old memories
// you can destroy your diary if it gets too overwhelming

// offline site:
// in today's world, we feel pressure to document and preserve our lives online and through social media.
// by going offline, the internet is no longer forever.
// the memory or though exists only in the moment of writing
// in worrying about the past or future, we can forget about the present
// this allows you to let things go

document.addEventListener('DOMContentLoaded', function () {
    const firebaseConfig = {
        apiKey: "AIzaSyCwxWXI5soE7TRk-ifhNBblGx54GxxNM_w",
        authDomain: "test2-859e0.firebaseapp.com",
        databaseURL: "https://test2-859e0-default-rtdb.firebaseio.com",
        projectId: "test2-859e0",
        storageBucket: "test2-859e0.appspot.com",
        messagingSenderId: "879228966907",
        appId: "1:879228966907:web:81af5a0bf9d486cdc05d5e"
    };

    const container = document.querySelector('.container');
    container.style.display = 'none'; // hiding the diary part to start

    firebase.initializeApp(firebaseConfig);

    let messagesRef = firebase.database().ref('Collected Data');
    let introRef = firebase.database().ref('Intro Data');

    introRef.once('value', function (snapshot) {
        if (!snapshot.exists()) {
            saveCollection();
        } else {
            fetchAndDisplayIntroData();
        }
    });

    function saveCollection() {
        let newMessageRef = introRef;
        newMessageRef.set({
            introEntry1: "Welcome to my Diary",
            introEntry2: "This is TOP SECRET",
            introEntry3: "This is a third entry of the diary that you have to save"
        });
    }

    // Fetch and display intro data on page load
    function fetchAndDisplayIntroData() {
        introRef.once('value', function (snapshot) {
            let introEntries = snapshot.val();
            if (introEntries) {
                for (let key in introEntries) {
                    let entryData = introEntries[key];

                    if (entryData.introEntry1) {
                        displayIntroEntry(entryData.introEntry1);
                    }
                    if (entryData.introEntry2) {
                        displayIntroEntry(entryData.introEntry2);
                    }
                    if (entryData.introEntry3) {
                        displayIntroEntry(entryData.introEntry3);
                    }
                }
            }
        });
    }

    // displaying intro diary entries from firebase, scrambles it
    // when clicked, adds a class 'clicked' to them and returns it unscrambled
    // runs function to check if they have all been clicked

    function displayIntroEntry(text) {
        let introEntriesContainer = document.getElementById('introEntries') || createIntroEntriesContainer();

        let entry = document.createElement('p');
        entry.className = "intro-entry";
        entry.textContent = scrambleText(text);

        entry.addEventListener('click', function () {
            entry.textContent = text;
            entry.classList.add('clicked');
            checkAllIntroEntriesClicked();
        });

        introEntriesContainer.appendChild(entry);
    }

    // creates intro container with the entries
    function createIntroEntriesContainer() {
        let introContainer = document.getElementById('introduction');
        let introEntriesContainer = document.createElement('div');
        introEntriesContainer.id = 'introEntries';
        introContainer.appendChild(introEntriesContainer);
        displayWordCloud();
        return introEntriesContainer;
    }

    // Scrambler function
    function scrambleText(text) {
        return text.split('').sort(() => Math.random() - 0.5).join('');
    }

    // checks if all of the intro entries are clicked
    // if they are, hide intro stuff and show diary stuff after 2 seconds
    function checkAllIntroEntriesClicked() {
        let entries = document.querySelectorAll('.intro-entry');
        let allClicked = Array.from(entries).every(entry => entry.classList.contains('clicked'));


        if (allClicked) {
            setTimeout(function () {
                const introContainer = document.getElementById('introduction');
                introContainer.style.display = 'none';  // Hide intro container
                container.style.display = 'block';      // Show form container
                messagesRef.once('value', function (snapshot) {

                    let messages = snapshot.val();
                    if (messages) {
                        for (let key in messages) {
                            displayData(messages[key]);
                        }

                    }
                });
            }, 2000);

        }
    }

    let wordCloud = [
        "I'm scared I will forget it all",
        "I have to write it down",
        "What if I lose it all?",
        "I want to remember everything",
        "I can't keep it all",
        "I will forget things",
        "What will happen to my memories?"
    ];

    // display background text
    function displayWordCloud() {
        const introContainer = document.getElementById('introduction');

        // styling for each word
        for (let i = 0; i < 50; i++) {
            let w = Math.floor(Math.random() * wordCloud.length);
            let randomWord = wordCloud[w];
            let wordDiv = document.createElement('div');
            wordDiv.textContent = randomWord;
            wordDiv.dataset.originalText = randomWord;
            wordDiv.dataset.isScrambled = false;
            wordDiv.dataset.isBlurred = false;
            wordDiv.style.position = 'absolute';
            wordDiv.style.left = Math.random() * introContainer.offsetWidth + 'px';
            wordDiv.style.top = Math.random() * introContainer.offsetHeight + 'px';
            wordDiv.style.fontSize = `${Math.random() * 15 + 13}px`; // Random size between 14px and 34px
            wordDiv.style.color = randomColor();
            introContainer.appendChild(wordDiv);

            startPhraseEffects(wordDiv);
        }
    }

    // picks random colors for each entry
    function randomColor() {
        const randomR = Math.floor(Math.random() * 256);
        const randomG = Math.floor(Math.random() * 256);
        const randomB = Math.floor(Math.random() * 256);
        return `rgb(${randomR}, ${randomG}, ${randomB})`;
    }

    // another scramble function
    function scramblePhrase(wordDiv) {
        if (wordDiv.dataset.isScrambled === "false") {
            wordDiv.textContent = scrambleText(wordDiv.dataset.originalText);
            wordDiv.dataset.isScrambled = "true";
        }
    }

    // another blur function
    function addBlurEffect(wordDiv) {
        wordDiv.style.filter = 'blur(3px)';
        wordDiv.style.opacity = '0.5';
        wordDiv.dataset.isBlurred = "true";
    }

    // move thru scramble to blur
    function startPhraseEffects(wordDiv) {
        setTimeout(() => {
            scramblePhrase(wordDiv);

            setTimeout(() => {
                addBlurEffect(wordDiv);
            }, getRandomArbitrary(3000, 10000));
        }, getRandomArbitrary(3000, 10000));
    }

    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    // END INTRO CODE

    // MAIN PAGE CODE (not intro)
    document.getElementById('contactForm').addEventListener('submit', submitForm);

    function submitForm(e) {
        e.preventDefault();

        let title = getInputVal('title');
        let diary = getInputVal('diary');
        let color = getInputVal('color');

        let emptyMessages = ["Don't leave it blank!", "You left something out...", "Can't remember it if you don't write it down..."];
        let g = Math.floor(Math.random() * emptyMessages.length);
        let d = emptyMessages[g];

        const inputConfirmDialog = document.getElementById('inputConfirmDialog');
        const inputDynamicText = document.getElementById('inputDynamicText');
        const inputConfirmYes = document.getElementById('inputConfirmYes');

        // if fields are empty, show popup
        if (title === "" || diary === "") {
            inputDynamicText.textContent = d;
            inputConfirmDialog.classList.remove('hidden');

            inputConfirmYes.addEventListener('click', function () {
                inputConfirmDialog.classList.add('hidden');
            });

            return;
        }

        saveMessage(title, diary, color);
        displayData({ title: title, diary: diary, color: color });

        // resets form
        document.getElementById('contactForm').reset();
    }


    function getInputVal(id) {
        return document.getElementById(id).value;
    }

    function saveMessage(title, diary, color) {
        let newMessageRef = messagesRef.push();
        newMessageRef.set({
            title: title,
            diary: diary,
            color: color,
            timestamp: Date.now() // if this is helpful later, i added it
        });
    }

    // shuffle function to change location of all the entries
    function shuffle() {
        const diaryEntries = document.querySelectorAll('.diary-entry');

        diaryEntries.forEach(diaryEntry => {
            const randomX = Math.floor(Math.random() * (window.innerWidth - 150));
            const randomY = Math.floor(Math.random() * (window.innerHeight - 110));

            diaryEntry.style.setProperty('--random-x', `${randomX}px`);
            diaryEntry.style.setProperty('--random-y', `${randomY}px`);
        });
    }

    // event listener for shuffle button, moves entries around
    document.querySelector('.shuffleButton').addEventListener('click', function () {
        shuffle();
    });

    // function to delete all entries
    function deleteNiceEntries() {
        messagesRef.remove()
            .then(function () {
                console.log("All entries from Firebase have been deleted.");

                const diaryEntries = document.querySelectorAll('.diary-entry');
                diaryEntries.forEach(entry => entry.remove());
            })
            .catch(function (error) {
                console.error("Error deleting entries: ", error);
            });
    }

    // self-destruct button uses deleteNiceEntries to delete them all from firebase and screen

    const destroyButton = document.getElementById('destroyButton');
    const confirmDialog = document.getElementById('confirmDialog');
    const confirmYes = document.getElementById('confirmYes');
    const confirmNo = document.getElementById('confirmNo');
    const dynamicText = document.getElementById('dynamicText');

    let destructMessages = [
        "Burning the book means obliterating all your memories. Are you ready to let it all go?",
        "This is a full wipe. All entries, gone forever. Continue?",
        "Burning the diary means leaving it all behind. Are you ready to make peace with that?"
    ];

    destroyButton.addEventListener('click', function () {
        let e = Math.floor(Math.random() * destructMessages.length);
        let l = destructMessages[e];
        dynamicText.textContent = l;
        confirmDialog.classList.remove('hidden');
    });

    confirmYes.addEventListener('click', function () {
        confirmDialog.classList.add('hidden');
        console.log('Action confirmed! Proceeding...');
        deleteNiceEntries();
    });

    confirmNo.addEventListener('click', function () {
        confirmDialog.classList.add('hidden');
        console.log('Action canceled.');
    });

    // end self destruct button

    // da big function displaying the data on the screen
    function displayData(newEntry) {
        const dataDisplay = document.getElementById('dataDisplay');

        if (newEntry) {
            const diaryEntry = document.createElement('p');
            diaryEntry.className = "diary-entry";
            diaryEntry.style.color = newEntry.color; // change text color to chosen color
            diaryEntry.innerHTML = `Title: ${newEntry.title}<br>Diary Entry: ${newEntry.diary}`;

            // randomizes the font for each entry
            const fontType = ["Arial", "Verdana", "Helvetica", "Parkinsans", "Courier New", "Playfair Display"];
            const randomFont = fontType[Math.floor(Math.random() * fontType.length)];
            diaryEntry.style.fontFamily = randomFont;

            // random positions for each entry
            const randomX = Math.floor(Math.random() * (window.innerWidth - 150)); // Adjust `150` to limit entry width
            const randomY = Math.floor(Math.random() * (window.innerHeight - 110)); // Adjust `50` to limit entry height
            diaryEntry.style.setProperty('--random-x', `${randomX}px`);
            diaryEntry.style.setProperty('--random-y', `${randomY}px`);

            dataDisplay.appendChild(diaryEntry);

            // POPUP CODE START
            let popup = null;
            let popupMessages = ["DON'T FORGET ME!", "TEND TO YOUR MEMORIES!", "WHAT ABOUT ME?", "YOU CAN'T REMEMBER EVERYTHING!", "DON'T LOSE ME FOREVER!", "YOU'RE GOING TO FORGET IT ALL!", "I'M SLIPPING AWAY!", "HOLD ON TO ME!"];
            let i = Math.floor(Math.random() * popupMessages.length);
            let r = popupMessages[i];

            // make the popup
            function createPopup(message) {
                popup = document.createElement('div');
                popup.className = 'popup';
                popup.textContent = message;
                document.body.appendChild(popup);
            }

            // hover for popup
            diaryEntry.addEventListener('mouseover', function (e) {
                createPopup(r);
                document.addEventListener('mousemove', movePopup);
            });

            // remove when mouse leaves the entry
            diaryEntry.addEventListener('mouseleave', function () {
                if (popup) {
                    popup.remove();
                }
                document.removeEventListener('mousemove', movePopup);
            });

            // END POPUP CODE

            // variables
            let isScrambled = false;
            let isBlurred = false;
            let scrambleTimeout;
            let blurTimeout;
            let zIndex = 0;
            let blurRemovalTimeout;

            // scrambles text function
            function scramble() {
                if (!isScrambled) {
                    diaryEntry.innerHTML = `Title: ${scrambleText(newEntry.title)}<br>Diary Entry: ${scrambleText(newEntry.diary)}`;
                    isScrambled = true;
                    isBlurred = false;
                    zIndex = zIndex - 1;
                    removeBlurEffect(diaryEntry);
                }
            }

            // unscrambles text function
            function unscramble() {
                diaryEntry.innerHTML = `Title: ${newEntry.title}<br>Diary Entry: ${newEntry.diary}`;
                isScrambled = false;
                zIndex = zIndex + 1;
                startScrambleTimer();
            }

            // blurs text function
            function addBlurEffect(entry) {
                zIndex = zIndex - 1;
                entry.style.filter = 'blur(3px)';
                entry.style.opacity = '0.5';
            }

            // undo blur text function
            function removeBlurEffect(entry) {
                entry.style.filter = 'none';
                entry.style.opacity = '1';
                zIndex = zIndex + 1;
                startScrambleTimer();
            }

            function startScrambleTimer() {
                clearTimeout(scrambleTimeout);
                clearTimeout(blurTimeout);

                if (!isScrambled) {
                    scrambleTimeout = setTimeout(scramble, getRandomArbitrary(3000, 10000));
                } else {
                    blurTimeout = setTimeout(() => {
                        if (isScrambled) {
                            addBlurEffect(diaryEntry);
                            isBlurred = true;
                        }
                    }, getRandomArbitrary(12000, 120000));
                }

            }

            function getRandomArbitrary(min, max) {
                return Math.random() * (max - min) + min;
            }

            // start the initial timer
            startScrambleTimer();

            // toggle states when entry clicked
            diaryEntry.addEventListener('click', function () {
                if (isScrambled && isBlurred) {
                    // If it's scrambled and blurred, remove blur and change states
                    removeBlurEffect(diaryEntry);
                    isBlurred = false;
                    isScrambled = true;
                } else if (isScrambled) {
                    // If only scrambled, and you click, unscramble it and change states
                    isBlurred = false;
                    isScrambled = true;
                    unscramble();
                }
            });
        }
    }
    
    // show the entries
    displayData();

});

