import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wifi, Battery, AlertTriangle, ShieldCheck, User, Smartphone, Monitor, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
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

  const [scale, setScale] = useState<number>(1);
  const [isAutoFit, setIsAutoFit] = useState<boolean>(true);
  const [useDeviceFrame, setUseDeviceFrame] = useState<boolean>(true);

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

  // Hook to calculate auto-fit scale based on viewport height, avoiding page scrollbars
  useEffect(() => {
    if (!useDeviceFrame) {
      setScale(1);
      return;
    }
    if (!isAutoFit) return;

    const handleResize = () => {
      // The simulator target height with spacing and paddings is around 910px
      const targetHeight = 910; 
      const availableHeight = window.innerHeight - 80; // reserve around 80px space for the upper presentation bar and margins
      
      if (availableHeight < targetHeight) {
        const computed = Math.max(0.55, Math.min(1.0, availableHeight / targetHeight));
        setScale(Math.round(computed * 100) / 100);
      } else {
        setScale(1.0);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isAutoFit, useDeviceFrame]);

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
      className="h-screen w-screen bg-slate-900 flex flex-col items-center justify-start select-none overflow-hidden font-sans relative"
    >
      {/* 
        Ultra-refined, Low-Key Design Review Header.
        Formulated as a high-fidelity sandbox inspector panel with supreme typography and clear structure.
      */}
      <div 
        id="presentation-control-bar"
        className="hidden sm:flex w-full h-14 bg-slate-900 border-b border-slate-800/60 px-6 items-center justify-between z-50 shrink-0 text-white select-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-[#ff8c00] flex items-center justify-center text-white shadow-sm shadow-[#ff8c00]/10">
            <span className="font-sans text-[10px] font-black tracking-tighter">HG</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold tracking-tight text-slate-250 uppercase">HeavyGear Simulator Sandbox</span>
              <span className="px-1.5 py-0.5 rounded-sm bg-indigo-500/10 text-[8px] font-bold text-indigo-400 border border-indigo-500/20 uppercase tracking-widest leading-none">
                Interactive Review
              </span>
            </div>
          </div>
        </div>

        {/* Presentation Controls Segment Selector */}
        <div className="flex items-center gap-5">
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-850">
            <button
              onClick={() => {
                setUseDeviceFrame(true);
                triggerBanner('Smartphone simulator layout active.', 'success');
              }}
              className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all flex items-center gap-2 cursor-pointer ${
                useDeviceFrame 
                  ? 'bg-slate-850 text-[#ff8c00] font-bold shadow-xs' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Simulated Phone</span>
            </button>
            <button
              onClick={() => {
                setUseDeviceFrame(false);
                triggerBanner('Edge-to-edge desktop web portal active.', 'success');
              }}
              className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all flex items-center gap-2 cursor-pointer ${
                !useDeviceFrame 
                  ? 'bg-slate-850 text-[#ff8c00] font-bold shadow-xs' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Web Interface</span>
            </button>
          </div>

          {/* Scale Control (Shown in smartphone frame mode only) */}
          {useDeviceFrame && (
            <div className="flex items-center gap-3 border-l border-slate-800 pl-4">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setIsAutoFit(false);
                    setScale(prev => Math.max(0.55, Math.min(1.2, parseFloat((prev - 0.05).toFixed(2)))));
                  }}
                  disabled={scale <= 0.55}
                  className="w-6 h-6 rounded bg-slate-950 border border-slate-800/80 flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-25 transition-all cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3 h-3" />
                </button>
                
                <div className="text-center min-w-[44px]">
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    {Math.round(scale * 100)}%
                  </span>
                </div>

                <button
                  onClick={() => {
                    setIsAutoFit(false);
                    setScale(prev => Math.max(0.55, Math.min(1.2, parseFloat((prev + 0.05).toFixed(2)))));
                  }}
                  disabled={scale >= 1.2}
                  className="w-6 h-6 rounded bg-slate-950 border border-slate-800/80 flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-25 transition-all cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3 h-3" />
                </button>
              </div>

              {/* Automatic Responsive Height Fit */}
              <button
                onClick={() => {
                  setIsAutoFit(!isAutoFit);
                  triggerBanner(isAutoFit ? 'Manual scale mode active.' : 'Fitting screen size dynamically.', 'success');
                }}
                className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all border flex items-center gap-1 cursor-pointer ${
                  isAutoFit 
                    ? 'bg-[#ff8c00]/10 text-[#ff8c00] border-[#ff8c00]/20' 
                    : 'bg-slate-950 text-slate-500 border-slate-850 hover:text-slate-350'
                }`}
              >
                <Maximize2 className="w-3 h-3" />
                <span>Auto-Fit</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Container Workspace */}
      <div className="flex-1 w-full flex items-center justify-center p-0 overflow-hidden relative bg-slate-900 sm:bg-slate-950">
        
        {/* Decorative Grid Mesh Overlay behind the mockup */}
        <div className="hidden sm:block absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px]" />
        
        {/* Glow Effects for visual aesthetics */}
        {useDeviceFrame && (
          <div className="hidden sm:block absolute w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none -top-40 -left-40 animate-pulse" />
        )}
        {useDeviceFrame && (
          <div className="hidden sm:block absolute w-[350px] h-[350px] rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none -bottom-40 -right-40" />
        )}

        <div
          id="presentation-zoom-container"
          className="flex items-center justify-center transition-transform duration-200 ease-out"
          style={useDeviceFrame ? {
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
          } : undefined}
        >
          {/* Main Simulated Phone Frame */}
          <div
            id="phone-frame-container"
            className={useDeviceFrame ? (
              "w-[440px] h-[890px] bg-white rounded-[48px] shadow-[0_0_0_12px_#141414,0_0_0_14px_#334155,0_32px_64px_rgba(0,0,0,0.55)] overflow-hidden flex flex-col relative border-[2px] border-slate-700/50 shrink-0"
            ) : (
              "w-full h-full bg-slate-50 flex flex-col relative overflow-hidden shrink-0 animate-fadeIn"
            )}
          >
            {/* Phone Top Notch & Camera Simulator (Visible only in desktop scale frame view) */}
            {useDeviceFrame && (
              <div id="phone-notch-bar" className="hidden sm:flex absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#141414] rounded-b-2xl z-50 items-center justify-center">
                <div className="w-8 h-1 bg-neutral-900 rounded-full mr-2" />
                <div className="w-1.5 h-1.5 bg-neutral-950 rounded-full border border-neutral-900" />
              </div>
            )}

            {/* Dynamic Simulated Status Bar */}
            {useDeviceFrame && (
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
            )}

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
                    <PortalView userEmail={userEmail} userRole={userRole} onLogout={handleLogout} isFullWebView={!useDeviceFrame} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dynamic Navigation Indicator Bar (Aesthetic iOS-style bottom line) */}
            {useDeviceFrame && (
              <div
                id="phone-home-indicator-wrapper"
                className="hidden sm:flex absolute bottom-1 right-0 left-0 h-5 justify-center items-center pointer-events-none z-40 bg-white/75 backdrop-blur-xs select-none"
              >
                <div className="w-32 h-1 bg-neutral-900/60 rounded-full" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
