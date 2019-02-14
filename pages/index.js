import { Component } from 'react'
import { createDeck, createPlayers, grabCards } from '../utils'
import Deck from '../components/Deck'
import Player from '../components/Player'
import Stack from '../components/Stack'

const playerAmount = 4
const cardsPerPlayer = 7

export default class Index extends Component {

  state = {
    currentPlayer: null,
    deck: null,
    players: null,
    stack: null,
  }

  componentDidMount() {
    const deck = createDeck()
    const players = createPlayers(playerAmount, cardsPerPlayer, deck)
    const stack = grabCards(deck, 1)

    this.setState({ deck, players, stack, currentPlayer: 0 })
    setTimeout(() => this.gameTurn())
  }

  render() {
    const { deck, stack, players } = this.state

    if (!players) {
      return null
    }

    return (
      <div>
        {players.map(({ name, cards }, i) => <Player key={i} name={name} cards={cards} />)}
        <Stack cards={stack} />
        <Deck cards={deck} />
      </div>
    )
  }

  gameTurn() {
    const { currentPlayer, players } = this.state

    this.playerTurn(players[currentPlayer])

    if (players[currentPlayer].cards.length === 0) {
      return console.log('Game over. Winner: ', players[currentPlayer].name)
    }

    this.setState({ currentPlayer: currentPlayer === (playerAmount - 1) ? 0 : currentPlayer + 1 })

    setTimeout(() => this.gameTurn(), 1000)
  }

  playerTurn(player) {
    const { stack, deck } = this.state

    const playableCards = player.cards.filter(card => this.mayPlayCard(card, stack[stack.length - 1]))

    if (!playableCards || !playableCards.length) {
      return player.cards = [...player.cards, ...grabCards(deck, 1)]
    }

    this.playCard(player, playableCards[0])
  }

  mayPlayCard(cardA, cardB) {
    return cardA.number === cardB.number || cardA.type === cardB.type
  }

  playCard(player, card) {
    const { stack } = this.state

    const index = player.cards.indexOf(card)
    const cardToPlay = player.cards.splice(index, 1)
    stack.push(cardToPlay[0])
  }
}
