import { useAuth } from '../context/AuthContext'
import { formatCurrency } from '../services/api'

function Transactions() {
  const { transactions } = useAuth()

  return (
    <div className="page-shell">
      <section className="page-header compact">
        <div>
          <p className="eyebrow">Trade history</p>
          <h1>Transactions</h1>
        </div>
      </section>

      {transactions.length > 0 ? (
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Stock</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((entry) => (
                <tr key={entry.id}>
                  <td>{new Date(entry.createdAt).toLocaleDateString('en-IN')}</td>
                  <td>{entry.stockSymbol}</td>
                  <td className={entry.type === 'BUY' ? 'buy-tag' : 'sell-tag'}>{entry.type}</td>
                  <td>{entry.quantity}</td>
                  <td>{formatCurrency(entry.price)}</td>
                  <td>{formatCurrency(entry.quantity * entry.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">No transactions yet.</div>
      )}
    </div>
  )
}

export default Transactions
