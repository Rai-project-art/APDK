 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
    import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
    import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, getDoc, doc, serverTimestamp, updateDoc, writeBatch, deleteDoc} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js"; 
 import {onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";


 
 
    const app = initializeApp(firebaseConfig);
const db = getFirestore(app); 
 const auth = getAuth(app);
   
   
   document.body.style.display="none";
   
    onAuthStateChanged(auth, async (user) => {
    if (user) {
        
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

       if (docSnap.exists() && docSnap.data().role === "admin") {
          localStorage.setItem("uaid", user.uid);
            console.log("Selamat datang, Admin!");
            
            document.body.style.display = "block";
        } else {
            
            console.log(user.uid)
            window.location.href = "index.html";
        }
    } else {
        
        window.location.href = "index.html";
    }
    
});
    
