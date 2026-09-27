import { h, Fragment } from '../runtime/dom.js';
import Preloader from './Preloader.js';
import Navbar from './Navbar.js';
import Footer from './Footer.js';
export default function MainLayout({children}) {
 return h(Fragment,{},h(Preloader,{}),h(Navbar,{}),h('main',{className:'flex-1 w-full flex flex-col'},children),h(Footer,{}));
}
