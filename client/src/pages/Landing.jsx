import Workflow from "../components/home/Workflow";
import NavHome from "../components/navbar/NavHome";
import "./home.css"
const Landing = () => {
  return (
    <div className="bg-black flex justify-center flex-col home">
      <section className="home-page-nav flex justify-center sticky top-0  py-2">
        <NavHome />
      </section>

      <section className="flex home-workflow justify-center py-50">
        <Workflow />
      </section>
    </div>
  );
}
export default Landing;