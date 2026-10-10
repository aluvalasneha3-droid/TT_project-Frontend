import { useMemo, useState } from 'react'

function TradeForm({ stocks, onTrade }) {
  const [type, setType] = useState('BUY')
  const [symbol, setSymbol] = useState(stocks[0]?.symbol || '')
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState('')

  const selectedStock = useMemo(
    () => stocks.find((stock) => stock.symbol === symbol) || stocks[0],
    [stocks, symbol],
  )

  const submitTrade = (event) => {
    event.preventDefault()

    if (!symbol || !selectedStock) {
      setError('Please select a valid stock.')
      return
    }

    const parsedQuantity = Number(quantity)

    if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
      setError('Quantity must be a positive whole number.')
      return
    }

    setError('')
    onTrade({ type, symbol, quantity: parsedQuantity })
  }

  return (
    <form className="trade-form" onSubmit={submitTrade}>
      <div className="trade-header">
        <h3>Quick Trade</h3>
        <span>Virtual money only</span>
      </div>

      <div className="field-row two-col">
        <label>
          Action
          <select value={type} onChange={(event) => setType(event.target.value)}>
            <option value="BUY">Buy</option>
            <option value="SELL">Sell</option>
          </select>
        </label>

        <label>
          Stock
          <select value={symbol} onChange={(event) => setSymbol(event.target.value)}>
            {stocks.map((stock) => (
              <option key={stock.symbol} value={stock.symbol}>
                {stock.symbol}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="field-row">
        <label>
          Quantity
          <input
            type="number"
            min="1"
            step="1"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
          />
        </label>
      </div>

      {selectedStock && (
        <div className="price-note">
          {selectedStock.companyName}: ₹{selectedStock.currentPrice.toLocaleString('en-IN')}
        </div>
      )}

      {error && <div className="error-box">{error}</div>}

      <button type="submit" className="primary-btn">
        {type === 'BUY' ? 'Buy Shares' : 'Sell Shares'}
      </button>
    </form>
  )
}

export default TradeForm
