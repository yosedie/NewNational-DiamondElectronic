"use client";
import { CustomButton } from "@/components";
import apiClient from "@/lib/api";
import { nanoid } from "nanoid";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const DashboardUsers = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // sending API request for all users
    apiClient.get("/api/users")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setUsers(data);
      });
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <p className="text-sm text-gray-600 mt-1">Manage all system users</p>
      </div>

      {/* Users Table Container */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="w-full p-4">
          <div className="flex justify-end mb-5">
            <Link href="/admin/users/new">
              <CustomButton
                buttonType="button"
                customWidth="140px"
                paddingX={10}
                paddingY={5}
                textSize="sm"
                text="+ Add New User"
              />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-md table-pin-cols w-full">
              {/* head */}
              <thead className="bg-gray-50">
                <tr>
                  <th className="bg-gray-50">Email</th>
                  <th className="bg-gray-50">Role</th>
                  <th className="bg-gray-50"></th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                {users &&
                  users.map((user) => (
                    <tr key={nanoid()} className="hover:bg-gray-50">
                      <td>
                        <div className="flex items-center gap-3">
                          <p>{user?.email}</p>
                        </div>
                      </td>
                      <td>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${user?.role?.toLowerCase() === 'admin'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                          }`}>
                          {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1).toLowerCase()}
                        </span>
                      </td>
                      <th>
                        <Link
                          href={`/admin/users/${user?.id}`}
                          className="btn btn-ghost btn-xs hover:bg-custom-red hover:text-white"
                        >
                          Details
                        </Link>
                      </th>
                    </tr>
                  ))}
              </tbody>
              {/* foot */}
              <tfoot className="bg-gray-50">
                <tr>
                  <th className="bg-gray-50">Email</th>
                  <th className="bg-gray-50">Role</th>
                  <th className="bg-gray-50"></th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardUsers;
