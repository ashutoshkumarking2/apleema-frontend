const fs = require("fs");

const file = "src/App.tsx";
let s = fs.readFileSync(file, "utf8");

const start = s.indexOf("  if (!ready)");
const end = s.indexOf("\n\n  return (", start);

if (start < 0 || end < 0) {
  console.error("ERROR: Loading section nahi mili. File unchanged.");
  process.exit(1);
}

const backup = file + ".backup-" + new Date().toISOString().replace(/[:.]/g, "-");
fs.copyFileSync(file, backup);

const loading = `  if (!ready) {
    return (
      <main className="flex min-h-svh items-center justify-center overflow-hidden bg-[#F8F3E9] px-6 text-[#191919]">
        <section
          role="status"
          aria-live="polite"
          className="flex w-full max-w-md -translate-y-4 flex-col items-center text-center"
        >
          <img
            src="/apleemaofficial.png"
            alt="Apleema"
            className="mb-7 h-24 w-24 object-contain sm:h-28 sm:w-28"
          />

          <h1 className="text-3xl font-medium tracking-[0.28em] sm:text-4xl">
            APLEEMA
          </h1>

          <p className="mt-7 text-base tracking-[0.12em] text-[#49443D] sm:text-lg">
            Preparing your workspace...
          </p>

          <div className="mt-12 h-20 w-20 animate-spin rounded-full border-[3px] border-[#DCD1BE] border-t-[#191919]" />

          <div className="mt-12 h-[5px] w-64 max-w-[75vw] overflow-hidden rounded-full bg-[#DED4C3]">
            <div className="h-full w-1/3 animate-[apleema-progress_1.8s_ease-in-out_infinite] rounded-full bg-[#191919]" />
          </div>

          <p className="mt-5 text-xs tracking-[0.16em] text-[#81796D]">
            GETTING EVERYTHING READY
          </p>
        </section>

        <style>{\`
          @keyframes apleema-progress {
            0% { transform: translateX(-110%); }
            100% { transform: translateX(310%); }
          }
          @media (prefers-reduced-motion: reduce) {
            .animate-spin, .animate-\\\\[apleema-progress_1\\\\.8s_ease-in-out_infinite\\\\] {
              animation-duration: 3s;
            }
          }
        \`}</style>
      </main>
    );
  }`;

s = s.slice(0, start) + loading + s.slice(end);
fs.writeFileSync(file, s, "utf8");

console.log("SUCCESS: Cream and black Apleema loading screen installed.");
console.log("Original logo: /apleemaofficial.png");
console.log("Backup: " + backup);
