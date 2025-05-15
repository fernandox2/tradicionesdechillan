// next.config.mjs
import withBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      if (!Array.isArray(config.externals)) config.externals = [];
      config.externals.push({ "mapbox-gl": "mapboxgl" });
    }
    return config;
  },
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(nextConfig);
