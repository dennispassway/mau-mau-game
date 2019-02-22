import { Component } from 'react'
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
    this.setupGame()
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

        {/* @TODO: set overlay and content in state */}

        {showStartOverlay && (<Overlay
          title='Mau Mau Game'
          text='Mau-Mau is a card game for 2 to 5 players that is popular in Germany, Austria, South Tyrol, the United States, Brazil, Poland, and the Netherlands. Mau-Mau is a member of the larger Crazy Eights or shedding family, to which e.g. the proprietary card games of Uno and Flaps belong. However Mau-Mau is played with standard French or German-suited playing cards.'
          buttonLabel='Start the game'
          onClick={() => this.startGame()}
        />)}

        {showLastCardFor && <Overlay title={`Last card for ${showLastCardFor}!`} />}

        {winner && <Overlay
          title={`Game over! ${winner} has won!`}
          text='That was fun! Want to make them play again?'
          buttonLabel='Play again'
          onClick={() => this.setupGame()}
        />}
      </div>
    )
  }

  startGame() {
    this.setState({ showStartOverlay: false })
    this.gameTurn()
  }

  setupGame() {
    const [firstCard, ...restOfDeck] = createDeck()
    const [players, deck] = createPlayers(config.playerAmount, config.cardsPerPlayer, restOfDeck)
    const stack = [firstCard]

    this.setState({ deck, players, stack, currentPlayer: 0, showStartOverlay: true, showLastCardFor: null, winner: null })
  }

  gameTurn() {
    const { currentPlayer, players, stack, deck } = this.state
    const player = players[currentPlayer]
    this.setState({ showLastCardFor: null })

    const playableCards = player.cards.filter(card => canPlayCard(card, stack[stack.length - 1]))

    if (!playableCards || !playableCards.length) {
      const [grabbedCards, newDeck] = grabCards(deck, 1)
      player.cards = [...player.cards, ...grabbedCards]
      this.setState({ deck: newDeck })
      this.newRound()
      return
    }

    if (deck.length === 0) {
      const cardsButOne = stack.length - 1
      const [newDeck, newStack] = grabCards(stack, cardsButOne)
      const shuffledDeck = shuffle(newDeck)
      this.setState({ deck: shuffledDeck, stack: newStack })
    }

    if (player.cards.length === 2) {
      this.setState({ showLastCardFor: player.name })
    }

    this.playCard(player, playableCards[0])

    if (players[currentPlayer].cards.length === 0) {
      return this.setState({ winner: players[currentPlayer].name })
    }

    this.newRound()
  }

  newRound() {
    const { currentPlayer } = this.state
    this.setState({ currentPlayer: currentPlayer === (config.playerAmount - 1) ? 0 : currentPlayer + 1 })
    setTimeout(() => this.gameTurn(), config.playSpeed)
  }

  playCard(player, card) {
    const { stack } = this.state
    const mutableStack = [...stack]

    const index = player.cards.indexOf(card)
    const [cardToPlay, remainingCards] = grabCards(player.cards, 1, index)

    mutableStack.push(cardToPlay[0])
    player.cards = remainingCards

    this.setState({ player, stack: mutableStack })
  }
}

function createDeck() {
  const cardTypes = ['heart', 'spade', 'clubs', 'diamond']
  const cardNumbers = [...Array(13).keys()].map(c => c + 1).map(c => {
    const specialOnes = { 1: 'A', 11: 'J', 12: 'Q', 13: 'K', }
    return specialOnes[c] || c
  })

  return shuffle(cardTypes.reduce((res, type) => [
    ...res,
    ...cardNumbers.map(number => ({ number, type }))
  ], []))
}

function canPlayCard(cardA, cardB) {
  return cardA.number === cardB.number || cardA.type === cardB.type
}

function createPlayers(amount, cards, deck) {
  let mutatableDeck = [...deck]

  const players = [...Array(amount)].map((_, i) => {
    const [grabbedCards, newDeck] = grabCards(mutatableDeck, cards)
    mutatableDeck = newDeck

    return { name: randomName(), cards: grabbedCards }
  })

  return [players, mutatableDeck]
}

function grabCards(deck, amount, startPosition = 0) {
  const mutateableDeck = [...deck]
  const cards = mutateableDeck.splice(startPosition, amount)
  return [cards, mutateableDeck]
}

function shuffle(array) {
  return array.sort(() => Math.random() - Math.random())
}

function randomName() {
  const names = ['James', 'Daan', 'Levi', 'Sem', 'Xavi', 'Finn', 'Max', 'Logan', 'Mees', 'Thomas', 'Nova', 'Mila', 'Zoë', 'Eva', 'Olivia', 'Sara', 'Julia', 'Rosalie', 'Evi', 'Senna']
  return names[Math.floor(Math.random() * names.length)]
}
