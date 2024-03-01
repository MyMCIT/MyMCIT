const dotenvExpand = require("dotenv-expand");

dotenvExpand.expand({ parsed: { ...process.env } });


/** @type {import('next').NextConfig} */

const nextConfig = {
};

export default nextConfig;
