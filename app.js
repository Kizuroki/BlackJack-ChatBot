let deck = [];
let dealerHand = [];
let playerHand = [];
let gameOver = false;

// Create a deck of cards
function createDeck() {
    let suits = ['Hearts', 'Spades', 'Diamonds', 'Clubs'];
    let values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ value, suit });
        }
    }
}

// Shuffle the deck
function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// Deal a card
function dealCard() {
    return deck.pop();
}

// Calculate hand value
function calculateHandValue(hand) {
    let value = 0;
    let aceCount = 0;

    for (let card of hand) {
        if (['J', 'Q', 'K'].includes(card.value)) {
            value += 10;
        } else if (card.value === 'A') {
            aceCount += 1;
            value += 11;
        } else {
            value += parseInt(card.value);
        }
    }

    // Adjust for Aces
    while (value > 21 && aceCount > 0) {
        value -= 10;
        aceCount -= 1;
    }

    return value;
}

// Start the game
function startGame() {
    createDeck();
    shuffleDeck();
    dealerHand = [dealCard(), dealCard()];
    playerHand = [dealCard(), dealCard()];
    gameOver = false;

    updateDisplay();
}

// Update the game display
function updateDisplay() {
    let dealerCards = dealerHand.map(card => `${card.value} of ${card.suit}`).join(', ');
    let playerCards = playerHand.map(card => `${card.value} of ${card.suit}`).join(', ');

    document.getElementById('dealer-cards').innerText = dealerCards;
    document.getElementById('player-cards').innerText = playerCards;

    let dealerValue = calculateHandValue(dealerHand);
    let playerValue = calculateHandValue(playerHand);

    document.getElementById('dealer-value').innerText = `Value: ${dealerValue}`;
    document.getElementById('player-value').innerText = `Value: ${playerValue}`;

    // Check for game over
    if (playerValue > 21) {
        document.getElementById('status').innerText = "You busted! Dealer wins!";
        gameOver = true;
    } else if (dealerValue > 21) {
        document.getElementById('status').innerText = "Dealer busted! You win!";
        gameOver = true;
    }
}

// Player hits (gets a new card)
function hit() {
    if (!gameOver) {
        playerHand.push(dealCard());
        updateDisplay();
    }
}

// Player stands (dealer's turn)
function stand() {
    if (!gameOver) {
        let dealerValue = calculateHandValue(dealerHand);
        while (dealerValue < 17) {
            dealerHand.push(dealCard());
            dealerValue = calculateHandValue(dealerHand);
        }
        updateDisplay();
        checkWinner();
    }
}

// Check who wins the game
function checkWinner() {
    let dealerValue = calculateHandValue(dealerHand);
    let playerValue = calculateHandValue(playerHand);

    if (playerValue > 21) {
        document.getElementById('status').innerText = "You busted! Dealer wins!";
    } else if (dealerValue > 21 || playerValue > dealerValue) {
        document.getElementById('status').innerText = "You win!";
    } else if (playerValue === dealerValue) {
        document.getElementById('status').innerText = "It's a tie!";
    } else {
        document.getElementById('status').innerText = "Dealer wins!";
    }
    gameOver = true;
}

// Restart the game
function restart() {
    startGame();
    document.getElementById('status').innerText = "";
}

// Event listeners for buttons
document.getElementById('hit').addEventListener('click', hit);
document.getElementById('stand').addEventListener('click', stand);
document.getElementById('restart').addEventListener('click', restart);

// Start the first game
startGame();
