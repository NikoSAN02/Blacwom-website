'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SignUpModal({ isOpen, onClose }) {
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      router.push('/auth/signup');
      onClose();
    }
  }, [isOpen, onClose, router]);

  return null;
}