export type Role = 'customer' | 'provider';

export type ScreenMode = 'SIGN_UP' | 'SIGN_IN' | 'PORTAL' | 'TERMS_OF_SERVICE';

export interface UserAccount {
  fullName: string;
  email: string;
  phone: string;
  role: Role;
}

export interface EquipmentItem {
  id: string;
  name: string;
  type: string;
  status: 'ACTIVE' | 'MAINTENANCE' | 'IDLE';
  efficiency: number;
  lastChecked: string;
  image: string;
}

export interface ServiceRequest {
  id: string;
  equipment: string;
  issue: string;
  location: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  status: 'PENDING' | 'DISPATCHED' | 'COMPLETED';
  date: string;
}
