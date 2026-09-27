import { h, mount } from './runtime/dom.js';
import Link, { usePathname } from './runtime/navigation.js';
import MainLayout from './components/MainLayout.js';
import ShopCatalog from './components/ShopCatalog.js';
import CatalogCard from './components/CatalogCard.js';
import ProductDetail from './app/product/[id]/ProductDetailClient.js';
import { CartProvider } from './context/CartContext.js';
import { WishlistProvider, useWishlist } from './context/WishlistContext.js';
import { products, categories, getProduct } from './data/products.js';
import Home from './app/page.js';
import About from './app/about/page.js';
import Contact from './app/contact-us/page.js';
import Drops from './app/drop-culture/page.js';
import FAQ from './app/faq/page.js';
import Search from './app/search/page.js';
import Shipping from './app/shipping-returns/page.js';
import Privacy from './app/privacy-policy/page.js';
import Terms from './app/terms-conditions/page.js';
const pages={'/':Home,'/about':About,'/contact-us':Contact,'/drop-culture':Drops,'/faq':FAQ,'/search':Search,'/shipping-returns':Shipping,'/privacy-policy':Privacy,'/terms-conditions':Terms};
function Saved(){const{wishlist}=useWishlist();const saved=products.filter(p=>wishlist.some(w=>w.id===p.id));return h('div',{className:'Commerce_page'},h('div',{className:'Commerce_container',style:{paddingTop:'64px',paddingBottom:'96px'}},h('p',{className:'Commerce_eyebrow'},'MURHOPRINTS / YOUR ROTATION'),h('h1',{className:'HomeEditorial_heading'},'Your saved pieces.'),saved.length?h('div',{className:'Commerce_catalogGrid',style:{marginTop:'36px'}},saved.map(product=>h(CatalogCard,{key:product.id,product}))):h('div',{className:'Commerce_empty'},h('p',{},'Tap the heart on a piece to keep it here during your visit.'),h(Link,{href:'/shop',className:'Commerce_primaryButton'},'Explore the collection'))));}
function NotFound(){return h('div',{className:'min-h-screen flex flex-col items-center justify-center text-center px-6 gap-6'},h('p',{className:'text-xs font-bold tracking-widest text-[#A6532A]'},'MURHOPRINTS / 404'),h('h1',{className:'text-4xl font-bold'},'This page is unavailable.'),h(Link,{href:'/shop',className:'bg-[#0B0B0B] text-white px-8 py-4'},'Explore the collection'));}
function Route(){const pathname=usePathname(),shop=pathname.match(/^\/shop(?:\/([^/]+))?(?:\/([^/]+))?$/),product=pathname.match(/^\/product\/([^/]+)$/);if(shop)return h(ShopCatalog,{key:pathname,category:shop[1],subcategory:shop[2],initialProducts:products,initialCategories:categories});if(product)return h(ProductDetail,{key:pathname,productId:decodeURIComponent(product[1]),initialProduct:getProduct(decodeURIComponent(product[1]))});if(pathname==='/saved')return h(Saved,{});const Page=pages[pathname]||NotFound;return h(Page,{key:pathname,searchParams:Object.fromEntries(new URLSearchParams(location.search))});}
function App(){return h(CartProvider,{},h(WishlistProvider,{},h(MainLayout,{},h(Route,{}))));}
mount(App,document.getElementById('app'));
