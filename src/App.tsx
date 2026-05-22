import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wifi, Battery, AlertTriangle, ShieldCheck, User } from 'lucide-react';
import { ScreenMode, Role } from './types';
import Header from './components/Header';
import SignUpForm from './components/SignUpForm';
import SignInForm from './components/SignInForm';
import PortalView from './components/PortalView';
import OtpVerification from './components/OtpVerification';
import ForgotPassword from './components/ForgotPassword';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenMode>('SIGN_UP');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userRole, setUserRole] = useState<Role>('customer');
  const [timeStr, setTimeStr] = useState<string>('12:00');
  const [alertBanner, setAlertBanner] = useState<{ text: string; type: 'success' | 'alert' } | null>(null);

  // Keep a clean status bar clock running
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const hrs = d.getHours().toString().padStart(2, '0');
      const mins = d.getMinutes().toString().padStart(2, '0');
      setTimeStr(`${hrs}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Set transient alerting feedback
  const triggerBanner = (text: string, type: 'success' | 'alert' = 'success') => {
    setAlertBanner({ text, type });
    setTimeout(() => {
      setAlertBanner(null);
    }, 4500);
  };

  const [pendingSignUpUser, setPendingSignUpUser] = useState<{
    fullName: string;
    email: string;
    phone: string;
    role: Role;
    password?: string;
  } | null>(null);

  // Sign up callback
  const handleSignUpSuccess = (fullName: string, email: string, phone: string, role: Role, password?: string) => {
    // Stage registration fields, then prompt user verification
    setPendingSignUpUser({ fullName, email, phone, role, password });
    triggerBanner('REGISTRATION INITIALIZED: Verification SMS/email OTP required.', 'success');
    setCurrentScreen('OTP_VERIFY');
  };

  // OTP activation callback
  const handleOtpVerificationSuccess = () => {
    if (!pendingSignUpUser) return;
    const { fullName, email, phone, role, password } = pendingSignUpUser;

    // 1. Persist user locally
    const storedUsersRaw = localStorage.getItem('heavygear_users');
    let users = [];
    if (storedUsersRaw) {
      try {
        users = JSON.parse(storedUsersRaw);
      } catch {
        users = [];
      }
    }
    // Commit verified account details
    users.push({ fullName, email, phone, role, password });
    localStorage.setItem('heavygear_users', JSON.stringify(users));

    // 2. Set current auth state variables
    setUserEmail(email);
    setUserRole(role);
    setPendingSignUpUser(null);

    // 3. Trigger alert and auto transition
    triggerBanner(`ACCOUNT ACTIVATED: Welcome ${fullName.split(' ')[0]} to HeavyGear!`, 'success');
    
    // Direct transition into live simulator portal dashboard
    setTimeout(() => {
      setCurrentScreen('PORTAL');
    }, 800);
  };

  // Reset completion callback
  const handleResetFinished = (email: string) => {
    setUserEmail(email);
    setCurrentScreen('SIGN_IN');
    triggerBanner('Security reset active. Please log in with your new credentials.', 'success');
  };

  // Sign in callback
  const handleSignInSuccess = (email: string, selectedRole: Role) => {
    // Check if user has an associated role in localStorage
    const storedUsersRaw = localStorage.getItem('heavygear_users');
    let matchingRole: Role = selectedRole;
    if (storedUsersRaw) {
      try {
        const users = JSON.parse(storedUsersRaw);
        const match = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
        if (match) {
          matchingRole = match.role;
        }
      } catch {
        // ignore
      }
    }

    setUserEmail(email);
    setUserRole(matchingRole);
    triggerBanner('SIMULATOR AUTHORIZATION APPROVED. Launching platform...', 'success');
    setCurrentScreen('PORTAL');
  };

  // Logout callback
  const handleLogout = () => {
    setUserEmail('');
    setCurrentScreen('SIGN_IN');
    triggerBanner('Secure session terminated successfully.', 'success');
  };

  return (
    <div
      id="app-root-viewport"
      className="min-h-screen w-full bg-slate-100 sm:bg-slate-200 flex items-center justify-center sm:p-4 md:p-8 select-none overflow-x-hidden"
    >
      {/* 
        High-Fidelity Rugged Smartphone Wrapper Container.
        Bigger and wider on desktops for superb spacing and luxurious readability,
        goes native 100% full-width and full-height on actual mobile viewports.
      */}
      <div
        id="phone-frame-container"
        className="w-full h-screen sm:h-[840px] md:h-[900px] sm:max-w-[440px] md:max-w-[480px] bg-white sm:rounded-[48px] sm:shadow-[0_0_0_10px_#1a1a1a,0_32px_64px_rgba(0,0,0,0.22)] overflow-hidden flex flex-col relative sm:border-[2px] sm:border-slate-400 industrial-grid"
      >
        {/* Phone Top Notch & Camera Simulator (Visible only on desktop scale for realism) */}
        <div id="phone-notch-bar" className="hidden sm:flex absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#1a1a1a] rounded-b-2xl z-50 items-center justify-center">
          <div className="w-8 h-1 bg-neutral-900 rounded-full mr-2" />
          <div className="w-1.5 h-1.5 bg-neutral-950 rounded-full border border-neutral-900" />
        </div>

        {/* Dynamic Simulated Status Bar */}
        <div
          id="phone-status-bar"
          className="hidden sm:flex w-full h-12 items-end justify-between px-8 pb-1.5 text-[10px] font-bold text-slate-800 shrink-0 z-40 select-none font-sans bg-transparent"
        >
          <span id="status-bar-time" className="font-extrabold tracking-tight">
            {timeStr}
          </span>
          <div className="flex items-center gap-1 text-slate-700">
            <span className="text-[8px] font-mono tracking-wider font-extrabold">LTE</span>
            <Wifi className="w-3 h-3" />
            <Battery className="w-3 h-3 fill-slate-700/15" />
          </div>
        </div>

        {/* Global Floating Transient Alert Banner */}
        <AnimatePresence mode="wait">
          {alertBanner && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              id="global-floating-alert-banner"
              className="absolute top-14 left-4 right-4 z-50 p-4 bg-white/95 backdrop-blur-sm border border-slate-200 shadow-xl rounded-2xl flex items-start gap-3"
            >
              {alertBanner.type === 'success' ? (
                <ShieldCheck className="w-5 h-5 text-[#4f46e5]" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-500" />
              )}
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider leading-normal">
                {alertBanner.text}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fixed Title Header Block */}
        {!(currentScreen === 'PORTAL' && userRole === 'customer') && (
          <Header currentScreen={currentScreen} onLogout={handleLogout} userEmail={userEmail} />
        )}

        {/* Primary Screen Area - Scrollable with simulated touch physics */}
        <div
          id="phone-interactive-screen-area"
          className={`flex-1 overflow-y-auto scroll-smooth ${
            currentScreen === 'PORTAL' && userRole === 'customer'
              ? 'p-0 overflow-y-hidden'
              : 'px-4 pt-6 pb-20'
          }`}
        >
          <AnimatePresence mode="wait">
            {currentScreen === 'SIGN_UP' && (
              <motion.div
                key="signup-panel"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.25 }}
                className="w-full h-full flex flex-col items-center"
              >
                <SignUpForm
                  onSignUpSuccess={handleSignUpSuccess}
                  onNavigateToSignIn={() => {
                    setCurrentScreen('SIGN_IN');
                    triggerBanner('Switching to credentials sign in...');
                  }}
                />
              </motion.div>
            )}

            {currentScreen === 'SIGN_IN' && (
              <motion.div
                key="signin-panel"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
                className="w-full h-full flex flex-col items-center"
              >
                <SignInForm
                  onSignInSuccess={handleSignInSuccess}
                  onNavigateToSignUp={() => {
                    setCurrentScreen('SIGN_UP');
                    triggerBanner('Returning to registration credentials form...');
                  }}
                  onNavigateToForgotPassword={() => {
                    setCurrentScreen('FORGOT_PASSWORD');
                    triggerBanner('Launching live password reset helper...');
                  }}
                  prefilledEmail={userEmail}
                />
              </motion.div>
            )}

            {currentScreen === 'OTP_VERIFY' && pendingSignUpUser && (
              <motion.div
                key="otp-panel"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full flex flex-col items-center"
              >
                <OtpVerification
                  fullName={pendingSignUpUser.fullName}
                  email={pendingSignUpUser.email}
                  phone={pendingSignUpUser.phone}
                  onVerificationSuccess={handleOtpVerificationSuccess}
                  onCancel={() => {
                    setCurrentScreen('SIGN_UP');
                    setPendingSignUpUser(null);
                    triggerBanner('Verification aborted. Returning to registration.');
                  }}
                />
              </motion.div>
            )}

            {currentScreen === 'FORGOT_PASSWORD' && (
              <motion.div
                key="forgot-password-panel"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full flex flex-col items-center"
              >
                <ForgotPassword
                  onResetFinished={handleResetFinished}
                  onCancel={() => {
                    setCurrentScreen('SIGN_IN');
                    triggerBanner('Returning to sign in page.');
                  }}
                />
              </motion.div>
            )}

            {currentScreen === 'PORTAL' && (
              <motion.div
                key="portal-panel"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="w-full h-full flex flex-col items-center"
              >
                <PortalView userEmail={userEmail} userRole={userRole} onLogout={handleLogout} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic Navigation Indicator Bar (Aesthetic iOS-style bottom line) */}
        <div
          id="phone-home-indicator-wrapper"
          className="hidden sm:flex absolute bottom-1 right-0 left-0 h-5 justify-center items-center pointer-events-none z-40 bg-white/75 backdrop-blur-xs select-none"
        >
          <div className="w-32 h-1 bg-neutral-900/60 rounded-full" />
        </div>
      </div>
    </div>
  );
}
