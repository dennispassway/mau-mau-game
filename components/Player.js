import Card from './Card'
import config from '../config'
import posed, { PoseGroup } from 'react-pose'
import styled from 'styled-components'

const CardContainer = posed.div({
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -100 }
})

const Container = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin: 50px 0;
  overflow: hidden;
  padding: 50px;
  width: 100%;

  @media (${config.viewportM}) {
    width: calc(50% - 100px);
  }
`

const CardsContainer = styled.div`
  display: flex;
  margin: 0 0 40px;
  position: relative;
`

const StyledCardContainer = styled(CardContainer)`
  display: block;

  &:not(:first-child) {
    left: ${({ index }) => `${index * 70}px`};
    position: absolute;
    top: 0;
  }
`

const Name = styled.div`
  color: #fff;
  font-weight: 400;
  font-size: 24px;
  line-height: 1;
  text-align: center;
`

export default function Player({ cards, name }) {
  return (
    <Container>
      <CardsContainer>
        <PoseGroup>
          {cards.map(({ type, number }, i) => (
            <StyledCardContainer key={i} index={i}>
              <Card key={i} type={type} number={number} />
            </StyledCardContainer>
          ))}
        </PoseGroup>
      </CardsContainer>
      <Name>{name}</Name>
    </Container>
  )
}
