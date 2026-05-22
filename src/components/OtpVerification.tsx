import React, { useState, useEffect } from 'react';
import { Mail, Phone, ShieldCheck, AlertCircle, ArrowLeft, RefreshCw, KeyRound } from 'lucide-react';

interface OtpVerificationProps {
  fullName: string;
  email: string;
  phone: string;
  onVerificationSuccess: () => void;
  onCancel: () => void;
}

export default function OtpVerification({
  fullName,
  email,
  phone,
  onVerificationSuccess,
  onCancel,
}: OtpVerificationProps) {
  const [method, setMethod] = useState<'EMAIL' | 'SMS'>('EMAIL');
  const [isSending, setIsSending] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [userCode, setUserCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Simple countdown custom hook
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Send the simulated OTP code
  const handleSendOtp = () => {
    setIsSending(true);
    setErrorMsg('');
    setSuccessMsg('');

    setTimeout(() => {
      // Generate a dynamic 4-digit code
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedCode(code);
      setIsSending(false);
      setOtpSent(true);
      setResendCooldown(30);
      
      // Print the simulated code clearly so they can test instantly
      setSuccessMsg(`SECURE DISPATCH: OTP Code [${code}] transmitted successfully to your chosen free-tier gateway.`);
    }, 1000);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (userCode.trim().length !== 4) {
      setErrorMsg('Please enter a valid 4-digit verification code.');
      return;
    }

    if (userCode.trim() !== generatedCode) {
      setErrorMsg('Incorrect OTP token. Please enter the code shown in the dispatch banner.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onVerificationSuccess();
    }, 800);
  };

  // Mask details for safety
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
    <div id="otp-verification-screen" className="w-full max-w-[440px] flex flex-col gap-5 pb-4 select-none">
      {/* Header */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Back to Register</span>
      </div>

      <div className="space-y-1">
        <h1 className="text-xl font-extrabold tracking-tight text-slate-800 uppercase font-sans">
          OTP Verification
        </h1>
        <p className="text-slate-500 text-xs leading-normal">
          Activate your heavy machinery dispatcher license.
        </p>
      </div>

      {/* Warning/Success Banner */}
      {successMsg && (
        <div id="otp-alert-success" className="p-3 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-xl text-left">
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-[10px] font-black text-emerald-800 tracking-wider uppercase block">GATEWAY READY</span>
              <p className="text-[10.5px] text-emerald-700 leading-normal font-medium">{successMsg}</p>
              
              {/* Highlight code for easy click-to-fill */}
              <div className="mt-2 inline-flex items-center gap-1.5 bg-emerald-600 text-white font-mono text-xs font-black px-2 py-1 rounded-lg">
                <span>TEST CODE:</span>
                <span className="underline tracking-widest">{generatedCode}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {errorMsg && (
        <div id="otp-alert-error" className="p-3 bg-rose-50 border-l-4 border-rose-500 rounded-r-xl flex items-start gap-2.5 text-left">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-[10px] font-black text-rose-800 tracking-wider uppercase block">VERIFICATION FAILURE</span>
            <span className="text-[10.5px] text-rose-700 leading-normal font-medium block">{errorMsg}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="bg-slate-50/50 border border-slate-200/50 p-4 rounded-3xl space-y-4">
        {!otpSent ? (
          <div className="space-y-4 text-left">
            <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
              Choose your preferred, cloud-ready free tier verification channel. We will transmit a 4-digit code to activate workspace credentials.
            </p>

            <div className="grid grid-cols-1 gap-2.5">
              {/* Email Gateway Option */}
              <button
                type="button"
                onClick={() => setMethod('EMAIL')}
                className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  method === 'EMAIL'
                    ? 'border-indigo-600 bg-indigo-50/45 shadow-sm'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${method === 'EMAIL' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase text-slate-800 tracking-wide">Email Verification OTP</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{maskEmail(email)}</p>
                  <span className="inline-block mt-1 text-[8px] font-bold text-indigo-600 bg-indigo-100/60 uppercase px-1.5 rounded tracking-wide">
                    Free Spark Tier
                  </span>
                </div>
              </button>

              {/* SMS Gateway Option */}
              <button
                type="button"
                onClick={() => setMethod('SMS')}
                className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  method === 'SMS'
                    ? 'border-indigo-600 bg-indigo-50/45 shadow-sm'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${method === 'SMS' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase text-slate-800 tracking-wide font-sans">Phone SMS Verification OTP</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{maskPhone(phone)}</p>
                  <span className="inline-block mt-1 text-[8px] font-bold text-emerald-600 bg-emerald-100/60 uppercase px-1.5 rounded tracking-wide">
                    Firebase Live Sandbox
                  </span>
                </div>
              </button>
            </div>

            <button
              type="button"
              onClick={handleSendOtp}
              disabled={isSending}
              className="w-full h-11 bg-[#1a1c1c] text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-slate-800 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer outline-none shadow-sm"
            >
              {isSending ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>TRANSMITTING CODE...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                  <span>SEND SECURITY OTP TOKEN</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block font-sans">
                ENTER 4-DIGIT CODE
              </label>
              <div className="flex gap-2.5 justify-center">
                <input
                  type="text"
                  maxLength={4}
                  value={userCode}
                  onChange={(e) => {
                    setUserCode(e.target.value.replace(/\D/g, ''));
                    if (errorMsg) setErrorMsg('');
                  }}
                  className="w-full max-w-[200px] h-12 bg-slate-100 border-2 border-slate-200 focus:border-indigo-600 rounded-2xl text-center text-xl font-extrabold tracking-[12px] font-sans text-slate-800 placeholder:text-slate-200 outline-none transition-all duration-150"
                  placeholder="••••"
                />
              </div>
            </div>

            <p className="text-[10.5px] text-slate-450 text-center font-sans">
              Didn't receive code?{' '}
              {resendCooldown > 0 ? (
                <span className="text-slate-500 font-bold">Resend code in {resendCooldown}s</span>
              ) : (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="text-indigo-600 font-extrabold hover:underline cursor-pointer bg-transparent border-none p-0 outline-none"
                >
                  Resend OTP Code
                </button>
              )}
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-indigo-700 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer outline-none shadow-md shadow-indigo-100"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>VERIFYING INSTANCE...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-white" />
                  <span>CONFIRM & ACTIVATE ACCOUNT</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setOtpSent(false);
                setUserCode('');
                setGeneratedCode('');
                setSuccessMsg('');
                setErrorMsg('');
              }}
              className="w-full text-center text-[10px] text-slate-500 font-bold uppercase tracking-wider hover:text-slate-700 cursor-pointer bg-transparent py-1"
            >
              Change Verification Method
            </button>
          </form>
        )}
      </div>

      {/* Decorative branding footnote */}
      <div className="flex items-center justify-center gap-1.5 py-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider font-mono">
          Telangana Telemetry Gate OTP v1.07 Spark
        </span>
      </div>
    </div>
  );
}
