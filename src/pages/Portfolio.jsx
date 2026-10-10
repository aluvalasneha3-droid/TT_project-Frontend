import { useAuth } from '../context/AuthContext'
import { formatCurrency } from '../services/api'

function Portfolio() {
  const { holdings, stocks } = useAuth()

  const rows = holdings.map((holding) => {
    const stock = stocks.find((item) => item.symbol === holding.stockSymbol)
    const currentPrice = stock ? stock.currentPrice : 0
    const currentValue = currentPrice * holding.quantity
    const costBasis = holding.quantity * holding.averagePrice

    return {
      ...holding,
      currentPrice,
      currentValue,
      unrealizedPnl: currentValue - costBasis,
    }
  })

  const totalValue = rows.reduce((sum, row) => sum + row.currentValue, 0)

  return (
    <div className="page-shell">
      <section className="page-header compact">
        <div>
          <p className="eyebrow">Your portfolio</p>
          <h1>Holdings</h1>
        </div>
      </section>

      {rows.length > 0 ? (
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Stock</th>
                <th>Quantity</th>
                <th>Avg. price</th>
                <th>Current price</th>
                <th>Current value</th>
                <th>Unrealized P/L</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.stockSymbol}</td>
                  <td>{row.quantity}</td>
                  <td>{formatCurrency(row.averagePrice)}</td>
                  <td>{formatCurrency(row.currentPrice)}</td>
                  <td>{formatCurrency(row.currentValue)}</td>
                  <td className={row.unrealizedPnl >= 0 ? 'profit' : 'loss'}>
                    {formatCurrency(row.unrealizedPnl)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="portfolio-total">
            <span>Total portfolio value</span>
            <strong>{formatCurrency(totalValue)}</strong>
          </div>
        </div>
      ) : (
        <div className="empty-state">No holdings found yet.</div>
      )}
    </div>
  )
}

export default Portfolio
