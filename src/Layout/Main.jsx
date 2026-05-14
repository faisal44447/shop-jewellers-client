import { Outlet } from "react-router-dom";
import NavBar from "../pages/Shared/NavBar/NavBar";
import Footer from '../pages/Shared/Footer/Footer';

const Main = () => {
    return (
        <div>
            <div className="mx-auto max-w-7xl items-center justify-items-center text-black">
                <NavBar />
            </div>

            <div className="pt-20">
                <Outlet />
            </div>
            <Footer></Footer>
        </div>
    );
};

export default Main;