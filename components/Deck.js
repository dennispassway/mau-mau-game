import Card from './Card'

export default function Deck({ cards }) {
  return (
    <div>
      {cards.map(({ type, number }, i) => <Card key={i} type={type} number={number} />)}
    </div>
  )
}
