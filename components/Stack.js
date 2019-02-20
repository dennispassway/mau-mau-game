import Card from './Card'
import posed, { PoseGroup } from 'react-pose'
import styled from 'styled-components'

const CardContainer = posed.div({
  enter: { opacity: 1, y: 0, rotate: ({ rotation }) => rotation },
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

export default function Stack({ cards }) {
  return (
    <Container>
      <PoseGroup>
        {cards.map(({ type, number }, i) => (
          <StyledCardContainer key={i} rotation={Math.floor(Math.random() * 10) - 5}>
            <Card type={type} number={number} />
          </StyledCardContainer>
        ))}
      </PoseGroup>
    </Container>
  )
}
