import { EquipmentItem, ServiceRequest } from './types';

export const INITIAL_EQUIPMENT: EquipmentItem[] = [
  {
    id: 'EQ-0924',
    name: 'Caterpillar 349 Hex',
    type: 'Excavator (50-Ton)',
    status: 'ACTIVE',
    efficiency: 94.2,
    lastChecked: '2 Hours Ago',
    image: 'https://images.unsplash.com/photo-1579684389782-64d84b5e905d?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'EQ-8812',
    name: 'Komatsu D155AX-8',
    type: 'Crawler Dozer',
    status: 'IDLE',
    efficiency: 88.5,
    lastChecked: '1 Day Ago',
    image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'EQ-4401',
    name: 'John Deere 850K',
    type: 'Dozer (Heavy duty)',
    status: 'MAINTENANCE',
    efficiency: 72.1,
    lastChecked: 'Just Now',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=300'
  }
];

export const INITIAL_REQUESTS: ServiceRequest[] = [
  {
    id: 'SR-771',
    equipment: 'Volvo EC380E Excavator',
    issue: 'Hydraulic high-pressure seal rupture in main bucket line',
    location: 'Sector 4 North Quarry',
    priority: 'CRITICAL',
    status: 'PENDING',
    date: '2026-05-21'
  },
  {
    id: 'SR-768',
    equipment: 'CAT 777G Haul Truck',
    issue: 'Engine management telemetry reporting exhaust filter restriction',
    location: 'Grid-12 Haul Road',
    priority: 'HIGH',
    status: 'DISPATCHED',
    date: '2026-05-21'
  },
  {
    id: 'SR-762',
    equipment: 'Komatsu PC210LC',
    issue: 'Scheduled 500-hr service (filters, hydraulic pump testing)',
    location: 'Central Depot Wash Bay',
    priority: 'MEDIUM',
    status: 'COMPLETED',
    date: '2026-05-20'
  }
];
