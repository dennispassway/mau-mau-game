import Card from './Card'
import styled from 'styled-components'

const Container = styled.div`
  position: relative;
  height: 360px;
  width: 250px;
`

const CardContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  transform: rotate(${({ rotation }) => rotation}deg);
`

export default function Stack({ cards }) {
  return (
    <Container>
      {cards.map(({ type, number }, i) => (
        <CardContainer key={i} rotation={Math.floor(Math.random() * 20) - 10}>
          <Card type={type} number={number} />
        </CardContainer>
      ))}
    </Container>
  )
}
