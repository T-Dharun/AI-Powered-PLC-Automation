import { useState } from 'react';
import Navbar from '../components/navbar/Navbar';
import Chat from '../components/workspace/Chat';
import Editor from '../components/workspace/Editor';
import "./style.css";

const Workspace = () => {
    const [stCode, setStCode] = useState('');
    return (
        <>
            <section className="h-screen">
                <nav className='flex justify-center navbar-workspace'><Navbar/></nav>
                <div className='workspace-container flex justify-around items-center'> 
                    <section className='ws-container flex flex-col lg:flex-row w-full justify-between'> 
                        <section className='h-full work-chat'><Chat stCode={stCode} setStCode={setStCode}/></section>
                        <section className='h-full work-editor'><Editor stCode={stCode} setStCode={setStCode}/></section>
                    </section>
                </div>
            </section>
        </>
    );
}

export default Workspace;
