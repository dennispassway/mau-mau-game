import config from '../config'
import styled from 'styled-components'
import posed from 'react-pose'

const FadeInUp = posed.div({
  mounted: { opacity: 1, y: 0 },
  unmounted: { opacity: 0, y: 200 }
})

const Container = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
`

const Background = styled.div`
  background-color: ${config.blue};
  height: 100%;
  left: 0;
  opacity: 0.9;
  position: absolute;
  top: 0;
  width: 100%;
`

const Content = styled.div`
  align-items: center;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 800px;
  padding: 20px;
  position: relative;
  text-align: center;
  width: 100%;
  z-index: 10;
`

const Title = styled.h2`
  font-size: 60px;
  line-height: 1;
  margin: 0 0 20px;
`

const Text = styled.p`
  font-size: 20px;
  line-height: 1.7;
  margin: 0 auto 20px;
  max-width: 600px;
  width: 100%;
`

const Button = styled.button`
  background-color: ${config.red};
  border-radius: 4px;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  outline: none;
  padding: 20px 30px;
  transition: background-color 200ms ease-out;

  &:hover, &:focus {
    background-color: ${config.black};
  }
`

export default function Overlay({ title, text, onClick, buttonLabel }) {
  return (
    <Container>
      <Background />
      <Content>
        {title && <FadeInUp initialPose='unmounted' pose='mounted'><Title>{title}</Title></FadeInUp>}
        {text && <FadeInUp initialPose='unmounted' pose='mounted'><Text>{text}</Text></FadeInUp>}
        {onClick && buttonLabel && <FadeInUp initialPose='unmounted' pose='mounted'><Button onClick={() => onClick()}>{buttonLabel}</Button></FadeInUp>}
      </Content>
    </Container>
  )
}
