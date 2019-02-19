import Card from './Card'
import styled from 'styled-components'

const Container = styled.div`
position: relative;
height: 240px;
width: 175px;
`

const CardContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
`

export default function Deck({ cards }) {
  return (
    <Container>
      {cards.reverse().map(({ type, number }, i) => (
        <CardContainer key={i}>
          <Card type={type} number={number} closed />
        </CardContainer>
      ))}
    </Container>
  )
}
