import "./home.css";
const workdata=[
    {
        title:'unified Dashboard',
        message:'There are n number of works  in our lab right away okay'
    },
    {
        title:'unified Dashboard',
        message:'There are n number of works  in our lab right away okay'
    },
    {
        title:'unified Dashboard',
        message:'There are n number of works  in our lab right away okay'
    },
    {
        title:'unified Dashboard',
        message:'There are n number of works  in our lab right away okay'
    },
    {
        title:'unified Dashboard',
        message:'There are n number of works  in our lab right away okay'
    },
    {
        title:'unified Dashboard',
        message:'There are n number of works  in our lab right away okay'
    },
]
const Workflow=()=>{
    return(
        <>
            <main className="flex items-center justify-center workflow flex-col">
                <section className="py-15 flex flex-col gap-5">
                    <div className="text-2xl text-red-400 font-bold text-center">Integrated Ecosystem</div>
                    <div className="text-4xl font-bold text-white text-center">One Step to reduce yours couple of hours</div>
                </section>
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-7.5">
                    {
                        workdata.map((item,idx)=>(
                            <section className="text-gray-100 bg-black workflow-card flex flex-col gap-5" key={idx}>
                                <div><div className="icon-work"></div></div>
                                <h1 className="text-2xl text-white font-bold ">{item.title}</h1>
                                <p className="text-[#69788b]">{item.message}</p>
                            </section>
                        ))
                    }
                </section>
            </main>
        </>
    )
}
export default Workflow;