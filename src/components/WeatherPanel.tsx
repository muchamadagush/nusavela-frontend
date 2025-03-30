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
    <section className="panel">
      <h2>Cuaca saat ini</h2>
      {weather ? (
        <>
          <p className="mono">{Math.round(weather.temperature_c)} °C</p>
          <p>{weather.description}</p>
          <p className="muted">
            Pengamatan:{' '}
            <time dateTime={new Date(weather.observed_at * 1000).toISOString()}>
              {formatDateTimeId(weather.observed_at, timezone)}
            </time>
          </p>
          <a href={weather.attribution.url} rel="noopener noreferrer" target="_blank">
            Sumber: OpenWeather
          </a>
        </>
      ) : (
        <p role="status">Informasi cuaca belum tersedia.</p>
      )}
    </section>
  )
}
