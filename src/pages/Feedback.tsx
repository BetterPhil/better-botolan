import { useState, type FormEvent } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Facebook,
  Loader2,
  Lightbulb,
  Mail,
  MessageSquare,
  Phone,
  Send,
  ShieldQuestion,
  Siren,
} from 'lucide-react';
import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { SectionHeading } from '../components/ui/SectionHeading';
import SEO from '../components/SEO';
import { siteConfig } from '../config/site';
import { barangays } from '../data/barangays';
import { cn } from '../lib/utils';

const CATEGORIES = [
  { value: 'Issue / Report', icon: Siren },
  { value: 'Suggestion', icon: Lightbulb },
  { value: 'Inquiry', icon: ShieldQuestion },
  { value: 'Compliment', icon: MessageSquare },
] as const;

type Status = 'idle' | 'submitting' | 'success' | 'error';

interface FormState {
  name: string;
  email: string;
  barangay: string;
  category: string;
  subject: string;
  message: string;
  _gotcha: string;
}

const EMPTY: FormState = {
  name: '',
  email: '',
  barangay: '',
  category: 'Issue / Report',
  subject: '',
  message: '',
  _gotcha: '',
};

const WEB3FORMS_URL = 'https://api.web3forms.com/submit';

/** True when a real server inbox is configured (not just mailto). */
const hasServerInbox = Boolean(
  siteConfig.web3formsKey || siteConfig.feedbackEndpoint
);

function newCaptcha() {
  return {
    a: 1 + Math.floor(Math.random() * 8),
    b: 1 + Math.floor(Math.random() * 8),
  };
}

export default function Feedback() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [captcha, setCaptcha] = useState(() => newCaptcha());
  const [captchaAns, setCaptchaAns] = useState('');

  const set = (key: keyof FormState, value: string) =>
    setForm(f => ({ ...f, [key]: value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.subject.trim()) e.subject = 'Please add a short subject.';
    if (!form.message.trim())
      e.message = 'Please describe your report or feedback.';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Please enter a valid email, or leave it blank.';
    if (Number(captchaAns) !== captcha.a + captcha.b)
      e.captcha = 'Incorrect answer — please try again.';
    return e;
  };

  const resetCaptcha = () => {
    setCaptcha(newCaptcha());
    setCaptchaAns('');
  };

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (form._gotcha) {
      setStatus('success'); // bot honeypot — pretend success, send nothing
      return;
    }
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      if (e.captcha) resetCaptcha();
      return;
    }

    setStatus('submitting');
    const name = form.name || '(anonymous)';
    const email = form.email || '(not provided)';
    const barangay = form.barangay || '(not provided)';
    const composed =
      `Subject: ${form.subject}\n` +
      `Category: ${form.category}\n` +
      `Barangay: ${barangay}\n` +
      `From: ${name} <${email}>\n\n` +
      form.message;

    try {
      if (siteConfig.web3formsKey) {
        // Web3Forms: emails the submission to the inbox tied to the key.
        const res = await fetch(WEB3FORMS_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            access_key: siteConfig.web3formsKey,
            subject: `[${form.category}] ${form.subject}`,
            from_name: `Better Botolan — ${name}`,
            ...(form.email ? { replyto: form.email } : {}),
            name,
            email,
            barangay,
            category: form.category,
            message: composed,
          }),
        });
        const json = (await res.json().catch(() => null)) as {
          success?: boolean;
        } | null;
        if (!res.ok || json?.success === false) throw new Error('bad status');
        setStatus('success');
      } else if (siteConfig.feedbackEndpoint) {
        const res = await fetch(siteConfig.feedbackEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            barangay,
            category: form.category,
            subject: form.subject,
            message: form.message,
          }),
        });
        if (!res.ok) throw new Error('bad status');
        setStatus('success');
      } else if (siteConfig.contactEmail) {
        const subject = `[${form.category}] ${form.subject}`;
        const body =
          `Name: ${name}\nEmail: ${email}\n` +
          `Barangay: ${barangay}\nCategory: ${form.category}\n\n${form.message}`;
        window.location.href =
          `mailto:${siteConfig.contactEmail}` +
          `?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const reset = () => {
    setForm(EMPTY);
    setErrors({});
    resetCaptcha();
    setStatus('idle');
  };

  return (
    <>
      <SEO
        title="Feedback & Reports"
        description={`Report an issue, ask a question, or share feedback with the Municipality of ${siteConfig.shortName}.`}
        keywords={`${siteConfig.shortName} feedback, report, complaint, suggestion`}
      />
      <Section className="p-3 mb-12">
        <Breadcrumbs
          className="mb-8"
          items={[{ label: 'Home', href: '/' }, { label: 'Feedback' }]}
        />
        <SectionHeading
          kicker="We're listening"
          title="Feedback & Reports"
          description="Report a problem, ask a question, or share a suggestion. Your voice helps improve Botolan."
        />

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          {/* Form / success */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            {status === 'success' ? (
              <div className="flex flex-col items-center py-10 text-center">
                <span className="bb-check mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
                  <CheckCircle2
                    className="h-12 w-12 text-green-600"
                    aria-hidden="true"
                  />
                </span>
                <h2 className="font-display text-2xl font-bold text-gray-900">
                  Thank you!
                </h2>
                <p className="mt-2 max-w-md text-gray-600">
                  {hasServerInbox
                    ? 'Your message has been sent to the Municipality of Botolan. We appreciate you taking the time.'
                    : 'Your email app should have opened with your message ready to send. If it did not, please email us directly.'}
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-6 rounded-full bg-primary-600 px-5 py-2.5 font-semibold text-white transition-transform hover:scale-[1.03]"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Category */}
                <div>
                  <span className="mb-2 block text-sm font-semibold text-gray-700">
                    What is this about?
                  </span>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {CATEGORIES.map(c => {
                      const Icon = c.icon;
                      const active = form.category === c.value;
                      return (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => set('category', c.value)}
                          className={cn(
                            'flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-medium transition-all',
                            active
                              ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-sm'
                              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          )}
                        >
                          <Icon className="h-5 w-5" aria-hidden="true" />
                          {c.value}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Name (optional)">
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => set('name', e.target.value)}
                      className={inputClass}
                      placeholder="Juan dela Cruz"
                    />
                  </Field>
                  <Field label="Email (optional)" error={errors.email}>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => set('email', e.target.value)}
                      className={cn(inputClass, errors.email && errorRing)}
                      placeholder="you@example.com"
                    />
                  </Field>
                </div>

                <Field label="Barangay (optional)">
                  <select
                    value={form.barangay}
                    onChange={e => set('barangay', e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select a barangay…</option>
                    {barangays.map(b => (
                      <option key={b.slug} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Subject" error={errors.subject}>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={e => set('subject', e.target.value)}
                    className={cn(inputClass, errors.subject && errorRing)}
                    placeholder="Short summary of your report or feedback"
                  />
                </Field>

                <Field label="Message" error={errors.message}>
                  <textarea
                    value={form.message}
                    onChange={e => set('message', e.target.value)}
                    rows={5}
                    className={cn(
                      inputClass,
                      'resize-y',
                      errors.message && errorRing
                    )}
                    placeholder="Describe the issue, question, or suggestion. Include a location if relevant."
                  />
                </Field>

                {/* Honeypot (hidden from people) */}
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form._gotcha}
                  onChange={e => set('_gotcha', e.target.value)}
                  className="hidden"
                  aria-hidden="true"
                />

                {/* Captcha */}
                <Field
                  label={`Spam check: what is ${captcha.a} + ${captcha.b}?`}
                  error={errors.captcha}
                >
                  <input
                    type="text"
                    inputMode="numeric"
                    value={captchaAns}
                    onChange={e => setCaptchaAns(e.target.value)}
                    className={cn(
                      inputClass,
                      'max-w-[8rem]',
                      errors.captcha && errorRing
                    )}
                    placeholder="Answer"
                  />
                </Field>

                {status === 'error' && (
                  <p className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                    <AlertCircle className="h-4 w-4" aria-hidden="true" />
                    {hasServerInbox || siteConfig.contactEmail
                      ? 'Something went wrong sending your message. Please try again, or contact us another way.'
                      : 'No submission channel is configured yet. Please use the contact options on the right.'}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-3 font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-60"
                >
                  {status === 'submitting' ? (
                    <>
                      <Loader2
                        className="h-4 w-4 animate-spin"
                        aria-hidden="true"
                      />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" aria-hidden="true" />
                      Submit
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Side info */}
          <aside className="space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900">
                Other ways to reach us
              </h3>
              <div className="mt-3 space-y-2 text-sm">
                {siteConfig.contactEmail && (
                  <a
                    href={`mailto:${siteConfig.contactEmail}`}
                    className="flex items-center gap-2 text-gray-700 hover:text-primary-700"
                  >
                    <Mail
                      className="h-4 w-4 text-primary-600"
                      aria-hidden="true"
                    />
                    {siteConfig.contactEmail}
                  </a>
                )}
                {siteConfig.facebookUrl && (
                  <a
                    href={siteConfig.facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-gray-700 hover:text-primary-700"
                  >
                    <Facebook
                      className="h-4 w-4 text-primary-600"
                      aria-hidden="true"
                    />
                    Message us on Facebook
                  </a>
                )}
                <a
                  href="/hotlines"
                  className="flex items-center gap-2 text-gray-700 hover:text-primary-700"
                >
                  <Phone
                    className="h-4 w-4 text-primary-600"
                    aria-hidden="true"
                  />
                  Emergency hotlines
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <div className="flex items-start gap-2">
                <Siren
                  className="mt-0.5 h-5 w-5 shrink-0 text-amber-600"
                  aria-hidden="true"
                />
                <p className="text-sm text-amber-800">
                  This form is <strong>not for emergencies</strong>. If life,
                  safety, or property is at risk, call the{' '}
                  <a href="/hotlines" className="font-semibold underline">
                    emergency hotlines
                  </a>{' '}
                  or 911 right away.
                </p>
              </div>
            </div>

            <p className="px-1 text-xs text-gray-400">
              Reports are reviewed by the Municipality of Botolan. Providing
              your email lets them follow up, but it is optional.
            </p>
          </aside>
        </div>
      </Section>

      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .bb-check { animation: bb-pop 0.4s cubic-bezier(.2,.8,.2,1) both; }
          @keyframes bb-pop {
            0% { transform: scale(0.4); opacity: 0; }
            60% { transform: scale(1.12); }
            100% { transform: scale(1); opacity: 1; }
          }
        }
      `}</style>
    </>
  );
}

const inputClass =
  'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30';
const errorRing = 'border-red-400 focus:border-red-400 focus:ring-red-400/30';

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-gray-700">
        {label}
      </span>
      {children}
      {error && (
        <span className="mt-1 block text-xs text-red-600">{error}</span>
      )}
    </label>
  );
}
