import { h, createContext, useContext, useState } from '../runtime/dom.js';
import toast from '../runtime/toast.js';
const WishlistContext=createContext(undefined);
export function WishlistProvider({children}) {
 const [wishlist,setWishlist]=useState([]);
 const addToWishlist=item=>{setWishlist(items=>items.some(p=>p.id===item.id)?items:[...items,item]);toast.success('Added to your saved pieces');};
 const removeFromWishlist=id=>setWishlist(items=>items.filter(p=>p.id!==id));
 return h(WishlistContext.Provider,{value:{wishlist,addToWishlist,removeFromWishlist,isInWishlist:id=>wishlist.some(p=>p.id===id),isLoading:false}},children);
}
export const useWishlist=()=>useContext(WishlistContext);
