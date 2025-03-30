import type { City, Place } from './api'

export interface ArchipelagoRegion {
  id: 'sumatera' | 'jawa' | 'bali-nusa' | 'kalimantan' | 'sulawesi' | 'maluku-papua'
  name: string
  shortName: string
  icon: string
  tagline: string
  description: string
  provincePrefixes: string[]
  featuredSlugs: string[]
  gradient: string
}

export const PROVINCE_NAMES: Record<string, string> = {
  '11': 'Aceh',
  '12': 'Sumatera Utara',
  '13': 'Sumatera Barat',
  '14': 'Riau',
  '15': 'Jambi',
  '16': 'Sumatera Selatan',
  '17': 'Bengkulu',
  '18': 'Lampung',
  '19': 'Kepulauan Bangka Belitung',
  '21': 'Kepulauan Riau',
  '31': 'DKI Jakarta',
  '32': 'Jawa Barat',
  '33': 'Jawa Tengah',
  '34': 'DI Yogyakarta',
  '35': 'Jawa Timur',
  '36': 'Banten',
  '51': 'Bali',
  '52': 'Nusa Tenggara Barat',
  '53': 'Nusa Tenggara Timur',
  '61': 'Kalimantan Barat',
  '62': 'Kalimantan Tengah',
  '63': 'Kalimantan Selatan',
  '64': 'Kalimantan Timur',
  '65': 'Kalimantan Utara',
  '71': 'Sulawesi Utara',
  '72': 'Sulawesi Tengah',
  '73': 'Sulawesi Selatan',
  '74': 'Sulawesi Tenggara',
  '75': 'Gorontalo',
  '76': 'Sulawesi Barat',
  '81': 'Maluku',
  '82': 'Maluku Utara',
  '91': 'Papua',
  '92': 'Papua Barat',
  '93': 'Papua Selatan',
  '94': 'Papua Tengah',
  '95': 'Papua Pegunungan',
  '96': 'Papua Barat Daya',
}

export const ARCHIPELAGO_REGIONS: ArchipelagoRegion[] = [
  {
    id: 'jawa',
    name: 'Jawa',
    shortName: 'Jawa',
    icon: '🌋',
    tagline: 'Warisan Keraton, Dataran Tinggi Priangan & Metropolis Modern',
    description:
      'Jelajahi koridor budaya Yogyakarta & Surakarta, kesejukan Bandung & Malang, hingga pusat ekonomi Jakarta dan Surabaya.',
    provincePrefixes: ['31', '32', '33', '34', '35', '36'],
    featuredSlugs: [
      'kota-bandung',
      'kota-yogyakarta',
      'kota-surabaya',
      'kota-administrasi-jakarta-pusat',
      'kota-malang',
      'kota-surakarta',
      'kota-semarang',
      'kabupaten-banyuwangi',
    ],
    gradient: 'linear-gradient(135deg, #0B1F3A 0%, #0D5C46 100%)',
  },
  {
    id: 'bali-nusa',
    name: 'Bali & Nusa Tenggara',
    shortName: 'Bali & Nusra',
    icon: '🌺',
    tagline: 'Harmoni Pulau Dewata, Gili Tropis & Taman Nasional Komodo',
    description:
      'Temukan pura pesisir dan sawah berundak di Bali, desa wisata hijau Lombok, hingga pelayaran kepulauan Labuan Bajo.',
    provincePrefixes: ['51', '52', '53'],
    featuredSlugs: [
      'kota-denpasar',
      'kabupaten-badung',
      'kabupaten-gianyar',
      'kabupaten-manggarai-barat',
      'kota-mataram',
      'kabupaten-lombok-tengah',
    ],
    gradient: 'linear-gradient(135deg, #134E4A 0%, #B45309 100%)',
  },
  {
    id: 'sumatera',
    name: 'Sumatera',
    shortName: 'Sumatera',
    icon: '🐅',
    tagline: 'Kaldera Danau Toba, Dataran Tinggi Minang & Pesisir Melayu',
    description:
      'Dari megahnya kaldera vulkanik Samosir dan Ngarai Sianok Bukittinggi hingga ragam gastronomi rempah Medan dan Palembang.',
    provincePrefixes: ['11', '12', '13', '14', '15', '16', '17', '18', '19', '21'],
    featuredSlugs: [
      'kota-medan',
      'kabupaten-samosir',
      'kota-bukittinggi',
      'kota-padang',
      'kota-palembang',
      'kota-batam',
    ],
    gradient: 'linear-gradient(135deg, #0F2942 0%, #15803D 100%)',
  },
  {
    id: 'kalimantan',
    name: 'Kalimantan',
    shortName: 'Kalimantan',
    icon: '🌿',
    tagline: 'Hutan Hujan Khatulistiwa, Sungai Mahakam & Kota Seribu Klenteng',
    description:
      'Saksikan akulturasi budaya Singkawang, pasar terapung Banjarmasin, hutan tropis Tahura Sultan Adam, dan gerbang IKN Balikpapan.',
    provincePrefixes: ['61', '62', '63', '64', '65'],
    featuredSlugs: [
      'kota-singkawang',
      'kota-balikpapan',
      'kota-pontianak',
      'kota-banjarmasin',
      'kota-samarinda',
    ],
    gradient: 'linear-gradient(135deg, #064E3B 0%, #0F172A 100%)',
  },
  {
    id: 'sulawesi',
    name: 'Sulawesi',
    shortName: 'Sulawesi',
    icon: '⛵',
    tagline: 'Taman Laut Bunaken, Pesisir Losari & Dataran Tinggi Toraja',
    description:
      'Nikmati penyelaman kelas dunia di dinding karang Bunaken Manado, kuliner bahari Makassar, hingga tradisi megalitik Toraja.',
    provincePrefixes: ['71', '72', '73', '74', '75', '76'],
    featuredSlugs: [
      'kota-manado',
      'kota-makassar',
      'kabupaten-tana-toraja',
      'kabupaten-wakatobi',
      'kota-bitung',
    ],
    gradient: 'linear-gradient(135deg, #0C4A6E 0%, #0D5C46 100%)',
  },
  {
    id: 'maluku-papua',
    name: 'Maluku & Papua',
    shortName: 'Maluku & Papua',
    icon: '🏝️',
    tagline: 'Surga Karst Raja Ampat, Kepulauan Rempah Banda & Pantai Ora',
    description:
      'Jelajahi pusat biodiversitas terumbu karang dunia di Raja Ampat, kejernihan air Pantai Ora Maluku, dan jejak sejarah Banda Neira.',
    provincePrefixes: ['81', '82', '91', '92', '93', '94', '95', '96'],
    featuredSlugs: [
      'kabupaten-raja-ampat',
      'kota-ambon',
      'kota-jayapura',
      'kota-sorong',
      'kota-ternate',
    ],
    gradient: 'linear-gradient(135deg, #0B1F3A 0%, #0284C7 100%)',
  },
]

export function getProvinceCode(city: Pick<City, 'id' | 'province_id'>): string {
  return city.province_id || city.id.slice(0, 2)
}

export function getProvinceName(city: Pick<City, 'id' | 'province_id'>): string {
  const code = getProvinceCode(city)
  return PROVINCE_NAMES[code] || 'Indonesia'
}

export function getCityRegion(city: Pick<City, 'id' | 'province_id'>): ArchipelagoRegion {
  const code = getProvinceCode(city)
  return (
    ARCHIPELAGO_REGIONS.find(r => r.provincePrefixes.includes(code)) ||
    ARCHIPELAGO_REGIONS[0]
  )
}

export interface HeroSpotlight {
  id: string
  badge: string
  region: string
  title: string
  subtitle: string
  description: string
  citySlug: string
  cityName: string
  imageUrl: string
  highlights: string[]
}

export const HERO_SPOTLIGHTS: HeroSpotlight[] = [
  {
    id: 'bandung',
    badge: 'JAWA BARAT · DATARAN TINGGI PRIANGAN',
    region: 'Jawa',
    title: 'Pesona Bandung & Priangan',
    subtitle: 'Harmoni Art Deco, Hutan Pinus & Gastronomi Kreatif',
    description:
      'Jelajahi koridor bersejarah Jalan Braga & Gedung Sate, kesejukan Tahura Dago dan Kawah Putih Ciwidey, lengkap dengan akses cepat faskes IGD 24 jam serta transportasi terpadu.',
    citySlug: 'kota-bandung',
    cityName: 'Kota Bandung',
    imageUrl:
      'https://images.unsplash.com/photo-1555899434-94d1368aa7af?auto=format&fit=crop&w=1400&q=80',
    highlights: ['Gedung Sate & Braga', 'Tahura Djuanda Dago', 'IGD 24 Jam RSHS & Borromeus'],
  },
  {
    id: 'bali',
    badge: 'BALI & NUSA TENGGARA · PULAU DEWATA',
    region: 'Bali & Nusa Tenggara',
    title: 'Keajaiban Budaya & Pantai Bali',
    subtitle: 'Pura Pesisir, Terasering Subak & Wellness Kelas Dunia',
    description:
      'Nikmati senja keemasan di tebing Uluwatu, keheningan sawah berundak Tegallalang Ubud, serta informasi lengkap layanan wisata dan kesehatan internasional di Denpasar & Badung.',
    citySlug: 'kota-denpasar',
    cityName: 'Kota Denpasar',
    imageUrl:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1400&q=80',
    highlights: ['Monumen Bajra Sandhi', 'Pura Luhur Uluwatu', 'RSUP Prof. Ngoerah 24 Jam'],
  },
  {
    id: 'yogyakarta',
    badge: 'DI YOGYAKARTA · SUMBU FILOSOFI UNESCO',
    region: 'Jawa',
    title: 'Warisan Agung Yogyakarta',
    subtitle: 'Keraton Ngayogyakarta, Malioboro & Tradisi Klasik',
    description:
      'Telusuri jejak budaya Jawa di Keraton Yogyakarta, berburu batik dan kuliner gudeg legendaris di Pasar Beringharjo, hingga agenda seni Sekaten.',
    citySlug: 'kota-yogyakarta',
    cityName: 'Kota Yogyakarta',
    imageUrl:
      'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?auto=format&fit=crop&w=1400&q=80',
    highlights: ['Keraton Yogyakarta', 'Kawasan Malioboro', 'Agenda Budaya & Kuliner'],
  },
  {
    id: 'labuan-bajo',
    badge: 'NUSA TENGGARA TIMUR · GERBANG KOMODO',
    region: 'Bali & Nusa Tenggara',
    title: 'Labuan Bajo & Taman Nasional Komodo',
    subtitle: 'Pelayaran Kepulauan Flores & Panorama Tiga Teluk Padar',
    description:
      'Temukan habitat asli Komodo, pasir merah muda Pink Beach, dan kesiapan layanan darurat medis RSUD Komodo 24 jam bagi wisatawan bahari.',
    citySlug: 'kabupaten-manggarai-barat',
    cityName: 'Kab. Manggarai Barat',
    imageUrl:
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1400&q=80',
    highlights: ['Pulau Padar & Komodo', 'Pelabuhan Marina Bajo', 'RSUD Komodo IGD 24 Jam'],
  },
  {
    id: 'raja-ampat',
    badge: 'PAPUA BARAT DAYA · SURGA BAWAH LAUT',
    region: 'Maluku & Papua',
    title: 'Gugusan Karst Raja Ampat',
    subtitle: 'Jantung Segitiga Terumbu Karang Dunia di Timur Nusantara',
    description:
      'Saksikan laguna zambrud Piaynemo dan Telaga Bintang di Waigeo, rumah bagi lebih dari 75% spesies karang dunia yang tak terlupakan.',
    citySlug: 'kabupaten-raja-ampat',
    cityName: 'Kab. Raja Ampat',
    imageUrl:
      'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=1400&q=80',
    highlights: ['Piaynemo & Telaga Bintang', 'Selat Dampier', 'Konservasi Bahari Papua'],
  },
]

export interface CuratedStoryCard {
  id: string
  regionBadge: string
  cityName: string
  citySlug: string
  categorySlug: string
  title: string
  summary: string
  readTimeOrTag: string
  imageUrl: string
}

export const POPULAR_RECOMMENDATIONS: CuratedStoryCard[] = [
  {
    id: 'rec-bandung',
    regionBadge: 'Jawa · Jawa Barat',
    cityName: 'Kota Bandung',
    citySlug: 'kota-bandung',
    categorySlug: 'wisata',
    title: 'Koridor Braga, Gedung Sate & Hutan Raya Dago Pakar',
    summary:
      'Perpaduan arsitektur Art Deco, kedai kopi klasik sejak 1930, dan wisata alam sejuk di jantung Priangan.',
    readTimeOrTag: 'Unggulan · WIB',
    imageUrl:
      'https://images.unsplash.com/photo-1555899434-94d1368aa7af?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'rec-bali',
    regionBadge: 'Bali & Nusa Tenggara',
    cityName: 'Kabupaten Badung & Denpasar',
    citySlug: 'kota-denpasar',
    categorySlug: 'wisata',
    title: 'Pesona Pesisir Dewata, Budaya Renon & Gastronomi Bali',
    summary:
      'Panduan destinasi budaya Bali, pantai selatan, hingga akses rumah sakit rujukan internasional 24 jam.',
    readTimeOrTag: 'Unggulan · WITA',
    imageUrl:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'rec-raja-ampat',
    regionBadge: 'Maluku & Papua',
    cityName: 'Kabupaten Raja Ampat',
    citySlug: 'kabupaten-raja-ampat',
    categorySlug: 'wisata',
    title: 'Raja Ampat: Surga Bawah Laut & Gugusan Karst Terbaik Dunia',
    summary:
      'Eksplorasi gugusan pulau karst Piaynemo, penyelaman terumbu karang, dan ekowisata bahari Papua Barat Daya.',
    readTimeOrTag: 'Bahari · WIT',
    imageUrl:
      'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'rec-bromo-malang',
    regionBadge: 'Jawa · Jawa Timur',
    cityName: 'Kota Malang & Surabaya',
    citySlug: 'kota-malang',
    categorySlug: 'wisata',
    title: 'Kaldera Gunung Bromo & Pesona Heritage Malang Raya',
    summary:
      'Petualangan matahari terbit di lautan pasir Tengger yang berpadu dengan wisata kuliner dan udara sejuk Kota Malang.',
    readTimeOrTag: 'Pegunungan · WIB',
    imageUrl:
      'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'rec-singkawang',
    regionBadge: 'Kalimantan · Kalbar',
    cityName: 'Kota Singkawang',
    citySlug: 'kota-singkawang',
    categorySlug: 'wisata',
    title: 'Singkawang: Harmoni Budaya di Kota Seribu Klenteng',
    summary:
      'Jejak akulturasi budaya Tionghoa, Dayak, dan Melayu dengan arsitektur vihara bersejarah dan kuliner khas khatulistiwa.',
    readTimeOrTag: 'Budaya · WIB',
    imageUrl:
      'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'rec-yogyakarta',
    regionBadge: 'Jawa · DI Yogyakarta',
    cityName: 'Kota Yogyakarta',
    citySlug: 'kota-yogyakarta',
    categorySlug: 'wisata',
    title: 'Keraton Ngayogyakarta, Taman Sari & Kuliner Malam Malioboro',
    summary:
      'Menyusuri sumbu filosofi Yogyakarta, pertunjukan seni tradisi, kriya perak Kotagede, dan kehangatan angkringan.',
    readTimeOrTag: 'Warisan UNESCO · WIB',
    imageUrl:
      'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?auto=format&fit=crop&w=900&q=80',
  },
]

export const HIDDEN_GEMS: CuratedStoryCard[] = [
  {
    id: 'gem-bunaken',
    regionBadge: 'Sulawesi · Sulawesi Utara',
    cityName: 'Kota Manado',
    citySlug: 'kota-manado',
    categorySlug: 'wisata',
    title: 'Taman Nasional Bunaken: Kombinasi Snorkeling, Dinding Karang & Kuliner Manado',
    summary:
      'Pengalaman wisata bahari terlengkap dengan visibilitas air jernih dan kekayaan biota laut Sulawesi Utara.',
    readTimeOrTag: 'Taman Laut · WITA',
    imageUrl:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'gem-ciwidey',
    regionBadge: 'Jawa · Jawa Barat',
    cityName: 'Kabupaten Bandung',
    citySlug: 'kabupaten-bandung',
    categorySlug: 'wisata',
    title: 'Kawah Putih Ciwidey & Perkebunan Teh Rancabali di Lereng Patuha',
    summary:
      'Danau vulkanik berwarna putih kehijauan di ketinggian 2.400 mdpl yang dikelilingi hamparan kebun teh sejuk.',
    readTimeOrTag: 'Dataran Tinggi · WIB',
    imageUrl:
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'gem-toba',
    regionBadge: 'Sumatera · Sumatera Utara',
    cityName: 'Kabupaten Samosir',
    citySlug: 'kabupaten-samosir',
    categorySlug: 'wisata',
    title: 'Kaldera Danau Toba & Desa Adat Huta Siallagan di Pulau Samosir',
    summary:
      'Menikmati ketenangan danau vulkanik terbesar di dunia sembari mengenal tradisi ulos dan megalitikum Batak.',
    readTimeOrTag: 'Geopark UNESCO · WIB',
    imageUrl:
      'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'gem-ambon',
    regionBadge: 'Maluku & Papua · Maluku',
    cityName: 'Kota Ambon',
    citySlug: 'kota-ambon',
    categorySlug: 'wisata',
    title: 'Pantai Pintu Kota & Pesona Bahari Teluk Ambon Manise',
    summary:
      'Pantai teduh dekat kota dengan tebing karang berlubang ikonik dan panorama Laut Banda yang menenangkan.',
    readTimeOrTag: 'Pesisir Timur · WIT',
    imageUrl:
      'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=900&q=80',
  },
]

export const CATEGORY_META: Record<
  string,
  { icon: string; badge: string; desc: string; coverGradient: string }
> = {
  wisata: {
    icon: '🧭',
    badge: 'Destinasi & Alam',
    desc: 'Tempat wisata unggulan, cagar budaya, taman nasional, dan rekreasi keluarga.',
    coverGradient: 'linear-gradient(135deg, #0D5C46 0%, #0B1F3A 100%)',
  },
  'rumah-sakit': {
    icon: '🏥',
    badge: 'Medis & IGD 24 Jam',
    desc: 'Rumah sakit rujukan, fasilitas kesehatan, klinik, dan layanan gawat darurat 24 jam.',
    coverGradient: 'linear-gradient(135deg, #991B1B 0%, #450A0A 100%)',
  },
  kuliner: {
    icon: '🍜',
    badge: 'Gastronomi & UMKM',
    desc: 'Kuliner legendaris daerah, kedai kopi lokal, restoran khas, dan sentra oleh-oleh UMKM.',
    coverGradient: 'linear-gradient(135deg, #B45309 0%, #78350F 100%)',
  },
  transportasi: {
    icon: '🚆',
    badge: 'Simpul Perjalanan',
    desc: 'Stasiun kereta api, bandara, terminal bus, dan pelabuhan penyeberangan antarpulau.',
    coverGradient: 'linear-gradient(135deg, #1D4ED8 0%, #1E3A8A 100%)',
  },
  'layanan-publik': {
    icon: '🏛️',
    badge: 'Utilitas Warga',
    desc: 'Mal Pelayanan Publik (MPP), kantor pemerintahan, pos polisi, dan layanan masyarakat.',
    coverGradient: 'linear-gradient(135deg, #334155 0%, #0F172A 100%)',
  },
}

export function getFallbackPlacesForCity(city: City, categorySlug?: string): Place[] {
  const presets: Record<string, Array<Place & { categorySlug: string }>> = {
    'kota-bandung': [
      {
        id: 'bdg-gedung-sate',
        categorySlug: 'wisata',
        name: 'Gedung Sate & Museum Gedung Sate',
        slug: 'gedung-sate-bandung',
        address: 'Jl. Diponegoro No.22, Citarum, Kec. Bandung Wetan, Kota Bandung',
        latitude: -6.902481,
        longitude: 107.61881,
        is_24_hours: false,
        is_sponsored: false,
        is_verified: true,
        rating_avg: 4.8,
        opening_hours: 'Selasa-Minggu 08:00-16:00 WIB',
        ticket_price_min: 5000,
        ticket_price_max: 5000,
        phone: '+62224267753',
        description:
          'Ikon arsitektur bersejarah Jawa Barat dengan museum interaktif sejarah pembangunan Bandung dan Nusantara.',
        image_url:
          'https://images.unsplash.com/photo-1555899434-94d1368aa7af?auto=format&fit=crop&w=1000&q=80',
      },
      {
        id: 'bdg-braga',
        categorySlug: 'wisata',
        name: 'Jalan Braga & Kawasan Heritage',
        slug: 'kawasan-heritage-jalan-braga',
        address: 'Jl. Braga, Kec. Sumur Bandung, Kota Bandung',
        latitude: -6.917825,
        longitude: 107.609568,
        is_24_hours: true,
        is_sponsored: false,
        is_verified: true,
        rating_avg: 4.7,
        opening_hours: 'Setiap Hari 24 Jam',
        ticket_price_min: 0,
        ticket_price_max: 0,
        description:
          'Koridor jalan bersejarah bergaya Art Deco dengan galeri seni, toko roti legendaris, dan kafe klasik di jantung Kota Bandung.',
      },
      {
        id: 'bdg-rshs',
        categorySlug: 'rumah-sakit',
        name: 'RSUP Dr. Hasan Sadikin (RSHS) Bandung',
        slug: 'rsup-dr-hasan-sadikin-bandung',
        address: 'Jl. Pasteur No.38, Pasteur, Kec. Sukajadi, Kota Bandung',
        latitude: -6.89861,
        longitude: 107.59889,
        is_24_hours: true,
        has_emergency: true,
        is_sponsored: false,
        is_verified: true,
        rating_avg: 4.5,
        opening_hours: 'IGD & Rawat Inap 24 Jam',
        phone: '+62222034953',
        description:
          'Rumah sakit rujukan utama nasional di Jawa Barat dengan layanan Instalasi Gawat Darurat (IGD) terpadu 24 jam.',
      },
      {
        id: 'bdg-borromeus',
        categorySlug: 'rumah-sakit',
        name: 'RS Santo Borromeus Bandung',
        slug: 'rs-santo-borromeus-bandung',
        address: 'Jl. Ir. H. Juanda No.100, Lebakgede, Kec. Coblong, Kota Bandung',
        latitude: -6.89412,
        longitude: 107.61345,
        is_24_hours: true,
        has_emergency: true,
        is_sponsored: false,
        is_verified: true,
        rating_avg: 4.7,
        opening_hours: 'IGD 24 Jam',
        phone: '+62222552000',
        description:
          'Rumah sakit umum terkemuka di kawasan Dago dengan layanan gawat darurat dan trauma center 24 jam.',
      },
      {
        id: 'bdg-purnama',
        categorySlug: 'kuliner',
        name: 'Warung Kopi Purnama (Sejak 1930)',
        slug: 'warung-kopi-purnama-bandung',
        address: 'Jl. Alkateri No.22, Braga, Kec. Sumur Bandung, Kota Bandung',
        latitude: -6.91952,
        longitude: 107.60678,
        is_24_hours: false,
        is_sponsored: false,
        is_verified: true,
        rating_avg: 4.7,
        opening_hours: 'Setiap Hari 06:30-21:00 WIB',
        ticket_price_min: 15000,
        ticket_price_max: 45000,
        phone: '+62224233621',
        description:
          'Kedai kopi legendaris di Bandung sejak 1930 yang terkenal dengan kopi susu klasik dan roti srikaya buatan sendiri.',
      },
      {
        id: 'bdg-stasiun',
        categorySlug: 'transportasi',
        name: 'Stasiun Kereta Api Bandung (Kebon Kawung)',
        slug: 'stasiun-bandung-kebon-kawung',
        address: 'Jl. Kebon Kawung No.43, Babakan Ciamis, Kec. Sumur Bandung, Kota Bandung',
        latitude: -6.91262,
        longitude: 107.60241,
        is_24_hours: true,
        is_sponsored: false,
        is_verified: true,
        rating_avg: 4.7,
        opening_hours: 'Setiap Hari 24 Jam',
        description:
          'Stasiun kereta api utama Kota Bandung yang melayani KA jarak jauh, KA Lokal Bandung Raya, dan feeder Kereta Cepat Whoosh.',
      },
      {
        id: 'bdg-mpp',
        categorySlug: 'layanan-publik',
        name: 'Mal Pelayanan Publik (MPP) Kota Bandung',
        slug: 'mpp-kota-bandung',
        address: 'Jl. Cianjur No.34, Kacapiring, Kec. Batununggal, Kota Bandung',
        latitude: -6.91994,
        longitude: 107.63451,
        is_24_hours: false,
        is_sponsored: false,
        is_verified: true,
        rating_avg: 4.6,
        opening_hours: 'Senin-Jumat 08:00-15:30 WIB',
        ticket_price_min: 0,
        ticket_price_max: 0,
        description:
          'Pusat layanan terpadu administrasi kependudukan, perizinan usaha, pajak daerah, dan layanan publik Kota Bandung.',
      },
    ],
  }

  const list = presets[city.slug] ?? []
  if (!categorySlug) return list
  return list.filter(p => p.categorySlug === categorySlug)
}
