#!/usr/bin/env node
import { program } from "commander";
import fs from "fs-extra";
import path from "path";
import { execSync } from "child_process";
// Define folder paths
const SRC_DIR = "./src";
const COMPONENTS_DIR = path.join(SRC_DIR, "components");
const CSS_DIR = path.join(SRC_DIR, "css");

const FILES = {
  main: path.join(SRC_DIR, "main.jsx"),
  app: path.join(SRC_DIR, "App.jsx"),
  css: path.join(CSS_DIR, "index.css"),
  vite_config: "./vite.config.js",
};

// Default file content
const mainContent = `import React from "react";
import ReactDOM from "react-dom/client";
import "./css/index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;

const appContent = `export default function App() {
  return (
    <div>App Component</div>
  );
}
`;
const cssContent = `@import "tailwindcss";`;
const viteConfigContent = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
`;

// Function to initialize React project
function initProject() {
  console.log("🔄 Initializing project...");

  // Remove the src folder if it exists
  fs.removeSync(SRC_DIR);
  // Create necessary directories
  fs.ensureDirSync(COMPONENTS_DIR);
  fs.ensureDirSync(CSS_DIR);

  // Create files with their content
  fs.writeFileSync(FILES.css, "");
  fs.writeFileSync(FILES.main, mainContent);
  fs.writeFileSync(FILES.app, appContent);

  console.log("✅ Project initialized successfully!");
}
async function  tailwindConfig() {
  console.log("🔄 running tailwindcss...");
  execSync("npm install tailwindcss @tailwindcss/vite");
  console.log("✅ tailwindcss installed successfully!");
  console.log("🔄 update vite_config file ...");
  fs.writeFileSync(FILES.vite_config, viteConfigContent);
  console.log("✅ vite_config updated successfully!");
  if (!fs.existsSync(CSS_DIR)) {
    console.log("🔄 create css folder ...");
    fs.ensureDirSync(CSS_DIR);
    console.log("✅ css folder created successfully!");
  }
  console.log("🔄 update css file ...");
  fs.appendFileSync(path.join(CSS_DIR, "index.css"), cssContent);
  console.log("✅ css file updated successfully!");
  console.log("run vite by typing 'npm run dev' to start the server");
}

// Define the 'init' command
program.command("init").description("Initialize a new React project").action(initProject);
program.command("tailwind").description("integrate tailwindcss in the project").action(tailwindConfig);
// Parse the command
program.parse();

export default program;