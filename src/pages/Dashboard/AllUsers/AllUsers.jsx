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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // MAKE ADMIN
  const handleMakeAdmin = async (user) => {
    try {
      const res = await axiosSecure.patch(`/users/admin/${user._id}`);

      if (res.data.modifiedCount > 0 || res.data.success) {
        refetch();
        Swal.fire("Success", `${user.name} is now Admin`, "success");
      }
    } catch (err) {
      Swal.fire("Error", "Failed to make admin", "error");
    }
  };

  // DELETE USER
  const handleDeleteUser = async (user) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This user will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes delete it",
    });

    if (confirm.isConfirmed) {
      const res = await axiosSecure.delete(`/users/${user._id}`);

      if (res.data.deletedCount > 0) {
        refetch();
        Swal.fire("Deleted!", "User removed", "success");
      }
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-5 text-center">
        All Users: {users.length}
      </h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <th>{index + 1}</th>
                <td>{user.name}</td>
                <td>{user.email}</td>

                <td>
                  {user.role === "admin" ? (
                    "Admin"
                  ) : (
                    isAdmin && (
                      <button
                        onClick={() => handleMakeAdmin(user)}
                        className="btn btn-sm bg-orange-500 text-white"
                      >
                        <FaUsers />
                      </button>
                    )
                  )}
                </td>

                <td>
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteUser(user)}
                      className="btn btn-ghost btn-sm"
                    >
                      <FaTrashAlt className="text-red-600" />
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