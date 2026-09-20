/** @type {import('next').NextConfig} */
const nextConfig = {
  agentRules: false,
  reactStrictMode: true,
  async redirects() {
    return ["/terms", "/graph"].map(source => ({ source, destination: "/", permanent: true }));
  },
};

export default nextConfig;
