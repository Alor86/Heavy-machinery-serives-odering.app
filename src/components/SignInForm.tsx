import React, { useState } from 'react';
import { Eye, EyeOff, ShieldCheck, Info, Contact, LogIn, Key, Lock } from 'lucide-react';
import { Role } from '../types';
import RoleToggle from './RoleToggle';

interface SignInFormProps {
  id?: string;
  onSignInSuccess: (email: string, role: Role) => void;
  onNavigateToSignUp: () => void;
  onNavigateToForgotPassword?: () => void;
  prefilledEmail?: string;
}

export default function SignInForm({
  id = 'signin-form-container',
  onSignInSuccess,
  onNavigateToSignUp,
  onNavigateToForgotPassword,
  prefilledEmail = '',
}: SignInFormProps) {
  const [role, setRole] = useState<Role>('customer');
  const [identifier, setIdentifier] = useState(prefilledEmail);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Error States
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [infoTitle, setInfoTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identifier.trim() || !password.trim()) {
      setErrorMsg('Please enter both your work email/phone and password.');
      return;
    }

    setIsSubmitting(true);

    // Simulate verification
    setTimeout(() => {
      setIsSubmitting(false);
      
      const storedUsersRaw = localStorage.getItem('heavygear_users');
      if (storedUsersRaw) {
        try {
          const users = JSON.parse(storedUsersRaw);
          const matchedUser = users.find(
            (u: any) =>
              u.email.toLowerCase() === identifier.toLowerCase() ||
              u.phone.replace(/\D/g, '') === identifier.replace(/\D/g, '')
          );
          
          if (matchedUser) {
            // Check password if it has one stored
            if (matchedUser.password && matchedUser.password !== password) {
              setErrorMsg('Incorrect secure password for this registered user account. Please try again or reset via Forgot Password.');
              return;
            }
          }
        } catch (err) {
          // Ignore parse errors
        }
      }

      onSignInSuccess(identifier, role);
    }, 700);
  };

  return (
    <div id={id} className="w-full max-w-[440px] flex flex-col gap-5 pb-2">
      {/* Hero Header */}
      <div id="signin-hero" className="space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 font-sans">
          Welcome Back
        </h1>
        <p className="text-slate-500 text-xs leading-normal font-sans">
          Sign in to book machinery or view your orders.
        </p>
      </div>

      {errorMsg && (
        <div id="signin-error" className="p-3 bg-rose-50 border-l-4 border-rose-500 rounded-r-xl flex items-start gap-2.5">
          <Info className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span className="text-[11px] font-semibold text-rose-800 leading-normal">{errorMsg}</span>
        </div>
      )}

      {infoMsg && (
        <div id="signin-info-alert" className="p-3 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-xl flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-left">
            <span className="text-[11px] font-black text-emerald-800 uppercase tracking-widest block leading-none mb-1">{infoTitle || 'INFO NOTICE'}</span>
            <span className="text-[10.5px] text-emerald-700 leading-relaxed block font-medium font-sans">{infoMsg}</span>
          </div>
        </div>
      )}

      {/* Role Switcher */}
      <div id="signin-role-selector-wrapper" className="space-y-1">
        <RoleToggle id="signin-role-toggle" activeRole={role} onChange={setRole} />
      </div>

      {/* Form Element */}
      <form onSubmit={handleSubmit} id="signin-form" className="flex flex-col gap-4">
        {/* Email or Phone Number */}
        <div id="field-signin-email" className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans">
            Email or Phone Number
          </label>
          <div className="relative font-sans">
            <input
              type="text"
              id="input-signin-email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full h-11 px-4 pr-12 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium placeholder:text-slate-300 transition-all outline-none text-xs focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter credentials"
            />
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
              <Contact className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Secure Password */}
        <div id="field-signin-password" className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans">
              Password
            </label>
            <button
               type="button"
               id="btn-forgot-password"
               onClick={() => {
                 if (onNavigateToForgotPassword) {
                   onNavigateToForgotPassword();
                 } else {
                   setInfoTitle('RESET INITIATED');
                   setInfoMsg('Password reset instructions have been dispatched to ' + (identifier || 'your registered credentials') + '. Please check your client workspace.');
                   setErrorMsg('');
                 }
               }}
               className="text-[10px] font-bold text-indigo-600 hover:underline cursor-pointer outline-none bg-transparent"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative font-sans">
            <input
              type={showPassword ? 'text' : 'password'}
              id="input-signin-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 px-4 pr-12 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium placeholder:text-slate-300 transition-all outline-none text-xs focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
            />
            <button
              type="button"
              id="btn-toggle-signin-password"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-indigo-500 transition-colors cursor-pointer outline-none"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          id="btn-submit-signin"
          disabled={isSubmitting}
          className={`w-full h-11 bg-indigo-600 text-white font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 rounded-xl shadow-lg shadow-indigo-100 active:scale-95 transition-all text-xs duration-100 cursor-pointer mt-1 select-none outline-none ${
            isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:bg-indigo-700'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
              <span>Authenticating...</span>
            </div>
          ) : (
            <>
              <span>Sign In</span>
              <LogIn className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Social/Alternative Divider */}
      <div className="relative my-2 flex items-center select-none">
        <div className="flex-grow border-t border-slate-200"></div>
        <span className="px-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">OR</span>
        <div className="flex-grow border-t border-slate-200"></div>
      </div>

      {/* Alternative actions */}
      <div className="space-y-2.5">
        <button
          type="button"
          id="btn-sso-signin"
          onClick={() => {
            setInfoTitle('SSO INITIATED');
            setInfoMsg('Connecting to single sign-on gateway... Handshaking security claims safely.');
            setErrorMsg('');
          }}
          className="w-full h-11 bg-slate-50 border border-slate-200/60 text-slate-705 font-bold text-xs flex items-center justify-center gap-2 rounded-xl hover:bg-slate-100/90 transition-colors cursor-pointer select-none outline-none"
        >
          <Key className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Sign in with SSO</span>
        </button>

        <p className="text-center pt-2 font-sans text-xs text-slate-500">
          New here?{' '}
          <button
            type="button"
            id="btn-navigate-to-signup"
            onClick={onNavigateToSignUp}
            className="text-indigo-600 font-extrabold hover:underline cursor-pointer outline-none bg-transparent border-none p-0 inline-block focus:ring-0"
          >
            Create an Account
          </button>
        </p>
      </div>

      {/* Decorative Machinery Image */}
      <div id="signin-bento-heavy-machinery" className="mt-3 rounded-2xl overflow-hidden border border-slate-200/50 grayscale opacity-60 group hover:scale-[1.01] transition-transform duration-300 relative">
        <img
          referrerPolicy="no-referrer"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCj1oifmQaCWpImm9q9b_nDS9u77Yq6yRI54dkWM6vWDXWMPlP0n70OpUmjq2Oen9A5ve3hjxSFtwzXBQgA-Uu29bJ3nvhSO19EEkc657JNusYGi7n-ViG8ontLN8T73Cmfm75-mKZZmXbqdBsQ6qlVzjzgqUZbKIwIEobT-Z0Jo8xvnbhTNkpcF_FdUzWVzxYMtqgGw_h6n9JB8cJ1r6uYAaWfzARENZb8-S4Hgf5jXNnhfIa12xhUZAo6LXgcai3_qifqZa3zW_E"
          alt="Heavy machinery construction scene at sunset"
          className="w-full h-24 object-cover"
        />
      </div>

      {/* Footer Security Notice */}
      <p className="font-sans text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-1 mt-1 pb-1">
        <Lock className="w-3 h-3 text-emerald-500" />
        <span>Secure encrypted connection</span>
      </p>

      {/* Demo Credentials Suggestion */}
      <div id="demo-badge" className="p-3 bg-slate-50 border border-slate-100 rounded-2xl mt-1 text-[10px] text-slate-500 flex gap-2.5 items-start">
        <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-1 font-sans text-left">
          <p className="font-bold text-slate-800 uppercase tracking-wider">Prototype Mode Active</p>
          <p className="leading-relaxed">You can create an account using the Sign Up form, or log in instantly as guest with any company email and password.</p>
        </div>
      </div>
    </div>
  );
}
