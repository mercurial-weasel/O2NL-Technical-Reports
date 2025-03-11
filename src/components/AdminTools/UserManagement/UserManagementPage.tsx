import React, { useState, useEffect } from 'react';
import { Header } from '@common/Header';
import { Footer } from '@common/Footer';
import { Section } from '@components/common';
import { UserList } from './UserList';
import { UserDetailsModal } from './UserDetailsModal';
import { useOrganization, useOrganizationList, useUser, useClerk } from '@clerk/clerk-react';
import { Spinner } from '@components/common/Spinner';
import { 
  TrashIcon, 
  UserPlusIcon, 
  ExclamationTriangleIcon, 
  BuildingOffice2Icon 
} from '@heroicons/react/24/outline';

// Organization ID from your Clerk dashboard
const O2NL_ORG_ID = "org_2uAAK2GsAAG4KZhoUlq0efZdxPo";

export function UserManagementPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pass the organization ID to useOrganization
  const { organization, isLoaded: isOrgLoaded } = useOrganization({ organizationId: O2NL_ORG_ID });
  const { createOrganization } = useOrganizationList();
  const { user } = useUser();
  const clerk = useClerk();

  // Debug output for organization
  useEffect(() => {
    console.log('Organization data:', {
      isLoaded: isOrgLoaded,
      organization,
      organizationId: O2NL_ORG_ID
    });
  }, [isOrgLoaded, organization]);

  useEffect(() => {
    async function loadUsers() {
      if (!isOrgLoaded) {
        return; // Wait for organization to load
      }
      
      if (!organization) {
        setError("Organization not found. Please check your organization ID or permissions.");
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
        setError(`Failed to load user list: ${error.message || 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadUsers();
  }, [isOrgLoaded, organization]);

  // Handle creating organization if needed
  const handleCreateOrganization = async () => {
    try {
      setIsLoading(true);
      const newOrg = await createOrganization({ name: "O2NL" });
      console.log('Created new organization:', newOrg);
      
      // Refresh the page to use the new organization
      window.location.reload();
    } catch (error) {
      console.error('Error creating organization:', error);
      setError(`Failed to create organization: ${error.message}`);
      setIsLoading(false);
    }
  };

  // Handle joining existing organization
  const handleJoinOrganization = async () => {
    try {
      setIsLoading(true);
      
      // First, attempt to set the organization as active
      try {
        await clerk.organization.setActive({ organization: O2NL_ORG_ID });
        console.log('Set organization as active:', O2NL_ORG_ID);
      } catch (err) {
        console.warn('Could not set organization as active:', err);
        // Continue anyway - might just need to join
      }
      
      // Try to open the organization join flow instead
      try {
        await clerk.openOrganizationProfile();
      } catch (profileErr) {
        console.error('Error opening organization profile:', profileErr);
        
        // Alternative: Open the organization switcher if profile fails
        await clerk.openUserProfile({
          initialPage: 'organization',
        });
      }
      
    } catch (error) {
      console.error('Overall error handling organization:', error);
      alert('Could not access organization settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
            {organization && (
              <button
                onClick={handleInviteUser}
                className="flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90 text-white px-4 py-2 rounded-md transition-colors"
              >
                <UserPlusIcon className="h-5 w-5" /> Invite User
              </button>
            )}
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
              <div className="text-center mb-6">
                <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-red-500 mb-2">Error Loading Users</h3>
                <p className="text-text-secondary">{error}</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <button
                  onClick={handleJoinOrganization}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  <BuildingOffice2Icon className="h-5 w-5" /> 
                  Join Organization
                </button>
                
                <button
                  onClick={handleCreateOrganization}
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  <BuildingOffice2Icon className="h-5 w-5" /> 
                  Create New Organization
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-background-card-from p-6 rounded-lg border border-border-primary">
              {organization && (
                <div className="mb-4 pb-4 border-b border-border-primary">
                  <h2 className="text-lg font-medium text-text-primary">
                    Organization: {organization.name}
                  </h2>
                  <p className="text-sm text-text-secondary">
                    ID: {organization.id} • Members: {users.length}
                  </p>
                </div>
              )}
              
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
