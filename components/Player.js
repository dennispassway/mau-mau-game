import Card from './Card'
import styled from 'styled-components'

const Container = styled.div`
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  border: solid 1px white;
  margin: 50px 0;
  overflow: hidden;
  padding: 50px;
  width: 100%;

  @media (min-width: 768px) {
    width: calc(50% - 100px);
  }
`

const CardsContainer = styled.div`
  display: flex;
  margin: 0 0 40px;
  position: relative;
`

const CardContainer = styled.div`
  display: block;

  &:not(:first-child) {
    left: ${({ index }) => `${index * 70}px`};
    position: absolute;
    top: 0;
  }
`

const Name = styled.div`
  color: #fff;
  font-family: 'Merriweather', serif;
  font-weight: 400;
  font-size: 24px;
  line-height: 1;
  text-align: center;
`

export default function Player({ cards, name }) {
  return (
    <Container>
      <CardsContainer>
        {cards.map(({ type, number }, i) => (
          <CardContainer key={i} index={i}>
            <Card key={i} type={type} number={number} />
          </CardContainer>
        ))}
      </CardsContainer>
      <Name>{name}</Name>
    </Container>
  )
}
