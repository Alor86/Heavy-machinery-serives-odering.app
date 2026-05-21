import { motion } from 'motion/react';
import { Role } from '../types';

interface RoleToggleProps {
  id?: string;
  activeRole: Role;
  onChange: (role: Role) => void;
}

export default function RoleToggle({ id = 'role-toggle', activeRole, onChange }: RoleToggleProps) {
  return (
    <div
      id={id}
      className="p-1 rounded-2xl flex relative overflow-hidden bg-slate-100 border border-slate-200/60 w-full"
    >
      {/* Sliding Selector Background Accent */}
      <motion.div
        id="role-slide-indicator"
        className="absolute top-1 bottom-1 bg-white rounded-xl shadow-md border border-slate-200/50"
        animate={{
          left: activeRole === 'customer' ? '4px' : '50%',
          width: 'calc(50% - 6px)',
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
      />

      <button
        type="button"
        id="btn-role-customer"
        onClick={() => onChange('customer')}
        className={`relative z-10 flex-1 py-3 text-center text-xs font-bold tracking-wider uppercase transition-colors duration-200 select-none cursor-pointer outline-none ${
          activeRole === 'customer' ? 'text-indigo-600 font-extrabold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        CUSTOMER
      </button>

      <button
        type="button"
        id="btn-role-provider"
        onClick={() => onChange('provider')}
        className={`relative z-10 flex-1 py-3 text-center text-xs font-bold tracking-wider uppercase transition-colors duration-200 select-none cursor-pointer outline-none ${
          activeRole === 'provider' ? 'text-indigo-600 font-extrabold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        PROVIDER
      </button>
    </div>
  );
}
