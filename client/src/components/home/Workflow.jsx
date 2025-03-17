import "./home.css";
const workdata = [
    {
        title: 'AI-Powered PLC Code Generation',
        message: 'Transforms natural language prompts into Structured Text (ST) and Ladder Logic for seamless industrial automation.'
    },
    {
        title: 'Intelligent Code Editor',
        message: 'Provides a real-time, syntax-aware Structured Text editor with built-in debugging for error-free PLC programming.'
    },
    {
        title: 'AST-Based Compilation & Validation',
        message: 'Converts ST code into an Abstract Syntax Tree (AST), ensuring logical consistency and eliminating syntax errors before execution.'
    },
    {
        title: 'Dynamic PLC Execution via OpenPLC',
        message: 'Deploys the AI-generated PLC programs to OpenPLC hardware (Arduino + relays), enabling real-time control of industrial processes.'
    },
    {
        title: 'Ladder Logic Editor with Drag & Drop',
        message: 'Automatically converts ST code into Ladder Logic, allowing intuitive modifications with an interactive graphical interface.'
    },
    {
        title: 'Seamless Integration with Industrial Systems',
        message: 'Supports standard PLC communication protocols, ensuring compatibility with industrial controllers and automation workflows.'
    }
];

const Workflow=()=>{
    return(
        <>
            <main className="flex items-center justify-center workflow flex-col">
                <section className="project-title">AI powered PLC Automation</section>
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