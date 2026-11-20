import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import ContactForm from './ContactForm';

export const metadata = {
  title: 'Contact ATSNexa',
  description: 'Contact ATSNexa support about the resume builder, ATS checker, or your account.',
  alternates: { canonical: '/contact' },
};

export default function Contact() {
  return <><Nav/><main className="container article legal">
    <h1>Contact ATSNexa</h1>
    <p>Questions about the resume builder, ATS checker, or your account? Send us a message below or email <a href="mailto:support@atsnexa.com">support@atsnexa.com</a>.</p>
    <section className="tool-card contact-card">
      <h2>Send us a message</h2>
      <p>Send your message directly from this page. No separate CAPTCHA or redirect.</p>
      <ContactForm />
    </section>
    <h2>Direct email</h2>
    <p><a href="mailto:support@atsnexa.com">support@atsnexa.com</a></p>
    <p>Never send passwords, identity documents, or confidential resumes through this form.</p>
  </main><Footer/></>;
}
