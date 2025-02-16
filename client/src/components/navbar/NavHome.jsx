import {Link} from "react-router-dom"
import "./Navbar.css";

const NavHome = () => {
    return (
        <>
            <nav className="p-3 flex justify-between items-center navbar-home ">
                <section className="flex items-center gap-5">
                    <h2 className="font-bold text-lg m-0">ThinkPLC</h2>
                </section>
                <section className="flex items-center gap-2">
                    <button className="nav-button bg-white text-black px-4 py-2 rounded sign-in">Signin</button>
                    <Link to="/workspace">
                    <button className="nav-button bg-black text-white px-4 py-2 rounded cursor:pointer get-started">Get Started</button>
                    </Link>
                </section>
            </nav>
        </>
    );
}
export default NavHome;

