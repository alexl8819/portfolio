import { memo } from 'react';
import { version } from '../../package.json';

const Footer = () => {
    return (
        <footer className='py-4'>
            <p className="text-center text-xs">© Copyright {new Date().getFullYear()} — <a href="https://github.com/alexl8819">alexl8819</a> v{version}</p>
        </footer>
    );
}

export default memo(Footer);