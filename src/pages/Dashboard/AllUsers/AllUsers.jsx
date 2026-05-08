import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaTrashAlt, FaUsers } from "react-icons/fa";
import Swal from "sweetalert2";
import useAdmin from "../../../hooks/useAdmin";

const AllUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [isAdmin] = useAdmin();

  const { data: users = [], refetch, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data || [];
    },
  });

  // ================= LOADING =================
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // ================= MAKE ADMIN =================
  const handleMakeAdmin = async (user) => {
    try {
      const res = await axiosSecure.patch(
        `/users/admin/${user._id}`
      );

      if (res.data?.modifiedCount > 0 || res.data?.success) {
        await refetch();

        Swal.fire({
          icon: "success",
          title: `${user.name} is now Admin`,
          timer: 1200,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      Swal.fire("Error", "Failed to make admin", "error");
    }
  };

  // ================= DELETE USER =================
  const handleDeleteUser = async (user) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: `${user.name} will be deleted permanently!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes delete it",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosSecure.delete(
        `/users/${user._id}`
      );

      if (res.data?.deletedCount > 0) {
        await refetch();

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "User removed successfully",
          timer: 1200,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      Swal.fire("Error", "Delete failed", "error");
    }
  };

  return (
    <div className="p-4">

      {/* HEADER */}
      <h2 className="text-3xl font-bold mb-6 text-center">
        👥 All Users ({users.length})
      </h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">

          <thead>
            <tr className="text-black">
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody className="text-orange-500">
            {users.map((user, index) => (
              <tr key={user._id}>

                <td className="text-black">{index + 1}</td>
                <td className="font-medium">
                  {user.name}
                </td>
                <td className="text-black">{user.email}</td>

                {/* ROLE */}
                <td>
                  {user.role === "admin" ? (
                    <span className="badge badge-success text-white">
                      Admin
                    </span>
                  ) : (
                    <span className="badge badge-warning">
                      User
                    </span>
                  )}
                </td>

                {/* ACTION */}
                <td className="flex gap-2">

                  {/* MAKE ADMIN */}
                  {isAdmin && user.role !== "admin" && (
                    <button
                      onClick={() =>
                        handleMakeAdmin(user)
                      }
                      className="btn btn-sm bg-orange-500 text-white"
                    >
                      <FaUsers />
                    </button>
                  )}

                  {/* DELETE */}
                  {isAdmin && (
                    <button
                      onClick={() =>
                        handleDeleteUser(user)
                      }
                      className="btn btn-sm btn-error"
                    >
                      <FaTrashAlt />
                    </button>
                  )}

                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
};

export default AllUsers;