import { StartOverlay, LastCardOverlay, WinnerOverlay } from '../components/Overlay'
import { useState, useEffect } from 'react'
import config from '../config'
import Deck from '../components/Deck'
import Head from 'next/head'
import Player from '../components/Player'
import Stack from '../components/Stack'
import styled, { createGlobalStyle } from 'styled-components'

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

export default function Index() {
  const [playerTurn, setPlayerTurn] = useState(0)
  const [deck, setDeck] = useState()
  const [players, setPlayers] = useState()
  const [showLastCardFor, setShowLastCardFor] = useState()
  const [showStartOverlay, setShowStartOverlay] = useState(true)
  const [stack, setStack] = useState()
  const [winner, setWinner] = useState(null)

  useEffect(setupGame, [])

  useEffect(() => {
    if (!showStartOverlay) {
      const timeOut = setTimeout(gameTurn, config.playSpeed)
      return () => clearTimeout(timeOut)
    }
  }, [playerTurn, showStartOverlay]) // This does not work if there's only 1 player, but who wants to play alone right?

  // If there are no cards, create a new deck from the stack
  useEffect(() => {
    if (deck && deck.length === 0) {
      const cardsButOne = stack.length - 1
      const [newDeck, newStack] = grabCards(stack, cardsButOne)
      const shuffledDeck = shuffle(newDeck)
      setDeck(shuffledDeck)
      setStack(newStack)
    }
  }, [deck])

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

      {showStartOverlay && (<StartOverlay onClick={startGame} />)}
      {showLastCardFor && <LastCardOverlay name={showLastCardFor} />}
      {winner && <WinnerOverlay name={winner} onClick={setupGame} />}
    </div>
  )

  function setupGame() {
    const [firstCard, ...restOfDeck] = createDeck()
    const [players, deck] = createPlayers(config.playerAmount, config.cardsPerPlayer, restOfDeck)
    const stack = [firstCard]

    setDeck(deck)
    setPlayers(players)
    setStack(stack)
    setPlayerTurn(0)
    setShowStartOverlay(true)
    setShowLastCardFor(null)
    setWinner(null)
  }

  function startGame() {
    setShowStartOverlay(false)
    gameTurn()
  }

  function gameTurn() {
    // Hide possible showing popup
    setShowLastCardFor(null)

    const player = players[playerTurn]
    const playableCards = player.cards.filter(card => canPlayCard(card, stack[stack.length - 1]))

    // Check if we can't play a card, if so, grab one
    if (!playableCards || !playableCards.length) {
      const [grabbedCards, newDeck] = grabCards(deck, 1)
      player.cards = [...player.cards, ...grabbedCards]
      setDeck(newDeck)
      nextGameTurn()
      return
    }

    // Show last card popup if we have 2 cards left and are about to play
    if (player.cards.length === 2) {
      setShowLastCardFor(player.name)
    }

    playCard(player, playableCards[0])

    // If that was the last card, player won
    if (players[playerTurn].cards.length === 0) {
      setWinner(players[playerTurn].name)
      return
    }

    nextGameTurn()
  }

  function nextGameTurn() {
    const nextPlayer = playerTurn === (config.playerAmount - 1) ? 0 : playerTurn + 1
    setPlayerTurn(nextPlayer)
  }

  function playCard(player, card) {
    const mutableStack = [...stack]

    const index = player.cards.indexOf(card)
    const [cardToPlay, remainingCards] = grabCards(player.cards, 1, index)

    mutableStack.push(cardToPlay[0])
    player.cards = remainingCards

    setStack(mutableStack)
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

function canPlayCard(cardA, cardB) {
  return cardA.number === cardB.number || cardA.type === cardB.type
}

function shuffle(array) {
  return array.sort(() => Math.random() - Math.random())
}

function randomName() {
  const names = ['James', 'Daan', 'Levi', 'Sem', 'Xavi', 'Finn', 'Max', 'Logan', 'Mees', 'Thomas', 'Nova', 'Mila', 'Zoë', 'Eva', 'Olivia', 'Sara', 'Julia', 'Rosalie', 'Evi', 'Senna']
  return names[Math.floor(Math.random() * names.length)]
}
