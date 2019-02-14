export function createDeck() {
  const cardNumbers = [...Array(13).keys()].map(c => c + 1).map(c => {
    const specialOnes = { 1: 'A', 11: 'J', 12: 'Q', 13: 'K', }
    return specialOnes[c] || c
  })

  const cardTypes = ['hearts', 'spades', 'clubs', 'diamonds']
  const cards = cardTypes.map(type => cardNumbers.map(number => ({ number, type })))

  return shuffle([].concat(...cards))
}

export function createPlayers(amount, cards, deck) {
  return [...Array(amount)].map((_, i) => ({ name: randomName(), cards: grabCards(deck, cards) }))
}

export function grabCards(deck, amount) {
  return deck.splice(0, amount)
}

function shuffle(array) {
  return array.sort(() => Math.random() - Math.random())
}

function randomName() {
  const names = ['James', 'Daan', 'Levi', 'Sem', 'Xavi', 'Finn', 'Max', 'Logan', 'Mees', 'Thomas', 'Nova', 'Mila', 'Zoë', 'Eva', 'Olivia', 'Sara', 'Julia', 'Rosalie', 'Evi', 'Senna']
  return names[Math.floor(Math.random() * names.length)]
}
