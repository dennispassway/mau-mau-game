import posed, { PoseGroup } from 'react-pose'
import Card from './Card'
import styled from 'styled-components'

const CardContainer = posed.div({
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 100 }
})

const Container = styled.div`
  position: relative;
  height: 240px;
  width: 175px;
`

const StyledCardContainer = styled(CardContainer)`
  position: absolute;
  top: 0;
  left: 0;
`

export default function Deck({ cards }) {
  return (
    <Container>
      <PoseGroup>
        {cards.reverse().map(({ type, number }, i) => (
          <StyledCardContainer key={i}>
            <Card type={type} number={number} closed />
          </StyledCardContainer>
        ))}
      </PoseGroup>
    </Container>
  )
}
