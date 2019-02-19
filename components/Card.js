import styled from 'styled-components'
import { Clubs, Diamond, Heart, Spade } from './Icons'

const icons = {
  clubs: Clubs,
  diamond: Diamond,
  heart: Heart,
  spade: Spade
}

const AspectRatio = styled.div`
  padding-bottom: 137%;
  position: relative;
  width: 100px;

  @media (min-width: 768px) {
    width: 175px;
  }
`

const Container = styled.div`
  align-items: center;
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  display: flex;
  font-family: 'Merriweather', serif;
  height: 100%;
  justify-content: center;
  overflow: hidden;
  position: absolute;
  width: 100%;

  &::before, &::after {
    content: '';
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 10;
  }
`

const CornerInfo = styled.div`
  align-items: center;
  bottom: ${({ isLeft }) => !isLeft ? '20px' : 'auto'};
  display: flex;
  flex-direction: column;
  left: ${({ isLeft }) => isLeft ? '20px' : 'auto'};
  position: absolute;
  right: ${({ isLeft }) => !isLeft ? '20px' : 'auto'};
  top: ${({ isLeft }) => isLeft ? '20px' : 'auto'};
  transform: rotate(${({ rotation }) => rotation || 0}deg);
`

const Number = styled.div`
  font-family: 'Merriweather', serif;
  font-weight: 700;
  font-size: 20px;
  line-height: 1;
  margin: 0 0 10px;
`

const CenterPieceContainer = styled.div`
  position: relative;
`

const IconContainer = styled.div`
  opacity: 0.1;
`

const CenterText = styled.div`
  font-family: 'Merriweather', serif;
  font-size: 30px;
  font-weight: 400;
  left: 50%;
  line-height: 1;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
`

const ClosedCard = styled.div`
  background: repeating-linear-gradient(
    45deg,
    #E71D36,
    #E71D36 10px,
    #011627 10px,
    #011627 20px
  );
  border-radius: 4px;
  height: calc(100% - 40px);
  left: 20px;
  position: absolute;
  top: 20px;
  width: calc(100% - 40px);
`

export default function Card({ type, number, closed }) {
  if (closed) {
    return (
      <AspectRatio>
        <Container>
          <ClosedCard />
        </Container>
      </AspectRatio>
    )
  }

  return (
    <AspectRatio>
      <Container>
        <CornerInformation type={type} number={number} isLeft />
        <CornerInformation type={type} number={number} rotation={180} />
        <CenterPiece number={number} type={type} />
      </Container>
    </AspectRatio>
  )
}

function CornerInformation({ type, number, rotation, isLeft }) {
  const Icon = icons[type]

  return (
    <CornerInfo rotation={rotation} isLeft={isLeft}>
      <Number>{number}</Number>
      <Icon fill={getColor(type)} style={{ width: 30, height: 30 }} />
    </CornerInfo>
  )
}

function CenterPiece({ number, type }) {
  const Icon = icons[type]

  return (
    <CenterPieceContainer>
      <IconContainer>
        <Icon fill={getColor(type)} style={{ width: 80, height: 80 }} />
      </IconContainer>
      <CenterText>{getName(number)}</CenterText>
    </CenterPieceContainer>
  )
}

function getName(number) {
  const map = { A: 'Ace', 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five', 6: 'Six', 7: 'Seven', 8: 'Eight', 9: 'Nine', 10: 'Ten', J: 'Jack', Q: 'Queen', K: 'King' }
  return map[number]
}

function getColor(type) {
  const map = { heart: '#E71D36', spade: '#011627', clubs: '#011627', diamond: '#E71D36', }
  return map[type]
}
