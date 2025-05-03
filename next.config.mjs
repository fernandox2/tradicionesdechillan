import nextBundleAnalyzer from '@next/bundle-analyzer';

// Configura el analizador
const withBundleAnalyzer = nextBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {};

export default withBundleAnalyzer(nextConfig);