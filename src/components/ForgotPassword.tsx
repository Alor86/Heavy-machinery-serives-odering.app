import React, { useState, useEffect } from 'react';
import { Mail, Phone, ShieldCheck, AlertCircle, ArrowLeft, RefreshCw, Lock, CheckCircle2 } from 'lucide-react';
import { UserAccount } from '../types';

interface ForgotPasswordProps {
  onResetFinished: (email: string) => void;
  onCancel: () => void;
}

type ResetStep = 'ENTER_EMAIL' | 'CHOOSE_METHOD' | 'ENTER_OTP' | 'NEW_PASSWORD' | 'SUCCESS';

export default function ForgotPassword({ onResetFinished, onCancel }: ForgotPasswordProps) {
  const [step, setStep] = useState<ResetStep>('ENTER_EMAIL');
  const [emailInput, setEmailInput] = useState('');
  const [matchedUser, setMatchedUser] = useState<UserAccount | null>(null);
  
  const [method, setMethod] = useState<'EMAIL' | 'SMS'>('EMAIL');
  const [isSending, setIsSending] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [userCode, setUserCode] = useState('');
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Countdown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Step 1: Find user account
  const handleLookupUser = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!emailInput.trim()) {
      setErrorMsg('Please enter your registered email address.');
      return;
    }

    const storedUsersRaw = localStorage.getItem('heavygear_users');
    let users: UserAccount[] = [];
    if (storedUsersRaw) {
      try {
        users = JSON.parse(storedUsersRaw);
      } catch {
        users = [];
      }
    }

    const user = users.find((u) => u.email.toLowerCase() === emailInput.trim().toLowerCase());
    if (!user) {
      setErrorMsg('No registered account was found with this email address. Please double check or Sign Up.');
      return;
    }

    setMatchedUser(user);
    setStep('CHOOSE_METHOD');
  };

  // Step 2: Trigger OTP
  const handleSendResetOtp = () => {
    if (!matchedUser) return;
    setIsSending(true);
    setErrorMsg('');
    setSuccessMsg('');

    setTimeout(() => {
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedCode(code);
      setIsSending(false);
      setResendCooldown(30);
      setSuccessMsg(`DISPATCH APPROVED: Password Reset OTP code [${code}] sent to your chosen sandbox receiver line.`);
      setStep('ENTER_OTP');
    }, 900);
  };

  // Step 3: Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (userCode.trim().length !== 4) {
      setErrorMsg('Please enter a 4-digit code.');
      return;
    }

    if (userCode.trim() !== generatedCode) {
      setErrorMsg('Incorrect OTP reset token. Check the code in the success banner and retry.');
      return;
    }

    setStep('NEW_PASSWORD');
    setSuccessMsg('');
    setErrorMsg('');
  };

  // Step 4: Save password
  const handleSaveNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify both inputs.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Load current accounts, update password
      const storedUsersRaw = localStorage.getItem('heavygear_users');
      let users: UserAccount[] = [];
      if (storedUsersRaw) {
        try {
          users = JSON.parse(storedUsersRaw);
        } catch {
          users = [];
        }
      }

      const updatedUsers = users.map((u) => {
        if (u.email.toLowerCase() === emailInput.trim().toLowerCase()) {
          return { ...u, password: newPassword };
        }
        return u;
      });

      localStorage.setItem('heavygear_users', JSON.stringify(updatedUsers));
      setIsSubmitting(false);
      setStep('SUCCESS');
    }, 1000);
  };

  const maskEmail = (em: string) => {
    const parts = em.split('@');
    if (parts.length !== 2) return em;
    const name = parts[0];
    const domain = parts[1];
    if (name.length <= 3) return `***@${domain}`;
    return `${name.substring(0, 3)}***@${domain}`;
  };

  const maskPhone = (ph: string) => {
    const digits = ph.trim().replace(/\D/g, '');
    if (digits.length < 4) return ph;
    return `+91 ***** **${digits.slice(-4)}`;
  };

  return (
    <div id="forgot-password-screen" className="w-full max-w-[440px] flex flex-col gap-5 pb-4 select-none">
      {/* Back button */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Back to Sign In</span>
      </div>

      <div className="space-y-1">
        <h1 className="text-xl font-extrabold tracking-tight text-slate-800 uppercase font-sans">
          Reset Password
        </h1>
        <p className="text-slate-500 text-xs leading-normal">
          Verify identity using secured free sandbox gateways.
        </p>
      </div>

      {successMsg && (
        <div id="reset-alert-success" className="p-3 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-xl text-left">
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-[10px] font-black text-emerald-800 tracking-wider uppercase block">GATEWAY ACTIVE</span>
              <p className="text-[10.5px] text-emerald-700 leading-normal font-medium">{successMsg}</p>
              {generatedCode && (
                <div className="mt-2 inline-flex items-center gap-1.5 bg-emerald-600 text-white font-mono text-xs font-black px-2 py-1 rounded-lg">
                  <span>TEST RESET CODE:</span>
                  <span className="underline tracking-widest">{generatedCode}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {errorMsg && (
        <div id="reset-alert-error" className="p-3 bg-rose-50 border-l-4 border-rose-500 rounded-r-xl flex items-start gap-2.5 text-left">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-[10px] font-black text-rose-800 tracking-wider uppercase block">SECURITY GUARD</span>
            <span className="text-[10.5px] text-rose-700 leading-normal font-medium block">{errorMsg}</span>
          </div>
        </div>
      )}

      <div className="bg-slate-50/50 border border-slate-200/50 p-4 rounded-3xl space-y-4">
        {step === 'ENTER_EMAIL' && (
          <form onSubmit={handleLookupUser} className="space-y-4 text-left">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans">
                ENTER WORK EMAIL
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="name@company.com"
                className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs font-medium placeholder:text-slate-300 outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-indigo-700 active:scale-98 transition-all flex items-center justify-center cursor-pointer outline-none shadow-md shadow-indigo-100"
            >
              <span>LOOK UP ACCOUNT</span>
            </button>
          </form>
        )}

        {step === 'CHOOSE_METHOD' && matchedUser && (
          <div className="space-y-4 text-left">
            <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
              Choose an active channel below to dispatch your password recovery security token:
            </p>

            <div className="grid grid-cols-1 gap-2.5">
              <button
                type="button"
                onClick={() => setMethod('EMAIL')}
                className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  method === 'EMAIL' ? 'border-indigo-600 bg-indigo-50/45' : 'border-slate-200 bg-white'
                }`}
              >
                <div className={`p-2 rounded-xl mt-0.5 ${method === 'EMAIL' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11.5px] font-black uppercase text-slate-800 tracking-wide font-sans">SMTP Email Gateway</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{maskEmail(matchedUser.email)}</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMethod('SMS')}
                className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  method === 'SMS' ? 'border-indigo-600 bg-indigo-50/45' : 'border-slate-200 bg-white'
                }`}
              >
                <div className={`p-2 rounded-xl mt-0.5 ${method === 'SMS' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11.5px] font-black uppercase text-slate-800 tracking-wide font-sans">SMS Telecom Gateway</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{maskPhone(matchedUser.phone)}</p>
                </div>
              </button>
            </div>

            <button
              type="button"
              onClick={handleSendResetOtp}
              disabled={isSending}
              className="w-full h-11 bg-[#1a1c1c] text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-slate-800 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer outline-none"
            >
              {isSending ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>TRANSMITTING OTP...</span>
                </>
              ) : (
                <span>DISPATCH SECURITY CODE</span>
              )}
            </button>
          </div>
        )}

        {step === 'ENTER_OTP' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-sans">
                ENTER RESET SECURITY CODE
              </label>
              <input
                type="text"
                maxLength={4}
                required
                value={userCode}
                onChange={(e) => {
                  setUserCode(e.target.value.replace(/\D/g, ''));
                  if (errorMsg) setErrorMsg('');
                }}
                className="w-full h-11 bg-white border border-slate-200 rounded-xl text-center text-lg font-mono font-black tracking-widest outline-none focus:ring-1 focus:focus:ring-indigo-500"
                placeholder="••••"
              />
            </div>

            <p className="text-[10.5px] text-slate-400 text-center font-sans">
              Didn't receive token?{' '}
              {resendCooldown > 0 ? (
                <span className="text-slate-500 font-bold">Resend in {resendCooldown}s</span>
              ) : (
                <button
                  type="button"
                  onClick={handleSendResetOtp}
                  className="text-indigo-600 font-extrabold hover:underline cursor-pointer bg-transparent border-none p-0 outline-none"
                >
                  Resend OTP
                </button>
              )}
            </p>

            <button
              type="submit"
              className="w-full h-11 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-indigo-700 active:scale-98 transition-all flex items-center justify-center cursor-pointer outline-none"
            >
              <span>VERIFY OTP CODE</span>
            </button>
          </form>
        )}

        {step === 'NEW_PASSWORD' && (
          <form onSubmit={handleSaveNewPassword} className="space-y-4 text-left">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider font-sans">
                  NEW PASSWORD
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="••••••••"
                    className="w-full h-11 px-4 pr-10 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs font-medium outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <Lock className="w-4 h-4 text-slate-350 absolute right-3 top-3.5" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider font-sans">
                  CONFIRM NEW PASSWORD
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="••••••••"
                    className="w-full h-11 px-4 pr-10 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs font-medium outline-none focus:ring-1 focus:focus:ring-indigo-500"
                  />
                  <Lock className="w-4 h-4 text-slate-350 absolute right-3 top-3.5" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-[#1a1c1c] text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-slate-800 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer outline-none"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>UPDATING CREDENTIALS...</span>
                </>
              ) : (
                <span>SAVE NEW PASSWORD</span>
              )}
            </button>
          </form>
        )}

        {step === 'SUCCESS' && (
          <div className="space-y-4 py-2 text-center select-none">
            <div className="flex justify-center text-emerald-500">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-black text-slate-800 uppercase tracking-tight">PASSWORD SECURED</p>
              <p className="text-[11px] text-slate-500 leading-normal">
                Credentials successfully rewritten in your local storage engine! You can now log in using your new credentials.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onResetFinished(emailInput)}
              className="w-full h-11 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-indigo-700 cursor-pointer shadow-md shadow-indigo-100 outline-none"
            >
              <span>RETURN TO SIGN IN</span>
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-1.5 py-1">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
        <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider font-mono">
          Security Reset Gateway Active
        </span>
      </div>
    </div>
  );
}
