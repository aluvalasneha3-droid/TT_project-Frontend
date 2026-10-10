const topics = [
  {
    title: 'Price trends',
    explanation: 'A trend describes the general direction of a price over time. Short-term moves can differ from the longer-term direction.',
  },
  {
    title: 'Percentage change',
    explanation: 'Percentage change compares a price move with the previous reference price, making moves easier to compare across differently priced stocks.',
  },
  {
    title: 'Risk and reward',
    explanation: 'Potential reward comes with uncertainty. A past price move or indicator cannot guarantee a future result.',
  },
  {
    title: 'Diversification',
    explanation: 'Holding companies from different areas can reduce reliance on one company, but it cannot remove market risk.',
  },
  {
    title: 'Realised and unrealised P/L',
    explanation: 'Unrealised profit or loss changes while you hold shares. Realised profit or loss is recorded after you sell.',
  },
]

function Learn() {
  return (
    <div className="page-shell">
      <section className="page-header compact">
        <div>
          <p className="eyebrow">Learn to Trade</p>
          <h1>Trading basics</h1>
          <p className="data-note">A few useful ideas for practising with virtual money.</p>
        </div>
      </section>

      <section className="learning-grid" aria-label="Trading basics">
        {topics.map((topic) => (
          <article className="panel-card learning-card" key={topic.title}>
            <h2>{topic.title}</h2>
            <p>{topic.explanation}</p>
          </article>
        ))}
      </section>
    </div>
  )
}

export default Learn