import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.TIMESCALE_URL,
});

export const initializeOHLCVTable = async () => {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS ohlcv (
        time TIMESTAMPTZ NOT NULL,
        symbol TEXT NOT NULL,
        timeframe TEXT NOT NULL,
        open FLOAT8 NOT NULL,
        high FLOAT8 NOT NULL,
        low FLOAT8 NOT NULL,
        close FLOAT8 NOT NULL,
        volume FLOAT8
            );

            SELECT create_hypertable('ohlcv', 'time', if_not_exists => TRUE) ;

            CREATE INDEX IF NOT EXISTS idx_ohlcv_symbol_time 
                ON ohlcv (symbol, time DESC); 
            CREATE INDEX IF NOT EXISTS idx_ohlcv_symbol_timeframe
                 ON ohlcv (symbol, timeframe, time DESC);
            `);
  } catch (error) {
    console.error("Failed to initialize hypertable:", error);
  }
};

export const insertOHLCVData = async (candles: any[]) => {
  try {
    const query = `
      INSERT INTO ohlcv (time, symbol, timeframe, open, high, low, close, volume)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT DO NOTHING;
    `;

    for (const candle of candles) {
      await pool.query(query, [
        candle.time,
        candle.symbol,
        candle.timeframe,
        candle.open,
        candle.high,
        candle.low,
        candle.close,
        candle.volume,
      ]);
    }
  } catch (error) {
    console.error("Failed to insert OHLCV data:", error);
  }
};

export const queryOHLCVData = async (
  symbol: string,
  timeframe: string,
  limit: number = 100,
) => {
  try {
    const result = await pool.query(
      `
        SELECT * FROM ohlcv
        WHERE symbol = $1 AND timeframe = $2
        ORDER BY time DESC
        LIMIT $3
        `,
      [symbol, timeframe, limit],
    );
    return result.rows;
  } catch (error) {
    console.error("Failed to query OHLCV data:", error);
    return [];
  }
};
