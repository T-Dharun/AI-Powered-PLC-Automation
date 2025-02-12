import { useState } from 'react';
import Navbar from '../components/navbar/Navbar';
import Chat from '../components/workspace/Chat';
import Editor from '../components/workspace/Editor';
import "./style.css";

const Workspace = () => {
    const [stCode,setStCode]=useState('');
    console.log(stCode);
    return (
        <>
            <section className="" style={{ height: '100vh' }}>
                <nav className='d-flex justify-content-center navbar-container'><Navbar/></nav>
                <div className='workspace-container d-flex justify-content-around  py-5'> 
                <section className='ws-container d-flex flex-column flex-lg-row w-100 justify-content-between'> 
                    <section className='h-100 work-chat'><Chat stCode={stCode} setStCode={setStCode}/></section>
                    <section className='h-100 work-editor'><Editor stCode={stCode} setStCode={setStCode}/></section>
                </section>
                </div>
            </section>
        </>
    );
}

export default Workspace;
