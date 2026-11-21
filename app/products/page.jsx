import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import AmazonShop from './AmazonShop';
export const metadata={title:'Career Essentials & Office Gear | ATSNexa Shop',description:'Discover useful career, home office, study, and interview essentials through Amazon.com affiliate shopping links.',alternates:{canonical:'/products'}};
export default function Products(){return <><Nav/><main><section className="page-hero container"><div className="eyebrow">ATSNEXA CAREER SHOP</div><h1>Tools for your next career move.</h1><p>Explore home-office essentials, interview gear, learning resources and work accessories. Find products on Amazon.com with one click.</p></section><AmazonShop/></main><Footer/></>}
