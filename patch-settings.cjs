const fs = require("fs");
const file = "src/settings.tsx";

if (!fs.existsSync(file)) {
  console.error("ERROR: src/settings.tsx nahi mili.");
  process.exit(1);
}

let s = fs.readFileSync(file, "utf8");
const backup = file + ".backup-" + new Date().toISOString().replace(/[:.]/g, "-");
fs.copyFileSync(file, backup);

function replaceOnce(oldText, newText, label) {
  const i = s.indexOf(oldText);
  if (i < 0 || s.indexOf(oldText, i + oldText.length) >= 0) {
    console.error("PATCH STOPPED: " + label + " exact unique match nahi mila.");
    console.error("Original backup: " + backup);
    process.exit(1);
  }
  s = s.slice(0, i) + newText + s.slice(i + oldText.length);
}

function replaceInSection(startMarker, endMarker, oldText, newText, label) {
  const start = s.indexOf(startMarker);
  const end = s.indexOf(endMarker, start + startMarker.length);
  if (start < 0 || end < 0) {
    console.error("PATCH STOPPED: section nahi mila: " + label);
    process.exit(1);
  }
  const section = s.slice(start, end);
  const i = section.indexOf(oldText);
  if (i < 0 || section.indexOf(oldText, i + oldText.length) >= 0) {
    console.error("PATCH STOPPED: section mein exact match nahi mila: " + label);
    process.exit(1);
  }
  s = s.slice(0, start) + section.slice(0, i) + newText +
      section.slice(i + oldText.length) + s.slice(end);
}

// 1. Multi-select state
replaceOnce(
  '  const [details, setDetails] = useState("")',
  `  const [details, setDetails] = useState("")
  const [problemConnections, setProblemConnections] = useState<Provider[]>([])
  const [problemIssues, setProblemIssues] = useState<string[]>([])
  const [securityIssues, setSecurityIssues] = useState<string[]>([])`,
  "selection state"
);

// 2. Clear selections when opening the disconnect flow
replaceOnce(
  '    setReason("")\n    setDetails("")\n    setChallengeLoading(true)',
  '    setReason("")\n    setDetails("")\n    setSwitchProvider("")\n    setProblemConnections([])\n    setProblemIssues([])\n    setSecurityIssues([])\n    setChallengeLoading(true)',
  "openDisconnect reset"
);

// 3. Clear selections when cancelling
replaceOnce(
  '    setReason("")\n    setDetails("")\n  }\n\n  async function confirmDisconnect()',
  '    setReason("")\n    setDetails("")\n    setSwitchProvider("")\n    setProblemConnections([])\n    setProblemIssues([])\n    setSecurityIssues([])\n  }\n\n  async function confirmDisconnect()',
  "cancelDisconnect reset"
);

// 4. Clear selections after a successful disconnect
replaceOnce(
  '      setReason("")\n      setDetails("")\n      setStep(1)',
  '      setReason("")\n      setDetails("")\n      setSwitchProvider("")\n      setProblemConnections([])\n      setProblemIssues([])\n      setSecurityIssues([])\n      setStep(1)',
  "success reset"
);

// 5. Insert the conditional checkbox sections before the optional-details section
replaceOnce(
  '                {reason === "other" && (',
  `                {reason === "not_working" && (
                  <div className="mt-4 space-y-4 rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-medium">Which connection is having a problem?</p>
                      <p className="mt-1 text-xs text-muted-foreground">Select one or both connections.</p>
                      <div className="mt-3 space-y-2">
                        {([
                          { value: "github" as Provider, label: "GitHub" },
                          { value: "vercel" as Provider, label: "Vercel" },
                        ]).map((item) => (
                          <label key={item.value} className="flex cursor-pointer items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={problemConnections.includes(item.value)}
                              onChange={(e) => setProblemConnections((prev) =>
                                e.target.checked
                                  ? [...prev, item.value]
                                  : prev.filter((v) => v !== item.value)
                              )}
                            />
                            {item.label}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">What problems are you experiencing?</p>
                      <div className="mt-3 space-y-2">
                        {[
                          "Unable to connect or authenticate",
                          "Repositories or projects are not loading",
                          "Permission or access denied",
                          "Connection expired or disconnected unexpectedly",
                          "Deployment or import is failing",
                          "Wrong account connected",
                          "Security or privacy concern",
                          "Other connection issue",
                        ].map((item) => (
                          <label key={item} className="flex cursor-pointer items-start gap-2 text-sm">
                            <input
                              type="checkbox"
                              className="mt-1"
                              checked={problemIssues.includes(item)}
                              onChange={(e) => setProblemIssues((prev) =>
                                e.target.checked
                                  ? [...prev, item]
                                  : prev.filter((v) => v !== item)
                              )}
                            />
                            <span>{item}</span>
                          </label>
                        ))}
                      </div>
                      {(problemConnections.length === 0 || problemIssues.length === 0) && (
                        <p className="mt-2 text-xs text-muted-foreground">
                          Select at least one connection and one problem.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {reason === "security_privacy" && (
                  <div className="mt-4 rounded-lg border p-3">
                    <p className="text-sm font-medium">What is your security or privacy concern?</p>
                    <p className="mt-1 text-xs text-muted-foreground">Select all that apply.</p>
                    <div className="mt-3 space-y-2">
                      {[
                        "I don't recognize this connected account",
                        "I want to revoke repository access",
                        "I am concerned about token security",
                        "I want to change account permissions",
                        "I suspect unauthorized access",
                        "I want to remove stored connection data",
                        "I have privacy concerns",
                        "Other security concern",
                      ].map((item) => (
                        <label key={item} className="flex cursor-pointer items-start gap-2 text-sm">
                          <input
                            type="checkbox"
                            className="mt-1"
                            checked={securityIssues.includes(item)}
                            onChange={(e) => setSecurityIssues((prev) =>
                              e.target.checked
                                ? [...prev, item]
                                : prev.filter((v) => v !== item)
                            )}
                          />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                    {securityIssues.length === 0 && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Select at least one concern to continue.
                      </p>
                    )}
                  </div>
                )}

                {reason === "other" && (`,
  "checkbox sections"
);

// 6. Validate the Continue button
replaceOnce(
  '                    disabled={!reason}\n                    onClick={() => setStep(3)}',
  `                    disabled={
                      !reason ||
                      (reason === "different_account" && !switchProvider) ||
                      (reason === "not_working" &&
                        (problemConnections.length === 0 || problemIssues.length === 0)) ||
                      (reason === "security_privacy" && securityIssues.length === 0)
                    }
                    onClick={() => setStep(3)}`,
  "Continue validation"
);

// 7. Add selected information to the confirmation step only
replaceInSection(
  '            {!challengeLoading && !challengeError && step === 3 && (',
  '            )}\n          </div>',
  '                  {reason === "other" && details.trim() && (',
  `                  {reason === "not_working" && (
                    <div className="mt-2">
                      <p className="font-medium">Affected connections:</p>
                      <p>{problemConnections.map((v) => v === "github" ? "GitHub" : "Vercel").join(", ")}</p>
                      <p className="mt-2 font-medium">Selected problems:</p>
                      <ul className="list-disc pl-5">
                        {problemIssues.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    </div>
                  )}
                  {reason === "security_privacy" && (
                    <div className="mt-2">
                      <p className="font-medium">Selected concerns:</p>
                      <ul className="list-disc pl-5">
                        {securityIssues.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    </div>
                  )}
                  {reason === "different_account" && switchProvider && (
                    <p className="mt-2">
                      <span className="font-medium">Account to switch: </span>
                      {switchProvider === "github" ? "GitHub" : "Vercel"}
                    </p>
                  )}
                  {reason === "other" && details.trim() && (`,
  "confirmation summary"
);

// 8. Validate the final confirmation button too
replaceOnce(
  '                    disabled={!reason || disconnectBusy}',
  `                    disabled={
                      !reason ||
                      disconnectBusy ||
                      (reason === "different_account" && !switchProvider) ||
                      (reason === "not_working" &&
                        (problemConnections.length === 0 || problemIssues.length === 0)) ||
                      (reason === "security_privacy" && securityIssues.length === 0)
                    }`,
  "final confirmation validation"
);

fs.writeFileSync(file, s, "utf8");
console.log("SUCCESS: Settings disconnect UI updated.");
console.log("Backup: " + backup);
