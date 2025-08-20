"use client";

import Image from 'next/image';
import { generateAvatar } from '@/lib/utils';

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: number;
}

export default function Avatar({ name, src, size = 64 }: AvatarProps) {
  const { initials, color } = generateAvatar(name);

  if (src) {
    return (
      <Image
        src={src}
        alt={name || 'Profile picture'}
        width={size}
        height={size}
        className="rounded-full"
      />
    );
  }

  return (
    <div
      className="flex items-center justify-center rounded-full font-bold text-white"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        fontSize: `${size / 2.5}px`,
      }}
    >
      {initials}
    </div>
  );
}