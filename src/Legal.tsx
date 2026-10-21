import type { ReactNode } from "react"
import { Link } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SUPPORT_EMAIL, SUPPORT_PHONE, SUPPORT_TEL, UPDATED } from "./siteInfo"

const linkCls = "hover:text-foreground hover:underline"

export function LegalLinks({ floating = false }: { floating?: boolean }) {
  return (
    <nav
      className={
        (floating ? "fixed inset-x-0 bottom-3 " : "") +
        "flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 text-xs text-muted-foreground"
      }
    >
      <Link className={linkCls} to="/terms">Terms</Link>
      <Link className={linkCls} to="/privacy">Privacy</Link>
      <Link className={linkCls} to="/docs">Docs</Link>
      <Link className={linkCls} to="/support">Support</Link>
    </nav>
  )
}

function Page({ title, updated, children }: { title: string; updated?: boolean; children: ReactNode }) {
  return (
    <div className="min-h-svh bg-background">
      <header className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-4">
        <Link to="/" className="flex items-center gap-3">
          <Avatar className="size-9">
            <AvatarImage src="/apleemaofficial.png" alt="Apleema" />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <span className="text-lg font-semibold">Apleema</span>
        </Link>
        <Button asChild variant="outline" size="sm">
          <Link to="/">Open app</Link>
        </Button>
      </header>
      <main className="mx-auto max-w-3xl px-4 pb-10">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        {updated && <p className="mt-1 text-sm text-muted-foreground">Last updated: {UPDATED}</p>}
        <div className="mt-6 flex flex-col gap-6 text-sm leading-7">{children}</div>
      </main>
      <footer className="border-t py-6">
        <LegalLinks />
      </footer>
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </section>
  )
}

function Contact() {
  return (
    <p>
      Phone: <a className="underline" href={SUPPORT_TEL}>{SUPPORT_PHONE}</a>
      {SUPPORT_EMAIL && (
        <>
          {" "}· Email: <a className="underline" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
        </>
      )}
    </p>
  )
}

export function Privacy() {
  return (
    <Page title="Privacy Policy" updated>
      <p>
        Apleema helps you connect your GitHub and Vercel accounts, import repositories, deploy them and attach custom
        domains. This policy explains what we collect and how we use it.
      </p>
      <Section title="1. Information we collect">
        <p>Account details from the login method you choose (Google, GitHub, Vercel or email and password): your name, email address, profile picture and a unique account ID.</p>
        <p>Access tokens for GitHub and Vercel that you authorize, so the app can list your repositories, create Vercel projects, start deployments and manage domains on your behalf.</p>
        <p>Basic technical data needed to run the service, such as error logs.</p>
      </Section>
      <Section title="2. How we use it">
        <p>We use this information only to sign you in and to perform the actions you request in the app. We do not sell your data and we do not use it for advertising.</p>
      </Section>
      <Section title="3. Third-party services">
        <p>Apleema relies on Firebase (authentication and database), GitHub, Vercel and our hosting provider. Their own privacy policies apply to the data they process.</p>
      </Section>
      <Section title="4. Storage and security">
        <p>Tokens are stored in our server-side database and are never exposed to other users. They are sent only to the service they belong to (GitHub or Vercel). No system is perfectly secure, but we limit access and use secure connections.</p>
      </Section>
      <Section title="5. Your choices">
        <p>You can disconnect GitHub or Vercel at any time from Settings, which removes the stored token. You can also revoke Apleema from your GitHub and Vercel account settings. To have your account data deleted, contact us using the details below.</p>
      </Section>
      <Section title="6. Contact">
        <Contact />
      </Section>
    </Page>
  )
}

export function Terms() {
  return (
    <Page title="Terms and EULA" updated>
      <p>
        These Terms also serve as the End User License Agreement (EULA) for Apleema. By signing in or using the app you
        agree to them.
      </p>
      <Section title="1. The service">
        <p>Apleema lets you connect GitHub and Vercel, import repositories, deploy them and manage custom domains. You are granted a limited, non-exclusive, non-transferable licence to use the service for your own projects.</p>
      </Section>
      <Section title="2. Your accounts and content">
        <p>You are responsible for your accounts, the repositories you deploy, the domains you add and everything published through them. You confirm that you have the right to deploy that content.</p>
      </Section>
      <Section title="3. Acceptable use">
        <p>Do not use Apleema to deploy illegal, harmful or infringing content, to attack or abuse other systems, or to break the rules of GitHub, Vercel or any other connected provider.</p>
      </Section>
      <Section title="4. Third-party services">
        <p>Deployments, domains and billing are handled by Vercel and GitHub under their own terms. Charges for domains or plans on those platforms are between you and them.</p>
      </Section>
      <Section title="5. Availability and warranty">
        <p>The service is provided as is and as available, without warranties of any kind. We may change, pause or stop features at any time.</p>
      </Section>
      <Section title="6. Limitation of liability">
        <p>To the fullest extent allowed by law, Apleema is not liable for indirect or consequential losses, lost data or downtime of your sites.</p>
      </Section>
      <Section title="7. Termination">
        <p>You may stop using Apleema at any time by disconnecting your accounts. We may suspend access if these Terms are broken.</p>
      </Section>
      <Section title="8. Changes">
        <p>We may update these Terms. Continued use after an update means you accept the new version.</p>
      </Section>
      <Section title="9. Contact">
        <Contact />
      </Section>
    </Page>
  )
}

export function Docs() {
  return (
    <Page title="Documentation">
      <Section title="Getting started">
        <ol className="list-decimal space-y-1 pl-5">
          <li>Sign in with Google, GitHub, Vercel or email and password.</li>
          <li>Open Connect and link your GitHub account.</li>
          <li>Link your Vercel account on the same page.</li>
          <li>Open Repositories and press Import next to the repository you want.</li>
          <li>Choose a project name and branch, then press Deploy.</li>
        </ol>
      </Section>
      <Section title="Connect a custom domain">
        <p>After a deployment you are taken to Domains. Search for a domain or type one you already own, select your project and add it. Then press Check status to see the DNS record to create at your registrar.</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Root domain (example.com): A record, name @, value 76.76.21.21</li>
          <li>Subdomain (www.example.com): CNAME record, name www, value cname.vercel-dns.com</li>
        </ul>
        <p>DNS changes can take from a few minutes up to 24 hours to apply.</p>
      </Section>
      <Section title="Common questions">
        <p><strong>Deployment failed.</strong> Make sure the Vercel GitHub app has access to the repository, then try again.</p>
        <p><strong>A domain stays Pending.</strong> Check that the DNS record matches exactly and wait for it to propagate.</p>
        <p><strong>Disconnect an account.</strong> Open Settings and press Disconnect next to GitHub or Vercel.</p>
      </Section>
      <Section title="Need help?">
        <Contact />
      </Section>
    </Page>
  )
}

export function Support() {
  return (
    <Page title="Support">
      <Card>
        <CardHeader>
          <CardTitle>Contact us</CardTitle>
          <CardDescription>Questions about deployments, domains or your account.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Contact />
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <a href={SUPPORT_TEL}>Call support</a>
            </Button>
            {SUPPORT_EMAIL && (
              <Button asChild variant="outline">
                <a href={`mailto:${SUPPORT_EMAIL}`}>Email support</a>
              </Button>
            )}
            <Button asChild variant="outline">
              <Link to="/docs">Read the docs</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </Page>
  )
}