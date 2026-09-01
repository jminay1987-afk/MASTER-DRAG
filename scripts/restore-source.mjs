import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";

async function joinParts(prefix, count, target) {
  const parts = [];
  for (let i = 1; i <= count; i++) {
    const n = String(i).padStart(2, "0");
    parts.push(await readFile(join(process.cwd(), "restore", `${prefix}.${n}.part`), "utf8"));
  }
  let content = parts.join("");
  if (prefix === "admin-page") {
    content = content.replace('    <QuickPilotSearch s={s} active={active} q={quickQ||""} role="CRONOMETRAJE" cat={current.categoria_fecha_id}/>\n', "");
  }
  const output = join(process.cwd(), target);
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, content, "utf8");
}

await joinParts("admin-actions", 7, "app/admin/actions.ts");
await joinParts("admin-page", 7, "app/admin/[[...parts]]/page.tsx");
console.log("Master Drag admin source restored.");
