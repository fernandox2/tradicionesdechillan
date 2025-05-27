// next.config.mjs
import withBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "tradicionesdechillan.cl",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ntx-05-lon-cp41.netexplora.com",
        port: "",
        pathname: "/**",
      },
    ],
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
