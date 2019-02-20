/* @TODO: game logic could be neater with promises and async await, also, utils are not really utils anymore */

import { Component } from 'react'
import { createDeck, createPlayers, grabCards, shuffle } from '../utils'
import { createGlobalStyle } from 'styled-components'
import config from '../config'
import Deck from '../components/Deck'
import Head from 'next/head'
import Overlay from '../components/Overlay'
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
    background-color: ${config.blue};
    font-family: 'Roboto', sans-serif;
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

export default class Index extends Component {

  state = {
    currentPlayer: null,
    deck: null,
    players: null,
    showLastCardFor: null,
    showStartOverlay: null,
    stack: null,
    winner: null
  }

  componentDidMount() {
    this.restart()
  }

  render() {
    const { deck, stack, players, showStartOverlay, showLastCardFor, winner } = this.state

    return (
      <div>
        <Head>
          <link href='https://fonts.googleapis.com/css?family=Roboto:400,700' rel='stylesheet' />
        </Head>
        <GlobalStyle />
        <StackDeckContainer>
          {stack && <Stack cards={stack} />}
          {deck && <Deck cards={deck} />}
        </StackDeckContainer>
        {players && (
          <PlayersContainer>
            {players.map(({ name, cards }, i) => <Player key={i} name={name} cards={cards} />)}
          </PlayersContainer>
        )}

        {showStartOverlay && (<Overlay
          key={Math.random()}
          title='Mau Mau Game'
          text='Mau-Mau is a card game for 2 to 5 players that is popular in Germany, Austria, South Tyrol, the United States, Brazil, Poland, and the Netherlands. Mau-Mau is a member of the larger Crazy Eights or shedding family, to which e.g. the proprietary card games of Uno and Flaps belong. However Mau-Mau is played with standard French or German-suited playing cards.'
          buttonLabel='Start the game'
          onClick={() => this.startGame()}
        />)}

        {showLastCardFor && <Overlay key='lastCard' title={`Last card for ${showLastCardFor}!`} />}

        {winner && <Overlay
          key='winner'
          title={`Game over! ${winner} has won!`}
          text='That was fun! Want to make them play again?'
          buttonLabel='Play again'
          onClick={() => this.restart()}
        />}
      </div>
    )
  }

  startGame() {
    this.setState({ showStartOverlay: false })
    this.gameTurn()
  }

  restart() {
    const deck = createDeck()
    const players = createPlayers(config.playerAmount, config.cardsPerPlayer, deck)
    const stack = grabCards(deck, 1)

    this.setState({ deck, players, stack, currentPlayer: 0, showStartOverlay: true, showLastCardFor: null, winner: null })
  }

  gameTurn() {
    const { currentPlayer, players } = this.state

    this.playerTurn(players[currentPlayer])

    if (players[currentPlayer].cards.length === 0) {
      return this.setState({ winner: players[currentPlayer].name })
    }

    this.setState({ currentPlayer: currentPlayer === (config.playerAmount - 1) ? 0 : currentPlayer + 1 })

    setTimeout(() => this.gameTurn(), config.playSpeed)
  }

  playerTurn(player) {
    const { stack, deck } = this.state

    this.setState({ showLastCardFor: null })

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
      this.setState({ showLastCardFor: player.name })
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
