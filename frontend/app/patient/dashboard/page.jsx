'use client';

import { getUser, logout } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function PatientDashboard() {
  const router = useRouter();
  const user = getUser();

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Patient Dashboard</h1>
      <p>Welcome, {user.email}</p>

      <button
        onClick={() => {
          logout();
          router.push('/login');
        }}
      >
        Logout
      </button>
    </div>
  );
}
