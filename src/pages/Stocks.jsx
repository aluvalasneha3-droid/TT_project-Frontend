import { useState } from 'react'
import TradeForm from '../components/TradeForm'
import { useAuth } from '../context/AuthContext'
import { formatCurrency } from '../services/api'

function Stocks() {
  const { stocks, stocksLoading, stocksError, trade, watchlist, toggleWatchlist } = useAuth()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  const searchTerm = search.trim().toLowerCase()
  const matchingStocks = stocks.filter((stock) =>
    `${stock.symbol} ${stock.companyName}`.toLowerCase().includes(searchTerm),
  )
  const hasChangeData = matchingStocks.some((stock) =>
    stock.percentChange !== null && stock.percentChange !== undefined && stock.percentChange !== '',
  )
  const filteredStocks = matchingStocks.filter((stock) => {
    if (filter === 'all') return true
    if (stock.percentChange === null || stock.percentChange === undefined || stock.percentChange === '') return false
    return filter === 'gainers' ? Number(stock.percentChange) > 0 : Number(stock.percentChange) < 0
  })

  const handleTrade = async ({ type, symbol, quantity }) => {
    try {
      const result = await trade({ type: type.toUpperCase(), symbol, quantity })
      setMessage(result.message)
      setIsError(false)
    } catch (error) {
      setMessage(error.message)
      setIsError(true)
    }
  }

  return (
    <div className="page-shell">
      <section className="page-header compact">
        <div>
          <p className="eyebrow">Market watch</p>
          <h1>Stocks</h1>
          <p className="data-note">
            {stocks.some((stock) => stock.dataSource === 'UPSTOX')
              ? 'Live quote snapshots from Upstox. Quotes refresh when this market list loads.'
              : 'Demo prices, not live market data. Configure Upstox credentials to load NSE quotes.'}
          </p>
        </div>
      </section>

      <div className="stock-layout">
        <TradeForm stocks={stocks} onTrade={handleTrade} />

        <div className="panel-card full-width">
          <div className="stock-list-header">
            <h3>Available stocks</h3>
            <span>{filteredStocks.length} shown</span>
          </div>
          {message && <div className={isError ? 'error-box' : 'success-box'}>{message}</div>}

          <div className="stock-controls">
            <label className="stock-search">
              Search stocks
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Company or symbol"
              />
            </label>
            <div className="segmented-control" role="group" aria-label="Filter stocks by price change">
              {['all', 'gainers', 'losers'].map((option) => (
                <button
                  key={option}
                  type="button"
                  className={filter === option ? 'selected' : ''}
                  aria-pressed={filter === option}
                  onClick={() => setFilter(option)}
                >
                  {option === 'all' ? 'All' : option[0].toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
          </div>
          {stocksError && <div className="error-box">Could not load the stock list: {stocksError}</div>}
          {stocksLoading && <div className="loading-state" role="status">Loading stock list…</div>}

          <div className="stock-list">
            {!stocksLoading && filteredStocks.map((stock) => {
              const percentChange = Number(stock.percentChange)
              const hasStockChange = stock.percentChange !== null && stock.percentChange !== undefined && stock.percentChange !== ''
              const isWatched = watchlist.includes(stock.symbol)

              return (
                <div key={stock.symbol} className="stock-item">
                  <div className="stock-identity">
                    <div className="stock-symbol">{stock.symbol}</div>
                    <div className="stock-company">{stock.companyName}</div>
                  </div>
                  <div className="stock-quote">
                    <div className="stock-price">{formatCurrency(stock.currentPrice)}</div>
                    {hasStockChange && (
                      <div className={percentChange >= 0 ? 'profit' : 'loss'}>
                        {percentChange > 0 ? '+' : ''}{percentChange.toFixed(2)}%
                      </div>
                    )}
                    <small className="quote-source">
                      {stock.dataSource === 'UPSTOX' ? `Live${stock.updatedAt ? ` · ${new Date(stock.updatedAt).toLocaleTimeString()}` : ''}` : 'Demo'}
                    </small>
                  </div>
                  <button
                    type="button"
                    className="watchlist-btn"
                    aria-pressed={isWatched}
                    onClick={() => toggleWatchlist(stock.symbol)}
                  >
                    {isWatched ? 'Watching' : 'Add to watchlist'}
                  </button>
                </div>
              )
            })}
            {!stocksLoading && filteredStocks.length === 0 && (
              <p className="empty-state">
                {filter !== 'all' && !hasChangeData
                  ? 'Price-change data is not available yet, so gainers and losers cannot be shown.'
                  : 'No stocks match your search.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Stocks
