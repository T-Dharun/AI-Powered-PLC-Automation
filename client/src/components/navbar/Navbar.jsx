import { Link } from "react-router-dom";
import { useTheme } from "../theme/ThemeContext.jsx";
import light from "../../assets/light-theme.svg";
import dark from "../../assets/dark-theme.svg";
import "./Navbar.css";

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <>
            <nav className="p-3 flex justify-between items-center navbar">
                <section className="flex items-center gap-5">
                    <h2 className="font-bold text-lg m-0">ThinkPLC</h2>
                    
                    <section className="hidden md:block">
                        <div className="flex px-3">
                            {
                                navData.map((item) => {
                                    return (
                                        <Link to={item.url} key={item.id} className="no-underline text-current">
                                            <div className="navbar-items text-md px-3" key={item.id}>{item.title}</div>
                                        </Link>
                                    )
                                })
                            }
                        </div>
                    </section>
                </section>
                <section className="flex items-center gap-2">
                    <button onClick={toggleTheme} className="theme-button">
                        <img src={theme === "light" ? dark : light} className="theme-image"/>
                    </button>
                    <button className="nav-button bg-white text-black px-4 py-2 rounded sign-in">Profile</button>
                    <Link to={"/"}>
                    <button className="nav-button bg-black text-white px-4 py-2 rounded cursor:pointer get-started">Logout</button>
                    </Link>
                </section>
            </nav>
        </>
    );
}
export default Navbar;

const navData = [
    {
        id: 1,
        title: "Home",
        url: '/',
    },
    {
        id: 2,
        title: "Workspace",
        url: '/',
    },
    {
        id: 3,
        title: "Documentation",
        url: '/',
    },
    {
        id: 4,
        title: "Dashboard",
        url: '/',
    }
];
