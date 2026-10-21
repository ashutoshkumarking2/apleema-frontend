const fs = require("fs");
const file = "src/App.tsx";
let s = fs.readFileSync(file, "utf8");

const replacements = [
  ['className="mb-7 h-24 w-24 object-contain sm:h-28 sm:w-28"',
   'className="mb-4 h-12 w-12 object-contain"'],
  ['className="text-3xl font-medium tracking-[0.28em] sm:text-4xl"',
   'className="text-xl font-medium tracking-[0.22em]"'],
  ['className="mt-7 text-base tracking-[0.12em] text-[#49443D] sm:text-lg"',
   'className="mt-4 text-sm tracking-wide text-[#49443D]"'],
  ['className="mt-12 h-20 w-20 animate-spin rounded-full border-[3px] border-[#DCD1BE] border-t-[#191919]"',
   'className="mt-7 h-8 w-8 animate-spin rounded-full border-2 border-[#DCD1BE] border-t-[#191919]"'],
  ['className="mt-12 h-[5px] w-64 max-w-[75vw] overflow-hidden rounded-full bg-[#DED4C3]"',
   'className="mt-6 h-1 w-36 max-w-[70vw] overflow-hidden rounded-full bg-[#DED4C3]"'],
  ['className="mt-5 text-xs tracking-[0.16em] text-[#81796D]"',
   'className="mt-3 text-[10px] tracking-[0.14em] text-[#81796D]"'],
  ['className="flex w-full max-w-md -translate-y-4 flex-col items-center text-center"',
   'className="flex w-full max-w-xs flex-col items-center text-center"']
];

for (const [from, to] of replacements) {
  if (!s.includes(from)) {
    console.error("PATCH STOPPED: expected style not found:\n" + from);
    process.exit(1);
  }
}

const backup = file + ".backup-compact-" + Date.now();
fs.copyFileSync(file, backup);
for (const [from, to] of replacements) {
  s = s.replace(from, to);
}
fs.writeFileSync(file, s, "utf8");
console.log("SUCCESS: Compact loading screen applied.");
console.log("Backup: " + backup);
