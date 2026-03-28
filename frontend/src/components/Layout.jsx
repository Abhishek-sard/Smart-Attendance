import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
    return (
        <div className="flex bg-slate-50 min-h-screen font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col relative overflow-hidden">
                <Header />
                <main className="p-8 flex-1 overflow-y-auto scroll-smooth">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
