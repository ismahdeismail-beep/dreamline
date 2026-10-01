import React, { useState } from 'react';
import { BusFront } from 'lucide-react';
import { COACH_TYPE_BADGE, type BusSchedule } from '../data/dreamlineData';

interface CoachPhotoProps {
  coachType: BusSchedule['coachType'];
  /** Optional photo path. When absent or broken, a branded placeholder renders instead. */
  src?: string;
  alt: string;
  className?: string;
}

/**
 * Coach photo banner with a graceful fallback.
 *
 * Never renders a broken image: if `src` is missing or fails to load we swap to
 * an indigo placeholder carrying the seat-layout badge, so cards stay visually
 * complete before real product photography is supplied.
 */
export const CoachPhoto: React.FC<CoachPhotoProps> = ({
  coachType,
  src,
  alt,
  className = ''
}) => {
  const [failed, setFailed] = useState(false);
  const badge = COACH_TYPE_BADGE[coachType];

  const showPhoto = Boolean(src) && !failed;

  return (
    <div className={`relative overflow-hidden bg-[#34398e]/5 ${className}`}>
      {showPhoto ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full min-h-[120px] bg-gradient-to-br from-[#34398e] to-[#282c6e] flex flex-col items-center justify-center gap-1.5 text-white">
          <BusFront className="w-8 h-8 opacity-90" />
          <span className="text-[10px] font-black tracking-[0.2em] uppercase opacity-80">
            {coachType}
          </span>
        </div>
      )}

      {/* Seat-layout badge stays legible over both photo and placeholder */}
      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#34398e]/90 text-white text-[10px] font-black tracking-wide">
        {badge}
      </span>
    </div>
  );
};