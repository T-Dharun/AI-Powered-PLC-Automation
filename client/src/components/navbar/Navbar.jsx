import { Link } from "react-router-dom";
import { useTheme } from "../theme/ThemeContext.jsx";
import light from "../../assets/light-theme.svg";
import dark from "../../assets/dark-theme.svg";
import "./Navbar.css";
const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <>
            <nav className="navbar p-3">
                <section className="d-flex align-items-center gap-5">
                    <h3 className="fw-bold m-0">ThinkPLC</h3>
                    
                    <section className="d-none d-md-block">
                        <div className="d-flex px-3">
                            {
                                navData.map((item) => {
                                    return (
                                        <Link to={item.url} key={item.id} className="text-decoration-none text-reset">
                                            <div className="navbar-items fs-6 px-3" key={item.id}>{item.title}</div>
                                        </Link>
                                    )
                                })
                            }
                        </div>
                    </section>
                </section>
                <section className="d-flex align-items-center gap-2">
                    <button onClick={toggleTheme} className="theme-button">
                        <img src={theme === "light" ? dark: light} className="theme-image"/>
                    </button>
                    <button className="nav-button btn btn-light sign-in">SignIn</button>
                    <button className="nav-button btn btn-dark get-started">Get Started</button>
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