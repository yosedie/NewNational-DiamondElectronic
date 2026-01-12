"use client";
import { CustomButton } from "@/components";
import { nanoid } from "nanoid";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { formatCategoryName } from "../../../../utils/categoryFormating";
import apiClient from "@/lib/api";

const DashboardCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  // getting all categories to be displayed on the all categories page
  useEffect(() => {
    apiClient.get("/api/categories")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        } else if (data && Array.isArray(data.data)) {
          setCategories(data.data);
        } else {
          console.error("Received invalid categories data:", data);
          setCategories([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setCategories([]);
      });
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Category Management</h1>
        <p className="text-sm text-gray-600 mt-1">Manage product categories</p>
      </div>

      {/* Categories Table Container */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="w-full p-4">
          <div className="flex justify-end mb-5">
            <Link href="/admin/categories/new">
              <CustomButton
                buttonType="button"
                customWidth="150px"
                paddingX={10}
                paddingY={5}
                textSize="sm"
                text="+ Add New Category"
              />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-md table-pin-cols w-full">
              {/* head */}
              <thead className="bg-gray-50">
                <tr>
                  <th className="bg-gray-50">Name</th>
                  <th className="bg-gray-50"></th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(categories) &&
                  categories.map((category: Category) => (
                    <tr key={nanoid()} className="hover:bg-gray-50">
                      <td>
                        <div>
                          <p className="font-medium">{formatCategoryName(category?.name)}</p>
                        </div>
                      </td>

                      <th>
                        <Link
                          href={`/admin/categories/${category?.id}`}
                          className="btn btn-ghost btn-xs hover:bg-custom-red hover:text-white"
                        >
                          Edit
                        </Link>
                      </th>
                    </tr>
                  ))}
              </tbody>
              {/* foot */}
              <tfoot className="bg-gray-50">
                <tr>
                  <th className="bg-gray-50">Name</th>
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

export default DashboardCategory;
