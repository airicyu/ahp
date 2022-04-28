import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = {
  entry: ["./src/ahp.js"],
  output: {
    path: path.join(__dirname, "dist"),
    filename: "ahp.bundle.js",
  },
};

export default config;
