const fs = require("fs");
const file = "src/App.tsx";
let s = fs.readFileSync(file, "utf8");

const oldStyle =
  'className="mb-5 h-14 w-14 shrink-0 object-contain sm:h-16 sm:w-16 md:h-[72px] md:w-[72px]"';

const newStyle =
  'className="mb-5 h-20 w-20 shrink-0 object-contain sm:h-24 sm:w-24 md:h-28 md:w-28"';

if (!s.includes(oldStyle)) {
  console.error("Current responsive logo style nahi mila. File unchanged.");
  process.exit(1);
}

const backup = file + ".backup-logo-" + Date.now();
fs.copyFileSync(file, backup);

s = s.replace(oldStyle, newStyle);
fs.writeFileSync(file, s, "utf8");

console.log("SUCCESS: Larger responsive Apleema logo applied.");
console.log("Backup: " + backup);
