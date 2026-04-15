import UserProducts from "../../../components/UserProducts/UserProducts";
import useAuth from "../../../hooks/useAuth";

const UserHome = () => {
    const { user } = useAuth();

    return (
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
            <div className="flex items-center gap-4">
                {/* ইউজারের প্রোফাইল পিকচার (যদি থাকে) */}
                {user?.photoURL && (
                    <div className="avatar">
                        <div className="w-16 rounded-full ring ring-orange-400 ring-offset-base-100 ring-offset-2">
                            <img src={user?.photoURL} alt="profile" />
                        </div>
                    </div>
                )}
                
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">
                        <span>Hi, Welcome </span>
                        <span className="text-orange-500">
                            {user?.displayName ? user.displayName : 'Back'}
                        </span>
                    </h2>
                    <p className="text-gray-500 mt-1">Manage your orders and profile from here.</p>
                </div>
            </div>

            {/* ড্যাশবোর্ডের সামারি কার্ড (ঐচ্ছিক) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                <div className="bg-orange-100 p-6 rounded-xl text-center">
                    <h3 className="text-2xl font-bold text-orange-600">User Profile</h3>
                    <p className="text-gray-600">{user?.email}</p>
                </div>
                <UserProducts></UserProducts>
            </div>
        </div>
    );
};

export default UserHome;