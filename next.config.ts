import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hay un package-lock.json suelto en el directorio personal: sin esto Next
  // infiere ~/ como raíz del workspace y rastrea archivos de más.
  turbopack: { root: path.resolve(__dirname) },
};

export default nextConfig;
