import { memo } from 'react';
import { version } from '../../package.json';

const Footer = () => {
    return (
        <footer className='py-4'>
            <p className="text-center text-xs">© Copyright {new Date().getFullYear()} v{version} — <a href="https://github.com/alexl8819">alexl8819</a></p>
        </footer>
    );
}

export default memo(Footer);