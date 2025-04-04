import React from 'react';
import { MdEmail, MdLocationOn } from 'react-icons/md';
import { FaIdCard } from 'react-icons/fa';

const UserProfileCard = ({user }) => {
    const { _id, name, emailId, address, registrationNumber, photoUrl } = user;
    
  return (
    <div className="w-1/2 md:w-1/2 mx-20 p-6 md:p-0">
      <div className="bg-card-bg rounded-xl shadow-lg p-6 text-white transition-all hover:bg-card-hover">
        {/* Profile Photo */}
        <div className="flex justify-center mb-6">
          <div className="w-profile-photo h-profile-photo rounded-full border-2 border-card-accent overflow-hidden">
            <img
              src={photoUrl}
              alt={`${name}'s profile photo`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Name */}
        <h1 className="text-2xl font-semibold text-center mb-6">{name}</h1>

        {/* Details Section */}
        <div className="space-y-4">
          {/* Email */}
          <div className="flex items-center gap-2 text-base">
            <MdEmail className="text-xl text-card-accent" aria-hidden="true" />
            <span>{emailId}</span>
          </div>

          {/* Address */}
          <div className="flex items-center gap-2 text-base">
            <MdLocationOn className="text-xl text-card-accent" aria-hidden="true" />
            <span>{address}</span>
          </div>

          {/* Registration Number */}
          <div className="flex items-center gap-2 text-base">
            <FaIdCard className="text-xl text-card-accent" aria-hidden="true" />
            <span>{registrationNumber}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;