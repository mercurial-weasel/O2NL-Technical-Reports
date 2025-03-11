import React from 'react';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';

const roleColorMap = {
  'org:admin': 'bg-red-500/20 text-red-500',
  'org:amt': 'bg-green-500/20 text-green-500',
  'org:commercial': 'bg-blue-500/20 text-blue-500',
  'org:member': 'bg-gray-500/20 text-gray-500',
  'org:people': 'bg-purple-500/20 text-purple-500',
};

export function UserList({ users, onUserClick, onDeleteUser, onUpdateRole }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border-primary">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-background-card-to text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-3 bg-background-card-to text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 bg-background-card-to text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3 bg-background-card-to text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 bg-background-card-to text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-background-card-from divide-y divide-border-primary">
          {users.map((user) => {
            const userData = user.publicUserData;
            const userEmail = userData?.emailAddresses?.[0] || 'No email';
            const role = user.role || 'org:member';
            const displayRole = role.replace('org:', '');
            const isAdmin = role === 'org:admin';
            
            return (
              <tr 
                key={user.id}
                className="hover:bg-brand-primary/5 transition-colors cursor-pointer"
                onClick={() => onUserClick(user)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 uppercase font-bold">
                      {userData?.firstName?.[0] || userData?.lastName?.[0] || userEmail[0]}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-text-primary">
                        {userData?.firstName} {userData?.lastName}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                  {userEmail}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${roleColorMap[role] || 'bg-gray-500/20 text-gray-500'}`}>
                    {displayRole}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                  {user.status || 'Active'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2" onClick={e => e.stopPropagation()}>
                    <select 
                      className="text-xs bg-background-card-from border border-border-primary rounded px-2 py-1"
                      value={displayRole}
                      onChange={(e) => onUpdateRole(userData.userId, e.target.value)}
                    >
                      <option value="admin">Admin</option>
                      <option value="amt">AMT</option>
                      <option value="commercial">Commercial</option>
                      <option value="member">Member</option>
                      <option value="people">People</option>
                    </select>
                    
                    {!isAdmin && (
                      <button 
                        onClick={() => onDeleteUser(userData.userId)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
