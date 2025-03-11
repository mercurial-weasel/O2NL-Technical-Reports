import React from 'react';
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';

export function UserDetailsModal({ user, isOpen, onClose, onUpdateRole, onDeleteUser }) {
  if (!isOpen || !user) return null;

  const userData = user.publicUserData;
  const userEmail = userData?.emailAddresses?.[0] || 'No email';
  const role = user.role || 'org:member';
  const displayRole = role.replace('org:', '');
  const isAdmin = role === 'org:admin';

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-background-base rounded-lg shadow-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-text-primary">User Details</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex justify-center mb-4">
            <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-2xl uppercase font-bold">
              {userData?.firstName?.[0] || userData?.lastName?.[0] || userEmail[0]}
            </div>
          </div>

          <h3 className="text-lg font-medium text-text-primary text-center">
            {userData?.firstName} {userData?.lastName}
          </h3>
          <p className="text-text-secondary text-center">{userEmail}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Role
            </label>
            <select
              className="w-full bg-background-card-from border border-border-primary rounded px-3 py-2"
              value={displayRole}
              onChange={(e) => onUpdateRole(userData.userId, e.target.value)}
            >
              <option value="admin">Admin</option>
              <option value="amt">AMT</option>
              <option value="commercial">Commercial</option>
              <option value="member">Member</option>
              <option value="people">People</option>
            </select>
          </div>

          <div className="pt-4 border-t border-border-primary flex justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-border-primary rounded text-text-primary hover:bg-background-card-to"
            >
              Close
            </button>
            
            {!isAdmin && (
              <button
                onClick={() => {
                  onDeleteUser(userData.userId);
                  onClose();
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded flex items-center gap-2"
              >
                <TrashIcon className="h-4 w-4" /> Remove User
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
