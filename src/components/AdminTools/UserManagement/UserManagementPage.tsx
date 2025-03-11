import React, { useState, useEffect } from 'react';
import { Header } from '@common/Header';
import { Footer } from '@common/Footer';
import { Section } from '@components/common';
import { UserList } from './UserList';
import { UserDetailsModal } from './UserDetailsModal';
import { useOrganization, useOrganizationList, useUser } from '@clerk/clerk-react';
import { Spinner } from '@components/common/Spinner';
import { TrashIcon, UserPlusIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export function UserManagementPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { organization } = useOrganization();
  const { createOrganization } = useOrganizationList();
  const { user } = useUser();

  // Debug output for admin access
  useEffect(() => {
    console.log('UserManagementPage accessed with user:', {
      userId: user?.id,
      email: user?.primaryEmailAddress?.emailAddress,
      organization,
      role: user?.organizationMemberships?.[0]?.role
    });
  }, [user, organization]);

  useEffect(() => {
    async function loadUsers() {
      if (!organization) {
        setError("No organization found. Please create an organization first.");
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Loading organization members...');
        const members = await organization.getMembershipList();
        console.log('Loaded members:', members);
        
        setUsers(members);
      } catch (error) {
        console.error('Error fetching organization members:', error);
        setError("Failed to load user list. Please try refreshing the page.");
      } finally {
        setIsLoading(false);
      }
    }
    
    loadUsers();
  }, [organization]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsUserDetailsModalOpen(true);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this user?')) {
      return;
    }
    
    try {
      setIsLoading(true);
      // Get the membership for this user
      const membership = users.find(member => member.publicUserData.userId === userId);
      if (membership) {
        await organization.removeMember(membership.id);
        // Update the users list
        setUsers(users.filter(user => user.id !== membership.id));
      }
    } catch (error) {
      console.error('Error removing user:', error);
      alert('Failed to remove user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInviteUser = async () => {
    const email = window.prompt('Enter email address to invite:');
    if (!email) return;
    
    try {
      setIsLoading(true);
      
      // Send invitation
      await organization.inviteMember({ 
        emailAddress: email,
        role: 'org:member' // Default role
      });
      
      alert(`Invitation sent to ${email}`);
      
      // Refresh the user list
      const members = await organization.getMembershipList();
      setUsers(members);
    } catch (error) {
      console.error('Error inviting user:', error);
      alert('Failed to send invitation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      setIsLoading(true);
      
      // Get the membership for this user
      const membership = users.find(member => member.publicUserData.userId === userId);
      if (membership) {
        await organization.updateMembership(membership.id, {
          role: `org:${newRole}`
        });
        
        // Update the users list
        const updatedMembers = await organization.getMembershipList();
        setUsers(updatedMembers);
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-base">
      <Header />
      <div className="pt-24 pb-16">
        <Section className="py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-text-primary">User Management</h1>
            <button
              onClick={handleInviteUser}
              className="flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90 text-white px-4 py-2 rounded-md transition-colors"
            >
              <UserPlusIcon className="h-5 w-5" /> Invite User
            </button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-center">
              <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-red-500 mb-2">Error Loading Users</h3>
              <p className="text-text-secondary">{error}</p>
            </div>
          ) : (
            <div className="bg-background-card-from p-6 rounded-lg border border-border-primary">
              <UserList 
                users={users} 
                onUserClick={handleUserClick}
                onDeleteUser={handleDeleteUser}
                onUpdateRole={handleUpdateRole}
              />
            </div>
          )}
        </Section>
        <Footer />
      </div>

      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          isOpen={isUserDetailsModalOpen}
          onClose={() => setIsUserDetailsModalOpen(false)}
          onUpdateRole={handleUpdateRole}
          onDeleteUser={handleDeleteUser}
        />
      )}
    </div>
  );
}
