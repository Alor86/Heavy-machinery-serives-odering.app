import React, { useState } from 'react';
import { UserRound, Mail, Phone, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Role, ScreenMode } from '../types';
import RoleToggle from './RoleToggle';

interface SignUpFormProps {
  id?: string;
  onSignUpSuccess: (fullName: string, email: string, phone: string, role: Role, password?: string) => void;
  onNavigateToSignIn: () => void;
}

export default function SignUpForm({
  id = 'signup-form-container',
  onSignUpSuccess,
  onNavigateToSignIn,
}: SignUpFormProps) {
  const [role, setRole] = useState<Role>('customer');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Validation States
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    } else if (fullName.length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    if (!email.trim()) {
      newErrors.email = 'Work Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please provide a valid company email';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone Number is required';
    } else if (phone.length < 7) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!password) {
      newErrors.password = 'Secure Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const storedUsersRaw = localStorage.getItem('heavygear_users');
    let users = [];
    if (storedUsersRaw) {
      try {
        users = JSON.parse(storedUsersRaw);
      } catch {
        users = [];
      }
    }

    const emailExists = users.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (emailExists) {
      setTimeout(() => {
        setIsSubmitting(false);
        setErrors({ email: 'Account already exists! Taking you to standard credentials sign-in...' });
        
        // Auto navigate to sign-in page after a small delay
        setTimeout(() => {
          onNavigateToSignIn();
        }, 1600);
      }, 600);
      return;
    }

    // Simulate API registration delay
    setTimeout(() => {
      setIsSubmitting(false);
      onSignUpSuccess(fullName, email, phone, role, password);
    }, 900);
  };

  return (
    <div id={id} className="w-full max-w-[440px] flex flex-col gap-6 pb-4">
      {/* Hero Header Selection */}
      <div id="signup-hero" className="space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 font-sans">
          Create Account
        </h1>
        <p className="text-slate-500 text-xs leading-normal">
          Book water tankers, JCBs, and heavy machinery instantly in Telangana.
        </p>
      </div>

      {/* Role Switcher */}
      <div id="role-selector-wrapper" className="space-y-1">
        <RoleToggle activeRole={role} onChange={setRole} />
      </div>

      {/* Form Element */}
      <form onSubmit={handleSubmit} id="signup-form" className="flex flex-col gap-4">
        {/* Full Name */}
        <div id="field-fullname" className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans">
            Full Name
          </label>
          <div className="relative">
            <input
              type="text"
              id="input-fullname"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
              }}
              className={`w-full h-11 px-4 pr-12 bg-slate-50 border rounded-xl text-slate-800 font-medium placeholder:text-slate-300 transition-all outline-none text-xs focus:ring-1 focus:ring-indigo-500 ${
                errors.fullName ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-500'
              }`}
              placeholder="e.g. John Deering"
            />
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
              <UserRound className="w-4 h-4" />
            </div>
          </div>
          {errors.fullName && (
            <span id="err-fullname" className="text-[10px] text-rose-500 font-semibold pl-1">
              • {errors.fullName}
            </span>
          )}
        </div>

        {/* Work Email */}
        <div id="field-email" className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans">
            Work Email
          </label>
          <div className="relative">
            <input
              type="email"
              id="input-email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
              }}
              className={`w-full h-11 px-4 pr-12 bg-slate-50 border rounded-xl text-slate-800 font-medium placeholder:text-slate-300 transition-all outline-none text-xs focus:ring-1 focus:ring-indigo-500 ${
                errors.email ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-500'
              }`}
              placeholder="name@company.com"
            />
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          {errors.email && (
            <span id="err-email" className="text-[10px] text-rose-500 font-semibold pl-1">
              • {errors.email}
            </span>
          )}
        </div>

        {/* Phone Number */}
        <div id="field-phone" className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans">
            Phone Number
          </label>
          <div className="relative">
            <input
              type="tel"
              id="input-phone"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
              }}
              className={`w-full h-11 px-4 pr-12 bg-slate-50 border rounded-xl text-slate-800 font-medium placeholder:text-slate-300 transition-all outline-none text-xs focus:ring-1 focus:ring-indigo-500 ${
                errors.phone ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-500'
              }`}
              placeholder="+1 (555) 000-0000"
            />
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
              <Phone className="w-4 h-4" />
            </div>
          </div>
          {errors.phone && (
            <span id="err-phone" className="text-[10px] text-rose-500 font-semibold pl-1">
              • {errors.phone}
            </span>
          )}
        </div>

        {/* Secure Password */}
        <div id="field-password" className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans">
            Secure Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="input-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
              }}
              className={`w-full h-11 px-4 pr-12 bg-slate-50 border rounded-xl text-slate-800 font-medium placeholder:text-slate-300 transition-all outline-none text-xs focus:ring-1 focus:ring-indigo-500 ${
                errors.password ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-500'
              }`}
              placeholder="••••••••"
            />
            <button
              type="button"
              id="btn-toggle-password-visibility"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-indigo-500 transition-colors cursor-pointer outline-none"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <span id="err-password" className="text-[10px] text-rose-500 font-semibold pl-1">
              • {errors.password}
            </span>
          )}
        </div>

        {/* Action Button */}
        <button
          type="submit"
          id="btn-submit-signup"
          disabled={isSubmitting}
          className={`w-full h-12 bg-indigo-600 text-white font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 rounded-xl shadow-lg shadow-indigo-100 active:scale-95 transition-all text-xs duration-100 cursor-pointer mt-2 select-none outline-none ${
            isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:bg-indigo-700'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
              <span>Registering...</span>
            </div>
          ) : (
            <>
              <span>Sign Up</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Alternative Actions */}
        <div id="signup-footer" className="text-center py-1 select-none">
          <p className="text-xs text-slate-500 font-sans">
            Already have an account?{' '}
            <button
              type="button"
              id="btn-navigate-to-signin"
              onClick={onNavigateToSignIn}
              className="text-indigo-600 font-bold hover:underline cursor-pointer outline-none bg-transparent border-none p-0 inline-block focus:ring-0"
            >
              Sign In
            </button>
          </p>
        </div>
      </form>

      {/* Aesthetic Imagery Support (Bento Style matching user's HTML payload but polished with soft rounded corners) */}
      <div id="signup-bento-images" className="grid grid-cols-2 gap-3 mt-2 opacity-80">
        <div
          id="bento-image-gear"
          className="aspect-square bg-slate-50 rounded-2xl border border-slate-200/60 overflow-hidden group hover:scale-[1.01] transition-transform duration-300 relative"
        >
          <img
            referrerPolicy="no-referrer"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAt9st_IKiiOZI6bQPhyu1Dao0FBWzh-lYpMWKzYoEaccS0RfeaZZNKkC0pzMsB4jNt591V-_eD_K-hmUiDjDaJlaVU5iXgPXaC_7RBxknJaHf1Sd6AbIER-htx11VzpEqgCpW-2lFrjxK2UYzOtYSBUn6wKt25oyDcmDAcOQrUg2JqtrC-2YQB3Pb2rO0eykfpuIkZr4w41IuL8Ny_hUqL5kEck4Nrs9Wo9KkBpwlW22lSc9QhqNCEsS1BIjP4bNOjbnWlwBinp4Y"
            alt="Macro heavy industrial gear assembly"
            className="w-full h-full object-cover grayscale contrast-110 transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-2 left-2 bg-slate-900/90 text-[7px] text-white font-mono tracking-wider uppercase px-2 py-0.5 rounded-full border border-slate-800">
            GEAR-SEC
          </div>
        </div>

        <div
          id="bento-image-excavator"
          className="aspect-square bg-slate-50 rounded-2xl border border-slate-200/60 overflow-hidden group hover:scale-[1.01] transition-transform duration-300 relative"
        >
          <img
            referrerPolicy="no-referrer"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMV9YaGvoSSJDIVrryN228H8se5VQTuJt3hysvymwVt7erJVnlSOaH2H2l5whHaHvobLDBQtSwNZRjjEozjq_7ezE86NVcyodbaoKjzWV5hwZsMdtXzRDM2phqWSKj-kUQlY-rJ797P2qB7Xoiuhz5FTKVxs_gF4_q4SKo0aOfYOtuY5glDjXmG8EXwN64I7SGJcyhPmwp8P9n-xPiGcj-MzpI6HSzO1BKMG94gjTmSSIzVGdrmlDuj-Y37vzy7XVKjAa2H-yyTgY"
            alt="Safety orange excavator"
            className="w-full h-full object-cover grayscale contrast-110 transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-2 left-2 bg-slate-900/90 text-[7px] text-white font-mono tracking-wider uppercase px-2 py-0.5 rounded-full border border-slate-800">
            FLEET-PRM
          </div>
        </div>
      </div>
    </div>
  );
}
