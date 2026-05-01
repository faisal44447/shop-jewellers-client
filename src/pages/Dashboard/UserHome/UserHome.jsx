import UserProducts from "../../../components/UserProducts/UserProducts";
import useAuth from "../../../hooks/useAuth";

const UserHome = () => {
    const { user } = useAuth();

    return (
        <div className="bg-white p-8 rounded-lg shadow-md border">

            {/* PROFILE */}
            <div className="flex items-center gap-4">

                {user?.photoURL && (
                    <div className="avatar">
                        <div className="w-16 rounded-full ring ring-orange-400 ring-offset-2">
                            <img src={user.photoURL} />
                        </div>
                    </div>
                )}

                <div>
                    <h2 className="text-3xl font-bold">
                        Hi, Welcome{" "}
                        <span className="text-orange-500">
                            {user?.displayName || "Back"}
                        </span>
                    </h2>

                    <p className="text-gray-500">
                        Manage your orders and profile
                    </p>
                </div>
            </div>

            {/* DASHBOARD CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

                <div className="bg-orange-100 p-6 rounded-xl">
                    <h3 className="text-xl font-bold text-orange-600">
                        User Profile
                    </h3>
                    <p>{user?.email}</p>
                </div>

                <UserProducts />

            </div>

        </div>
    );
};

export default UserHome;