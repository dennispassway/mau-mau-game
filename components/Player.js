import Card from './Card'

export default function Player({ cards, name }) {
  return (
    <div>
      {name}
      <div>
        {cards.map(({ type, number }, i) => <Card key={i} type={type} number={number} />)}
      </div>
    </div>
  )
}
