import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = {
  entry: ["./src/ahp.js"], // 在 index 檔案後的 .js 副檔名是可選的
  output: {
    path: path.join(__dirname, "dist"),
    filename: "ahp.bundle.js",
  },
};

export default config;
