import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

async function joinParts(prefix, count, target) {
  const parts = [];
  for (let i = 1; i <= count; i++) {
    const n = String(i).padStart(2, "0");
    parts.push(await readFile(join(process.cwd(), "restore", `${prefix}.${n}.part`), "utf8"));
  }
  await mkdir(join(process.cwd(), target, ".."), { recursive: true }).catch(() => {});
  await writeFile(join(process.cwd(), target), parts.join(""), "utf8");
}

await mkdir(join(process.cwd(), "app", "admin", "[[...parts]]"), { recursive: true });
await joinParts("admin-actions", 7, "app/admin/actions.ts");
await joinParts("admin-page", 7, "app/admin/[[...parts]]/page.tsx");
console.log("Master Drag admin source restored.");
