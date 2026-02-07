import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
    return (
        <main>
            <section style={{ maxWidth: '600px' }}>
                <p style={{ opacity: 0.8, marginBottom: 'var(--spacing-md)' }}>
                    For inquiries, commissions, or collaborations, please fill out the form below and I'll get back to you as soon as possible.
                </p>
                <ContactForm />
            </section>
        </main>
    );
}
