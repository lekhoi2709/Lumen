import React, { useEffect, useState } from "react";
import {
  getUsersList,
  deleteUser,
} from "@/services/api/admin-api";
import EditRoleForm from "@/components/admin/edit-role";
import EditUserForm from "@/components/admin/edit-user";
import { Edit, Trash, UserCog } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import DeleteConfirmDialog from "@/components/admin/confirm-dialog";

const UserList: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [emailFilter, setEmailFilter] = useState<string>('');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingUserDetailsId, setEditingUserDetailsId] = useState<string | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'user'; id: string } | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsersList();
        setUsers(usersData.data.users);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleEditRoleSuccess = async () => {
    try {
      const usersData = await getUsersList();
      setUsers(usersData.data.users);
      setEditingUserId(null);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleEditUserSuccess = async () => {
    try {
      const usersData = await getUsersList();
      setUsers(usersData.data.users);
      setEditingUserDetailsId(null);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleDeleteUser = (userId: string) => {
    setItemToDelete({ type: 'user', id: userId });
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        await deleteUser(itemToDelete.id);
        const usersData = await getUsersList();
        setUsers(usersData.data.users);
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
      setItemToDelete(null);
    }
    setIsDeleteConfirmOpen(false);
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(emailFilter.toLowerCase()),
  );

  return (
    <div>
      <h2 className="mb-4 text-3xl font-bold">Users List</h2>
      <div className="mb-4">
        <Input
          placeholder="Filter emails..."
          value={emailFilter}
          onChange={(event) => setEmailFilter(event.target.value)}
          className="max-w-sm text-lg"
        />
      </div>
      <div className="overflow-x-auto">
        <Table>
          <thead>
            <tr>
              <th className="text-left text-lg py-4" style={{ width: '25%' }}>User</th>
              <th className="text-left text-lg py-4" style={{ width: '25%' }}>Email</th>
              <th className="text-left text-lg py-4" style={{ width: '25%' }}>Role</th>
              <th className="text-left text-lg py-4" style={{ width: '25%' }}>Actions</th>
            </tr>
          </thead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user._id} className="py-4">
                <TableCell className="p-0" style={{ width: '25%' }}>
                  <span className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarImage src={user.avatarUrl} />
                      <AvatarFallback>
                        {user.firstName.at(0)}
                      </AvatarFallback>
                    </Avatar>
                    <p className="ml-2 text-lg">
                      {user.firstName} {user.lastName}
                    </p>
                  </span>
                </TableCell>
                <TableCell className="p-0 text-lg" style={{ width: '25%' }}>{user.email}</TableCell>
                <TableCell className="p-0 text-lg" style={{ width: '25%' }}>
                  <span
                    className={`badge ${
                      user.role === "Administrator" ? "badge-blue" : "badge-gray"
                    }`}
                  >
                    {user.role}
                  </span>
                </TableCell>
                <TableCell className="p-0 text-lg" style={{ width: '25%' }}>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingUserId(user._id)}
                      className="rounded bg-yellow-500 px-3 py-2 text-white"
                    >
                      <UserCog className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setEditingUserDetailsId(user._id)}
                      className="rounded bg-blue-500 px-3 py-2 text-white"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="rounded bg-red-500 px-3 py-2 text-white"
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  </div>
                  {editingUserId === user._id && (
                    <EditRoleForm
                      userId={user._id}
                      onSuccess={handleEditRoleSuccess}
                      onClose={() => setEditingUserId(null)}
                    />
                  )}
                  {editingUserDetailsId === user._id && (
                    <EditUserForm
                      user={user}
                      onSuccess={handleEditUserSuccess}
                      onClose={() => setEditingUserDetailsId(null)}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DeleteConfirmDialog
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default UserList;
