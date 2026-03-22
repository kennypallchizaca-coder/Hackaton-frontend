import { useState, useCallback } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Wallet, Check, Eye, EyeOff, Copy } from '../../../components/common/Icons';
import { cn } from '../../../utils/cn';
import { SEO } from '../../../components/common/SEO';
import { useAuthStore } from '../../auth/store/authStore';

type SettingsTab = 'profile' | 'security' | 'notifications' | 'billing';

const TABS: { id: SettingsTab; label: string }[] = [
  { id: 'profile', label: 'Merchant Profile' },
  { id: 'security', label: 'Security & API' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'billing', label: 'Plan & Billing' },
];

function FormField({ label, value: initialValue, type = 'text', mono = false, readOnly = false }: {
  label: string; value?: string; type?: string; mono?: boolean; readOnly?: boolean;
}) {
  const [value, setValue] = useState(initialValue || '');
  const [prevInitialValue, setPrevInitialValue] = useState(initialValue);

  if (initialValue !== prevInitialValue) {
    setValue(initialValue || '');
    setPrevInitialValue(initialValue);
  }

  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value ?? '');
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div>
      <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">{label}</label>
      <div className="relative flex items-center">
        <input
          type={type === 'password' ? (show ? 'text' : 'password') : type}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          readOnly={readOnly}
          className={cn(
            "w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-[12px] text-slate-50 outline-none focus:border-blue-500 transition-colors",
            mono ? 'font-mono' : '',
            readOnly ? 'text-slate-400 cursor-default' : ''
          )}
        />
        {type === 'password' && (
          <button onClick={() => setShow(s => !s)} className="absolute right-8 text-slate-400 hover:text-slate-50">
            {show ? <EyeOff size={13} /> : <Eye size={13} />}
          </button>
        )}
        {readOnly && (
          <button onClick={handleCopy} className="absolute right-2 text-slate-400 hover:text-blue-500 transition-colors">
            {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
          </button>
        )}
      </div>
    </div>
  );
}

function Toggle({ label, description, defaultChecked = false }: { label: string; description?: string; defaultChecked?: boolean }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
      <div>
        <div className="text-[12px] font-medium text-slate-50">{label}</div>
        {description && <div className="text-[10px] text-slate-400 mt-0.5">{description}</div>}
      </div>
      <button
        onClick={() => setOn(v => !v)}
        className={cn("w-10 h-5 rounded-full transition-colors relative", on ? 'bg-blue-600' : 'bg-slate-800')}
      >
        <div className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all", on ? 'left-5' : 'left-0.5')} />
      </button>
    </div>
  );
}

export function Settings() {
  const user = useAuthStore(state => state.user);
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [saved, setSaved] = useState(false);

  const handleSave = useCallback(() => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }, []);

  return (
    <div className="min-h-full bg-slate-950 text-slate-50">
      <SEO 
        title="Account Settings" 
        description="Manage your merchant profile, API credentials, security, and billing methods for your KuriPay account." 
      />
      {/* Page Header */}
      <div className="border-b border-slate-800 px-5 py-3 flex items-center gap-2">
        <SettingsIcon size={14} className="text-blue-500" />
        <h1 className="text-[14px] font-bold text-slate-50">Account Settings</h1>
      </div>

      {/* Two-column layout: left nav + right content */}
      <div className="flex" style={{ minHeight: 'calc(100vh - 144px)' }}>
        
        {/* Left: Tab Navigation */}
        <div className="w-48 border-r border-slate-800 p-3 shrink-0">
          <div className="space-y-0.5">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2.5 rounded text-[12px] font-medium transition-colors text-left",
                  activeTab === tab.id
                    ? "bg-blue-500/10 text-blue-500"
                    : "text-slate-400 hover:text-slate-50 hover:bg-slate-800"
                )}
              >
                {tab.id === 'profile' && <User size={14} />}
                {tab.id === 'security' && <Shield size={14} />}
                {tab.id === 'notifications' && <Bell size={14} />}
                {tab.id === 'billing' && <Wallet size={14} />}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Content */}
        <div className="flex-1 p-6 max-w-3xl">
          
          {activeTab === 'profile' && (
            <div className="space-y-5">
              <div className="bg-slate-800 border border-slate-800 rounded overflow-hidden">
                <div className="px-4 py-2.5 border-b border-slate-800">
                  <span className="text-[12px] font-bold">Business Configuration</span>
                </div>
                <div className="p-4 grid grid-cols-2 gap-4">
                  <FormField label="Merchant Legal Name" value={user?.name || "KuriPay EC Demo"} />
                  <FormField label="Tax ID / RUC" value="1792345678001" mono />
                  <FormField label="Headquarters City" value="Quito" />
                  <FormField label="Region / Province" value="Pichincha" />
                  <div className="col-span-2">
                    <FormField label="Primary Contact Email" value={user?.email || "merchant@kuripay.ec"} type="email" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 border border-slate-800 rounded overflow-hidden">
                <div className="px-4 py-2.5 border-b border-slate-800">
                  <span className="text-[12px] font-bold">Network Node Settings</span>
                </div>
                <div className="p-4 space-y-4">
                  <FormField label="Lightning Node RPC URL" value="https://node.kuripay.ec:8080" mono />
                  <FormField label="On-Chain Settlement Address (BTC)" value="bc1q9f8a2d3ec4d5e6f7g8h9i0j1k2l3m4n5o6p7q8" mono readOnly />
                </div>
              </div>

              <div className="flex justify-end">
                <button onClick={handleSave} className={cn(
                  "flex items-center gap-2 px-6 py-2 rounded text-[12px] font-bold transition-all",
                  saved ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30' : 'bg-blue-600 text-slate-950 hover:bg-blue-500'
                )}>
                  {saved ? <><Check size={14} /> Saved</> : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-5">
              <div className="bg-slate-800 border border-slate-800 rounded overflow-hidden">
                <div className="px-4 py-2.5 border-b border-slate-800">
                  <span className="text-[12px] font-bold">API Credentials</span>
                </div>
                <div className="p-4 space-y-4">
                  <FormField label="Public Key" value={import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_•••••••••••••••••••••••••••"} mono readOnly />
                  <FormField label="Secret Key" value="sk_test_•••••••••••••••••••••••••••" type="password" mono readOnly />
                  <FormField label="Webhook URL" value="https://yourdomain.com/webhooks/kuripay" mono />
                </div>
              </div>

              <div className="bg-slate-800 border border-slate-800 rounded overflow-hidden">
                <div className="px-4 py-2.5 border-b border-slate-800">
                  <span className="text-[12px] font-bold">Two-Factor Authentication</span>
                </div>
                <div className="p-4 space-y-3">
                  <Toggle label="TOTP Authenticator" description="Use Google Authenticator or Authy" defaultChecked />
                  <Toggle label="Hardware Security Key" description="YubiKey or FIDO2 compatible" />
                  <Toggle label="SMS Verification" description="+593 98 765 4321" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-5">
              {[
                {
                  title: 'Transaction Alerts',
                  items: [
                    { label: 'New payment received', description: 'Notify when a new BTC payment is confirmed', on: true },
                    { label: 'Failed transaction', description: 'Alert on payment processing failures', on: true },
                    { label: 'Pending settlement', description: 'Remind about unconfirmed transactions after 30 min', on: false },
                  ]
                },
                {
                  title: 'Security Alerts',
                  items: [
                    { label: 'New login detected', description: 'Alert on new device authentication', on: true },
                    { label: 'API key used', description: 'Notify each time your secret key is used', on: false },
                    { label: 'Compliance flags', description: 'Alert on KYT risk detection', on: true },
                  ]
                },
                {
                  title: 'Reports',
                  items: [
                    { label: 'Daily summary', description: 'Receive a daily digest at 8:00 AM', on: true },
                    { label: 'Weekly analytics', description: 'Receive weekly performance report', on: false },
                  ]
                },
              ].map(section => (
                <div key={section.title} className="bg-slate-800 border border-slate-800 rounded overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-slate-800">
                    <span className="text-[12px] font-bold">{section.title}</span>
                  </div>
                  <div className="px-4">
                    {section.items.map(item => (
                      <Toggle key={item.label} label={item.label} description={item.description} defaultChecked={item.on} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-5">
              {/* Current Plan */}
              <div className="bg-slate-800 border border-blue-500/30 rounded overflow-hidden">
                <div className="px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
                  <span className="text-[12px] font-bold">Current Plan</span>
                  <span className="text-[9px] font-black px-2 py-0.5 rounded bg-blue-600/15 text-blue-500 border border-blue-500/30 uppercase">Active</span>
                </div>
                <div className="p-4">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-[24px] font-black text-blue-500">Pro Merchant</span>
                    <span className="text-[12px] text-slate-400">/ month</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-[11px]">
                    {[
                      ['Transactions', 'Unlimited'],
                      ['Settlement', 'Same-day'],
                      ['Fee Rate', '0% on BTC pairs'],
                      ['API Calls', '100k/month'],
                      ['Stores', 'Unlimited'],
                      ['Support', '24/7 Priority'],
                    ].map(([k, v]) => (
                      <div key={k} className="bg-slate-950 rounded p-2.5 border border-slate-800">
                        <div className="text-slate-400 mb-0.5">{k}</div>
                        <div className="text-emerald-500 font-bold">{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-slate-800 border border-slate-800 rounded overflow-hidden">
                <div className="px-4 py-2.5 border-b border-slate-800">
                  <span className="text-[12px] font-bold">Payment Method</span>
                </div>
                <div className="p-4 flex items-center gap-3">
                  <div className="w-10 h-7 bg-slate-800 rounded flex items-center justify-center">
                    <span className="text-[8px] font-black text-slate-50">BTC</span>
                  </div>
                  <div>
                    <div className="text-[12px] font-bold text-slate-50">Bitcoin Auto-Pay</div>
                    <div className="text-[10px] text-slate-400">bc1q...p7q8 · Renews Mar 20, 2026</div>
                  </div>
                </div>
              </div>

              {/* Invoice History */}
              <div className="bg-slate-800 border border-slate-800 rounded overflow-hidden">
                <div className="px-4 py-2.5 border-b border-slate-800">
                  <span className="text-[12px] font-bold">Invoice History</span>
                </div>
                <div className="divide-y divide-slate-800">
                  {[
                    { date: 'Feb 20, 2026', amount: '0.00089 BTC', status: 'Paid' },
                    { date: 'Jan 20, 2026', amount: '0.00089 BTC', status: 'Paid' },
                    { date: 'Dec 20, 2025', amount: '0.00091 BTC', status: 'Paid' },
                  ].map(inv => (
                    <div key={inv.date} className="flex items-center justify-between px-4 py-3 hover:bg-white/2 transition-colors">
                      <span className="text-[12px] text-slate-400">{inv.date}</span>
                      <span className="text-[12px] font-bold text-slate-50">{inv.amount}</span>
                      <span className="text-[10px] text-emerald-500 font-bold">{inv.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
