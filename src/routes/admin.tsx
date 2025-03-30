import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { api, seo } from '../lib/api'
import { formatDateTimeId } from '../lib/format'

const userProfileSchema = z.object({
  id: z.string(),
  email: z.string(),
  username: z.string(),
  full_name: z.string(),
  role: z.string(),
  is_active: z.boolean(),
  last_login_at: z.string().nullable().optional(),
  created_at: z.string().optional(),
})
type UserProfile = z.infer<typeof userProfileSchema>

const authResponseSchema = z.object({
  token: z.string(),
  expires_in: z.number(),
  user: userProfileSchema,
})

const authStatusSchema = z.object({
  needs_initial_setup: z.boolean(),
  active_users: z.number(),
})

const submissionItemSchema = z.object({
  id: z.string(),
  city_id: z.string(),
  place_id: z.string().nullable(),
  submission_type: z.string(),
  submitter_name: z.string(),
  submitter_contact: z.string(),
  payload: z.object({ message: z.string().optional() }).passthrough(),
  created_at: z.string(),
})

const analyticsItemSchema = z.object({
  city_id: z.string().nullable(),
  click_type: z.string(),
  clicks: z.number(),
})

const SESSION_STORAGE_KEY = 'nusavela_operator_session'

export const Route = createFileRoute('/admin')({
  head: () =>
    seo(
      'Login & Panel Operator — NusaVela',
      'Portal login operator, moderasi kontribusi komunitas, manajemen mitra UMKM, dan pengguna NusaVela.',
      '/admin',
      { '@type': 'WebPage', name: 'Portal Operator NusaVela' },
    ),
  component: AdminPortal,
})

function AdminPortal() {
  const [token, setToken] = useState('')
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null)
  const [authMode, setAuthMode] = useState<'login' | 'setup'>('login')
  const [activeTab, setActiveTab] = useState<
    'submissions' | 'sponsorship' | 'curation' | 'users'
  >('submissions')
  const [pending, setPending] = useState<z.infer<typeof submissionItemSchema>[]>([])
  const [analytics, setAnalytics] = useState<z.infer<typeof analyticsItemSchema>[]>([])
  const [usersList, setUsersList] = useState<UserProfile[]>([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    void api('/auth/status', authStatusSchema)
      .then(st => {
        if (st.needs_initial_setup) setAuthMode('setup')
      })
      .catch(() => {})

    try {
      const saved = sessionStorage.getItem(SESSION_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as { token: string; user: UserProfile }
        if (parsed.token && parsed.user) {
          setToken(parsed.token)
          setCurrentUser(parsed.user)
          void refreshWorkspace(parsed.token)
        }
      }
    } catch {
      /* Ignore storage errors */
    }
  }, [])

  function authHeaders(activeToken = token) {
    return { Authorization: `Bearer ${activeToken}` }
  }

  async function refreshWorkspace(activeToken = token) {
    if (!activeToken) return
    setBusy(true)
    setError('')
    try {
      const [subs, clicks, usr] = await Promise.all([
        api('/admin/submissions', submissionItemSchema.array(), {
          headers: authHeaders(activeToken),
        }),
        api('/admin/analytics', analyticsItemSchema.array(), {
          headers: authHeaders(activeToken),
        }),
        api('/admin/users', userProfileSchema.array(), {
          headers: authHeaders(activeToken),
        }).catch(() => []),
      ])
      setPending(subs)
      setAnalytics(clicks)
      setUsersList(usr)
    } catch {
      setError('Sesi berakhir atau tidak valid. Silakan login kembali.')
      handleLogout()
    } finally {
      setBusy(false)
    }
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    setBusy(true)
    setError('')
    setMessage('')
    try {
      const res = await api('/auth/login', authResponseSchema, {
        method: 'POST',
        body: JSON.stringify({
          identifier: String(f.get('identifier') || '').trim(),
          password: String(f.get('password') || ''),
        }),
      })
      setToken(res.token)
      setCurrentUser(res.user)
      sessionStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify({ token: res.token, user: res.user }),
      )
      setMessage(`Selamat datang kembali, ${res.user.full_name}.`)
      await refreshWorkspace(res.token)
    } catch {
      setError('Email/username atau kata sandi tidak sesuai.')
    } finally {
      setBusy(false)
    }
  }

  async function handleInitialSetup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    setBusy(true)
    setError('')
    setMessage('')
    try {
      const res = await api('/auth/setup', authResponseSchema, {
        method: 'POST',
        body: JSON.stringify({
          full_name: String(f.get('full_name') || '').trim(),
          email: String(f.get('email') || '').trim(),
          username: String(f.get('username') || '').trim(),
          password: String(f.get('password') || ''),
        }),
      })
      setToken(res.token)
      setCurrentUser(res.user)
      sessionStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify({ token: res.token, user: res.user }),
      )
      setMessage('Akun Administrator utama berhasil dibuat dan masuk otomatis.')
      await refreshWorkspace(res.token)
    } catch {
      setError(
        'Gagal membuat akun admin awal. Pastikan tabel users masih kosong dan kata sandi minimal 8 karakter.',
      )
    } finally {
      setBusy(false)
    }
  }

  function handleLogout() {
    setToken('')
    setCurrentUser(null)
    setPending([])
    setAnalytics([])
    setUsersList([])
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY)
    } catch {
      /* Ignore */
    }
  }

  async function handleReviewSubmission(
    subId: string,
    decision: 'approved' | 'rejected',
    notes: string,
    verifyPlace: boolean,
  ) {
    setBusy(true)
    setError('')
    try {
      await api(`/admin/submissions/${encodeURIComponent(subId)}/review`, z.unknown(), {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          status: decision,
          notes: notes || (decision === 'approved' ? 'Disetujui operator' : 'Ditolak operator'),
          ...(decision === 'approved'
            ? { patch: { is_verified: verifyPlace } }
            : {}),
        }),
      })
      setMessage(`Kontribusi ${subId.slice(0, 8)} berhasil di-${decision}.`)
      await refreshWorkspace()
    } catch {
      setError('Gagal memproses review kontribusi.')
    } finally {
      setBusy(false)
    }
  }

  async function handleSponsor(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const placeId = String(f.get('place_id') || '').trim()
    const tier = Number(f.get('tier') || 0)
    const days = Number(f.get('days') || 30)
    const until =
      tier > 0 ? new Date(Date.now() + days * 86400000).toISOString() : null
    setBusy(true)
    setError('')
    try {
      await api(`/admin/places/${encodeURIComponent(placeId)}/sponsorship`, z.unknown(), {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({
          tier,
          until,
          payment_reference: String(f.get('payment_reference') || ''),
        }),
      })
      setMessage('Status sponsor UMKM berhasil diperbarui.')
    } catch {
      setError('Gagal memperbarui status sponsor.')
    } finally {
      setBusy(false)
    }
  }

  async function handleAffiliate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const placeId = String(f.get('place_id') || '').trim()
    const hotel = String(f.get('hotel_url') || '').trim() || null
    const ticket = String(f.get('ticket_url') || '').trim() || null
    setBusy(true)
    setError('')
    try {
      await api(`/admin/places/${encodeURIComponent(placeId)}/affiliate`, z.unknown(), {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ hotel_url: hotel, ticket_url: ticket }),
      })
      setMessage('Tautan afiliasi tempat berhasil diperbarui.')
    } catch {
      setError('Gagal memperbarui tautan afiliasi.')
    } finally {
      setBusy(false)
    }
  }

  async function handleCreateUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const f = new FormData(form)
    setBusy(true)
    setError('')
    try {
      await api('/admin/users', userProfileSchema, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          full_name: String(f.get('full_name') || '').trim(),
          email: String(f.get('email') || '').trim(),
          username: String(f.get('username') || '').trim(),
          password: String(f.get('password') || ''),
          role: String(f.get('role') || 'operator'),
        }),
      })
      form.reset()
      setMessage('Akun operator baru berhasil ditambahkan ke tabel users.')
      await refreshWorkspace()
    } catch {
      setError('Gagal menambahkan pengguna baru. Pastikan email dan username belum dipakai.')
    } finally {
      setBusy(false)
    }
  }

  async function handleCreateEmergency(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const f = new FormData(form)
    const cityId = String(f.get('city_id') || '').trim() || null
    setBusy(true)
    setError('')
    try {
      await api('/admin/emergency', z.unknown(), {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          city_id: cityId,
          service_name: String(f.get('service_name') || '').trim(),
          category: String(f.get('category') || 'medis'),
          phone_number: String(f.get('phone_number') || '').trim(),
          source_url: String(f.get('source_url') || '').trim(),
          is_toll_free: f.get('is_toll_free') === 'on',
          is_24_hours: true,
        }),
      })
      form.reset()
      setMessage('Kontak darurat terverifikasi berhasil diaktifkan.')
    } catch {
      setError('Gagal menambahkan kontak darurat. Pastikan URL sumber menggunakan HTTPS.')
    } finally {
      setBusy(false)
    }
  }

  if (!currentUser) {
    return (
      <main id="main">
        <div className="panel auth-card">
          <p className="eyebrow">PORTAL MANAJEMEN NUSAVELA</p>
          <h1>{authMode === 'login' ? 'Masuk ke Panel Operator' : 'Setup Admin Pertama'}</h1>
          <p className="muted">
            {authMode === 'login'
              ? 'Masuk menggunakan email atau username dan kata sandi akun operator Anda.'
              : 'Buat akun administrator pertama pada tabel users untuk mengelola direktori 514 kota.'}
          </p>

          <div className="tabs">
            <button
              type="button"
              className={`pill ${authMode === 'login' ? 'active' : ''}`}
              onClick={() => {
                setAuthMode('login')
                setError('')
              }}
            >
              Login Operator
            </button>
            <button
              type="button"
              className={`pill ${authMode === 'setup' ? 'active' : ''}`}
              onClick={() => {
                setAuthMode('setup')
                setError('')
              }}
            >
              Setup Admin Awal
            </button>
          </div>

          {error && (
            <p role="alert" className="error">
              {error}
            </p>
          )}
          {message && <p role="status">{message}</p>}

          {authMode === 'login' ? (
            <form onSubmit={handleLogin}>
              <label>
                Email atau Username
                <input
                  name="identifier"
                  required
                  autoComplete="username"
                  placeholder="admin@nusavela.com atau admin"
                />
              </label>
              <label>
                Kata Sandi
                <input
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                />
              </label>
              <button disabled={busy} style={{ width: '100%', justifyContent: 'center' }}>
                {busy ? 'Memverifikasi…' : 'Masuk Sekarang'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleInitialSetup}>
              <label>
                Nama Lengkap Administrator
                <input name="full_name" required placeholder="Administrator Utama" />
              </label>
              <label>
                Email Resmi
                <input name="email" type="email" required placeholder="admin@nusavela.com" />
              </label>
              <label>
                Username
                <input
                  name="username"
                  required
                  minLength={3}
                  placeholder="admin"
                />
              </label>
              <label>
                Kata Sandi (Minimal 8 karakter)
                <input
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  placeholder="Minimal 8 karakter"
                />
              </label>
              <button disabled={busy} style={{ width: '100%', justifyContent: 'center' }}>
                {busy ? 'Membuat Akun…' : 'Buat Akun Admin & Masuk'}
              </button>
            </form>
          )}
        </div>
      </main>
    )
  }

  return (
    <main id="main">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div>
          <p className="eyebrow">OPERASIONAL & MODERASI B2B</p>
          <h1>Dashboard Operator NusaVela</h1>
        </div>
        <div className="row">
          <span className="badge verified">
            {currentUser.full_name} ({currentUser.role})
          </span>
          <button type="button" className="button-outline" onClick={() => void refreshWorkspace()}>
            ↻ Muat Ulang
          </button>
          <button type="button" className="button-danger" onClick={handleLogout}>
            Keluar
          </button>
        </div>
      </div>

      {message && <p role="status" className="panel section">{message}</p>}
      {error && <p role="alert" className="error">{error}</p>}

      <div className="tabs section">
        <button
          type="button"
          className={`pill ${activeTab === 'submissions' ? 'active' : ''}`}
          onClick={() => setActiveTab('submissions')}
        >
          📥 Moderasi Kontribusi ({pending.length})
        </button>
        <button
          type="button"
          className={`pill ${activeTab === 'sponsorship' ? 'active' : ''}`}
          onClick={() => setActiveTab('sponsorship')}
        >
          ✦ Sponsor UMKM & Afiliasi
        </button>
        <button
          type="button"
          className={`pill ${activeTab === 'curation' ? 'active' : ''}`}
          onClick={() => setActiveTab('curation')}
        >
          🚑 Kurasi Kontak Darurat
        </button>
        <button
          type="button"
          className={`pill ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Pengguna (`users`) & Analitik
        </button>
      </div>

      {activeTab === 'submissions' && (
        <section className="panel">
          <h2>Antrean Kontribusi Warga & Klaim Usaha ({pending.length})</h2>
          {!pending.length ? (
            <p className="muted">Tidak ada antrean kontribusi berstatus pending saat ini.</p>
          ) : (
            <div>
              {pending.map(item => (
                <div key={item.id} className="submission-card">
                  <div className="row" style={{ justifyContent: 'space-between' }}>
                    <span className="badge">{item.submission_type}</span>
                    <span className="mono muted">Kota ID: {item.city_id}</span>
                  </div>
                  <p style={{ margin: '10px 0' }}>{item.payload.message}</p>
                  <p className="muted" style={{ fontSize: '13px' }}>
                    Pengirim: <strong>{item.submitter_name}</strong> ({item.submitter_contact}) ·{' '}
                    {formatDateTimeId(item.created_at)}
                  </p>
                  {item.place_id && (
                    <div className="row" style={{ marginTop: '10px' }}>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          void handleReviewSubmission(
                            item.id,
                            'approved',
                            'Disetujui dan diverifikasi oleh operator',
                            true,
                          )
                        }
                      >
                        ✓ Setujui & Verifikasi Tempat
                      </button>
                      <button
                        type="button"
                        className="button-danger"
                        disabled={busy}
                        onClick={() =>
                          void handleReviewSubmission(
                            item.id,
                            'rejected',
                            'Data belum memenuhi kriteria verifikasi',
                            false,
                          )
                        }
                      >
                        ✕ Tolak
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === 'sponsorship' && (
        <div className="bento">
          <section className="panel">
            <h2>Aktivasi Sponsor UMKM (Verified / Spotlight)</h2>
            <form onSubmit={handleSponsor}>
              <label>
                UUID Tempat (`place_id`)
                <input
                  name="place_id"
                  required
                  placeholder="00000000-0000-0000-0000-000000000000"
                />
              </label>
              <label>
                Paket Sponsor (`tier`)
                <select name="tier" defaultValue="1">
                  <option value="1">Tier 1 — NusaVela Verified</option>
                  <option value="2">Tier 2 — NusaVela Spotlight (Top 3 & Pin Emas)</option>
                  <option value="0">Tier 0 — Nonaktifkan Sponsor</option>
                </select>
              </label>
              <label>
                Durasi Aktif (Hari)
                <input
                  name="days"
                  type="number"
                  min="1"
                  max="365"
                  defaultValue="30"
                  required
                />
              </label>
              <label>
                Referensi Pembayaran Terverifikasi
                <input
                  name="payment_reference"
                  required
                  minLength={3}
                  maxLength={200}
                  placeholder="INV-2026-001"
                />
              </label>
              <button disabled={busy}>Simpan Status Sponsor</button>
            </form>
          </section>

          <section className="panel">
            <h2>Konfigurasi Link Afiliasi Tempat</h2>
            <form onSubmit={handleAffiliate}>
              <label>
                UUID Tempat (`place_id`)
                <input
                  name="place_id"
                  required
                  placeholder="00000000-0000-0000-0000-000000000000"
                />
              </label>
              <label>
                URL Afiliasi Hotel (HTTPS)
                <input
                  name="hotel_url"
                  type="url"
                  placeholder="https://www.traveloka.com/..."
                />
              </label>
              <label>
                URL Afiliasi Tiket Wisata (HTTPS)
                <input
                  name="ticket_url"
                  type="url"
                  placeholder="https://www.tiket.com/..."
                />
              </label>
              <button disabled={busy}>Simpan Tautan Afiliasi</button>
            </form>
          </section>
        </div>
      )}

      {activeTab === 'curation' && (
        <section className="panel">
          <h2>Tambah Kontak Darurat Terverifikasi</h2>
          <form onSubmit={handleCreateEmergency} className="form-grid">
            <label>
              Kode Kota (`city_id` — Kosongkan untuk Nasional)
              <input name="city_id" placeholder="Misal: 3273 (Kosong = Nasional)" />
            </label>
            <label>
              Nama Layanan Darurat
              <input
                name="service_name"
                required
                placeholder="Ambulans Gawat Darurat Kemenkes (119)"
              />
            </label>
            <label>
              Kategori Layanan
              <select name="category" defaultValue="medis">
                <option value="medis">Medis / Ambulans</option>
                <option value="call_center">Call Center Darurat (112)</option>
                <option value="keamanan">Kepolisian (110)</option>
                <option value="pemadam">Pemadam Kebakaran (113)</option>
                <option value="sar">SAR / Basarnas (115)</option>
              </select>
            </label>
            <label>
              Nomor Telepon Darurat
              <input name="phone_number" required placeholder="119" />
            </label>
            <label className="full-width">
              URL Sumber Resmi Verifikasi (Wajib HTTPS)
              <input
                name="source_url"
                type="url"
                required
                placeholder="https://kemkes.go.id/"
              />
            </label>
            <label className="row full-width">
              <input name="is_toll_free" type="checkbox" defaultChecked />
              Bebas Pulsa (Toll-Free) & Siaga 24 Jam
            </label>
            <div className="full-width">
              <button disabled={busy}>Aktifkan Kontak Darurat</button>
            </div>
          </form>
        </section>
      )}

      {activeTab === 'users' && (
        <div className="bento">
          <section className="panel">
            <h2>Daftar Akun Operator (`users`: {usersList.length})</h2>
            <ul>
              {usersList.map(u => (
                <li key={u.id} style={{ marginBottom: '10px' }}>
                  <strong>{u.full_name}</strong> (<span className="mono">@{u.username}</span> ·{' '}
                  {u.email}) — <span className="badge">{u.role}</span>
                </li>
              ))}
            </ul>
            <h3>Tambah Operator Baru</h3>
            <form onSubmit={handleCreateUser}>
              <label>
                Nama Lengkap
                <input name="full_name" required placeholder="Nama Operator" />
              </label>
              <label>
                Email
                <input name="email" type="email" required placeholder="operator@nusavela.com" />
              </label>
              <label>
                Username
                <input name="username" required minLength={3} placeholder="operator_bandung" />
              </label>
              <label>
                Peran (`role`)
                <select name="role" defaultValue="operator">
                  <option value="operator">Operator (Moderasi & Kurasi)</option>
                  <option value="admin">Admin Penuh (Kelola Users & Sistem)</option>
                </select>
              </label>
              <label>
                Kata Sandi Awal
                <input name="password" type="password" required minLength={8} />
              </label>
              <button disabled={busy}>Tambah ke Tabel Users</button>
            </form>
          </section>

          <section className="panel">
            <h2>Analitik Klik Monetisasi (30 Hari Terakhir)</h2>
            {!analytics.length ? (
              <p className="muted">Belum ada catatan klik dalam 30 hari terakhir.</p>
            ) : (
              <ul>
                {analytics.map((row, idx) => (
                  <li key={idx}>
                    <strong>{row.click_type}</strong> · Kota:{' '}
                    <span className="mono">{row.city_id || 'Nasional'}</span> →{' '}
                    <span className="mono">{row.clicks} klik</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </main>
  )
}
