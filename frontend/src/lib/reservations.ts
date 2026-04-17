import { apiRequest } from './api';

export interface Reservation {
  id: string;
  fullName: string;
  email: string;
  university: string;
  createdAt: string;
  checkedIn: boolean;
  checkedInAt: string | null;
}

export interface DashboardStats {
  total: number;
  checkedIn: number;
}

export interface ScanSuccess {
  fullName: string;
  university: string;
  reservationId: string;
}

type CheckinApiResult =
  | { status: 'success'; fullName: string; university: string }
  | { status: 'already_checked_in'; fullName: string; checkedInAt: string | null }
  | { status: 'not_found' };

function getStaffHeaders(): Record<string, string> {
  const staffPassword = sessionStorage.getItem('staff-pin') || '';
  return { 'x-staff-password': staffPassword };
}

export async function createReservation(data: {
  fullName: string;
  email: string;
  university: string;
}): Promise<Reservation> {
  const reservation = await apiRequest<{
    id: string;
    fullName: string;
    email: string;
    university: string;
    createdAt: string;
  }>('/api/reservations', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  return {
    ...reservation,
    checkedIn: false,
    checkedInAt: null,
  };
}

export async function getReservationById(id: string): Promise<Reservation | undefined> {
  try {
    return await apiRequest<Reservation>(`/api/reservations/${id}`);
  } catch {
    return undefined;
  }
}

export async function resendTicket(email: string): Promise<void> {
  await apiRequest<{ message: string }>('/api/reservations/resend', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function checkIn(id: string): Promise<
  { success: true; attendee: ScanSuccess } | { success: false; error: 'already' | 'invalid' }
> {
  const result = await apiRequest<CheckinApiResult>('/api/checkin/scan', {
    method: 'POST',
    headers: getStaffHeaders(),
    body: JSON.stringify({ reservationId: id }),
  });

  if (result.status === 'success') {
    return {
      success: true,
      attendee: {
        reservationId: id,
        fullName: result.fullName,
        university: result.university,
      },
    };
  }

  if (result.status === 'already_checked_in') {
    return { success: false, error: 'already' };
  }

  return { success: false, error: 'invalid' };
}

export async function getStats(): Promise<DashboardStats> {
  const stats = await apiRequest<{
    totalReservations: number;
    totalCheckedIn: number;
  }>('/api/dashboard/stats', {
    headers: getStaffHeaders(),
  });

  return {
    total: stats.totalReservations,
    checkedIn: stats.totalCheckedIn,
  };
}

export async function getAllReservations(): Promise<Reservation[]> {
  return apiRequest<Reservation[]>('/api/dashboard/reservations', {
    headers: getStaffHeaders(),
  });
}
