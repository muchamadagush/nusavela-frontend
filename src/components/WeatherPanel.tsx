import { z } from 'zod'
import { formatDateTimeId } from '../lib/format'

export const weatherSchema = z.object({
  temperature_c: z.number().finite(),
  description: z.string(),
  observed_at: z.number().int().positive(),
  attribution: z.object({
    name: z.literal('OpenWeather'),
    url: z.literal('https://openweathermap.org/'),
  }),
})

export function WeatherPanel({
  weather,
  timezone,
}: {
  weather: z.infer<typeof weatherSchema> | null
  timezone?: string
}) {
  return (
    <section className="panel weather-panel">
      <p className="eyebrow">KONDISI ATMOSFER LOKAL</p>
      <h2>Cuaca saat ini</h2>
      {weather ? (
        <div className="weather-content">
          <div className="weather-temp-row">
            <span className="weather-icon" aria-hidden="true">🌤️</span>
            <div>
              <p className="mono weather-temp">{Math.round(weather.temperature_c)} °C</p>
              <p className="weather-desc">{weather.description}</p>
            </div>
          </div>
          <p className="muted weather-meta">
            Pengamatan:{' '}
            <time dateTime={new Date(weather.observed_at * 1000).toISOString()}>
              {formatDateTimeId(weather.observed_at, timezone)}
            </time>
          </p>
          <a
            href={weather.attribution.url}
            rel="noopener noreferrer"
            target="_blank"
            className="weather-source"
          >
            Sumber: OpenWeather ↗
          </a>
        </div>
      ) : (
        <p role="status" className="muted">
          Informasi cuaca belum tersedia.
        </p>
      )}
    </section>
  )
}
