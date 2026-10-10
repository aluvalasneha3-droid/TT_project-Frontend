import { useAuth } from '../context/AuthContext'
import { formatCurrency } from '../services/api'

function Dashboard() {
  const { user, holdings, stocks, transactions, watchlist, balance } = useAuth()
  const hasLiveQuotes = stocks.some((stock) => stock.dataSource === 'UPSTOX')

  const portfolioValue = holdings.reduce((total, holding) => {
    const stock = stocks.find((item) => item.symbol === holding.stockSymbol)
    return total + (stock ? stock.currentPrice * holding.quantity : 0)
  }, 0)

  const unrealizedPnl = holdings.reduce((total, holding) => {
    const stock = stocks.find((item) => item.symbol === holding.stockSymbol)
    const currentValue = stock ? stock.currentPrice * holding.quantity : 0
    const costBasis = holding.quantity * holding.averagePrice
    return total + (currentValue - costBasis)
  }, 0)

  const watchedStocks = stocks.filter((stock) => watchlist.includes(stock.symbol))

  return (
    <div className="page-shell">
      <section className="page-header">
        <div>
          <p className="eyebrow">Portfolio overview</p>
          <h1>Welcome, {user?.username || 'Trader'}</h1>
        </div>
        <div className="notice-box">
          Practise trading with virtual money. No real money is involved.{' '}
          {hasLiveQuotes ? 'Market quotes are from Upstox.' : 'Displayed prices are demo values, not live quotes.'}
        </div>
      </section>

      <section className="summary-grid">
        <div className="summary-card">
          <span>Virtual balance</span>
          <strong>{formatCurrency(balance)}</strong>
        </div>
        <div className="summary-card">
          <span>Portfolio value</span>
          <strong>{formatCurrency(portfolioValue)}</strong>
        </div>
        <div className="summary-card">
          <span>Unrealized P/L</span>
          <strong className={unrealizedPnl >= 0 ? 'profit' : 'loss'}>
            {formatCurrency(unrealizedPnl)}
          </strong>
        </div>
        <div className="summary-card">
          <span>Completed trades</span>
          <strong>{transactions.length}</strong>
        </div>
      </section>

      <section className="mini-grid">
        <div className="panel-card">
          <h3>Top holdings</h3>
          {holdings.length > 0 ? (
            <ul className="list-stack">
              {holdings.slice(0, 3).map((holding) => {
                return (
                  <li key={holding.id}>
                    <span>{holding.stockSymbol}</span>
                    <strong>{holding.quantity} shares</strong>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="empty-text">No holdings yet. Start by buying a stock.</p>
          )}
        </div>

        <div className="panel-card">
          <h3>Watchlist</h3>
          {watchedStocks.length > 0 ? (
            <ul className="list-stack">
              {watchedStocks.map((stock) => (
                <li key={stock.symbol}>
                  <span>{stock.symbol}</span>
                  <strong>{formatCurrency(stock.currentPrice)}</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-text">Your watchlist is empty.</p>
          )}
        </div>

        <div className="panel-card market-overview">
          <h3>Market overview</h3>
          <div className="overview-row"><span>Stocks listed</span><strong>{stocks.length}</strong></div>
          <div className="overview-row"><span>Stocks watched</span><strong>{watchedStocks.length}</strong></div>
          <p className="data-note">
            {hasLiveQuotes
              ? 'Live NSE quote snapshots are loaded when this page opens.'
              : 'Demo prices only. Configure Upstox access to load live NSE quotes.'}
          </p>
        </div>

        <div className="panel-card beginner-tip">
          <h3>Beginner tip</h3>
          <p>Spread investments across different companies instead of relying on a single stock. Diversification can reduce concentration risk, but it cannot eliminate risk.</p>
        </div>
      </section>
    </div>
  )
}

export default Dashboard
