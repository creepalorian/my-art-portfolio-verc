import Link from 'next/link';

export default function Header() {
    return (
        <header className="container" style={{
            paddingTop: 'var(--spacing-md)',
            paddingBottom: 'var(--spacing-md)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <Link href="/" style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                letterSpacing: '-0.02em'
            }}>
                AD
            </Link>
            <nav style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                <Link href="/" className="btn-outline" style={{ border: 'none' }}>
                    Work
                </Link>
                <Link href="/about" className="btn-outline" style={{ border: 'none' }}>
                    About
                </Link>
                <Link href="/admin" className="btn-outline" style={{ border: 'none', opacity: 0.5 }}>
                    Admin
                </Link>
            </nav>
        </header>
    );
}
