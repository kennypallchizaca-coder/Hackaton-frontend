import { useState, useCallback } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Wallet, Check, Eye, EyeOff, Copy } from '../components/Icons';
import { cn } from '../utils/cn';

type SettingsTab = 'profile' | 'security' | 'notifications' | 'billing';

const TABS: { id: SettingsTab; label: string }[] = [
  { id: 'profile', label: 'Merchant Profile' },
  { id: 'security', label: 'Security & API' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'billing', label: 'Plan & Billing' },
];

function FormField({ label, value, type = 'text', mono = false, readOnly = false }: {
  label: string; value?: string; type?: string; mono?: boolean; readOnly?: boolean;
}) {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value ?? '');
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div>
      <label className="block text-[10px] text-[#6B8CAE] uppercase tracking-wider mb-1">{label}</label>
      <div className="relative flex items-center">
        <input
          type={type === 'password' ? (show ? 'text' : 'password') : type}
          defaultValue={value}
          readOnly={readOnly}
          className={cn(
            "w-full bg-[#060E1E] border border-[#1a2d4a] rounded px-3 py-2 text-[12px] text-[#EAECEF] outline-none focus:border-[#FCD535] transition-colors",
            mono ? 'font-mono' : '',
            readOnly ? 'text-[#6B8CAE] cursor-default' : ''
          )}
        />
        {type === 'password' && (
          <button onClick={() => setShow(s => !s)} className="absolute right-8 text-[#6B8CAE] hover:text-[#EAECEF]">
            {show ? <EyeOff size={13} /> : <Eye size={13} />}
          </button>
        )}
        {readOnly && (
          <button onClick={handleCopy} className="absolute right-2 text-[#6B8CAE] hover:text-[#FCD535] transition-colors">
            {copied ? <Check size={12} className="text-[#0ECB81]" /> : <Copy size={12} />}
          </button>
        )}
      </div>
    </div>
  );
}

function Toggle({ label, description, defaultChecked = false }: { label: string; description?: string; defaultChecked?: boolean }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#1a2d4a] last:border-0">
      <div>
        <div className="text-[12px] font-medium text-[#EAECEF]">{label}</div>
        {description && <div className="text-[10px] text-[#6B8CAE] mt-0.5">{description}</div>}
      </div>
      <button
        onClick={() => setOn(v => !v)}
        className={cn("w-10 h-5 rounded-full transition-colors relative", on ? 'bg-[#FCD535]' : 'bg-[#1a2d4a]')}
      >
        <div className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all", on ? 'left-5' : 'left-0.5')} />
      </button>
    </div>
  );
}

export function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [saved, setSaved] = useState(false);

  const handleSave = useCallback(() => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }, []);

  return (
    <div className="min-h-full bg-[#060E1E] text-[#EAECEF]">
      {/* Page Header */}
      <div className="border-b border-[#1a2d4a] px-5 py-3 flex items-center gap-2">
        <SettingsIcon size={14} className="text-[#FCD535]" />
        <h1 className="text-[14px] font-bold text-[#EAECEF]">Account Settings</h1>
      </div>

      {/* Two-column layout: left nav + right content */}
      <div className="flex" style={{ minHeight: 'calc(100vh - 144px)' }}>
        
        {/* Left: Tab Navigation */}
        <div className="w-48 border-r border-[#1a2d4a] p-3 shrink-0">
          <div className="space-y-0.5">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2.5 rounded text-[12px] font-medium transition-colors text-left",
                  activeTab === tab.id
                    ? "bg-[#FCD535]/10 text-[#FCD535]"
                    : "text-[#6B8CAE] hover:text-[#EAECEF] hover:bg-[#0D1F3C]"
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
              <div className="bg-[#0D1F3C] border border-[#1a2d4a] rounded overflow-hidden">
                <div className="px-4 py-2.5 border-b border-[#1a2d4a]">
                  <span className="text-[12px] font-bold">Business Configuration</span>
                </div>
                <div className="p-4 grid grid-cols-2 gap-4">
                  <FormField label="Merchant Legal Name" value="KuriPay EC Demo" />
                  <FormField label="Tax ID / RUC" value="1792345678001" mono />
                  <FormField label="Headquarters City" value="Quito" />
                  <FormField label="Region / Province" value="Pichincha" />
                  <div className="col-span-2">
                    <FormField label="Primary Contact Email" value="merchant@kuripay.ec" type="email" />
                  </div>
                </div>
              </div>

              <div className="bg-[#0D1F3C] border border-[#1a2d4a] rounded overflow-hidden">
                <div className="px-4 py-2.5 border-b border-[#1a2d4a]">
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
                  saved ? 'bg-[#0ECB81]/20 text-[#0ECB81] border border-[#0ECB81]/30' : 'bg-[#FCD535] text-[#060E1E] hover:bg-[#f0c90a]'
                )}>
                  {saved ? <><Check size={14} /> Saved</> : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-5">
              <div className="bg-[#0D1F3C] border border-[#1a2d4a] rounded overflow-hidden">
                <div className="px-4 py-2.5 border-b border-[#1a2d4a]">
                  <span className="text-[12px] font-bold">API Credentials</span>
                </div>
                <div className="p-4 space-y-4">
                  <FormField label="Public Key" value={import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_placeholder"} mono readOnly />
                  <FormField label="Secret Key" value={import.meta.env.VITE_STRIPE_SECRET_KEY || "sk_test_placeholder"} type="password" mono />
                  <FormField label="Webhook URL" value="https://yourdomain.com/webhooks/kuripay" mono />
                  <div className="pt-2 flex gap-3">
                    <button className="px-4 py-2 bg-[#F6465D]/10 border border-[#F6465D]/30 text-[#F6465D] rounded text-[11px] font-bold hover:bg-[#F6465D]/20 transition-colors">
                      Rotate Secret Key
                    </button>
                    <button className="px-4 py-2 border border-[#1a2d4a] text-[#6B8CAE] rounded text-[11px] font-bold hover:text-[#EAECEF] hover:border-[#FCD535]/30 transition-colors">
                      View Webhooks
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-[#0D1F3C] border border-[#1a2d4a] rounded overflow-hidden">
                <div className="px-4 py-2.5 border-b border-[#1a2d4a]">
                  <span className="text-[12px] font-bold">Two-Factor Authentication</span>
                </div>
                <div className="p-4 space-y-3">
                  <Toggle label="TOTP Authenticator" description="Use Google Authenticator or Authy" defaultChecked />
                  <Toggle label="Hardware Security Key" description="YubiKey or FIDO2 compatible" />
                  <Toggle label="SMS Verification" description="+593 98 765 4321" />
                </div>
              </div>

              <div className="bg-[#0D1F3C] border border-[#1a2d4a] rounded overflow-hidden">
                <div className="px-4 py-2.5 border-b border-[#1a2d4a]">
                  <span className="text-[12px] font-bold">Change Password</span>
                </div>
                <div className="p-4 grid grid-cols-2 gap-4">
                  <div className="col-span-2"><FormField label="Current Password" type="password" /></div>
                  <FormField label="New Password" type="password" />
                  <FormField label="Confirm Password" type="password" />
                  <div className="col-span-2 flex justify-end">
                    <button className="px-6 py-2 bg-[#FCD535] text-[#060E1E] rounded text-[12px] font-bold hover:bg-[#f0c90a] transition-colors">
                      Update Password
                    </button>
                  </div>
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
                <div key={section.title} className="bg-[#0D1F3C] border border-[#1a2d4a] rounded overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-[#1a2d4a]">
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
              <div className="bg-[#0D1F3C] border border-[#FCD535]/30 rounded overflow-hidden">
                <div className="px-4 py-2.5 border-b border-[#1a2d4a] flex items-center justify-between">
                  <span className="text-[12px] font-bold">Current Plan</span>
                  <span className="text-[9px] font-black px-2 py-0.5 rounded bg-[#FCD535]/15 text-[#FCD535] border border-[#FCD535]/30 uppercase">Active</span>
                </div>
                <div className="p-4">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-[24px] font-black text-[#FCD535]">Pro Merchant</span>
                    <span className="text-[12px] text-[#6B8CAE]">/ month</span>
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
                      <div key={k} className="bg-[#060E1E] rounded p-2.5 border border-[#1a2d4a]">
                        <div className="text-[#6B8CAE] mb-0.5">{k}</div>
                        <div className="text-[#0ECB81] font-bold">{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-[#0D1F3C] border border-[#1a2d4a] rounded overflow-hidden">
                <div className="px-4 py-2.5 border-b border-[#1a2d4a]">
                  <span className="text-[12px] font-bold">Payment Method</span>
                </div>
                <div className="p-4 flex items-center gap-3">
                  <div className="w-10 h-7 bg-[#1a2d4a] rounded flex items-center justify-center">
                    <span className="text-[8px] font-black text-[#EAECEF]">BTC</span>
                  </div>
                  <div>
                    <div className="text-[12px] font-bold text-[#EAECEF]">Bitcoin Auto-Pay</div>
                    <div className="text-[10px] text-[#6B8CAE]">bc1q...p7q8 · Renews Mar 20, 2026</div>
                  </div>
                  <button className="ml-auto text-[11px] text-[#6B8CAE] hover:text-[#FCD535] transition-colors">Update</button>
                </div>
              </div>

              {/* Invoice History */}
              <div className="bg-[#0D1F3C] border border-[#1a2d4a] rounded overflow-hidden">
                <div className="px-4 py-2.5 border-b border-[#1a2d4a]">
                  <span className="text-[12px] font-bold">Invoice History</span>
                </div>
                <div className="divide-y divide-[#1a2d4a]">
                  {[
                    { date: 'Feb 20, 2026', amount: '0.00089 BTC', status: 'Paid' },
                    { date: 'Jan 20, 2026', amount: '0.00089 BTC', status: 'Paid' },
                    { date: 'Dec 20, 2025', amount: '0.00091 BTC', status: 'Paid' },
                  ].map(inv => (
                    <div key={inv.date} className="flex items-center justify-between px-4 py-3 hover:bg-white/2 transition-colors">
                      <span className="text-[12px] text-[#6B8CAE]">{inv.date}</span>
                      <span className="text-[12px] font-bold text-[#EAECEF]">{inv.amount}</span>
                      <span className="text-[10px] text-[#0ECB81] font-bold">{inv.status}</span>
                      <button className="text-[11px] text-[#6B8CAE] hover:text-[#FCD535] transition-colors">Download</button>
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
