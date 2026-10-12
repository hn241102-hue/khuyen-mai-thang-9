import { cp, mkdir, rm, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const dist = new URL("dist/", root);
await rm(dist, { recursive: true, force: true });
await mkdir(new URL("assets/", dist), { recursive: true });

for (const file of ["index.html", "styles.css", "app.js", "pricing.js"]) {
  await cp(new URL(file, root), new URL(file, dist));
}

const artwork = `<svg xmlns="http://www.w3.org/2000/svg" width="350" height="326" viewBox="0 0 350 326">
  <circle cx="195" cy="166" r="138" fill="#ffe5eb"/>
  <rect x="130" y="199" width="40" height="78" rx="8" fill="#f6a6b5"/>
  <rect x="187" y="150" width="40" height="127" rx="8" fill="#ef728b"/>
  <rect x="244" y="100" width="40" height="177" rx="8" fill="#cf0725"/>
  <path d="M90 181 148 130 194 147 260 72" fill="none" stroke="#dc1035" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="m224 74 42-9-5 44" fill="none" stroke="#dc1035" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="111" cy="224" r="50" fill="#ffce55" stroke="#e5aa26" stroke-width="5"/>
  <circle cx="111" cy="224" r="38" fill="none" stroke="#fff0b2" stroke-width="3"/>
  <path d="m97 241 28-34" stroke="#a66a00" stroke-width="6" stroke-linecap="round"/>
  <circle cx="97" cy="210" r="6" fill="none" stroke="#a66a00" stroke-width="5"/>
  <circle cx="125" cy="238" r="6" fill="none" stroke="#a66a00" stroke-width="5"/>
</svg>`;

await writeFile(new URL("assets/campaign-art.svg", dist), artwork);
console.log("Build thanh cong: dist/");
