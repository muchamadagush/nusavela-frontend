import type { City, Place } from './api'
import type { Locale } from './i18n'

export interface ArchipelagoRegion {
  id: 'sumatera' | 'jawa' | 'bali-nusa' | 'kalimantan' | 'sulawesi' | 'maluku-papua'
  orderLabel: string
  name: string
  nameEn: string
  shortName: string
  shortNameEn: string
  icon: string
  tagline: string
  taglineEn: string
  description: string
  descriptionEn: string
  provincePrefixes: string[]
  featuredSlugs: string[]
  quickCities: Array<{ slug: string; name: string; nameEn: string }>
  imageUrl: string
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

export const PROVINCE_NAMES_EN: Record<string, string> = {
  '11': 'Aceh',
  '12': 'North Sumatra',
  '13': 'West Sumatra',
  '14': 'Riau',
  '15': 'Jambi',
  '16': 'South Sumatra',
  '17': 'Bengkulu',
  '18': 'Lampung',
  '19': 'Bangka Belitung Islands',
  '21': 'Riau Islands',
  '31': 'DKI Jakarta',
  '32': 'West Java',
  '33': 'Central Java',
  '34': 'Yogyakarta Special Region',
  '35': 'East Java',
  '36': 'Banten',
  '51': 'Bali',
  '52': 'West Nusa Tenggara',
  '53': 'East Nusa Tenggara',
  '61': 'West Kalimantan',
  '62': 'Central Kalimantan',
  '63': 'South Kalimantan',
  '64': 'East Kalimantan',
  '65': 'North Kalimantan',
  '71': 'North Sulawesi',
  '72': 'Central Sulawesi',
  '73': 'South Sulawesi',
  '74': 'Southeast Sulawesi',
  '75': 'Gorontalo',
  '76': 'West Sulawesi',
  '81': 'Maluku',
  '82': 'North Maluku',
  '91': 'Papua',
  '92': 'West Papua',
  '93': 'South Papua',
  '94': 'Central Papua',
  '95': 'Highland Papua',
  '96': 'Southwest Papua',
}

export const ARCHIPELAGO_REGIONS: ArchipelagoRegion[] = [
  {
    id: 'jawa',
    orderLabel: '01',
    name: 'Jawa',
    nameEn: 'Java',
    shortName: 'Jawa',
    shortNameEn: 'Java',
    icon: '🌋',
    tagline: 'Warisan Keraton, Dataran Tinggi Priangan & Metropolis Modern',
    taglineEn: 'Royal Heritage, Priangan Highlands & Modern Metropolises',
    description:
      'Jelajahi koridor budaya Yogyakarta & Surakarta, kesejukan Bandung & Malang, hingga pusat ekonomi Jakarta dan Surabaya.',
    descriptionEn:
      'Explore the royal cultural corridors of Yogyakarta & Surakarta, the cool highlands of Bandung & Malang, and vibrant Jakarta & Surabaya.',
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
    quickCities: [
      { slug: 'kota-bandung', name: 'Bandung', nameEn: 'Bandung' },
      { slug: 'kota-yogyakarta', name: 'Yogyakarta', nameEn: 'Yogyakarta' },
      { slug: 'kota-surabaya', name: 'Surabaya', nameEn: 'Surabaya' },
      { slug: 'kota-malang', name: 'Malang', nameEn: 'Malang' },
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?auto=format&fit=crop&w=1000&q=80',
    gradient: 'linear-gradient(135deg, #0B1F3A 0%, #0D5C46 100%)',
  },
  {
    id: 'bali-nusa',
    orderLabel: '02',
    name: 'Bali & Nusa Tenggara',
    nameEn: 'Bali & Lesser Sunda',
    shortName: 'Bali & Nusra',
    shortNameEn: 'Bali & Nusra',
    icon: '🌺',
    tagline: 'Harmoni Pulau Dewata, Gili Tropis & Taman Nasional Komodo',
    taglineEn: 'Island of the Gods, Tropical Gili Atolls & Komodo National Park',
    description:
      'Temukan pura pesisir dan sawah berundak di Bali, desa wisata hijau Lombok, hingga pelayaran kepulauan Labuan Bajo.',
    descriptionEn:
      'Discover clifftop sea temples and UNESCO rice terraces in Bali, green eco-villages in Lombok, and Labuan Bajo island voyages.',
    provincePrefixes: ['51', '52', '53'],
    featuredSlugs: [
      'kota-denpasar',
      'kabupaten-badung',
      'kabupaten-gianyar',
      'kabupaten-manggarai-barat',
      'kota-mataram',
      'kabupaten-lombok-tengah',
    ],
    quickCities: [
      { slug: 'kota-denpasar', name: 'Denpasar', nameEn: 'Denpasar' },
      { slug: 'kabupaten-badung', name: 'Badung (Kuta/Uluwatu)', nameEn: 'Badung (Uluwatu)' },
      { slug: 'kabupaten-manggarai-barat', name: 'Labuan Bajo', nameEn: 'Labuan Bajo' },
      { slug: 'kota-mataram', name: 'Mataram (Lombok)', nameEn: 'Mataram (Lombok)' },
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80',
    gradient: 'linear-gradient(135deg, #134E4A 0%, #B45309 100%)',
  },
  {
    id: 'sumatera',
    orderLabel: '03',
    name: 'Sumatera',
    nameEn: 'Sumatra',
    shortName: 'Sumatera',
    shortNameEn: 'Sumatra',
    icon: '🐅',
    tagline: 'Kaldera Danau Toba, Dataran Tinggi Minang & Pesisir Melayu',
    taglineEn: 'Lake Toba Caldera, Minangkabau Highlands & Malay Coasts',
    description:
      'Dari megahnya kaldera vulkanik Samosir dan Ngarai Sianok Bukittinggi hingga ragam gastronomi rempah Medan dan Palembang.',
    descriptionEn:
      'From the volcanic caldera of Lake Toba and Bukittinggi canyons to the rich spice gastronomy of Medan and Palembang.',
    provincePrefixes: ['11', '12', '13', '14', '15', '16', '17', '18', '19', '21'],
    featuredSlugs: [
      'kota-medan',
      'kabupaten-samosir',
      'kota-bukittinggi',
      'kota-padang',
      'kota-palembang',
      'kota-batam',
    ],
    quickCities: [
      { slug: 'kota-medan', name: 'Medan', nameEn: 'Medan' },
      { slug: 'kabupaten-samosir', name: 'Samosir (Danau Toba)', nameEn: 'Lake Toba' },
      { slug: 'kota-bukittinggi', name: 'Bukittinggi', nameEn: 'Bukittinggi' },
      { slug: 'kota-palembang', name: 'Palembang', nameEn: 'Palembang' },
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1000&q=80',
    gradient: 'linear-gradient(135deg, #0F2942 0%, #15803D 100%)',
  },
  {
    id: 'kalimantan',
    orderLabel: '04',
    name: 'Kalimantan',
    nameEn: 'Kalimantan (Borneo)',
    shortName: 'Kalimantan',
    shortNameEn: 'Kalimantan',
    icon: '🌿',
    tagline: 'Hutan Hujan Khatulistiwa, Sungai Mahakam & Kota Seribu Klenteng',
    taglineEn: 'Equatorial Rainforests, Mahakam River & City of a Thousand Temples',
    description:
      'Saksikan akulturasi budaya Singkawang, pasar terapung Banjarmasin, hutan tropis Tahura Sultan Adam, dan gerbang IKN Balikpapan.',
    descriptionEn:
      'Experience cultural harmony in Singkawang, floating markets in Banjarmasin, tropical rainforests, and Balikpapan.',
    provincePrefixes: ['61', '62', '63', '64', '65'],
    featuredSlugs: [
      'kota-singkawang',
      'kota-balikpapan',
      'kota-pontianak',
      'kota-banjarmasin',
      'kota-samarinda',
    ],
    quickCities: [
      { slug: 'kota-singkawang', name: 'Singkawang', nameEn: 'Singkawang' },
      { slug: 'kota-balikpapan', name: 'Balikpapan', nameEn: 'Balikpapan' },
      { slug: 'kota-pontianak', name: 'Pontianak', nameEn: 'Pontianak' },
      { slug: 'kota-banjarmasin', name: 'Banjarmasin', nameEn: 'Banjarmasin' },
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=1000&q=80',
    gradient: 'linear-gradient(135deg, #064E3B 0%, #0F172A 100%)',
  },
  {
    id: 'sulawesi',
    orderLabel: '05',
    name: 'Sulawesi',
    nameEn: 'Sulawesi (Celebes)',
    shortName: 'Sulawesi',
    shortNameEn: 'Sulawesi',
    icon: '⛵',
    tagline: 'Taman Laut Bunaken, Pesisir Losari & Dataran Tinggi Toraja',
    taglineEn: 'Bunaken Marine Park, Losari Coast & Toraja Highlands',
    description:
      'Nikmati penyelaman kelas dunia di dinding karang Bunaken Manado, kuliner bahari Makassar, hingga tradisi megalitik Toraja.',
    descriptionEn:
      'Enjoy world-class diving along Bunaken coral walls in Manado, Makassar coastal cuisine, and ancient Toraja highlands.',
    provincePrefixes: ['71', '72', '73', '74', '75', '76'],
    featuredSlugs: [
      'kota-manado',
      'kota-makassar',
      'kabupaten-tana-toraja',
      'kabupaten-wakatobi',
      'kota-bitung',
    ],
    quickCities: [
      { slug: 'kota-manado', name: 'Manado (Bunaken)', nameEn: 'Manado (Bunaken)' },
      { slug: 'kota-makassar', name: 'Makassar', nameEn: 'Makassar' },
      { slug: 'kabupaten-tana-toraja', name: 'Tana Toraja', nameEn: 'Tana Toraja' },
      { slug: 'kabupaten-wakatobi', name: 'Wakatobi', nameEn: 'Wakatobi' },
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
    gradient: 'linear-gradient(135deg, #0C4A6E 0%, #0D5C46 100%)',
  },
  {
    id: 'maluku-papua',
    orderLabel: '06',
    name: 'Maluku & Papua',
    nameEn: 'Maluku & Papua',
    shortName: 'Maluku & Papua',
    shortNameEn: 'Maluku & Papua',
    icon: '🏝️',
    tagline: 'Surga Karst Raja Ampat, Kepulauan Rempah Banda & Pantai Ora',
    taglineEn: 'Raja Ampat Karst Lagoons, Banda Spice Islands & Ora Beach',
    description:
      'Jelajahi pusat biodiversitas terumbu karang dunia di Raja Ampat, kejernihan air Pantai Ora Maluku, dan jejak sejarah Banda Neira.',
    descriptionEn:
      'Explore the global epicenter of coral reef biodiversity in Raja Ampat, crystal-clear Ora Beach, and historic Banda Neira.',
    provincePrefixes: ['81', '82', '91', '92', '93', '94', '95', '96'],
    featuredSlugs: [
      'kabupaten-raja-ampat',
      'kota-ambon',
      'kota-jayapura',
      'kota-sorong',
      'kota-ternate',
    ],
    quickCities: [
      { slug: 'kabupaten-raja-ampat', name: 'Raja Ampat', nameEn: 'Raja Ampat' },
      { slug: 'kota-ambon', name: 'Ambon', nameEn: 'Ambon' },
      { slug: 'kota-jayapura', name: 'Jayapura', nameEn: 'Jayapura' },
      { slug: 'kota-ternate', name: 'Ternate', nameEn: 'Ternate' },
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=1000&q=80',
    gradient: 'linear-gradient(135deg, #0B1F3A 0%, #0284C7 100%)',
  },
]

export function getProvinceCode(city: Pick<City, 'id' | 'province_id'>): string {
  return city.province_id || city.id.slice(0, 2)
}

export function getProvinceName(
  city: Pick<City, 'id' | 'province_id'>,
  locale: Locale = 'id',
): string {
  const code = getProvinceCode(city)
  if (locale === 'en') {
    return PROVINCE_NAMES_EN[code] || PROVINCE_NAMES[code] || 'Indonesia'
  }
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
  badgeEn: string
  region: string
  regionEn: string
  title: string
  titleEn: string
  subtitle: string
  subtitleEn: string
  description: string
  descriptionEn: string
  citySlug: string
  cityName: string
  cityNameEn: string
  imageUrl: string
  highlights: string[]
  highlightsEn: string[]
}

export const HERO_SPOTLIGHTS: HeroSpotlight[] = [
  {
    id: 'bandung',
    badge: 'JAWA BARAT · DATARAN TINGGI PRIANGAN',
    badgeEn: 'WEST JAVA · PRIANGAN HIGHLANDS',
    region: 'Jawa',
    regionEn: 'Java',
    title: 'Pesona Bandung & Priangan',
    titleEn: 'The Charm of Bandung & Priangan',
    subtitle: 'Harmoni Art Deco, Hutan Pinus & Gastronomi Kreatif',
    subtitleEn: 'Art Deco Heritage, Pine Forests & Creative Gastronomy',
    description:
      'Jelajahi koridor bersejarah Jalan Braga & Gedung Sate, kesejukan Tahura Dago dan Kawah Putih Ciwidey, lengkap dengan akses cepat faskes IGD 24 jam serta transportasi terpadu.',
    descriptionEn:
      'Explore the historic Braga Street & Gedung Sate corridor, cool Dago Forest Park and White Crater Ciwidey, complete with 24-hour emergency hospital access and integrated rail hubs.',
    citySlug: 'kota-bandung',
    cityName: 'Kota Bandung',
    cityNameEn: 'Bandung City',
    imageUrl:
      'https://images.unsplash.com/photo-1555899434-94d1368aa7af?auto=format&fit=crop&w=1400&q=80',
    highlights: ['Gedung Sate & Braga', 'Tahura Djuanda Dago', 'IGD 24 Jam RSHS & Borromeus'],
    highlightsEn: ['Gedung Sate & Braga', 'Djuanda Forest Park', '24H ER RSHS & Borromeus'],
  },
  {
    id: 'bali',
    badge: 'BALI & NUSA TENGGARA · PULAU DEWATA',
    badgeEn: 'BALI & LESSER SUNDA · ISLAND OF THE GODS',
    region: 'Bali & Nusa Tenggara',
    regionEn: 'Bali & Nusra',
    title: 'Keajaiban Budaya & Pantai Bali',
    titleEn: 'Cultural Wonders & Coasts of Bali',
    subtitle: 'Pura Pesisir, Terasering Subak & Wellness Kelas Dunia',
    subtitleEn: 'Clifftop Sea Temples, Subak Rice Terraces & World-Class Wellness',
    description:
      'Nikmati senja keemasan di tebing Uluwatu, keheningan sawah berundak Tegallalang Ubud, serta informasi lengkap layanan wisata dan kesehatan internasional di Denpasar & Badung.',
    descriptionEn:
      'Experience golden sunsets atop Uluwatu cliffs, serene Tegallalang rice terraces in Ubud, and verified international medical & travel services across Denpasar & Badung.',
    citySlug: 'kota-denpasar',
    cityName: 'Kota Denpasar',
    cityNameEn: 'Denpasar City',
    imageUrl:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1400&q=80',
    highlights: ['Monumen Bajra Sandhi', 'Pura Luhur Uluwatu', 'RSUP Prof. Ngoerah 24 Jam'],
    highlightsEn: ['Bajra Sandhi Monument', 'Uluwatu Sea Temple', 'Prof. Ngoerah 24H Hospital'],
  },
  {
    id: 'yogyakarta',
    badge: 'DI YOGYAKARTA · SUMBU FILOSOFI UNESCO',
    badgeEn: 'YOGYAKARTA · UNESCO PHILOSOPHICAL AXIS',
    region: 'Jawa',
    regionEn: 'Java',
    title: 'Warisan Agung Yogyakarta',
    titleEn: 'Royal Heritage of Yogyakarta',
    subtitle: 'Keraton Ngayogyakarta, Malioboro & Tradisi Klasik',
    subtitleEn: 'The Sultanate Palace, Malioboro & Living Classical Arts',
    description:
      'Telusuri jejak budaya Jawa di Keraton Yogyakarta, berburu batik dan kuliner gudeg legendaris di Pasar Beringharjo, hingga agenda seni Sekaten.',
    descriptionEn:
      'Walk the royal courts of Keraton Yogyakarta, discover hand-drawn batik and legendary gudeg along Malioboro, and follow year-round cultural festivals.',
    citySlug: 'kota-yogyakarta',
    cityName: 'Kota Yogyakarta',
    cityNameEn: 'Yogyakarta City',
    imageUrl:
      'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?auto=format&fit=crop&w=1400&q=80',
    highlights: ['Keraton Yogyakarta', 'Kawasan Malioboro', 'Agenda Budaya & Kuliner'],
    highlightsEn: ['Yogyakarta Royal Palace', 'Malioboro Quarter', 'Cultural Events & Cuisine'],
  },
  {
    id: 'labuan-bajo',
    badge: 'NUSA TENGGARA TIMUR · GERBANG KOMODO',
    badgeEn: 'EAST NUSA TENGGARA · GATEWAY TO KOMODO',
    region: 'Bali & Nusa Tenggara',
    regionEn: 'Bali & Nusra',
    title: 'Labuan Bajo & Taman Nasional Komodo',
    titleEn: 'Labuan Bajo & Komodo National Park',
    subtitle: 'Pelayaran Kepulauan Flores & Panorama Tiga Teluk Padar',
    subtitleEn: 'Flores Island Voyages & Padar Island Three-Bay Panorama',
    description:
      'Temukan habitat asli Komodo, pasir merah muda Pink Beach, dan kesiapan layanan darurat medis RSUD Komodo 24 jam bagi wisatawan bahari.',
    descriptionEn:
      'Discover the natural habitat of the Komodo dragon, Pink Beach, and 24-hour emergency hyperbaric & trauma readiness at Komodo General Hospital.',
    citySlug: 'kabupaten-manggarai-barat',
    cityName: 'Kab. Manggarai Barat',
    cityNameEn: 'West Manggarai (Labuan Bajo)',
    imageUrl:
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1400&q=80',
    highlights: ['Pulau Padar & Komodo', 'Pelabuhan Marina Bajo', 'RSUD Komodo IGD 24 Jam'],
    highlightsEn: ['Padar & Komodo Islands', 'Labuan Bajo Marina', 'Komodo Hospital 24H ER'],
  },
  {
    id: 'raja-ampat',
    badge: 'PAPUA BARAT DAYA · SURGA BAWAH LAUT',
    badgeEn: 'SOUTHWEST PAPUA · CORAL TRIANGLE PARADISE',
    region: 'Maluku & Papua',
    regionEn: 'Maluku & Papua',
    title: 'Gugusan Karst Raja Ampat',
    titleEn: 'Raja Ampat Karst Archipelago',
    subtitle: 'Jantung Segitiga Terumbu Karang Dunia di Timur Nusantara',
    subtitleEn: 'Heart of the Global Coral Triangle in Eastern Indonesia',
    description:
      'Saksikan laguna zambrud Piaynemo dan Telaga Bintang di Waigeo, rumah bagi lebih dari 75% spesies karang dunia yang tak terlupakan.',
    descriptionEn:
      'Behold the emerald karst lagoons of Piaynemo and Star Lagoon in Waigeo, home to over 75% of the world’s known coral species.',
    citySlug: 'kabupaten-raja-ampat',
    cityName: 'Kab. Raja Ampat',
    cityNameEn: 'Raja Ampat Regency',
    imageUrl:
      'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=1400&q=80',
    highlights: ['Piaynemo & Telaga Bintang', 'Selat Dampier', 'Konservasi Bahari Papua'],
    highlightsEn: ['Piaynemo & Star Lagoon', 'Dampier Strait Diving', 'Papua Marine Conservation'],
  },
]

export interface CuratedStoryCard {
  id: string
  regionBadge: string
  regionBadgeEn: string
  cityName: string
  cityNameEn: string
  citySlug: string
  categorySlug: string
  title: string
  titleEn: string
  summary: string
  summaryEn: string
  readTimeOrTag: string
  readTimeOrTagEn: string
  imageUrl: string
}

export const POPULAR_RECOMMENDATIONS: CuratedStoryCard[] = [
  {
    id: 'rec-bandung',
    regionBadge: 'Jawa · Jawa Barat',
    regionBadgeEn: 'Java · West Java',
    cityName: 'Kota Bandung',
    cityNameEn: 'Bandung City',
    citySlug: 'kota-bandung',
    categorySlug: 'wisata',
    title: 'Koridor Braga, Gedung Sate & Hutan Raya Dago Pakar',
    titleEn: 'Braga Heritage Corridor, Gedung Sate & Dago Forest Park',
    summary:
      'Perpaduan arsitektur Art Deco, kedai kopi klasik sejak 1930, dan wisata alam sejuk di jantung Priangan.',
    summaryEn:
      'A timeless blend of Art Deco architecture, classic 1930s coffee houses, and cool mountain forest parks.',
    readTimeOrTag: 'Unggulan · WIB',
    readTimeOrTagEn: 'Featured · WIB',
    imageUrl:
      'https://images.unsplash.com/photo-1555899434-94d1368aa7af?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'rec-bali',
    regionBadge: 'Bali & Nusa Tenggara',
    regionBadgeEn: 'Bali & Lesser Sunda',
    cityName: 'Kabupaten Badung & Denpasar',
    cityNameEn: 'Badung & Denpasar, Bali',
    citySlug: 'kota-denpasar',
    categorySlug: 'wisata',
    title: 'Pesona Pesisir Dewata, Budaya Renon & Gastronomi Bali',
    titleEn: 'Sacred Coasts, Renon Cultural Park & Balinese Gastronomy',
    summary:
      'Panduan destinasi budaya Bali, pantai selatan, hingga akses rumah sakit rujukan internasional 24 jam.',
    summaryEn:
      'Complete guide to Balinese cultural landmarks, southern beaches, and 24-hour international hospital care.',
    readTimeOrTag: 'Unggulan · WITA',
    readTimeOrTagEn: 'Featured · WITA',
    imageUrl:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'rec-raja-ampat',
    regionBadge: 'Maluku & Papua',
    regionBadgeEn: 'Maluku & Papua',
    cityName: 'Kabupaten Raja Ampat',
    cityNameEn: 'Raja Ampat Regency',
    citySlug: 'kabupaten-raja-ampat',
    categorySlug: 'wisata',
    title: 'Raja Ampat: Surga Bawah Laut & Gugusan Karst Terbaik Dunia',
    titleEn: 'Raja Ampat: World’s Finest Underwater & Karst Lagoon Paradise',
    summary:
      'Eksplorasi gugusan pulau karst Piaynemo, penyelaman terumbu karang, dan ekowisata bahari Papua Barat Daya.',
    summaryEn:
      'Explore the iconic Piaynemo karst islets, pristine coral reefs, and marine ecotourism in Southwest Papua.',
    readTimeOrTag: 'Bahari · WIT',
    readTimeOrTagEn: 'Marine · WIT',
    imageUrl:
      'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'rec-bromo-malang',
    regionBadge: 'Jawa · Jawa Timur',
    regionBadgeEn: 'Java · East Java',
    cityName: 'Kota Malang & Surabaya',
    cityNameEn: 'Malang & Surabaya',
    citySlug: 'kota-malang',
    categorySlug: 'wisata',
    title: 'Kaldera Gunung Bromo & Pesona Heritage Malang Raya',
    titleEn: 'Mount Bromo Caldera & Highland Heritage of Greater Malang',
    summary:
      'Petualangan matahari terbit di lautan pasir Tengger yang berpadu dengan wisata kuliner dan udara sejuk Kota Malang.',
    summaryEn:
      'Unforgettable sunrise adventures across the Tengger volcanic sea of sand paired with Malang’s cool highland heritage.',
    readTimeOrTag: 'Pegunungan · WIB',
    readTimeOrTagEn: 'Highlands · WIB',
    imageUrl:
      'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'rec-singkawang',
    regionBadge: 'Kalimantan · Kalbar',
    regionBadgeEn: 'Kalimantan · West Borneo',
    cityName: 'Kota Singkawang',
    cityNameEn: 'Singkawang City',
    citySlug: 'kota-singkawang',
    categorySlug: 'wisata',
    title: 'Singkawang: Harmoni Budaya di Kota Seribu Klenteng',
    titleEn: 'Singkawang: Cultural Harmony in the City of a Thousand Temples',
    summary:
      'Jejak akulturasi budaya Tionghoa, Dayak, dan Melayu dengan arsitektur vihara bersejarah dan kuliner khas khatulistiwa.',
    summaryEn:
      'Vibrant Chinese, Dayak, and Malay heritage featuring historic temples and equatorial culinary specialties.',
    readTimeOrTag: 'Budaya · WIB',
    readTimeOrTagEn: 'Heritage · WIB',
    imageUrl:
      'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'rec-yogyakarta',
    regionBadge: 'Jawa · DI Yogyakarta',
    regionBadgeEn: 'Java · Yogyakarta',
    cityName: 'Kota Yogyakarta',
    cityNameEn: 'Yogyakarta City',
    citySlug: 'kota-yogyakarta',
    categorySlug: 'wisata',
    title: 'Keraton Ngayogyakarta, Taman Sari & Kuliner Malam Malioboro',
    titleEn: 'Yogyakarta Royal Palace, Taman Sari & Malioboro Night Culinary',
    summary:
      'Menyusuri sumbu filosofi Yogyakarta, pertunjukan seni tradisi, kriya perak Kotagede, dan kehangatan angkringan.',
    summaryEn:
      'Discover Yogyakarta’s UNESCO philosophical axis, traditional performing arts, Kotagede silver crafts, and street cuisine.',
    readTimeOrTag: 'Warisan UNESCO · WIB',
    readTimeOrTagEn: 'UNESCO Heritage · WIB',
    imageUrl:
      'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?auto=format&fit=crop&w=900&q=80',
  },
]

export const HIDDEN_GEMS: CuratedStoryCard[] = [
  {
    id: 'gem-bunaken',
    regionBadge: 'Sulawesi · Sulawesi Utara',
    regionBadgeEn: 'Sulawesi · North Sulawesi',
    cityName: 'Kota Manado',
    cityNameEn: 'Manado City',
    citySlug: 'kota-manado',
    categorySlug: 'wisata',
    title: 'Taman Nasional Bunaken: Kombinasi Snorkeling, Dinding Karang & Kuliner Manado',
    titleEn: 'Bunaken National Park: Coral Wall Snorkeling & Spicy Manado Cuisine',
    summary:
      'Pengalaman wisata bahari terlengkap dengan visibilitas air jernih dan kekayaan biota laut Sulawesi Utara.',
    summaryEn:
      'Complete marine adventure featuring crystal-clear visibility, vertical coral walls, and vibrant coastal gastronomy.',
    readTimeOrTag: 'Taman Laut · WITA',
    readTimeOrTagEn: 'Marine Park · WITA',
    imageUrl:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'gem-ciwidey',
    regionBadge: 'Jawa · Jawa Barat',
    regionBadgeEn: 'Java · West Java',
    cityName: 'Kabupaten Bandung',
    cityNameEn: 'Bandung Regency',
    citySlug: 'kabupaten-bandung',
    categorySlug: 'wisata',
    title: 'Kawah Putih Ciwidey & Perkebunan Teh Rancabali di Lereng Patuha',
    titleEn: 'White Crater Ciwidey & Rancabali Tea Estates on Mount Patuha',
    summary:
      'Danau vulkanik berwarna putih kehijauan di ketinggian 2.400 mdpl yang dikelilingi hamparan kebun teh sejuk.',
    summaryEn:
      'Turquoise volcanic crater lake at 2,400m elevation surrounded by misty highland tea plantations.',
    readTimeOrTag: 'Dataran Tinggi · WIB',
    readTimeOrTagEn: 'Highlands · WIB',
    imageUrl:
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'gem-toba',
    regionBadge: 'Sumatera · Sumatera Utara',
    regionBadgeEn: 'Sumatra · North Sumatra',
    cityName: 'Kabupaten Samosir',
    cityNameEn: 'Samosir Regency (Lake Toba)',
    citySlug: 'kabupaten-samosir',
    categorySlug: 'wisata',
    title: 'Kaldera Danau Toba & Desa Adat Huta Siallagan di Pulau Samosir',
    titleEn: 'Lake Toba Supervolcano Caldera & Huta Siallagan Heritage Village',
    summary:
      'Menikmati ketenangan danau vulkanik terbesar di dunia sembari mengenal tradisi ulos dan megalitikum Batak.',
    summaryEn:
      'Experience the tranquility of the world’s largest volcanic lake alongside ancient Batak megalithic culture.',
    readTimeOrTag: 'Geopark UNESCO · WIB',
    readTimeOrTagEn: 'UNESCO Geopark · WIB',
    imageUrl:
      'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'gem-ambon',
    regionBadge: 'Maluku & Papua · Maluku',
    regionBadgeEn: 'Maluku & Papua · Maluku',
    cityName: 'Kota Ambon',
    cityNameEn: 'Ambon City',
    citySlug: 'kota-ambon',
    categorySlug: 'wisata',
    title: 'Pantai Pintu Kota & Pesona Bahari Teluk Ambon Manise',
    titleEn: 'Pintu Kota Sea Arch & Coastal Beauty of Ambon Bay',
    summary:
      'Pantai teduh dekat kota dengan tebing karang berlubang ikonik dan panorama Laut Banda yang menenangkan.',
    summaryEn:
      'Natural coral arch cliff overlooking the Banda Sea in Indonesia’s UNESCO City of Music.',
    readTimeOrTag: 'Pesisir Timur · WIT',
    readTimeOrTagEn: 'Eastern Coast · WIT',
    imageUrl:
      'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=900&q=80',
  },
]

export const CATEGORY_META: Record<
  string,
  {
    icon: string
    badge: string
    badgeEn: string
    desc: string
    descEn: string
    coverGradient: string
  }
> = {
  wisata: {
    icon: '🧭',
    badge: 'Destinasi & Alam',
    badgeEn: 'Nature & Heritage',
    desc: 'Tempat wisata unggulan, cagar budaya, taman nasional, dan rekreasi keluarga.',
    descEn: 'Featured tourist attractions, cultural heritage sites, national parks, and family recreation.',
    coverGradient: 'linear-gradient(135deg, #0D5C46 0%, #0B1F3A 100%)',
  },
  'rumah-sakit': {
    icon: '🏥',
    badge: 'Medis & IGD 24 Jam',
    badgeEn: 'Medical & 24H ER',
    desc: 'Rumah sakit rujukan, fasilitas kesehatan, klinik, dan layanan gawat darurat 24 jam.',
    descEn: 'Referral hospitals, medical clinics, pharmacies, and 24-hour emergency rooms (IGD).',
    coverGradient: 'linear-gradient(135deg, #991B1B 0%, #450A0A 100%)',
  },
  kuliner: {
    icon: '🍜',
    badge: 'Gastronomi & UMKM',
    badgeEn: 'Gastronomy & SMEs',
    desc: 'Kuliner legendaris daerah, kedai kopi lokal, restoran khas, dan sentra oleh-oleh UMKM.',
    descEn: 'Legendary regional cuisine, historic coffee shops, authentic restaurants, and local SME crafts.',
    coverGradient: 'linear-gradient(135deg, #B45309 0%, #78350F 100%)',
  },
  transportasi: {
    icon: '🚆',
    badge: 'Simpul Perjalanan',
    badgeEn: 'Transit Hubs',
    desc: 'Stasiun kereta api, bandara, terminal bus, dan pelabuhan penyeberangan antarpulau.',
    descEn: 'Train stations, airports, intercity bus terminals, and ferry ports across the archipelago.',
    coverGradient: 'linear-gradient(135deg, #1D4ED8 0%, #1E3A8A 100%)',
  },
  'layanan-publik': {
    icon: '🏛️',
    badge: 'Utilitas Warga',
    badgeEn: 'Civic Services',
    desc: 'Mal Pelayanan Publik (MPP), kantor pemerintahan, pos polisi, dan layanan masyarakat.',
    descEn: 'Public Service Malls (MPP), civic offices, police stations, and community service centers.',
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
