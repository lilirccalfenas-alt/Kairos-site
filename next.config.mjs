/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [{ source: '/cursos', destination: '/treinamentos', permanent: true }]
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
