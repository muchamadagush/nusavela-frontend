import { z } from 'zod'
export const weatherSchema = z.object({ temperature_c: z.number().finite(), description: z.string(), observed_at: z.number().int().positive(), attribution: z.object({ name: z.literal('OpenWeather'), url: z.literal('https://openweathermap.org/') }) })
export function WeatherPanel({ weather }: { weather: z.infer<typeof weatherSchema> | null }) {
  return <section className="panel"><h2>Cuaca saat ini</h2>{weather ? <><p className="mono">{Math.round(weather.temperature_c)} °C</p><p>{weather.description}</p><p className="muted">Pengamatan: <time dateTime={new Date(weather.observed_at * 1000).toISOString()}>{new Date(weather.observed_at * 1000).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB</time></p><a href={weather.attribution.url} rel="noopener noreferrer" target="_blank">Sumber: OpenWeather</a></> : <p role="status">Informasi cuaca belum tersedia.</p>}</section>
}
