import { Component } from 'react'
import { createDeck, createPlayers, grabCards, shuffle } from '../utils'
import { createGlobalStyle } from 'styled-components'
import Deck from '../components/Deck'
import Head from 'next/head'
import Player from '../components/Player'
import Stack from '../components/Stack'
import styled from 'styled-components'

const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }

  html, body {
    margin: 0;
    padding: 0;
  }

  body {
    background-color: #6BD4ff;
    min-height: 100vh;
  }
`

const StackDeckContainer = styled.div`
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  display: flex;
  justify-content: center;
  overflow: hidden;
  padding: 50px;
  width: 100%;

  & > * {
    margin: 0 50px;
  }
`

const PlayersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
`

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
    setTimeout(() => this.gameTurn()) // hack: next tick
  }

  render() {
    const { deck, stack, players } = this.state

    if (!players) {
      return null
    }

    return (
      <div>
        <Head>
          <link href='https://fonts.googleapis.com/css?family=Merriweather:400,700' rel='stylesheet' />
        </Head>
        <GlobalStyle />
        <StackDeckContainer>
          <Stack cards={stack} />
          <Deck cards={deck} />
        </StackDeckContainer>
        <PlayersContainer>
          {players.map(({ name, cards }, i) => <Player key={i} name={name} cards={cards} />)}
        </PlayersContainer>
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

    setTimeout(() => this.gameTurn(), 100)
  }

  playerTurn(player) {
    const { stack, deck } = this.state

    const playableCards = player.cards.filter(card => this.mayPlayCard(card, stack[stack.length - 1]))

    if (!playableCards || !playableCards.length) {
      return player.cards = [...player.cards, ...grabCards(deck, 1)]
    }

    if (deck.length === 0) {
      const cardsButOne = stack.length - 1
      const newDeck = grabCards(stack, cardsButOne)
      const shuffledDeck = shuffle(newDeck)

      this.setState({ deck: shuffledDeck })
    }

    if (player.cards.length === 2) {
      console.log('Last card for ', player.name)
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

    this.setState({ player, stack })
  }
}
