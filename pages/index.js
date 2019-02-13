const playerAmount = 4
const cardsPerPlayer = 7

const deck = createDeck()
const shuffledDeck = shuffle(deck)
const players = createPlayers(playerAmount, cardsPerPlayer, shuffledDeck)
const stack = grabCards(shuffledDeck, 1)

let currentPlayer = 0

turn()

function createPlayers(amount, cards, deck) {
  return [...Array(amount)].map((_, i) => ({ name: randomName(), cards: grabCards(deck, cards) }))
}

function randomName() {
  const names = ['James', 'Daan', 'Levi', 'Sem', 'Xavi', 'Finn', 'Max', 'Logan', 'Mees', 'Thomas', 'Nova', 'Mila', 'Zoë', 'Eva', 'Olivia', 'Sara', 'Julia', 'Rosalie', 'Evi', 'Senna']
  return names[Math.floor(Math.random() * names.length)]
}

function turn() {
  playerTurn(players[currentPlayer])

  if (players[currentPlayer].cards.length === 0) {
    return console.log('Game over. Winner: ', players[currentPlayer].name)
  }

  currentPlayer = currentPlayer === (playerAmount - 1) ? 0 : currentPlayer + 1
  turn()
}

function playerTurn(player) {
  const playableCards = player.cards.filter(card => mayPlayCard(card, stack[stack.length - 1]))

  if (!playableCards || !playableCards.length) {
    return player.cards = [...player.cards, ...grabCards(shuffledDeck, 1)]
  }

  playCard(player, playableCards[0], stack)
}

function playCard(player, card, stack) {
  const index = player.cards.indexOf(card)
  const cardToPlay = player.cards.splice(index, 1)
  stack.push(cardToPlay[0])
}

function mayPlayCard(cardA, cardB) {
  return cardA.number === cardB.number || cardA.type === cardB.type
}

function createDeck() {
  const cardNumbers = [...Array(13).keys()].map(c => c + 1).map(c => {
    const specialOnes = { 1: 'A', 11: 'J', 12: 'Q', 13: 'K', }
    return specialOnes[c] || c
  })

  const cardTypes = ['hearts', 'spades', 'clubs', 'diamonds']
  const cards = cardTypes.map(type => cardNumbers.map(number => ({ number, type })))

  return [].concat(...cards)
}

function shuffle(array) {
  return array.sort(() => Math.random() - Math.random())
}

function grabCards(deck, amount) {
  return deck.splice(0, amount)
}

export default function Index() {
  return (
    <div>Hello world!</div>
  )
}
