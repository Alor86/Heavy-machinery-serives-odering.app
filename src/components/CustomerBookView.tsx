import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  History,
  Clock,
  Sparkles,
  CheckCircle,
  Truck,
  Layers,
  MapPin,
  Calendar,
  IndianRupee,
  ChevronRight,
  ShieldCheck,
  Gift,
  X,
  Compass,
  AlertTriangle,
  Info,
  Search,
  SlidersHorizontal,
  Plus,
  ArrowRight,
  ChevronLeft,
  CalendarDays,
  FileSpreadsheet,
  Activity,
  ArrowBigUp,
  RotateCcw,
  RefreshCw,
  Printer,
  CreditCard,
  Edit2,
  Trash2,
  Heart,
  HelpCircle,
  PhoneCall,
  Bell,
  Lock,
  ExternalLink,
  Check,
  Award,
  Shield,
  LogOut,
  Star,
  Database,
  Cloud
} from 'lucide-react';

interface CustomerBookViewProps {
  id?: string;
  userEmail: string;
  onLogout: () => void;
}

interface MachineryItem {
  id: string;
  name: string;
  image: string;
  rate: number;
  horsepower: string;
  weight: string;
  capacity: string;
  description: string;
}

interface BookingRecord {
  bookingId: string;
  machineryName: string;
  machineryImage: string;
  date: string;
  location: string;
  rate: number;
  status: 'PENDING' | 'DISPATCHED' | 'COMPLETED' | 'CANCELLED';
  orderPrice: number;
}

// 11 Heavy Machinery items matching the user's uploaded portfolio
const BOOKABLE_MACHINERY: MachineryItem[] = [
  {
    id: 'MACH-01',
    name: 'Water Tanker',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUZRw0DaS0YpGWkhBwT9xxnts8OyKRaxFAHpzz479OWykfJCAIwzzu3z3djhdee5TaU4B_5ngs9mS3jR7ZsFloZ9mRHpCXqksBX2_XVs8DG2f_16RjKcMUThKeErGfsNzM0D4ArzHs6T-c2HKPKOw6_jYdBQYt24wwNWrWukd_fRz9fAoLCxCiCf4dScfC3CSGZLpECk8OnrVDsoJlaI2eKOXauf52k5cpNMaswdAwD4ifw4OHUrbA9uPO67mHi8T16VtNU8r6lfU',
    rate: 140,
    horsepower: '420 HP',
    weight: '26,000 lbs',
    capacity: '5,000 Gallons',
    description: 'Designed for high-capacity liquid transportation, quarry dust control, and heavy site hydration operations.'
  },
  {
    id: 'MACH-02',
    name: 'JCB',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIt0g7zhctt80bMygOEqVO4IsJNdSn9tlfivkEhZdqUw-hI_h2sojrlTxLlzn7a9MxvwOECBJLhw9Xf4LyeMprK05Y2jnpeOoQRErWnPH3ADZtxL2xoMqzAuF1ZhMj43gtNGoHzaS3tUGIAueD8JIqDzCnStVEzcZcUdDt3WwDVLKQq5copM2cTVJBd-eKfJZfEDtzMQFBcb6DhCeA32ETzyOlH1IkqP17X4lUVjeI8wiE3o3gQK4nX5L7-DW-l938NS3ubuXlx-g',
    rate: 110,
    horsepower: '109 HP',
    weight: '18,400 lbs',
    capacity: '1.3 cu yd Bucket',
    description: 'Versatile backhoe loader ready for utility excavations, minor trenching, and complex terrain logistics.'
  },
  {
    id: 'MACH-03',
    name: 'Goods Carrier',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQEYq_wULiK54DFym_DL8qns6E6GHGn1J9iBnlkbz15c5BcVT-VG8TRk6msXsnWouyLx7_O0cyibhtQdipzxUSP1PSi6VEozQHkKhfC4Qw1QDmAdi7ouB4croO8uVjz17NWKaDdCJf_xs_pPewBZUm3fUbz0txM8Eio6kGaAzXeB3rHFvqZ1CYetoINSWEERCsMic8HSieeB0OVAklFFBvwrX3xlNmPuxJnykrA5wl6Fy-nEPFpzlbAdNNlryOcEP4tpIkTnz7f7Y',
    rate: 165,
    horsepower: '450 HP',
    weight: '32,000 lbs',
    capacity: '20-Ton Payload',
    description: 'Industrial flatbed goods carrier vehicle engineered for high-weight logistical structures and metal shipments.'
  },
  {
    id: 'MACH-04',
    name: 'Tipper',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7mgfNENADa0YDVs_Uvx8ADdTbqn2f-dwx27jkJzOYkWN_JkdogjviHHXslYZyPuZoqQrfWAZD1x_SJC1XZHNHLALEVle9xKQ0fiwrGW8IUEqbBgR2vN2gmi0f9oiNnHbRBWU2mN5BmkXum0lKqNr0vNW-uPHcV6odbtIqXQQJzg2gXp274vKqt4X53P3HPpXnULfl2Es5Xztw4DYKTPZ-Rylw2XF0hvrJktWwtb8XMeQ3dLHzXtsmfLx6gLpZb3t2JZ_Om86_iV4',
    rate: 150,
    horsepower: '400 HP',
    weight: '28,000 lbs',
    capacity: '16 cu yd Bed',
    description: 'High-traction dumper with powerful structural hydraulics for rapid aggregate unloading and rubble relocation.'
  },
  {
    id: 'MACH-05',
    name: 'Tractor',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_9S3c8CRmBP0sVtithQGTyeQoBQCrWDwX1qL3nDwz_HMH9-hXE-EZEHrMPdml5mZMMW8Bh-Na2Ocl3R0zTA5tUSkuNO0czRJlWajAT8AjJFJAAiRA7TNe5Ja50htoGYZXC4OGhGmRMve4CVPO7R2Kn135JACjvp2pnfRVYDmZeLfzcjF4RB1idiniykI0jk0Qm_pmQHtkyRz88seNh_81Nlxew5raLYdYmpWhFo57nMI9TpSw0K7YsPPa-NXbxObGd1hdWaOPW40',
    rate: 95,
    horsepower: '145 HP',
    weight: '12,500 lbs',
    capacity: '6.5-Ton Pull Force',
    description: 'Industrial utility tractor built with wide lug tires to pull active payloads and negotiate deep mud.'
  },
  {
    id: 'MACH-06',
    name: 'Tractor with Trolly',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMvAYV1RAHqYSo8rY2yxriFm7z1ofQeD830zsiz8ac9UJKQmMy5i0CF5Yb0uzqKjGSROk2Vdc1rqm4dWRF65D1YJbmZPyir9T62HCDZke9C7WsXlyL3ZBWtPTCmV3gupPkWxtb9gRjX8L1Zr-yan8KqJ1TGYD8P8fxT3kYgsqsJcRIjFH-QWVygva3c1CEjP-7It9yWwbAtqqgEIDLd_SLN-CAEBWCO_Lr8yCVnjwI312MW75QM6jEm-7o4lAWHPKfPXveEX69uFk',
    rate: 120,
    horsepower: '145 HP',
    weight: '16,800 lbs',
    capacity: '12-Ton Bed Capacity',
    description: 'Heavy utility tractor matched built-in to a robust dual-axle trolley for transport across loose gravel flats.'
  },
  {
    id: 'MACH-07',
    name: 'Road Roller',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5tqVUkyJ5Tx0cDnkZR08OmAvUyBFzhd4Vs3XW97Wzp_J-gmz4wiFP6V5wcgZthd89e5Q6sJ0x33NxEfjjYcX6NW_MG6nSv7PmUuSueoiRxQT-iM6pl6v8zqFIesxQlo0VTG_x2_qk9vgrpUfzNi-324XdTfEy7R557hxjEkT3EkBSxN4s897kejNND64zS3_owfHbzRkGsV7vy_FywA2c6qsRIBhFiPlwYIhsvMdNRXI0tjinz8cxoaDBvmT7p62j4nwtO0ioqxo',
    rate: 130,
    horsepower: '120 HP',
    weight: '24,000 lbs',
    capacity: 'Static Drum Width 84 in',
    description: 'Vibratory road roller machinery optimized for asphalt compaction and structural soil base stabilization.'
  },
  {
    id: 'MACH-08',
    name: 'Crane',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUvfaRAPleL4l05tKQgmt0Y-WO0HzFePxidxUBQk22vjSAkRS0pZpdYx86Ril6Isr4ZAAV1fiInsGOJaeB8Eop6lltONdfUsr1gu644az8esD6NHL1gWoWfGyQ93BWa7a5u3H2q0knUv-MsL9TJqSrleuMGXdl0Veg2pED9TkeQe2XZfL4qEZ4dISmDkyfFr6or1L3GS0sqY37ZSBcT5CjgBncX9TQR0sfNTOtaMJPo6Bg87f2wxOMT671NR5yYmyCelMa4DGONow',
    rate: 220,
    horsepower: '380 HP',
    weight: '44,000 lbs',
    capacity: '50-Ton Max Lift Limit',
    description: 'Mobile hydraulic crane with telescoping lattice boom, designed for heavy rigging and rapid elevation work.'
  },
  {
    id: 'MACH-09',
    name: 'Lorry for Rocks',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCw3FyGgK0CwlNTNNNHhzVfacMuuxaSUm2HAlIxXskc9OEsUzsULMr_k4pJOp6t6aMhbtfDWU_A8VaJ-rpI7WCs-heyc9m3PENly7lwREVARMFt6Apo7DFgD1EJGJEsdxAP5q_3nWRBgUK4MI0GbICPKaWmDDRz3VQpBJAS0FW53Y2aBw-r8YdlwdZXuB4CLMscN8P1zmqzmk_lNOHBgEKKpC3c_I1kctEqhPEgqGnrly2ALr4LJjY7lH-rPEKDhSeTmVJGXfhvrzo',
    rate: 170,
    horsepower: '480 HP',
    weight: '34,000 lbs',
    capacity: '24-Ton Structural Bed',
    description: 'Reinforced heavy quarry excavator dumper engineered with high sideguards to load and transport rugged stones.'
  },
  {
    id: 'MACH-10',
    name: 'Concrete Mixer',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWYxp7GEd0q7Tv3g3ekUe4uM4q9F1CRF7fNUXLPpCES_pBPmcuOQbOER42yZb2Sp3CeMT7CIkCldQiEFHZQ7WqnxoFqMjMZUNovU3Dr58WaIPwXLxKyvjQJZcpFyjuXNdsdKRJBy942NDpClzP2p7mvtdCng6IZniJNlc-brlWqkMn3llim-IYF6GQrQILHapIn4oqD-x-_R7tX2oPe07h-onOXvv_KM8aB3rra8TII6R5ZSEXFCMY5qcJN2h_UjHw5adDrh11Uqw',
    rate: 155,
    horsepower: '350 HP',
    weight: '29,500 lbs',
    capacity: '10 cu yd Drum Volume',
    description: 'Transit cement mixer with variable-speed rotating drum, stabilizing active concrete mixes to site locations.'
  },
  {
    id: 'MACH-11',
    name: 'Excavator',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgR13SbsouIUiMfBKFdMk-ErPjuDMq9Q6w4WnZyU28BxZofjVM6BRoJLNWLiCK9tcRy8KWVQM0o_7UCZbds7-FjjF1uLssGs0qOZ9YalognSa6mZG6UOt7HSZKVI6Uxw10uuCc5_wFGIHtiL3hnB7L8DTEYIPq_4bBDqKuTM1UKEfNec7SzX1alcodTTFdMFsCgIp0j6WwCu1Sv3g6tLwQa9Si2Mf3O01pUWNK5gMbgwD3cXLaIjgZzgCESmMPse4sbtDmu5TmPaY',
    rate: 180,
    horsepower: '290 HP',
    weight: '49,000 lbs',
    capacity: '2.4 cu yd Heavy Bucket',
    description: 'Heavy crawler excavator built for massive mining trenching support and highly complex quarry excavation.'
  }
];

// Initial history matching the design reference details
const INITIAL_HISTORY: BookingRecord[] = [
  {
    bookingId: 'HG-9921-X3',
    machineryName: 'JCB 3DX Super',
    machineryImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIt0g7zhctt80bMygOEqVO4IsJNdSn9tlfivkEhZdqUw-hI_h2sojrlTxLlzn7a9MxvwOECBJLhw9Xf4LyeMprK05Y2jnpeOoQRErWnPH3ADZtxL2xoMqzAuF1ZhMj43gtNGoHzaS3tUGIAueD8JIqDzCnStVEzcZcUdDt3WwDVLKQq5copM2cTVJBd-eKfJZfEDtzMQFBcb6DhCeA32ETzyOlH1IkqP17X4lUVjeI8wiE3o3gQK4nX5L7-DW-l938NS3ubuXlx-g',
    date: 'Oct 24, 2023 • 10:30 AM',
    location: 'Sector 4 Quarry',
    rate: 110,
    status: 'COMPLETED',
    orderPrice: 1240.00
  },
  {
    bookingId: 'HG-8842-T5',
    machineryName: 'Water Tanker 5000L',
    machineryImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUZRw0DaS0YpGWkhBwT9xxnts8OyKRaxFAHpzz479OWykfJCAIwzzu3z3djhdee5TaU4B_5ngs9mS3jR7ZsFloZ9mRHpCXqksBX2_XVs8DG2f_16RjKcMUThKeErGfsNzM0D4ArzHs6T-c2HKPKOw6_jYdBQYt24wwNWrWukd_fRz9fAoLCxCiCf4dScfC3CSGZLpECk8OnrVDsoJlaI2eKOXauf52k5cpNMaswdAwD4ifw4OHUrbA9uPO67mHi8T16VtNU8r6lfU',
    date: 'Oct 26, 2023 • 08:15 AM',
    location: 'Grid-9B Outer Ring',
    rate: 140,
    status: 'DISPATCHED',
    orderPrice: 850.00
  },
  {
    bookingId: 'HG-7712-C8',
    machineryName: 'Rough Terrain Crane',
    machineryImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUvfaRAPleL4l05tKQgmt0Y-WO0HzFePxidxUBQk22vjSAkRS0pZpdYx86Ril6Isr4ZAAV1fiInsGOJaeB8Eop6lltONdfUsr1gu644az8esD6NHL1gWoWfGyQ93BWa7a5u3H2q0knUv-MsL9TJqSrleuMGXdl0Veg2pED9TkeQe2XZfL4qEZ4dISmDkyfFr6or1L3GS0sqY37ZSBcT5CjgBncX9TQR0sfNTOtaMJPo6Bg87f2wxOMT671NR5yYmyCelMa4DGONow',
    date: 'Oct 22, 2023 • 02:45 PM',
    location: 'Sector 8 Rigging Coordinate',
    rate: 220,
    status: 'COMPLETED',
    orderPrice: 4100.00
  },
  {
    bookingId: 'HG-6650-M1',
    machineryName: 'Concrete Mixer Truck',
    machineryImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWYxp7GEd0q7Tv3g3ekUe4uM4q9F1CRF7fNUXLPpCES_pBPmcuOQbOER42yZb2Sp3CeMT7CIkCldQiEFHZQ7WqnxoFqMjMZUNovU3Dr58WaIPwXLxKyvjQJZcpFyjuXNdsdKRJBy942NDpClzP2p7mvtdCng6IZniJNlc-brlWqkMn3llim-IYF6GQrQILHapIn4oqD-x-_R7tX2oPe07h-onOXvv_KM8aB3rra8TII6R5ZSEXFCMY5qcJN2h_UjHw5adDrh11Uqw',
    date: 'Oct 20, 2023 • 11:00 AM',
    location: 'Bridge Staging East',
    rate: 155,
    status: 'CANCELLED',
    orderPrice: 0.00
  }
];

export default function CustomerBookView({ id = 'customer-book-view', userEmail, onLogout }: CustomerBookViewProps) {
  // Saved states
  const [ordersCount, setOrdersCount] = useState<number>(() => {
    const saved = localStorage.getItem('hg_orders_count');
    return saved ? parseInt(saved, 10) : 3;
  });

  const [freeCoupons, setFreeCoupons] = useState<number>(() => {
    const saved = localStorage.getItem('hg_free_coupons');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [bookings, setBookings] = useState<BookingRecord[]>(() => {
    const saved = localStorage.getItem('hg_bookings_history_new');
    return saved ? JSON.parse(saved) : INITIAL_HISTORY;
  });

  // Screen Toggles
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showProfile, setShowProfile] = useState<boolean>(false);

  // Profile Editable States with Local Storage persistence (bound to the active authenticated user)
  const [profileName, setProfileName] = useState<string>(() => {
    const customKey = userEmail ? `hg_profile_name_${userEmail.toLowerCase()}` : '';
    const cached = customKey ? localStorage.getItem(customKey) : null;
    if (cached) return cached;

    if (userEmail) {
      const storedUsersRaw = localStorage.getItem('heavygear_users');
      if (storedUsersRaw) {
        try {
          const users = JSON.parse(storedUsersRaw);
          const match = users.find((u: any) => u.email.toLowerCase() === userEmail.toLowerCase());
          if (match && match.fullName) {
            return match.fullName;
          }
        } catch {
          // ignore
        }
      }
      const parts = userEmail.split('@')[0];
      return parts.charAt(0).toUpperCase() + parts.slice(1);
    }
    return localStorage.getItem('hg_profile_name') || 'Rajesh Kumar';
  });

  const [profileCompany, setProfileCompany] = useState<string>(() => {
    const customKey = userEmail ? `hg_profile_company_${userEmail.toLowerCase()}` : '';
    const cached = customKey ? localStorage.getItem(customKey) : null;
    if (cached) return cached;
    return localStorage.getItem('hg_profile_company') || 'Titan Logistics & Construction Co.';
  });

  const [profileRole, setProfileRole] = useState<string>(() => {
    const customKey = userEmail ? `hg_profile_role_${userEmail.toLowerCase()}` : '';
    const cached = customKey ? localStorage.getItem(customKey) : null;
    if (cached) return cached;
    return localStorage.getItem('hg_profile_role') || 'Senior Operator';
  });

  const [profileId, setProfileId] = useState<string>(() => {
    const customKey = userEmail ? `hg_profile_id_${userEmail.toLowerCase()}` : '';
    const cached = customKey ? localStorage.getItem(customKey) : null;
    if (cached) return cached;

    if (userEmail) {
      let hash = 0;
      for (let i = 0; i < userEmail.length; i++) {
        hash = (hash << 5) - hash + userEmail.charCodeAt(i);
        hash |= 0;
      }
      return `HG-${Math.abs(hash % 9000) + 1000}`;
    }
    return localStorage.getItem('hg_profile_id') || 'HG-8821';
  });

  const [profileImg, setProfileImg] = useState<string>(() => {
    const customKey = userEmail ? `hg_profile_img_${userEmail.toLowerCase()}` : '';
    const cached = customKey ? localStorage.getItem(customKey) : null;
    if (cached) return cached;
    return localStorage.getItem('hg_profile_img') || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAE9ohZJY6J6oVp6Zg3_5eeWE-tkxIHKgp86DB2cKZvKcL0gHOKVnI6Ge-HuQWQTVfa6RKEzELRicOEzWQdGM76gNSBUP65Y53da9Y5cZJz_kgIpjPQNcuCKdvzm1JY5x_1gV8Iah9KL8nq8YtSCsHKgXyY-cyk6hbRgmIfhcs4mUl4SOMf5m1qFGoN-0BvZLgaL9Gd3tu5pyu_sDPy6Bc0smTeni6d5sKQGsBx3i4_4g5BLp671T9lmmOkzQp4DBQHZjKRi5KxOGw';
  });

  // Credit Card States
  interface PaymentCard {
    id: string;
    holder: string;
    num: string;
    exp: string;
    isCorporate: boolean;
  }
  const [paymentCards, setPaymentCards] = useState<PaymentCard[]>(() => {
    const saved = localStorage.getItem(`hg_payment_cards_${userEmail ? userEmail.toLowerCase() : 'default'}`);
    if (saved) return JSON.parse(saved);
    
    // Dynamic fallback matching active profileName
    const initialHolderName = (userEmail ? userEmail.split('@')[0] : 'Rajesh Kumar').toUpperCase();
    return [
      { id: 'card-1', holder: initialHolderName, num: '•••• •••• •••• 5590', exp: '12/26', isCorporate: true }
    ];
  });

  // Saved / Starred machinery items state
  const [starredMachineryIds, setStarredMachineryIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('hg_starred_machinery_ids');
    return saved ? JSON.parse(saved) : ['MACH-11', 'MACH-02']; // Default starred ids (JCB & Excavator)
  });

  const toggleStarMachinery = (itemId: string) => {
    let next;
    if (starredMachineryIds.includes(itemId)) {
      next = starredMachineryIds.filter(id => id !== itemId);
    } else {
      next = [...starredMachineryIds, itemId];
    }
    setStarredMachineryIds(next);
    localStorage.setItem('hg_starred_machinery_ids', JSON.stringify(next));
  };

  // Add Card State
  const [showAddCard, setShowAddCard] = useState<boolean>(false);
  const [newCardNum, setNewCardNum] = useState<string>('');
  const [newCardHolder, setNewCardHolder] = useState<string>('');
  const [newCardExp, setNewCardExp] = useState<string>('');
  const [newCardCorp, setNewCardCorp] = useState<boolean>(false);

  // Edit Profile Dialog States
  const [showEditProfile, setShowEditProfile] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>(profileName);
  const [editCompany, setEditCompany] = useState<string>(profileCompany);
  const [editRole, setEditRole] = useState<string>(profileRole);
  const [editImg, setEditImg] = useState<string>(profileImg);

  // Notification Settings Form
  const [showNotificationsModal, setShowNotificationsModal] = useState<boolean>(false);
  const [notifEmail, setNotifEmail] = useState<boolean>(true);
  const [notifPush, setNotifPush] = useState<boolean>(true);
  const [notifSMS, setNotifSMS] = useState<boolean>(false);
  const [notifMaintenance, setNotifMaintenance] = useState<boolean>(true);

  // Privacy & Security settings
  const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(false);
  const [hasPasscode, setHasPasscode] = useState<boolean>(true);

  // Cloud Sandboxing Integrations
  const [showIntegrationModal, setShowIntegrationModal] = useState<boolean>(false);
  const [googleMapsKey, setGoogleMapsKey] = useState<string>(() => {
    const key = userEmail ? `hg_gmaps_key_${userEmail.toLowerCase()}` : 'hg_gmaps_key';
    return localStorage.getItem(key) || (((import.meta as any).env || {}).VITE_GOOGLE_MAPS_API_KEY as string) || '';
  });
  const [firebaseApiKey, setFirebaseApiKey] = useState<string>(() => {
    const key = userEmail ? `hg_fb_api_key_${userEmail.toLowerCase()}` : 'hg_fb_api_key';
    return localStorage.getItem(key) || (((import.meta as any).env || {}).VITE_FIREBASE_API_KEY as string) || '';
  });
  const [firebaseProjectId, setFirebaseProjectId] = useState<string>(() => {
    const key = userEmail ? `hg_fb_project_id_${userEmail.toLowerCase()}` : 'hg_fb_project_id';
    return localStorage.getItem(key) || (((import.meta as any).env || {}).VITE_FIREBASE_PROJECT_ID as string) || '';
  });
  const [firebaseAuthDomain, setFirebaseAuthDomain] = useState<string>(() => {
    const key = userEmail ? `hg_fb_auth_domain_${userEmail.toLowerCase()}` : 'hg_fb_auth_domain';
    return localStorage.getItem(key) || (((import.meta as any).env || {}).VITE_FIREBASE_AUTH_DOMAIN as string) || '';
  });
  const [firebaseStorageBucket, setFirebaseStorageBucket] = useState<string>(() => {
    const key = userEmail ? `hg_fb_storage_bucket_${userEmail.toLowerCase()}` : 'hg_fb_storage_bucket';
    return localStorage.getItem(key) || (((import.meta as any).env || {}).VITE_FIREBASE_STORAGE_BUCKET as string) || '';
  });
  const [firebaseSenderId, setFirebaseSenderId] = useState<string>(() => {
    const key = userEmail ? `hg_fb_sender_id_${userEmail.toLowerCase()}` : 'hg_fb_sender_id';
    return localStorage.getItem(key) || (((import.meta as any).env || {}).VITE_FIREBASE_MESSAGING_SENDER_ID as string) || '';
  });
  const [firebaseAppId, setFirebaseAppId] = useState<string>(() => {
    const key = userEmail ? `hg_fb_app_id_${userEmail.toLowerCase()}` : 'hg_fb_app_id';
    return localStorage.getItem(key) || (((import.meta as any).env || {}).VITE_FIREBASE_APP_ID as string) || '';
  });

  // Sync booking record to client configured Firebase Firestore database
  const syncBookingToFirebase = async (record: BookingRecord) => {
    const apiKeyVal = firebaseApiKey || (((import.meta as any).env || {}).VITE_FIREBASE_API_KEY as string) || '';
    const projectIdVal = firebaseProjectId || (((import.meta as any).env || {}).VITE_FIREBASE_PROJECT_ID as string) || '';
    
    if (!apiKeyVal || !projectIdVal) {
      console.log('Firebase sync bypassed: No custom API credentials active for user profile.');
      return;
    }

    try {
      const { initializeApp, getApps } = await import('firebase/app');
      const { getFirestore, collection, addDoc } = await import('firebase/firestore');

      const config = {
        apiKey: apiKeyVal,
        authDomain: firebaseAuthDomain || `${projectIdVal}.firebaseapp.com`,
        projectId: projectIdVal,
        storageBucket: firebaseStorageBucket || `${projectIdVal}.appspot.com`,
        messagingSenderId: firebaseSenderId || '38294029482',
        appId: firebaseAppId || '1:38294029482:web:9f2'
      };

      const apps = getApps();
      const app = apps.length > 0 ? apps[0] : initializeApp(config);
      const db = getFirestore(app);

      await addDoc(collection(db, 'hg_bookings_history'), {
        bookingId: record.bookingId,
        machineryName: record.machineryName,
        date: record.date,
        location: record.location,
        rate: record.rate,
        status: record.status,
        orderPrice: record.orderPrice,
        userEmail: userEmail || 'anonymous_user',
        synchronizedAt: new Date().toISOString()
      });

      console.log(`[Firebase Live Sync] Added booking record ${record.bookingId} to Firestore successfully!`);
      triggerNotification('FIRESTORE SYNC: Booking successfully pushed to Cloud collection.');
    } catch (err: any) {
      console.warn('[Firebase Live Sync Error]: Could not sync database:', err);
      triggerNotification(`SYNC DEFERRED: ${err.message || 'Check firestore network permission'}`);
    }
  };

  // Support / Live desk details
  const [showSupportDesk, setShowSupportDesk] = useState<boolean>(false);
  const [supportText, setSupportText] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<MachineryItem | null>(null);

  // Busy Alerts overlay states
  const [showBusyAlert, setShowBusyAlert] = useState<boolean>(false);
  const [busyMachineryName, setBusyMachineryName] = useState<string>('');

  // Support FAQ and Logistics Policy Dialog States
  const [showFAQModal, setShowFAQModal] = useState<boolean>(false);
  const [showPrivacyPolicyModal, setShowPrivacyPolicyModal] = useState<boolean>(false);

  // High-fidelity custom toast system
  const [showSuccessNotif, setShowSuccessNotif] = useState<boolean>(false);
  const [notifMessage, setNotifMessage] = useState<string>('');

  const triggerNotification = (msg: string) => {
    setNotifMessage(msg);
    setShowSuccessNotif(true);
  };

  // Search & Filtering inside history
  const [historySearchQuery, setHistorySearchQuery] = useState<string>('');
  const [historyTab, setHistoryTab] = useState<'ALL' | 'COMPLETED' | 'DISPATCHED' | 'CANCELLED'>('ALL');
  const [dateFilterOpen, setDateFilterOpen] = useState<boolean>(false);
  const [typeFilterOpen, setTypeFilterOpen] = useState<boolean>(false);

  // Search in Home Catalog
  const [catalogSearch, setCatalogSearch] = useState<string>('');

  // Interactive popup modals inside Order History
  const [viewingInvoice, setViewingInvoice] = useState<BookingRecord | null>(null);
  const [trackingTelemetry, setTrackingTelemetry] = useState<BookingRecord | null>(null);

  // Form Booking parameters
  const [bookingLocation, setBookingLocation] = useState<string>('');
  const [isBookingSubmitting, setIsBookingSubmitting] = useState<boolean>(false);
  const [successBookingName, setSuccessBookingName] = useState<string | null>(null);

  // Persist local action modifications
  const saveStates = (newOrders: number, newCoupons: number, newHistory: BookingRecord[]) => {
    setOrdersCount(newOrders);
    localStorage.setItem('hg_orders_count', newOrders.toString());
    setFreeCoupons(newCoupons);
    localStorage.setItem('hg_free_coupons', newCoupons.toString());
    setBookings(newHistory);
    localStorage.setItem('hg_bookings_history_new', JSON.stringify(newHistory));
  };

  const handleSignOutAction = () => {
    setShowProfile(false);
    onLogout();
  };

  // Create real checkout dispatch
  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    if (!bookingLocation.trim()) {
      triggerNotification('Specify valid site dispatch coordinates to complete booking.');
      return;
    }

    setIsBookingSubmitting(true);

    setTimeout(() => {
      const uniqueId = `HG-${Math.floor(1000 + Math.random() * 8999)}-Y${Math.floor(1 + Math.random() * 9)}`;
      const now = new Date();
      const formattedDate = now.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }) + ' • ' + now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });

      const orderEst = selectedItem.rate * 4 + 80; // Estimated 4-hour slot + logistical deployment fee

      const newBookingRecord: BookingRecord = {
        bookingId: uniqueId,
        machineryName: selectedItem.name,
        machineryImage: selectedItem.image,
        date: formattedDate,
        location: bookingLocation.trim(),
        rate: selectedItem.rate,
        status: 'DISPATCHED', // Starts automatically in progress deployment
        orderPrice: freeCoupons > 0 ? 0.00 : orderEst
      };

      const updatedHistory = [newBookingRecord, ...bookings];
      const nextOrders = ordersCount + 1;
      let nextCoupons = freeCoupons;

      if (freeCoupons > 0) {
        nextCoupons = freeCoupons - 1;
      }

      saveStates(nextOrders, nextCoupons, updatedHistory);
      syncBookingToFirebase(newBookingRecord);
      setIsBookingSubmitting(false);
      setSuccessBookingName(selectedItem.name);
      setSelectedItem(null);
      setBookingLocation('');

      setTimeout(() => {
        setSuccessBookingName(null);
        // Automatically take them to see their freshly booked item in history!
        setShowHistory(true);
      }, 2500);

    }, 1800);
  };

  const handleClaimOffer = () => {
    if (ordersCount >= 10) {
      const nextCoupons = freeCoupons + 1;
      const nextOrders = ordersCount - 10;
      saveStates(nextOrders, nextCoupons, bookings);
      triggerNotification('SUCCESS: Earned 1 Lifetime Free Dispatch Coupon! Added to your account.');
    }
  };

  const reorderCancelledItem = (item: BookingRecord) => {
    const matchedCatalog = BOOKABLE_MACHINERY.find(m => item.machineryName.toLowerCase().includes(m.name.toLowerCase()));
    if (matchedCatalog) {
      setSelectedItem(matchedCatalog);
      setBookingLocation(item.location);
    } else {
      // safe fallback
      setSelectedItem(BOOKABLE_MACHINERY[1]); 
    }
  };

  // Perform client-side searches and filtering of dispatches
  const filteredHistory = bookings.filter(book => {
    const matchesSearch = 
      book.machineryName.toLowerCase().includes(historySearchQuery.toLowerCase()) || 
      book.bookingId.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
      book.location.toLowerCase().includes(historySearchQuery.toLowerCase());
    
    if (historyTab === 'ALL') return matchesSearch;
    return matchesSearch && book.status === historyTab;
  });

  const filteredCatalog = BOOKABLE_MACHINERY.filter(item =>
    item.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
    item.description.toLowerCase().includes(catalogSearch.toLowerCase())
  );

  return (
    <div id={id} className="w-full h-full flex flex-col bg-[#f9f9f9] font-sans relative overflow-hidden select-none">
      
      {/* 3 screens toggled via standard state: Screen C (Profile Workstation) / Screen A (Booking Deck) / Screen B (Order History) */}
      <AnimatePresence mode="wait">
        {showProfile ? (
          // SCREEN C: HIGH-FIDELITY PROFILE WORKSPACE
          <motion.div
            key="screen-profile"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            className="w-full h-full flex flex-col absolute inset-0 bg-[#f9f9f9]"
          >
            {/* Screen C Header */}
            <header className="h-14 bg-white border-b-2 border-slate-150 flex justify-between items-center px-4 shrink-0 z-30 shadow-xs">
              <button
                type="button"
                onClick={() => setShowProfile(false)}
                className="flex items-center gap-1 py-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl cursor-pointer border-none text-[9px] font-black uppercase tracking-wider transition-colors animate-pulse"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-[#ff8c00]" />
                <span>Home</span>
              </button>

              <div className="flex flex-col items-center">
                <span className="font-sans text-xs font-black tracking-tighter text-[#1a1c1c] leading-none uppercase">
                  HEAVY<span className="text-[#ff8c00]">GEAR</span> PROFILE
                </span>
                <span className="text-[6.5px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                  OPERATOR METRIC INTERFACE
                </span>
              </div>

              <span className="text-[8px] font-mono font-bold text-slate-500 bg-slate-50 border border-slate-150 px-2 py-0.5 rounded-lg">
                ID: {profileId}
              </span>
            </header>

            {/* Scrollable Contents Grid */}
            <div className="flex-1 overflow-y-auto px-4 pt-4 pb-28 text-center space-y-4">
              
              {/* Profile Header Box */}
              <div className="bg-white border-2 border-[#1a1c1c]/15 rounded-2xl p-4 flex flex-col items-center text-center relative">
                <div className="relative">
                  <img
                    src={profileImg}
                    alt={profileName}
                    className="w-20 h-20 rounded-2xl border-4 border-[#ff8c00] object-cover shadow-xs"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setEditName(profileName);
                      setEditCompany(profileCompany);
                      setEditRole(profileRole);
                      setEditImg(profileImg);
                      setShowEditProfile(true);
                    }}
                    className="absolute -bottom-1 -right-1 bg-[#904d00] hover:bg-[#ff8c00] text-white p-1.5 rounded-full border-2 border-white flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h2 className="text-[17px] font-black text-slate-805 uppercase mt-3 tracking-tight">
                  {profileName}
                </h2>
                <p className="text-[10px] text-slate-500 font-bold flex items-center justify-center gap-1 mt-0.5 uppercase tracking-wide">
                  <Compass className="w-3.5 h-3.5 text-[#ff8c00]" />
                  {profileCompany}
                </p>

                <div className="flex items-center gap-2 justify-center mt-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50/60 border border-[#ff8c00]/30 text-[#904d00] rounded-full text-[8px] font-black uppercase font-sans">
                    <CheckCircle className="w-3 h-3 text-emerald-500 fill-emerald-50" />
                    {profileRole}
                  </span>
                  <span className="inline-flex items-center text-[8.5px] font-mono font-bold text-slate-500 bg-slate-50 border border-slate-150 px-2 py-0.5 rounded-full">
                    ID: {profileId}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditName(profileName);
                    setEditCompany(profileCompany);
                    setEditRole(profileRole);
                    setEditImg(profileImg);
                    setShowEditProfile(true);
                  }}
                  className="w-full h-9 bg-[#904d00] hover:bg-[#ff8c00] text-white text-[10px] font-black uppercase tracking-wider rounded-xl mt-4 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <User className="w-4 h-4 text-white" />
                  <span>Edit Profile Info</span>
                </button>
              </div>

              {/* Bento Grid Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Account Settings */}
                <div className="bg-white border-2 border-[#1a1c1c]/15 rounded-2xl overflow-hidden shadow-xs flex flex-col text-left">
                  <div className="bg-slate-50 px-3 py-2 border-b border-slate-150 flex items-center gap-2 animate-fade-in">
                    <SlidersHorizontal className="w-4 h-4 text-[#ff8c00]" />
                    <span className="text-[9px] font-black uppercase text-slate-700 tracking-wider">Account Settings</span>
                  </div>
                  <div className="divide-y divide-slate-100 font-sans">
                    <button
                      type="button"
                      onClick={() => setShowNotificationsModal(true)}
                      className="w-full text-left px-3 py-3 hover:bg-slate-50 flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-slate-400 group-hover:text-[#ff8c00] duration-150" />
                        <span className="text-[11px] font-bold text-slate-700">Notification Preferences</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-350 group-hover:translate-x-0.5 duration-150" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowPrivacyModal(true)}
                      className="w-full text-left px-3 py-3 hover:bg-slate-50 flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-slate-400 group-hover:text-[#ff8c00] duration-150" />
                        <span className="text-[11px] font-bold text-slate-700">Privacy & Security Defaults</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-350 group-hover:translate-x-0.5 duration-150" />
                    </button>

                    {userEmail?.toLowerCase() === 'sairuthwikvangala@gmail.com' && (
                      <button
                        type="button"
                        onClick={() => setShowIntegrationModal(true)}
                        className="w-full text-left px-3 py-3 hover:bg-slate-50 flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Database className="w-4 h-4 text-slate-400 group-hover:text-[#ff8c00] duration-150" />
                          <span className="text-[11px] font-bold text-slate-700">Cloud SDK Credentials</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[7px] font-mono font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                            googleMapsKey || firebaseApiKey ? 'bg-emerald-50 text-emerald-600 border border-emerald-150' : 'bg-slate-50 text-slate-450 border border-slate-150'
                          }`}>
                            {googleMapsKey || firebaseApiKey ? 'Integrated' : 'Idle'}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-350 group-hover:translate-x-0.5 duration-150" />
                        </div>
                      </button>
                    )}
                  </div>
                </div>

                {/* Saved machinery Section */}
                <div className="bg-white border-2 border-[#1a1c1c]/15 rounded-2xl overflow-hidden shadow-xs flex flex-col text-left">
                  <div className="bg-slate-50 px-3 py-2 border-b border-slate-150 flex items-center gap-2">
                    <Star className="w-4 h-4 text-[#ff8c00] fill-[#ff8c00]" />
                    <span className="text-[9px] font-black uppercase text-slate-700 tracking-wider">Saved Machinery ({starredMachineryIds.length})</span>
                  </div>
                  <div className="p-3 space-y-2.5">
                    {BOOKABLE_MACHINERY.filter(m => starredMachineryIds.includes(m.id)).length > 0 ? (
                      BOOKABLE_MACHINERY.filter(m => starredMachineryIds.includes(m.id)).slice(0, 2).map(mach => (
                        <div key={mach.id} className="flex items-center gap-2.5 border border-slate-150 p-2 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                          <img
                            src={mach.image}
                            alt={mach.name}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-250 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-black text-slate-700 uppercase tracking-tight truncate">{mach.name}</p>
                            <p className="text-[7.5px] font-mono text-slate-400 leading-none">Class Rate: ₹{mach.rate}/hr</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleStarMachinery(mach.id)}
                            className="text-[#ff8c00] hover:text-slate-300 p-1 cursor-pointer"
                          >
                            <Star className="w-4 h-4 fill-current" />
                          </button>
                        </div>
                      ))
                    ) : (
                      // Default interactive reference fallback with CAT 320 GC
                      <div className="flex items-center gap-2.5 border border-slate-150 p-2 rounded-xl bg-slate-50/50">
                        <img
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8OamaHTTShf1VXKSygMlS86DDSm7hF4VS99MNgKhcIPlYdKEjqYedV0gXnOuTbUDZS6d6pmA83m08D3SyFZdp9u8yFWGlyL-x4fi9u6h8vKTl8Q8EfpecPgNYLmn-D7E1WCOoaSaat8AOY0BJk-mlK4THV3VI4HDa6YPq2-OntawnzeHTDv_r9me-sNNJ-4kAmlMM1cildX1hkitOvhnN7eIvKM37YFm10O4p55wxO41YDdTI2mUzivYoBaYcevTKXBgghgZd1H4"
                          alt="CAT Excavator"
                          className="w-10 h-10 rounded-lg object-cover border border-slate-250 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-black text-slate-700 uppercase tracking-tight">CAT 320 GC</p>
                          <p className="text-[7.5px] font-mono text-slate-400 leading-none">Fleet ID: XJ-092</p>
                        </div>
                        <Star className="w-4 h-4 text-[#ff8c00] fill-[#ff8c00]" />
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => setShowProfile(false)}
                      className="w-full py-1.5 font-sans font-black text-[8px] tracking-widest text-[#ff8c00] hover:text-[#904d00] uppercase border border-dashed border-[#ff8c00]/30 hover:border-[#ff8c00] rounded-lg text-center cursor-pointer transition-colors bg-white leading-none"
                    >
                      BROWSE OPERATIONAL REGISTRY
                    </button>
                  </div>
                </div>

                {/* Credit Card Payment Methods */}
                <div className="bg-white border-2 border-[#1a1c1c]/15 rounded-2xl overflow-hidden shadow-xs flex flex-col text-left">
                  <div className="bg-slate-50 px-3 py-2 border-b border-slate-150 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#ff8c00]" />
                      <span className="text-[9px] font-black uppercase text-slate-700 tracking-wider">Payment Methods</span>
                    </div>
                    {paymentCards.length > 0 && (
                      <span className="text-[7px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded leading-none">
                        Active Cards: {paymentCards.length}
                      </span>
                    )}
                  </div>
                  <div className="p-3 space-y-3">
                    {paymentCards.map(c => (
                      <div
                        key={c.id}
                        className="relative group overflow-hidden rounded-xl p-3 bg-gradient-to-br from-slate-900 to-neutral-800 text-white border border-neutral-950 shadow-xs flex flex-col justify-between min-h-[105px]"
                      >
                        <div className="flex justify-between items-start leading-none mb-1">
                          <div className="flex items-center gap-1.5">
                            <CreditCard className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                            <span className="text-[7.5px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                              {c.isCorporate ? 'CORPORATE REVOLVING CARD' : 'PERSONAL SECURE PAYMENT'}
                            </span>
                          </div>
                          
                          {paymentCards.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const next = paymentCards.filter(pc => pc.id !== c.id);
                                setPaymentCards(next);
                                localStorage.setItem('hg_payment_cards', JSON.stringify(next));
                              }}
                              className="text-neutral-500 hover:text-rose-400 p-0.5 cursor-pointer leading-none transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        <p className="font-mono text-sm tracking-[4px] font-bold text-slate-100 my-2 leading-none">{c.num}</p>
                        
                        <div className="flex justify-between items-end font-mono text-[8px] text-slate-400">
                          <span className="uppercase font-bold tracking-wider truncate max-w-[130px] text-slate-350">{c.holder}</span>
                          <span>EXP {c.exp}</span>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => setShowAddCard(true)}
                      className="w-full h-10.5 border-2 border-dashed border-slate-300 hover:border-[#ff8c00] text-slate-500 hover:text-[#ff8c00] rounded-xl flex items-center justify-center gap-2 font-black text-[9px] uppercase tracking-widest bg-slate-50/50 hover:bg-amber-50/10 cursor-pointer transition-all duration-150"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Corporate Card</span>
                    </button>
                  </div>
                </div>

                {/* Support & FAQ */}
                <div className="bg-white border-2 border-[#1a1c1c]/15 rounded-2xl overflow-hidden shadow-xs flex flex-col text-left">
                  <div className="bg-slate-50 px-3 py-2 border-b border-slate-150 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#ff8c00]" />
                    <span className="text-[9px] font-black uppercase text-slate-700 tracking-wider">HeavyGear Support Desk</span>
                  </div>
                  <div className="divide-y divide-slate-100 font-sans">
                    <button
                      type="button"
                      onClick={() => setShowFAQModal(true)}
                      className="w-full text-left px-3 py-3 hover:bg-slate-50 flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-slate-400 group-hover:text-[#ff8c00] duration-150" />
                        <span className="text-[11px] font-bold text-slate-700">Operator Help Center & FAQ</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-350" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowSupportDesk(true)}
                      className="w-full text-left px-3 py-3 hover:bg-slate-50 flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <PhoneCall className="w-4 h-4 text-slate-400 group-hover:text-[#ff8c00] duration-150" />
                        <span className="text-[11px] font-bold text-slate-700">Contact Fleet Dispatch Desk</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-350 group-hover:translate-x-0.5 duration-150" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Extra Privacy Policy & Sign Out footer list */}
              <div className="space-y-2 mt-4 text-left">
                <button
                  type="button"
                  onClick={() => setShowPrivacyPolicyModal(true)}
                  className="w-full h-11 bg-white hover:bg-slate-50 border-2 border-slate-200/80 rounded-xl px-4 flex items-center justify-between group cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-slate-400 group-hover:text-[#ff8c00] duration-150" />
                    <span className="text-xs font-bold text-slate-700">Logistics Privacy Policy</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-350" />
                </button>

                <button
                  type="button"
                  onClick={onLogout}
                  className="w-full h-11 bg-rose-50/10 hover:bg-rose-50 border-2 border-rose-200/40 rounded-xl px-4 flex items-center justify-between group cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-2">
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span className="text-xs font-black text-rose-600 uppercase tracking-wide">Sign Out Session</span>
                  </div>
                  <span className="text-[8px] font-mono font-bold text-rose-450 opacity-70">HG Platform v2.4.1</span>
                </button>
              </div>
            </div>

            {/* Sticky Native Footer navigation */}
            <nav className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t-2 border-slate-150 flex justify-around items-center px-4 z-40 select-none shadow-lg">
              <button
                type="button"
                onClick={() => { setShowProfile(false); setShowHistory(false); }}
                className="flex-1 flex flex-col items-center justify-center cursor-pointer text-slate-400 hover:text-[#ff8c00] transition-colors gap-0.5 border-none bg-transparent"
              >
                <Truck className="w-5 h-5" />
                <span className="text-[8px] font-black uppercase tracking-wider">Fleet Deck</span>
              </button>

              <button
                type="button"
                onClick={() => { setShowProfile(false); setShowHistory(true); }}
                className="flex-1 flex flex-col items-center justify-center cursor-pointer text-slate-400 hover:text-[#ff8c00] transition-colors gap-0.5 border-none bg-transparent"
              >
                <History className="w-5 h-5" />
                <span className="text-[8px] font-black uppercase tracking-wider">Dispatches</span>
              </button>

              <button
                type="button"
                onClick={() => setShowProfile(true)}
                className="flex-1 flex flex-col items-center justify-center cursor-pointer text-[#ff8c00] gap-0.5 border-none bg-transparent"
              >
                <User className="w-5 h-5 text-[#ff8c00]" />
                <span className="text-[8.5px] font-black uppercase tracking-widest text-[#ff8c00]">Profile</span>
              </button>
            </nav>
          </motion.div>
        ) : !showHistory ? (
          // SCREEN A: BOOKING DECK (Home Screen with Single-Column Cards)
          <motion.div
            key="screen-booking-deck"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 15 }}
            className="w-full h-full flex flex-col absolute inset-0"
          >
            {/* TopAppBar */}
            <header className="h-14 bg-white border-b-2 border-slate-150 flex justify-between items-center px-4 shrink-0 z-30 shadow-xs relative">
              <button
                type="button"
                id="btn-trigger-profile"
                onClick={() => setShowProfile(true)}
                className="flex flex-col items-center justify-center cursor-pointer bg-transparent border-none outline-none group"
              >
                <div className="w-7 h-7 rounded-full bg-[#ff8c00]/10 text-[#ff8c00] flex items-center justify-center overflow-hidden border-2 border-[#1a1c1c] shadow-xs group-hover:scale-105 transition-transform">
                  <User className="w-4 h-4 text-[#ff8c00]" />
                </div>
                <span className="text-[8px] font-extrabold text-[#904d00] uppercase tracking-wider mt-0.5 leading-none">
                  Profile
                </span>
              </button>

              <div className="flex flex-col items-center">
                <span className="font-sans text-base font-black tracking-tighter text-[#1a1c1c] leading-none uppercase">
                  HEAVY<span className="text-[#ff8c00]">GEAR</span>
                </span>
                <span className="text-[7px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                  Authorized Dispatcher
                </span>
              </div>

              <button
                type="button"
                id="btn-topbar-history"
                onClick={() => setShowHistory(true)}
                className="flex flex-col items-center justify-center cursor-pointer bg-transparent border-none outline-none group"
              >
                <div className="w-7 h-7 bg-slate-50 border border-slate-200 text-slate-700 flex items-center justify-center rounded-lg group-hover:bg-[#ff8c00]/10 transition-colors">
                  <History className="w-4 h-4 text-[#ff8c00]" />
                </div>
                <span className="text-[8px] font-extrabold text-[#904d00] uppercase tracking-wider mt-0.5 leading-none group-hover:text-slate-600">
                  History
                </span>
              </button>
            </header>

            {/* Scrollable Catalog Section */}
            <div
              id="catalog-scroll-area"
              className="flex-1 overflow-y-auto px-4 pt-4 pb-32 hide-scrollbar scroll-smooth"
            >
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest leading-none">
                      Heavy Machinery Booking Desk
                    </p>
                    <h1 className="text-[19px] font-black leading-tight text-[#1a1c1c] tracking-tight uppercase mt-1">
                      Book Heavy Machinery
                    </h1>
                  </div>
                  
                  <span className="text-[7.5px] font-mono font-bold text-[#ff8c00] bg-amber-50 border border-amber-100 rounded-full py-0.5 px-2 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                    GPS Tracking Live
                  </span>
                </div>

                {/* Live Search Panel */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                    <Search className="w-3.5 h-3.5 text-slate-300" />
                  </span>
                  <input
                    type="text"
                    id="catalog-search-input"
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    placeholder="Search by vehicle name or utility class..."
                    className="w-full h-8 px-8 bg-white border border-slate-200 rounded-xl text-[11px] text-slate-800 placeholder:text-slate-350 outline-none focus:ring-1 focus:ring-[#ff8c00]"
                  />
                  {catalogSearch && (
                    <button
                      onClick={() => setCatalogSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 bg-transparent border-none text-[9px] font-bold"
                    >
                      CLEAR
                    </button>
                  )}
                </div>
              </div>

              {/* Stacked Single-Column cards fitting perfectly dynamically without grid overflowing */}
              <div id="machinery-cards-list-stacked" className="space-y-4">
                {filteredCatalog.map((item, index) => {
                  const isWaterTanker = item.id === 'MACH-01' || item.name.toLowerCase().includes('water tanker');
                  return (
                    <motion.div
                      key={item.id}
                      id={`machinery-card-${item.id}`}
                      onClick={() => {
                        if (isWaterTanker) {
                          setSelectedItem(item);
                        } else {
                          setBusyMachineryName(item.name);
                          setShowBusyAlert(true);
                        }
                      }}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(index * 0.05, 0.4), duration: 0.3 }}
                      whileHover={{ scale: isWaterTanker ? 1.01 : 1.00 }}
                      whileTap={{ scale: isWaterTanker ? 0.99 : 1.00 }}
                      className={`border-2 rounded-2xl overflow-hidden shadow-sm flex flex-col cursor-pointer transition-all duration-150 group relative ${
                        isWaterTanker 
                          ? 'bg-white border-[#1a1c1c]/15 hover:border-[#ff8c00]' 
                          : 'bg-slate-50 border-slate-200 opacity-90'
                      }`}
                    >
                      {/* Visual Cover aspect */}
                      <div className="aspect-[16/10] bg-slate-50 overflow-hidden relative border-b border-slate-100">
                        <img
                          referrerPolicy="no-referrer"
                          src={item.image}
                          alt={item.name}
                          className={`w-full h-full object-cover transition-all duration-300 ${
                            isWaterTanker 
                              ? 'grayscale brightness-95 group-hover:grayscale-0' 
                              : 'grayscale brightness-50 contrast-125'
                          }`}
                        />
                        
                        {/* Transparent Layer for Busy / All Booked */}
                        {!isWaterTanker && (
                          <div className="absolute inset-0 bg-[#1a1c1c]/60 backdrop-blur-[1px] flex flex-col items-center justify-center text-center p-3 z-10">
                            <div className="border border-[#ff8c00] px-3 py-1 rounded-lg bg-[#1a1c1c]/90 text-white font-sans font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5 shadow-md">
                              <Clock className="w-3.5 h-3.5 text-[#ff8c00] animate-spin" style={{ animationDuration: '4s' }} />
                              <span>ALL BOOKED</span>
                            </div>
                            <span className="text-[7.5px] text-orange-200 mt-1 uppercase font-black tracking-widest leading-none bg-[#904d00]/80 px-1.5 py-0.5 rounded">
                              Busy • Quarry Unit
                            </span>
                          </div>
                        )}
                        
                        {/* Star Favoriting Overlay */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStarMachinery(item.id);
                          }}
                          className="absolute top-3 left-3 w-7 h-7 rounded-full bg-white/75 hover:bg-white text-[#ff8c00] flex items-center justify-center shadow-xs transition-colors cursor-pointer z-20 border-none"
                          title="Save machinery to profile bookmarks"
                        >
                          <Star className={`w-3.5 h-3.5 ${starredMachineryIds.includes(item.id) ? 'fill-[#ff8c00]' : ''}`} />
                        </button>
                        
                        {/* Price cost tag overlay */}
                        <div className="absolute top-3 right-3 bg-[#1a1c1c] text-white text-[9px] font-mono font-black px-2 py-0.5 rounded-lg z-10">
                          ₹{item.rate}/hr
                        </div>

                        <div className="absolute bottom-2 left-3 bg-[#ff8c00] text-white text-[7.5px] font-black tracking-widest px-1.5 py-0.5 rounded uppercase z-10">
                          {item.id}
                        </div>
                      </div>

                      {/* Meta info footer section */}
                      <div className={`p-3 w-full flex flex-col justify-between text-left ${isWaterTanker ? 'bg-white' : 'bg-slate-50/80'}`}>
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className={`text-xs font-black uppercase tracking-wider ${isWaterTanker ? 'text-[#1a1c1c]' : 'text-slate-500'}`}>
                              {item.name}
                            </h3>
                            <span className="text-[8.5px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              {item.horsepower}
                            </span>
                          </div>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                            {item.weight} Class • Capacity: {item.capacity}
                          </p>
                          <p className="text-[9.5px] text-slate-500 leading-normal mt-1.5 line-clamp-2 font-medium">
                            {item.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 mt-2.5">
                          <span className={`text-[8px] font-black tracking-widest uppercase ${isWaterTanker ? 'text-[#ff8c00]' : 'text-slate-400'}`}>
                            {isWaterTanker ? 'DEPLOY THIS CARRIER VEHICLE' : 'HEAVY RESERVATION QUEUE'}
                          </span>
                          <div className={`flex items-center gap-1 font-bold text-[9px] ${isWaterTanker ? 'text-[#ff8c00]' : 'text-slate-400'}`}>
                            <span>{isWaterTanker ? 'RESERVE' : 'NOTIFY'}</span>
                            <ChevronRight className={`w-3.5 h-3.5 duration-150 ${isWaterTanker ? 'text-[#ff8c00] group-hover:translate-x-1' : 'text-slate-400'}`} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {filteredCatalog.length === 0 && (
                  <div className="text-center py-10 bg-slate-100 rounded-xl border border-slate-200/50">
                    <Info className="w-4 h-4 text-slate-400 mx-auto mb-1.5" />
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">No machinery matches filter</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom sticky Section (Progress Bar & Stats) */}
            <section className="absolute bottom-0 left-0 right-0 h-[104px] bg-white border-t-2 border-slate-150 z-25 flex flex-col justify-center px-4 pb-2 pt-1 shadow-lg shrink-0">
              <div className="space-y-1">
                <div className="flex justify-between items-end leading-none">
                  <span className="text-[8.5px] font-extrabold text-[#1a1c1c] uppercase tracking-wide">
                    Authorized orders this month: <strong className="text-[#ff8c00] font-black">{ordersCount}/10</strong>
                  </span>
                  <span className="text-[9px] font-mono font-black text-[#ff8c00]">
                    {Math.min(Math.round((ordersCount / 10) * 100), 100)}%
                  </span>
                </div>

                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/40 relative">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-[#ff8c00] transition-all duration-500 rounded-full"
                    style={{ width: `${Math.min((ordersCount / 10) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2">
                <button
                  type="button"
                  id="btn-claim-special-offer"
                  onClick={handleClaimOffer}
                  disabled={ordersCount < 10}
                  className={`flex-1 h-9.5 text-[8.5px] font-black uppercase tracking-widest rounded-xl border outline-none transition-all ${
                    ordersCount >= 10
                      ? 'bg-gradient-to-r from-[#ff8c00] to-orange-600 text-white shadow-md border-[#623200] active:scale-97 cursor-pointer'
                      : 'bg-slate-100 text-slate-400 border-slate-200/50 cursor-not-allowed'
                  }`}
                >
                  CLAIM FREE ORDER SLOT {ordersCount >= 10 && '✨'}
                </button>

                <button
                  type="button"
                  onClick={() => triggerNotification(`Active Coupons: ${freeCoupons}. Earn more by completing active heavy machinery dispatches.`)}
                  className="flex flex-col items-center justify-center min-w-[70px] h-9.5 bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/15 rounded-xl active:scale-95 transition-all outline-none"
                >
                  <div className="flex items-center gap-1 leading-none">
                    <Gift className="w-3.5 h-3.5 text-[#ff8c00]" />
                    <span className="text-[10px] font-black text-[#ff8c00] font-mono">{freeCoupons}</span>
                  </div>
                  <span className="text-[6.5px] font-black text-slate-500 uppercase tracking-widest mt-0.5 leading-none">
                    Gift Balance
                  </span>
                </button>
              </div>
            </section>
          </motion.div>
        ) : (
          // SCREEN B: ORDER HISTORY VIEW (High-Fidelity conforming strictly to the second design reference)
          <motion.div
            key="screen-order-history"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            className="w-full h-full flex flex-col absolute inset-0 bg-[#f9f9f9]"
          >
            {/* Top Back/Close Navigation Bar */}
            <header className="h-14 bg-white border-b-2 border-slate-150 flex justify-between items-center px-3 gap-2 shrink-0 z-30">
              <button
                type="button"
                id="btn-return-to-catalog"
                onClick={() => setShowHistory(false)}
                className="flex items-center gap-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer border-none text-[9px] font-black uppercase tracking-wider text-slate-600 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>BOOK DECK</span>
              </button>

              <div className="flex items-center gap-1">
                <Compass className="w-4 h-4 text-[#ff8c00]" />
                <span className="font-sans text-xs font-black text-[#ff8c00] leading-none uppercase select-none">
                  HeavyGear <span className="text-[#1a1c1c] text-[8px] font-bold">Logs</span>
                </span>
              </div>

              <div className="h-6 w-px bg-slate-200" />

              <span className="text-[8px] font-mono font-bold text-slate-400 uppercase bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg">
                SECURE OPERATOR
              </span>
            </header>

            {/* Custom Filter options & List */}
            <div className="flex-1 overflow-y-auto pb-24 hide-scrollbar scroll-smooth">
              <div className="bg-white border-b-2 border-slate-150 px-4 py-4 space-y-3.5 shrink-0">
                
                {/* Title */}
                <div className="flex items-center justify-between">
                  <h1 className="font-sans text-[20px] font-black text-[#1a1c1c] uppercase tracking-tight">
                    Order History
                  </h1>
                  <span className="text-[8.5px] font-extrabold uppercase bg-orange-100/30 text-[#904d00] font-mono px-2 py-0.5 rounded-full border border-orange-100">
                    {filteredHistory.length} Recorded
                  </span>
                </div>

                {/* High Contrast search bar wrapper matching the reference */}
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-slate-350" />
                  </span>
                  <input
                    type="text"
                    id="order-search-input"
                    value={historySearchQuery}
                    onChange={(e) => setHistorySearchQuery(e.target.value)}
                    placeholder="Search dispatches by ID, machine or coordinate..."
                    className="block w-full pl-9 pr-3 py-2.5 border-2 border-slate-200 bg-[#ffffff] focus:border-[#ff8c00] rounded-xl text-xs text-[#1a1c1c] placeholder:text-slate-300 font-medium transition-all"
                  />
                  {historySearchQuery && (
                    <button
                      onClick={() => setHistorySearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-transparent border-none text-[8.5px] font-black"
                    >
                      CLEAR
                    </button>
                  )}
                </div>

                {/* Filters Row */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {/* Date range trigger */}
                    <div className="relative">
                      <button
                        onClick={() => { setDateFilterOpen(!dateFilterOpen); setTypeFilterOpen(false); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-slate-200 rounded-xl text-[8.5px] uppercase font-mono font-black text-slate-600 hover:bg-slate-50 transition-all select-none"
                      >
                        <CalendarDays className="w-3.5 h-3.5 text-[#ff8c00]" />
                        <span>Date Range</span>
                        <span className="text-[7.5px] text-slate-400">▼</span>
                      </button>
                      
                      {dateFilterOpen && (
                        <div className="absolute top-8 left-0 w-36 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-40 text-left space-y-1">
                          <p className="text-[7px] text-slate-400 uppercase font-black px-1">Presets</p>
                          <button
                            onClick={() => { setHistorySearchQuery('Oct'); setDateFilterOpen(false); }}
                            className="w-full text-left text-[9px] font-bold uppercase p-1 hover:bg-slate-50 text-slate-700 block"
                          >
                            October 2023
                          </button>
                          <button
                            onClick={() => { setHistorySearchQuery('2026'); setDateFilterOpen(false); }}
                            className="w-full text-left text-[9px] font-bold uppercase p-1 hover:bg-slate-50 text-slate-700 block"
                          >
                            May 2026 dispatches
                          </button>
                          <button
                            onClick={() => { setHistorySearchQuery(''); setDateFilterOpen(false); }}
                            className="w-full text-left text-[9px] font-bold uppercase p-1 hover:bg-slate-50 text-slate-500 block border-t border-slate-100"
                          >
                            Clear Date Filter
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Machinery Type trigger */}
                    <div className="relative">
                      <button
                        onClick={() => { setTypeFilterOpen(!typeFilterOpen); setDateFilterOpen(false); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-slate-200 rounded-xl text-[8.5px] uppercase font-mono font-black text-slate-600 hover:bg-slate-50 transition-all select-none"
                      >
                        <Activity className="w-3.5 h-3.5 text-[#ff8c00]" />
                        <span>Type class</span>
                        <span className="text-[7.5px] text-slate-400">▼</span>
                      </button>

                      {typeFilterOpen && (
                        <div className="absolute top-8 left-0 w-36 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-40 text-left space-y-1">
                          <p className="text-[7px] text-slate-400 uppercase font-black px-1">Vehicles</p>
                          <button
                            onClick={() => { setHistorySearchQuery('JCB'); setTypeFilterOpen(false); }}
                            className="w-full text-left text-[9px] font-bold uppercase p-1 hover:bg-slate-50 text-slate-700 block"
                          >
                            JCB models
                          </button>
                          <button
                            onClick={() => { setHistorySearchQuery('Tanker'); setTypeFilterOpen(false); }}
                            className="w-full text-left text-[9px] font-bold uppercase p-1 hover:bg-slate-50 text-slate-700 block"
                          >
                            Water Tankers
                          </button>
                          <button
                            onClick={() => { setHistorySearchQuery('Crane'); setTypeFilterOpen(false); }}
                            className="w-full text-left text-[9px] font-bold uppercase p-1 hover:bg-slate-50 text-slate-700 block"
                          >
                            Rig Cranes
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Horizontal Scroll bar for order tabs filters */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar scroll-smooth">
                    {([
                      { id: 'ALL', label: 'All Orders' },
                      { id: 'COMPLETED', label: 'Completed' },
                      { id: 'DISPATCHED', label: 'In Progress' },
                      { id: 'CANCELLED', label: 'Cancelled' }
                    ] as const).map(tab => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setHistoryTab(tab.id)}
                        className={`px-3 py-1.5 text-[8.5px] font-black uppercase rounded-full whitespace-nowrap cursor-pointer transition-all ${
                          historyTab === tab.id
                            ? 'bg-[#904d00] text-white font-extrabold shadow-sm'
                            : 'border-2 border-slate-200 text-slate-505 hover:bg-slate-100 hover:text-slate-700'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order history list contents - conforming to Card Item UI references inside smartphone preview container */}
              <div className="px-4 py-4 space-y-4 max-w-md mx-auto relative z-10">
                {filteredHistory.map((rec, index) => (
                  <motion.div
                    key={rec.bookingId}
                    id={`invoice-item-card-${rec.bookingId}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.05, 0.45) }}
                    className="group bg-white border-2 border-slate-205 hover:border-[#ff8c00] transition-all p-3.5 flex flex-col gap-3 rounded-2xl shadow-xs"
                  >
                    
                    {/* Grayscale styled header visual */}
                    <div className="w-full h-24 bg-slate-100 border border-slate-200 rounded-xl overflow-hidden relative">
                      <img
                        referrerPolicy="no-referrer"
                        src={rec.machineryImage}
                        alt={rec.machineryName}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                      />
                      
                      <div className="absolute top-2.5 left-2.5 bg-[#1a1c1c]/90 text-white font-mono text-[7.5px] font-bold px-1.5 py-0.5 rounded-md leading-none">
                        Ref: {rec.bookingId}
                      </div>

                      {/* Display localized states */}
                      <div className="absolute top-2.5 right-2.5">
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border shadow-sm ${
                          rec.status === 'COMPLETED'
                            ? 'bg-emerald-500 text-white border-emerald-600'
                            : rec.status === 'DISPATCHED'
                            ? 'bg-[#ff8c00] text-white border-orange-600'
                            : 'bg-rose-500 text-white border-rose-600'
                        }`}>
                          {rec.status === 'DISPATCHED' ? 'IN PROGRESS' : rec.status}
                        </span>
                      </div>
                    </div>

                    {/* text detail layer */}
                    <div className="space-y-1.5 text-left">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-sans text-sm font-black text-slate-800 tracking-tight uppercase">
                            {rec.machineryName}
                          </h3>
                          <p className="font-mono text-[8px] text-slate-400 uppercase tracking-wider uppercase">
                            Order ID Tracking Number: {rec.bookingId}
                          </p>
                        </div>
                      </div>

                      {/* Info coordinates row */}
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#ff8c00]" />
                        <span>Destination Site: {rec.location}</span>
                      </p>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 font-mono text-[9px]">
                        <div className="flex items-center gap-1 text-slate-500">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{rec.date}</span>
                        </div>

                        <div className="flex items-center gap-1 justify-end font-black text-slate-800">
                          <IndianRupee className="w-3.5 h-3.5 text-[#ff8c00]" />
                          <span>Fee: ₹{rec.orderPrice.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Actions footer wrapper */}
                      <div className="flex items-center justify-between pt-2">
                        {rec.status !== 'CANCELLED' ? (
                          <>
                            <button
                              type="button"
                              onClick={() => setViewingInvoice(rec)}
                              className="text-slate-500 hover:text-slate-800 text-[8.5px] font-extrabold uppercase flex items-center gap-1 underline transition-colors"
                            >
                              <Printer className="w-3 h-3 text-[#ff8c00]" />
                              <span>View Invoice sheet</span>
                            </button>

                            {rec.status === 'DISPATCHED' ? (
                              <button
                                type="button"
                                onClick={() => setTrackingTelemetry(rec)}
                                className="flex items-center gap-1 text-white bg-[#ff8c00] hover:bg-orange-600 text-[8.5px] font-black uppercase tracking-wider py-1 px-2.5 rounded-lg border-none shadow-xs cursor-pointer active:scale-95 transition-all"
                              >
                                <Compass className="w-3 h-3 animate-spin duration-3000" />
                                <span>Track active asset</span>
                              </button>
                            ) : (
                              <span className="text-[8px] font-bold text-emerald-600 font-mono flex items-center gap-1 bg-emerald-50 py-0.5 px-2 rounded border border-emerald-100">
                                <CheckCircle className="w-3 h-3" />
                                DISPATCH COMPLETE
                              </span>
                            )}
                          </>
                        ) : (
                          <>
                            <span className="text-[8px] font-mono text-rose-500 bg-rose-50 border border-rose-100 py-0.5 px-2 rounded">
                              Discharge allocation revoked
                            </span>
                            
                            <button
                              type="button"
                              onClick={() => reorderCancelledItem(rec)}
                              className="flex items-center gap-1 text-white bg-slate-700 hover:bg-slate-900 text-[8.5px] font-black uppercase tracking-wider py-1 px-2.5 rounded-lg border-none cursor-pointer"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>Reorder vehicle</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {filteredHistory.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-slate-205">
                    <History className="w-8 h-8 text-slate-300 mx-auto mb-2 animate-pulse" />
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest">
                      No matching records found
                    </p>
                    <p className="text-[9px] text-slate-400 mt-1">
                      Modify your active query filters or check other status tabs.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Orange Floating Action Button (FAB) at bottom-right returning back to Booking deck to place order */}
            <motion.button
              type="button"
              id="fab-booking-redirect"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setShowHistory(false)}
              className="absolute bottom-6 right-6 w-12 h-12 bg-[#ff8c00] text-white flex items-center justify-center rounded-2xl shadow-xl shadow-orange-200 border-2 border-white select-none cursor-pointer z-30"
              title="Book machinery"
            >
              <Plus className="w-6 h-6 stroke-[3px]" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL POPUPS: 1. Profile Configuration & Form Dialog Overlays */}
      <AnimatePresence>
        {/* EDIT PROFILE DIALOG */}
        {showEditProfile && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditProfile(false)}
              className="fixed inset-0 bg-[#1a1c1c]/80 z-50 cursor-pointer"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] bg-white border-2 border-[#1a1c1c] rounded-3xl p-5 z-55 shadow-2xl flex flex-col text-left space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b-2 border-slate-150">
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Configure Operator Profile</span>
                <button
                  type="button"
                  onClick={() => setShowEditProfile(false)}
                  className="w-6 h-6 rounded-full bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!editName.trim()) return;
                  setProfileName(editName);
                  setProfileCompany(editCompany);
                  setProfileRole(editRole);
                  setProfileImg(editImg);
                  if (userEmail) {
                    const lEmail = userEmail.toLowerCase();
                    localStorage.setItem(`hg_profile_name_${lEmail}`, editName);
                    localStorage.setItem(`hg_profile_company_${lEmail}`, editCompany);
                    localStorage.setItem(`hg_profile_role_${lEmail}`, editRole);
                    localStorage.setItem(`hg_profile_img_${lEmail}`, editImg);
                  } else {
                    localStorage.setItem('hg_profile_name', editName);
                    localStorage.setItem('hg_profile_company', editCompany);
                    localStorage.setItem('hg_profile_role', editRole);
                    localStorage.setItem('hg_profile_img', editImg);
                  }
                  setShowEditProfile(false);
                }}
                className="space-y-3 text-xs"
              >
                <div className="space-y-1">
                  <label className="text-[8.5px] font-black uppercase text-slate-500 tracking-wider">Operator Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full h-9 px-2.5 bg-slate-50 border border-slate-200 focus:border-[#ff8c00] rounded-xl outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[8.5px] font-black uppercase text-slate-500 tracking-wider">Assigned Contractor</label>
                  <input
                    type="text"
                    required
                    value={editCompany}
                    onChange={(e) => setEditCompany(e.target.value)}
                    className="w-full h-9 px-2.5 bg-slate-50 border border-slate-200 focus:border-[#ff8c00] rounded-xl outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[8.5px] font-black uppercase text-slate-500 tracking-wider">Operator Class Role</label>
                  <input
                    type="text"
                    required
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full h-9 px-2.5 bg-slate-50 border border-slate-200 focus:border-[#ff8c00] rounded-xl outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[8.5px] font-black uppercase text-slate-500 tracking-wider">Avatar Url Coordinate</label>
                  <input
                    type="text"
                    required
                    value={editImg}
                    onChange={(e) => setEditImg(e.target.value)}
                    className="w-full h-9 px-2.5 bg-slate-50 border border-slate-200 focus:border-[#ff8c00] rounded-xl text-[10px] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-10 bg-[#ff8c00] hover:bg-orange-600 text-white font-black uppercase tracking-wider text-[10px] rounded-xl cursor-pointer shadow-md shadow-orange-100 flex items-center justify-center gap-1.5 pt-0.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Commit modifications</span>
                </button>
              </form>
            </motion.div>
          </>
        )}

        {/* ADD CORPORATE CREDIT CARD DIALOG */}
        {showAddCard && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddCard(false)}
              className="fixed inset-0 bg-[#1a1c1c]/80 z-50 cursor-pointer"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] bg-white border-2 border-[#1a1c1c] rounded-3xl p-5 z-55 shadow-2xl flex flex-col text-left space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b-2 border-slate-150">
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Secure Payment Gateway</span>
                <button
                  type="button"
                  onClick={() => setShowAddCard(false)}
                  className="w-6 h-6 rounded-full bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newCardNum || !newCardHolder || !newCardExp) return;
                  const masked = '•••• •••• •••• ' + newCardNum.replace(/\s+/g, '').slice(-4);
                  const newCardObj: PaymentCard = {
                    id: `card-${Date.now()}`,
                    holder: newCardHolder.toUpperCase(),
                    num: masked,
                    exp: newCardExp,
                    isCorporate: newCardCorp
                  };
                  const updated = [...paymentCards, newCardObj];
                  setPaymentCards(updated);
                  localStorage.setItem('hg_payment_cards', JSON.stringify(updated));
                  setNewCardNum('');
                  setNewCardHolder('');
                  setNewCardExp('');
                  setNewCardCorp(false);
                  setShowAddCard(false);
                }}
                className="space-y-3 text-xs"
              >
                <div className="space-y-1">
                  <label className="text-[8.5px] font-black uppercase text-slate-500 tracking-wider">Cardholder Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. RAJESH KUMAR"
                    value={newCardHolder}
                    onChange={(e) => setNewCardHolder(e.target.value)}
                    className="w-full h-9 px-2.5 bg-slate-50 border border-slate-200 focus:border-[#ff8c00] rounded-xl outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[8.5px] font-black uppercase text-slate-500 tracking-wider">16-Digit Card Number</label>
                  <input
                    type="text"
                    required
                    maxLength={19}
                    placeholder="4111 2222 3333 5590"
                    value={newCardNum}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\s+/g, '').replace(/(\d{4})/g, '$1 ').trim();
                      setNewCardNum(value);
                    }}
                    className="w-full h-9 px-2.5 bg-slate-50 border border-slate-200 focus:border-[#ff8c00] rounded-xl outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[8.5px] font-black uppercase text-slate-500 tracking-wider">Exp Date</label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      maxLength={5}
                      value={newCardExp}
                      onChange={(e) => {
                        let val = e.target.value;
                        if (val.length === 2 && !val.includes('/')) {
                          val += '/';
                        }
                        setNewCardExp(val);
                      }}
                      className="w-full h-9 px-2.5 bg-slate-50 border border-slate-200 focus:border-[#ff8c00] rounded-xl outline-none text-center"
                    />
                  </div>

                  <div className="flex flex-col justify-end pb-1 font-bold">
                    <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-slate-600">
                      <input
                        type="checkbox"
                        checked={newCardCorp}
                        onChange={(e) => setNewCardCorp(e.target.checked)}
                        className="rounded border-slate-300 text-[#ff8c00] focus:ring-[#ff8c00] w-4 h-4"
                      />
                      <span>Revolving Card</span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-10 bg-slate-900 hover:bg-[#ff8c00] text-white font-black uppercase tracking-wider text-[10px] rounded-xl cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                >
                  <CreditCard className="w-4 h-4 text-orange-400" />
                  <span>Bind Corporate Card</span>
                </button>
              </form>
            </motion.div>
          </>
        )}

        {/* NOTIFICATION PREFERENCES DIALOG */}
        {showNotificationsModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNotificationsModal(false)}
              className="fixed inset-0 bg-[#1a1c1c]/80 z-50 cursor-pointer"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[325px] bg-white border-2 border-[#1a1c1c] rounded-3xl p-5 z-55 shadow-2xl flex flex-col text-left space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b-2 border-slate-150">
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Alert Gatekeeper Channels</span>
                <button
                  type="button"
                  onClick={() => setShowNotificationsModal(false)}
                  className="w-6 h-6 rounded-full bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3 text-xs leading-none">
                <p className="text-[9px] text-slate-400 uppercase font-black tracking-wider leading-relaxed">
                  Decide where to broadcast cargo tracking metrics, fuel allocations, and logistics updates:
                </p>

                <label className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-150 rounded-xl cursor-pointer">
                  <div className="space-y-0.5 text-left">
                    <span className="font-bold text-slate-750 block text-[11px]">Dispatch Email Broadcasts</span>
                    <span className="text-[8px] text-slate-400 font-mono">Archive order invoices dynamically</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifEmail}
                    onChange={(e) => setNotifEmail(e.target.checked)}
                    className="rounded border-slate-300 text-[#ff8c00] focus:ring-[#ff8c00] w-4.5 h-4.5"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-150 rounded-xl cursor-pointer">
                  <div className="space-y-0.5 text-left">
                    <span className="font-bold text-slate-750 block text-[11px]">Fast Mobile Push Alerts</span>
                    <span className="text-[8px] text-slate-400 font-mono">Live driver coordinate notifications</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifPush}
                    onChange={(e) => setNotifPush(e.target.checked)}
                    className="rounded border-slate-300 text-[#ff8c00] focus:ring-[#ff8c00] w-4.5 h-4.5"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-150 rounded-xl cursor-pointer">
                  <div className="space-y-0.5 text-left">
                    <span className="font-bold text-slate-750 block text-[11px]">Direct SMS Alerts</span>
                    <span className="text-[8px] text-slate-400 font-mono">Failback SMS for dead-zone quarries</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifSMS}
                    onChange={(e) => setNotifSMS(e.target.checked)}
                    className="rounded border-slate-300 text-[#ff8c00] focus:ring-[#ff8c00] w-4.5 h-4.5"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-150 rounded-xl cursor-pointer">
                  <div className="space-y-0.5 text-left">
                    <span className="font-bold text-slate-750 block text-[11px]">Depot System Maintenance Logs</span>
                    <span className="text-[8px] text-slate-400 font-mono">Scheduled machinery recalibration bulletins</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifMaintenance}
                    onChange={(e) => setNotifMaintenance(e.target.checked)}
                    className="rounded border-slate-300 text-[#ff8c00] focus:ring-[#ff8c00] w-4.5 h-4.5"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => {
                    triggerNotification('SUCCESS: Dispatch channels saved.');
                    setShowNotificationsModal(false);
                  }}
                  className="w-full h-10 bg-slate-900 hover:bg-[#ff8c00] text-white font-black uppercase tracking-wider text-[9px] rounded-xl flex items-center justify-center cursor-pointer transition-colors pt-0.5"
                >
                  Apply gatekeeper updates
                </button>
              </div>
            </motion.div>
          </>
        )}

        {/* PRIVACY & SECURITY DIALOG */}
        {showPrivacyModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPrivacyModal(false)}
              className="fixed inset-0 bg-[#1a1c1c]/80 z-50 cursor-pointer"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[310px] bg-slate-950 text-white border-2 border-[#ff8c00]/30 rounded-3xl p-5 z-55 shadow-2xl flex flex-col text-left space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
                <span className="text-[8px] font-mono font-bold text-orange-400 uppercase tracking-widest">Active Security Protocol</span>
                <button
                  type="button"
                  onClick={() => setShowPrivacyModal(false)}
                  className="w-6 h-6 rounded-full bg-neutral-900 border border-neutral-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="p-3 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-2">
                  <div className="flex justify-between font-mono text-[9px] text-[#ff8c00]">
                    <span>LEDGER ENCRYPTON:</span>
                    <span className="font-bold">ACTIVE (AES-256 GCM)</span>
                  </div>
                  <div className="flex justify-between font-mono text-[9px] text-emerald-450 text-[9px] text-emerald-400">
                    <span>TEL_GRID SYNC:</span>
                    <span className="font-bold">OK (SSL/TLS v1.3)</span>
                  </div>
                  <div className="flex justify-between font-mono text-[9px] text-slate-400">
                    <span>KEYCHAIN VAULT ID:</span>
                    <span className="font-bold">VAULT-453F-900A</span>
                  </div>
                </div>

                <label className="flex items-center justify-between p-2.5 bg-neutral-900 border border-neutral-800 rounded-xl cursor-pointer">
                  <div className="space-y-0.5 text-left">
                    <span className="font-bold text-white block text-[11px] font-sans">Passcode Dispatch Shield</span>
                    <span className="text-[8px] text-slate-500 font-mono">Query validation prompt on book</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={hasPasscode}
                    onChange={(e) => setHasPasscode(e.target.checked)}
                    className="rounded border-neutral-750 text-[#ff8c00] focus:ring-[#ff8c00] w-4.5 h-4.5 bg-neutral-900"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => {
                    triggerNotification('Privacy Shield updated successfully.');
                    setShowPrivacyModal(false);
                  }}
                  className="w-full h-10 bg-[#ff8c00] hover:bg-orange-600 text-white font-black uppercase tracking-widest text-[9.5px] rounded-xl flex items-center justify-center cursor-pointer border-none pt-0.5"
                >
                  Dismiss Security Interface
                </button>
              </div>
            </motion.div>
          </>
        )}

        {/* CLOUD SANDBOX CREDENTIALS INTEGRATION DIALOG */}
        {showIntegrationModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowIntegrationModal(false)}
              className="fixed inset-0 bg-[#1a1c1c]/80 z-50 cursor-pointer"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] max-h-[580px] overflow-y-auto bg-slate-900 text-white border-2 border-[#ff8c00]/40 rounded-3xl p-5 z-55 shadow-2xl flex flex-col text-left space-y-3.5 font-sans"
            >
              <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
                <span className="text-[9px] font-mono font-bold text-[#ff8c00] uppercase tracking-widest flex items-center gap-1.5">
                  <Cloud className="w-3.5 h-3.5 animate-pulse" />
                  Cloud API Integrations
                </span>
                <button
                  type="button"
                  onClick={() => setShowIntegrationModal(false)}
                  className="w-6 h-6 rounded-full bg-neutral-950 border border-neutral-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3 text-[10px]">
                <p className="text-slate-400 leading-relaxed text-[9.5px]">
                  Provide your own sandbox credentials to connect map visualization components and backend database functions directly to your custom cloud tenants.
                </p>

                <div className="space-y-1 text-left">
                  <label className="text-[8.5px] font-mono font-bold text-orange-400 uppercase tracking-widest block">Google Maps API Key</label>
                  <input
                    type="password"
                    placeholder="AIzaSyA..."
                    value={googleMapsKey}
                    onChange={(e) => setGoogleMapsKey(e.target.value)}
                    className="w-full h-8.5 px-2.5 bg-neutral-950 border border-neutral-800 focus:border-[#ff8c00] rounded-xl text-xs outline-none text-white font-mono placeholder:text-slate-600"
                  />
                </div>

                <div className="border-t border-neutral-800 my-2 pt-2">
                  <span className="text-[8.5px] font-mono font-bold text-[#ff8c00] uppercase tracking-widest block mb-1">Firebase Configuration Block</span>
                  
                  <div className="space-y-2.5">
                    <div className="space-y-1">
                      <label className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Firebase API Key</label>
                      <input
                        type="password"
                        placeholder="AIzaSyB..."
                        value={firebaseApiKey}
                        onChange={(e) => setFirebaseApiKey(e.target.value)}
                        className="w-full h-8 px-2 bg-neutral-950 border border-neutral-800 focus:border-[#ff8c00] rounded-xl outline-none text-white font-mono placeholder:text-slate-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Project ID</label>
                      <input
                        type="text"
                        placeholder="heavygear-project-123"
                        value={firebaseProjectId}
                        onChange={(e) => setFirebaseProjectId(e.target.value)}
                        className="w-full h-8 px-2 bg-neutral-950 border border-neutral-800 focus:border-[#ff8c00] rounded-xl outline-none text-white font-mono placeholder:text-slate-600"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-wider block truncate">Auth Domain</label>
                        <input
                          type="text"
                          placeholder="heavygear.firebaseapp.com"
                          value={firebaseAuthDomain}
                          onChange={(e) => setFirebaseAuthDomain(e.target.value)}
                          className="w-full h-8 px-2 bg-neutral-950 border border-neutral-800 focus:border-[#ff8c00] rounded-xl outline-none text-white text-[9px] font-mono placeholder:text-slate-700"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-wider block truncate">Storage Bucket</label>
                        <input
                          type="text"
                          placeholder="heavygear.appspot.com"
                          value={firebaseStorageBucket}
                          onChange={(e) => setFirebaseStorageBucket(e.target.value)}
                          className="w-full h-8 px-2 bg-[#0d0e0e] border border-neutral-800 focus:border-[#ff8c00] rounded-xl outline-none text-white text-[9px] font-mono placeholder:text-slate-700"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-wider block truncate">Messaging Sender ID</label>
                        <input
                          type="text"
                          placeholder="38294029482"
                          value={firebaseSenderId}
                          onChange={(e) => setFirebaseSenderId(e.target.value)}
                          className="w-full h-8 px-2 bg-[#0d0e0e] border border-neutral-800 focus:border-[#ff8c00] rounded-xl outline-none text-white text-[9px] font-mono placeholder:text-slate-700"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-wider block truncate">App ID</label>
                        <input
                          type="text"
                          placeholder="1:3829402:web:9f2"
                          value={firebaseAppId}
                          onChange={(e) => setFirebaseAppId(e.target.value)}
                          className="w-full h-8 px-2 bg-[#0d0e0e] border border-neutral-800 focus:border-[#ff8c00] rounded-xl outline-none text-white text-[9px] font-mono placeholder:text-slate-700"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-800 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setGoogleMapsKey('');
                      setFirebaseApiKey('');
                      setFirebaseProjectId('');
                      setFirebaseAuthDomain('');
                      setFirebaseStorageBucket('');
                      setFirebaseSenderId('');
                      setFirebaseAppId('');
                      if (userEmail) {
                        const lEmail = userEmail.toLowerCase();
                        localStorage.removeItem(`hg_gmaps_key_${lEmail}`);
                        localStorage.removeItem(`hg_fb_api_key_${lEmail}`);
                        localStorage.removeItem(`hg_fb_project_id_${lEmail}`);
                        localStorage.removeItem(`hg_fb_auth_domain_${lEmail}`);
                        localStorage.removeItem(`hg_fb_storage_bucket_${lEmail}`);
                        localStorage.removeItem(`hg_fb_sender_id_${lEmail}`);
                        localStorage.removeItem(`hg_fb_app_id_${lEmail}`);
                      } else {
                        localStorage.removeItem('hg_gmaps_key');
                        localStorage.removeItem('hg_fb_api_key');
                        localStorage.removeItem('hg_fb_project_id');
                        localStorage.removeItem('hg_fb_auth_domain');
                        localStorage.removeItem('hg_fb_storage_bucket');
                        localStorage.removeItem('hg_fb_sender_id');
                        localStorage.removeItem('hg_fb_app_id');
                      }
                      triggerNotification('CLEARED: Sandbox keys wiped safely.');
                      setShowIntegrationModal(false);
                    }}
                    className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 font-mono text-[8px] font-extrabold uppercase tracking-widest text-[#ff8c00] transition-colors border-none cursor-pointer"
                  >
                    Wipe Keys
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (userEmail) {
                        const lEmail = userEmail.toLowerCase();
                        localStorage.setItem(`hg_gmaps_key_${lEmail}`, googleMapsKey);
                        localStorage.setItem(`hg_fb_api_key_${lEmail}`, firebaseApiKey);
                        localStorage.setItem(`hg_fb_project_id_${lEmail}`, firebaseProjectId);
                        localStorage.setItem(`hg_fb_auth_domain_${lEmail}`, firebaseAuthDomain);
                        localStorage.setItem(`hg_fb_storage_bucket_${lEmail}`, firebaseStorageBucket);
                        localStorage.setItem(`hg_fb_sender_id_${lEmail}`, firebaseSenderId);
                        localStorage.setItem(`hg_fb_app_id_${lEmail}`, firebaseAppId);
                      } else {
                        localStorage.setItem('hg_gmaps_key', googleMapsKey);
                        localStorage.setItem('hg_fb_api_key', firebaseApiKey);
                        localStorage.setItem('hg_fb_project_id', firebaseProjectId);
                        localStorage.setItem('hg_fb_auth_domain', firebaseAuthDomain);
                        localStorage.setItem('hg_fb_storage_bucket', firebaseStorageBucket);
                        localStorage.setItem('hg_fb_sender_id', firebaseSenderId);
                        localStorage.setItem('hg_fb_app_id', firebaseAppId);
                      }
                      triggerNotification('SUCCESS: Custom sandbox API credentials linked.');
                      setShowIntegrationModal(false);
                    }}
                    className="flex-1 py-1.5 h-9 rounded-xl bg-[#ff8c00] hover:bg-orange-600 font-mono text-[8px] font-black uppercase tracking-widest text-white transition-colors border-none cursor-pointer flex items-center justify-center"
                  >
                    Save & Bind
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {/* FLEET SERVICE CHAT/TICKET DESK */}
        {showSupportDesk && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSupportDesk(false)}
              className="fixed inset-0 bg-[#1a1c1c]/80 z-50 cursor-pointer"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] bg-white border-2 border-[#1a1c1c] rounded-3xl p-5 z-55 shadow-2xl flex flex-col text-left space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b-2 border-slate-150">
                <div className="text-left space-y-0.5">
                  <span className="text-[8px] font-black text-slate-400 block tracking-widest">HEAVYGEAR LOGISTICS</span>
                  <span className="text-xs font-black tracking-tight block uppercase">Dispatch Desk</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSupportDesk(false)}
                  className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center cursor-pointer border-none"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-left">
                <div className="p-2.5 bg-amber-500/5 border border-[#ff8c00]/15 rounded-xl text-[10px] leading-relaxed text-slate-600 font-medium">
                  <strong className="text-[#904d00] font-black block mb-0.5 uppercase tracking-wide">Depot Dispatch Hotline:</strong>
                  For instant roadside aggregate assistance, high-site hydration pumps failure, or priority vehicle rerouting support, transmit your log ticket below. Representative responds in 3 minutes.
                </div>

                <div className="space-y-1">
                  <label className="text-[8.5px] font-black uppercase text-slate-500 tracking-wider">Describe operational ticket log</label>
                  <textarea
                    rows={3}
                    value={supportText}
                    onChange={(e) => setSupportText(e.target.value)}
                    placeholder="e.g. Caterpillar model water levels dropping at Sector 9..."
                    className="w-full text-[11px] p-2.5 bg-slate-50 border border-slate-200 focus:border-[#ff8c00] rounded-xl outline-none leading-normal font-sans"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!supportText.trim()) {
                      triggerNotification('Please input active log details before submitting.');
                      return;
                    }
                    triggerNotification(`TICKET TRANSMITTED: Log ID TKT-${Math.floor(1000 + Math.random() * 8999)} is bound to terminal ${profileId} for operator ${profileName}.`);
                    setSupportText('');
                    setShowSupportDesk(false);
                  }}
                  className="w-full h-10 bg-slate-900 hover:bg-[#ff8c00] text-white font-black uppercase tracking-wider text-[10px] rounded-xl mt-2 cursor-pointer transition-colors flex items-center justify-center gap-1.5 pt-0.5"
                >
                  <Compass className="w-4 h-4 text-orange-400" />
                  <span>Transmit ticket to depot</span>
                </button>
              </div>
            </motion.div>
          </>
        )}

        {/* BUSY MACHINERY WAITLIST ALERT DIALOG */}
        {showBusyAlert && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBusyAlert(false)}
              className="fixed inset-0 bg-[#1a1c1c]/90 z-50 cursor-pointer"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] bg-white border-2 border-[#ff8c00] rounded-3xl p-6 z-55 shadow-2xl flex flex-col text-left space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b-2 border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#ff8c00] animate-spin" style={{ animationDuration: '4s' }} />
                  <span className="text-[10px] font-sans font-black uppercase text-[#1a1c1c] tracking-wider">
                    Machinery Status Alert
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBusyAlert(false)}
                  className="w-6 h-6 rounded-full bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3.5 text-xs text-left">
                <div className="bg-amber-50 border border-amber-200/60 p-3 rounded-2xl flex flex-col gap-1.5">
                  <span className="text-[9.5px] font-sans font-black text-[#904d00] uppercase tracking-wider block">
                    {busyMachineryName || 'Selected Machinery'} — BUSY AT ANOTHER SITE
                  </span>
                  <p className="text-[11px] text-[#623200] leading-normal font-medium font-sans">
                    This vehicle is currently running at another work site. You cannot book it directly right now.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#ff8c00] animate-ping shrink-0" />
                    <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">Waitlist Status</span>
                  </div>
                  <p className="text-[10.5px] text-slate-600 font-medium">
                    We have added you to the waitlist. We will send you an SMS and notification the moment this machinery becomes free.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      triggerNotification(`WAITLIST REGISTERED: You will receive SMS alerts when ${busyMachineryName} becomes free.`);
                      setShowBusyAlert(false);
                    }}
                    className="flex-1 h-10 bg-[#ff8c00] hover:bg-orange-600 text-white font-sans font-black uppercase tracking-wider text-[9px] rounded-xl cursor-pointer shadow-md shadow-orange-100 flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4 text-white" />
                    <span>Join Waitlist</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {/* 1. OPERATOR HELP CENTER & FAQ MODAL */}
        {showFAQModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFAQModal(false)}
              className="fixed inset-0 bg-[#1a1c1c]/90 z-50 cursor-pointer"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] max-h-[80vh] bg-white border-2 border-[#ff8c00] rounded-3xl p-6 z-55 shadow-2xl flex flex-col text-left space-y-4"
            >
              <div className="flex justify-between items-center pb-2.5 border-b-2 border-slate-100 shrink-0">
                <div className="flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-[#ff8c00]" />
                  <span className="text-[10px] font-sans font-black uppercase text-[#1a1c1c] tracking-wider">
                    Operator Help Center & FAQ
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFAQModal(false)}
                  className="w-6 h-6 rounded-full bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3.5 text-xs text-left overflow-y-auto pr-1 max-h-[45vh]">
                <div className="space-y-1 bg-amber-50 border border-amber-200/50 p-2.5 rounded-xl">
                  <span className="text-[9px] font-black uppercase tracking-wider text-[#904d00]">1. Setup Diesel Policy</span>
                  <p className="text-[10.5px] text-[#623200] leading-relaxed">
                    Standard diesel-powered dispatches include 5k Liters of operational setup diesel. Refills are requested via HG-Depot credits.
                  </p>
                </div>

                <div className="space-y-1 bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">2. Active In-Cab Telematics</span>
                  <p className="text-[10.5px] text-slate-600 leading-relaxed">
                    Satellite track meters must stay active. If dead-zone quarry operates, SMS signals automatically log coordinate stamps.
                  </p>
                </div>

                <div className="space-y-1 bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">3. Drop-Off Logistics</span>
                  <p className="text-[10.5px] text-slate-600 leading-relaxed">
                    At session end, lock the vehicle cabin and slide keys carefully inside the secure Drop Box located at Depot Sector 4.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowFAQModal(false)}
                className="w-full h-10 bg-slate-900 hover:bg-[#ff8c00] text-white font-sans font-black uppercase tracking-wider text-[9px] rounded-xl flex items-center justify-center cursor-pointer transition-colors"
              >
                Acknowledge Info Guidelines
              </button>
            </motion.div>
          </>
        )}

        {/* 2. LOGISTICS PRIVACY POLICY MODAL */}
        {showPrivacyPolicyModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPrivacyPolicyModal(false)}
              className="fixed inset-0 bg-[#1a1c1c]/90 z-50 cursor-pointer"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] bg-slate-900 border-2 border-orange-500/30 rounded-3xl p-6 z-55 shadow-2xl flex flex-col text-left space-y-4 text-white"
            >
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-[#ff8c00]" />
                  <span className="text-[10px] font-sans font-black uppercase text-slate-100 tracking-wider">
                    Logistics Privacy Policy
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPrivacyPolicyModal(false)}
                  className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer border-none"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3.5 text-xs text-left">
                <p className="text-[10.5px] text-slate-350 leading-relaxed">
                  Real-time geolocation telemetry monitors machinery speeds and fuel metrics. Routes remain cryptographically locked inside local containers:
                </p>

                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-850 space-y-2 font-mono text-[9px] text-slate-400">
                  <div className="flex justify-between">
                    <span>GRID COORDINATES:</span>
                    <span className="text-[#ff8c00] font-black">ENCRYPTED</span>
                  </div>
                  <p className="text-[8px] text-slate-500 leading-normal pl-2 border-l border-slate-800">
                    Your route tracks are deleted dynamically 48 hours following dispatch completion.
                  </p>
                  
                  <div className="flex justify-between pt-1">
                    <span>KEYCHAIN ID LOGS:</span>
                    <span className="text-emerald-450 font-black">SECURED</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPrivacyPolicyModal(false)}
                className="w-full h-10 bg-[#ff8c00] hover:bg-orange-600 text-white font-sans font-black uppercase tracking-wider text-[9px] rounded-xl flex items-center justify-center cursor-pointer transition-colors border-none"
              >
                Close Privacy Rules
              </button>
            </motion.div>
          </>
        )}

        {/* 3. HIGH FIDELITY TOAST SYSTEM */}
        {showSuccessNotif && (
          <>
            <motion.div
              initial={{ opacity: 0, y: -40, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -45, x: '-50%' }}
              className="fixed top-6 left-1/2 -translate-x-1/2 w-[310px] bg-slate-905 bg-[#1a1c1c] border border-[#ff8c00]/40 text-white p-3.5 rounded-2xl z-60 shadow-2xl flex items-start gap-3"
            >
              <div className="w-5 h-5 rounded-full bg-[#ff8c00]/10 text-[#ff8c00] flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle className="w-4.5 h-4.5 text-[#ff8c00]" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <span className="text-[8.5px] font-sans font-black uppercase tracking-wider text-orange-400 block leading-none mb-1">
                  HEAVYGEAR ALERT
                </span>
                <p className="text-[10.5px] text-slate-200 font-sans font-medium leading-normal pr-1">
                  {notifMessage}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSuccessNotif(false)}
                className="text-slate-500 hover:text-white shrink-0 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MODAL POPUPS: 2. Booking form detail Drawer */}
      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              exit={{ opacity: 0 }}
              id="booking-backdrop"
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-[#1a1c1c] z-35"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 24, stiffness: 220 }}
              id="booking-checkout-bottom-sheet"
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl border-t-2 border-slate-200 z-40 p-4 space-y-4 max-h-[92%] overflow-y-auto"
            >
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                <div className="space-y-0.5 text-left">
                  <span className="text-[7.5px] font-black text-[#ff8c00] uppercase tracking-widest block">
                    Secured Telemetry request
                  </span>
                  <h3 className="text-[13px] font-black uppercase text-slate-800 tracking-tight">
                    Checkout: {selectedItem.name}
                  </h3>
                </div>
                
                <button
                  type="button"
                  id="btn-close-booking"
                  onClick={() => setSelectedItem(null)}
                  className="w-7 h-7 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Machinery Highlight spec banner */}
              <div className="bg-slate-50 border border-slate-150 rounded-xl p-2.5 flex gap-3 text-left">
                <div className="w-16 h-16 shrink-0 bg-slate-100 border border-slate-200 rounded-xl overflow-hidden relative">
                  <img
                    referrerPolicy="no-referrer"
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-[#1a1c1c]/85 text-white text-[7px] text-center font-mono py-0.5">
                    {selectedItem.id}
                  </div>
                </div>

                <div className="flex-1 min-w-0 space-y-0.5">
                  <p className="text-[10px] font-black text-slate-700 uppercase tracking-tight">
                    {selectedItem.name}
                  </p>
                  <p className="text-[9px] text-slate-400 italic font-medium leading-tight">
                    "{selectedItem.description}"
                  </p>
                  <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-slate-200/50 font-mono text-[8px] text-slate-500">
                    <span>Power: <strong>{selectedItem.horsepower}</strong></span>
                    <span>Class: <strong>{selectedItem.weight}</strong></span>
                  </div>
                </div>
              </div>

              {/* Rate parameters */}
              <div className="bg-amber-50/50 border border-amber-500/10 rounded-xl p-3 space-y-1 text-left text-xs text-slate-700">
                <div className="flex justify-between font-black text-slate-800">
                  <span className="uppercase text-[8.5px] text-slate-400 tracking-wide font-sans">Base Rental Rate</span>
                  <span className="text-[#ff8c00] font-mono">₹{selectedItem.rate}/hour</span>
                </div>
                
                {freeCoupons > 0 ? (
                  <div className="flex justify-between items-center text-[8px] font-black text-emerald-600 bg-emerald-50 py-1 px-2 rounded-lg border border-emerald-100">
                    <span>LIFETIME COUPON APPLIED:</span>
                    <span>FLAT 100% OFF</span>
                  </div>
                ) : (
                  <div className="flex justify-between text-[8px] text-slate-400">
                    <span>Logistics crew setup transport:</span>
                    <span>FREE (PROMOTIONAL SLOT)</span>
                  </div>
                )}
              </div>

              {/* Destination Area selection Form */}
              <form onSubmit={handleConfirmBooking} className="space-y-4 text-left">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#ff8c00]" />
                    Project Site Location coordinates
                  </label>
                  <input
                    type="text"
                    id="input-site-coordinates"
                    required
                    value={bookingLocation}
                    onChange={(e) => setBookingLocation(e.target.value)}
                    placeholder="e.g. Sector 8 Rigging Coordinate or Grid-4B"
                    className="w-full h-9 px-3 bg-slate-50 border border-slate-200 focus:border-[#ff8c00] rounded-xl outline-none text-slate-800 text-xs font-medium"
                  />
                  <p className="text-[8px] text-slate-400 italic">
                    Operator scheduling and diesel transport standard logs are managed on dispatch dashboard.
                  </p>
                </div>

                <button
                  type="submit"
                  id="btn-confirm-checkout"
                  disabled={isBookingSubmitting}
                  className={`w-full h-10.5 bg-[#ff8c00] hover:bg-orange-600 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 rounded-xl outline-none shadow-md shadow-orange-100 ${
                    isBookingSubmitting ? 'opacity-85 cursor-wait' : 'cursor-pointer active:scale-98'
                  }`}
                >
                  {isBookingSubmitting ? (
                    <>
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin shrink-0" />
                      <span>AUTHORIZING TELEMETRY STACK...</span>
                    </>
                  ) : (
                    <>
                      <Truck className="w-4 h-4 text-white" />
                      <span>{freeCoupons > 0 ? 'USE COUPON & DISPATCH CARRIER' : 'Authorize dispatch now'}</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MODAL POPUPS: 3. Invoice Telemetry receipt Sheet popup */}
      <AnimatePresence>
        {viewingInvoice && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingInvoice(null)}
              className="absolute inset-0 bg-[#000000] z-50"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[310px] bg-white border-2 border-slate-900 rounded-3xl p-5 z-55 shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b-2 border-slate-150">
                <div className="text-left">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">HEAVYGEAR LOGISTICS</span>
                  <span className="text-xs font-black uppercase tracking-tight block">Invoice Breakdown</span>
                </div>
                
                <button
                  onClick={() => setViewingInvoice(null)}
                  className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 border-none cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Receipt Body content */}
              <div className="space-y-3.5 text-left text-[11px] font-mono text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-150 relative">
                
                {/* Visual barcode indicator for high contrast industrial style */}
                <div className="w-full h-5 bg-neutral-900 flex justify-between px-2 items-center text-white/50 text-[5px] select-none rounded">
                  <span>| || | |||| || | | |||| || || | | </span>
                  <span className="text-[6px] tracking-widest font-black text-white">{viewingInvoice.bookingId}</span>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-slate-400 text-[8.5px] uppercase font-sans font-black">
                    <span>Parameter</span>
                    <span>Assigned Log</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-slate-450 font-sans">Vehicle:</span>
                    <strong className="text-slate-850 text-right">{viewingInvoice.machineryName}</strong>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-450 font-sans">Dispatch ID:</span>
                    <strong className="text-slate-850">{viewingInvoice.bookingId}</strong>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-450 font-sans">Deployment Date:</span>
                    <strong>{viewingInvoice.date.split('•')[0]}</strong>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-450 font-sans">Coordinate:</span>
                    <strong className="text-slate-850 truncate max-w-[120px]">{viewingInvoice.location}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-dashed border-slate-300 space-y-1">
                  <div className="flex justify-between">
                    <span className="font-sans">Hourly Rental Rate:</span>
                    <span>₹{viewingInvoice.rate}/hour</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-sans">Transport deployment:</span>
                    <span className="text-emerald-600">FREE</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-sans">Estimated Slot total:</span>
                    <span>4 Hours Min</span>
                  </div>

                  <div className="flex justify-between pt-1.5 border-t border-slate-300 text-xs font-black text-slate-900">
                    <span className="font-sans">GRAND METRIC TOTAL:</span>
                    <span className="text-[#ff8c00]">₹{viewingInvoice.orderPrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* Simulated printer message */}
                <button
                  type="button"
                  onClick={() => { triggerNotification('SUCCESS: Printer task transmitted securely to your local depot network receiver.'); setViewingInvoice(null); }}
                  className="w-full py-1 bg-[#1a1c1c] hover:bg-neutral-800 text-white font-sans text-[8.5px] font-black uppercase tracking-widest rounded-xl transition-all border-none flex items-center justify-center gap-1"
                >
                  <Printer className="w-3 h-3 text-[#ff8c00]" />
                  <span>Transmit to depot printer</span>
                </button>
              </div>

              <p className="text-[8px] text-slate-400 uppercase font-bold tracking-wider italic text-center">
                All receipts are securely archived inside HeavyGear blockchain ledger database.
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MODAL POPUPS: 4. Telemetry Satellite active tracker popup */}
      <AnimatePresence>
        {trackingTelemetry && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.55 }}
              exit={{ opacity: 0 }}
              onClick={() => setTrackingTelemetry(null)}
              className="absolute inset-0 bg-[#1a1c1c] z-50"
            />

            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[310px] bg-[#1a1c1c] text-white border-2 border-orange-500 rounded-3xl p-5 z-55 shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-orange-500/30">
                <div className="text-left">
                  <span className="text-[7px] font-bold text-orange-400 uppercase tracking-widest block">TELEMETRY DEPLOYMENT SIGNAL</span>
                  <h3 className="text-xs font-black uppercase tracking-tight text-white">{trackingTelemetry.machineryName}</h3>
                </div>

                <button
                  onClick={() => setTrackingTelemetry(null)}
                  className="w-6 h-6 bg-neutral-800 rounded-full flex items-center justify-center text-slate-400 hover:text-white border-none cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Simulated visual radar/map panel */}
              <div className="w-full h-32 bg-[#1f2122] rounded-2xl border border-neutral-800 relative flex flex-col items-center justify-center overflow-hidden">
                <iframe
                  title="Active Live Map Tracking"
                  id="hg-active-gmaps-iframe"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(trackingTelemetry.location + ', Telangana, India')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-full border-none rounded-2xl"
                  allowFullScreen
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Estimate travel specs */}
              <div className="space-y-2.5 text-left font-mono text-[10px]">
                <div className="flex justify-between">
                  <span className="text-neutral-400 font-sans">Active Site Location:</span>
                  <span className="text-white font-bold">{trackingTelemetry.location}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-neutral-400 font-sans">Battery / Fuel load:</span>
                  <span className="text-orange-400 font-bold">92.4% Gallons capacity</span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[8px] text-neutral-400">
                    <span>DEPLOYMENT PIPELINE</span>
                    <span>24 MIN REMAINING</span>
                  </div>
                  {/* Progress completion bar */}
                  <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <motion.div
                      animate={{ width: ['20%', '65%', '45%', '70%'] }}
                      transition={{ duration: 15, repeat: Infinity, repeatType: 'reverse' }}
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"
                    />
                  </div>
                </div>

                <div className="bg-neutral-900/60 p-2 rounded-xl text-[8.5px] border border-neutral-800 font-sans leading-relaxed text-slate-300">
                  <span className="font-bold text-[#ff8c00] block mb-0.5">🚀 CARRIER DEPARTURE STATUS:</span>
                  Heavy logistical transport vehicle is securely carrying {trackingTelemetry.machineryName} to your target coordinate grid. Standard arrival secure escort coordinates active.
                </div>
              </div>

              <button
                full-width="true"
                type="button"
                onClick={() => setTrackingTelemetry(null)}
                className="w-full py-2 bg-gradient-to-r from-[#ff8c00] to-orange-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest border-none cursor-pointer hover:brightness-105 active:scale-97 transition-all leading-none"
              >
                DISMISS MONITOR SCREEN
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MODAL POPUPS: 5. Success Confetti dispatch overlay */}
      <AnimatePresence>
        {successBookingName && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            id="modal-success-overlay"
            className="absolute inset-0 bg-[#1a1c1c]/95 z-50 flex flex-col justify-center items-center p-6 text-center select-none"
          >
            <div className="w-16 h-16 rounded-full bg-[#ff8c00] flex items-center justify-center border-4 border-white shadow-xl animate-bounce">
              <Truck className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-[#ff8c00] text-[20px] font-black font-sans uppercase tracking-tight mt-4">
              Machinery Dispatched!
            </h2>
            <p className="text-white text-xs mt-1 leading-snug font-sans tracking-tight max-w-[220px]">
              Congratulations! Your request for safe allocation of <strong className="text-amber-300 font-black">{successBookingName}</strong> has been logged.
            </p>

            <div className="w-44 bg-neutral-905 border border-neutral-800 p-2.5 rounded-xl text-[9px] text-[#ff8c00] font-mono tracking-wider mt-5">
              <span>ESTIMATED FREIGHT ARRIVAL:</span>
              <strong className="block text-white mt-0.5 uppercase">24 MINUTES ESCORT ACTIVE</strong>
            </div>

            <p className="text-slate-400 text-[8px] uppercase font-bold tracking-widest mt-8 animate-pulse">
              Translating to Active tracking logs...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
