    
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
 import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, getDoc, doc, serverTimestamp, updateDoc, writeBatch, deleteDoc, setDoc, onSnapshot} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js"; 
 import { getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
 
    const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


let usernya=[];
let uaid = "";
async function ambildatauser(){
    
    
    const dtpath = await getDocs(collection(db,"users"));
    
    usernya = dtpath.docs.map(i=>({
        id: i.id,
        ...i.data()
    }))
    
    ambildatachat();
   uaid= localStorage.getItem("uaid");
}

async function ambildatachat(){
    let waktuSekarang = new Date(); 
    waktuSekarang = waktuSekarang.setMinutes(waktuSekarang.getMinutes() - 3);
    waktuSekarang = new Date(waktuSekarang);
    const q = query(
  collection(db, "adAct"),
  where("UP_TIME", ">", waktuSekarang)
);
    const semuanya = await getDocs(q);
    let hasilnya = semuanya.docs.map(b=>({...b.data()}));
    hasilnya= hasilnya.sort((a, b) => {
  const dateA = a.UP_TIME?.toDate() || 0;
  const dateB = b.UP_TIME?.toDate() || 0;
  return dateB - dateA;
});
    tampilkanchat(hasilnya);
    
}

async function tampilkanchat(data){
    const leyo = document.getElementById("cpesan");
    leyo.innerHTML = "";
    
    data.forEach(b=>{
    const chat = document.createElement('div');
    
    
    const cain = usernya.filter(i=>i.id===b.UC_ID)
    
    if(cain[0].PK === "Khusus"){
        chat.className = "dev";
    }else if(b.Jenis ==="Report"){
        chat.className="preport";
    }else{
        chat.className="pesannya"
    }
    const waktuTampil = b.UP_TIME && typeof b.UP_TIME.toDate === 'function' 
            ? b.UP_TIME.toDate().toLocaleString('id-ID') 
            : "Sedang mengirim..."; 
    chat.innerHTML =` <p class="iden">${cain[0].username} || ${cain[0].callsign}</p>
                <p class="textnya">${b.Pesan}</p>
                <p class="tanggal">${waktuTampil}</p>`
    
    
    leyo.appendChild(chat);
    
    })
}
    
 
  document.getElementById("cadmin").onkeypress = function (e){
        if(e.key === 'Enter'){
        const pesan = document.getElementById("cadmin").value
        const katapesan = ["/report", "/chat"];
        const katalog = ["/logout", "/beranda", "/kosongkanriwayat","/inputdata","/ubahdata", "/catuks"];
  if(katapesan.some(k=>pesan.toLowerCase().includes(k))){       
            kirimchat(pesan);
            document.getElementById("cadmin").value="";
          document.getElementById("kcsalah").style.display="none";
  }else if(katalog.some(k=>pesan.toLowerCase().includes(k))){  
            
            
       if(pesan.includes(katalog[0])){
         signOut(auth).then(() => {
        window.location.href = "index.html";
        document.getElementById("kcsalah").style.display="none";
    }); 
      
       }else if(pesan.includes(katalog[1])){
         window.location.href = "beranda.html";
            document.getElementById("kcsalah").style.display="none";
            }else if(pesan.includes(katalog[2])){
            
            kosongkanriwayat();
            
              }else if(pesan.includes(katalog[3])){
            
            window.location.href="input-data.html"
            
              } else if(pesan.includes(katalog[4])){
            
            window.location.href="ubah-data.html"
            
              } else if(pesan.includes(katalog[5])){
            
            window.location.href="CatUKS.html"
            
              } 
              }else{
               document.getElementById("cadmin").value=""; document.getElementById("kcsalah").style.display="flex";
            }
            
            
        }
        
    }
   
  async function kirimchat(chat){
      let pesan = chat;
      let jenis ="";
      if(chat.includes("/report")){
          jenis ="Report"
      }else if(chat.includes("/chat")){
          jenis ="chat"
          pesan = pesan.replace("/chat", "");
          
      }
      
      
      
      document.getElementById("loadmengirim").style.display="flex";
      try{
      const path = collection(db, "adAct")
          await addDoc(path, {
              Pesan: pesan,
              Jenis: jenis,
              UC_ID: uaid,
              UP_TIME: serverTimestamp(),
              
              
          })
          
          if(jenis==="Report"){
          const oo = usernya.filter(i=>i.id === uaid);
          const masa = (new Date()).toLocaleString();
              laporpak( "["+masa+"] "+"["+oo[0].username+" || "+oo[0].callsign+"] "+pesan )
          }
          document.getElementById("gagalmengirim").style.display="none";
      }catch(e){
         console.log(e)
         document.getElementById("gagalmengirim").style.display="flex";
      }
      document.getElementById("loadmengirim").style.display="none";
  }
   
   


async function awal(){
document.getElementById("cadmin").style.display="none";

await ambildatauser();
let waktuSekarang = new Date(); 
let timer;
    waktuSekarang = waktuSekarang.setMinutes(waktuSekarang.getMinutes() - 5); 
    waktuSekarang = new Date(waktuSekarang);
const q = query(
  collection(db, "adAct"),
  where("UP_TIME", ">", waktuSekarang)
);
onSnapshot(q, (snapshot) => {
  
  let data = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data({ serverTimestamps: 'estimate' }) 
  }));

   data= data.sort((a, b) => {
  const dateA = a.UP_TIME?.toDate() || 0;
  const dateB = b.UP_TIME?.toDate() || 0;
  return dateB - dateA;
});
  snapshot.docChanges().forEach((change) => {
  document.getElementById("berhasilmenghapus").style.display="none"
        document.getElementById("gagalmenghapus").style.display="none"
    
    if (change.type === "added") {
      
      tampilkanchat(data); 
      document.getElementById("cdispath").style.display="flex";
      
      
      
      document.getElementById("cadmin").onfocus = function(){
          clearTimeout(timer)
          
    
      }
      
      const jalantutup = () =>{
          clearTimeout(timer)
          
            timer = setTimeout(()=>{
          document.getElementById("cadmin").style.display="none";
          document.getElementById("cdispath").style.display="none"
          document.getElementById("buk").style.display="flex";
        document.getElementById("tup").style.display="none"; 
      },7000)
      }
      document.getElementById("cadmin").onblur = function(){
      
        jalantutup()
      }
      if(document.getElementById("cadmin").style.display==="none"){
          jalantutup()
      }
      
      
      
    }
  });
  document.getElementById("cadmin").onfocus = function(){
          clearTimeout(timer)
      }
});

}

document.getElementById("bukaadacty").onclick = function(){
    if(document.getElementById("tup").style.display==="none"){
        document.getElementById("cdispath").style.display="flex"
        document.getElementById("buk").style.display="none";
        document.getElementById("tup").style.display="flex";
        document.getElementById("cadmin").style.display="flex";
    }else{
        document.getElementById("cdispath").style.display="none"
        document.getElementById("buk").style.display="flex";
        document.getElementById("tup").style.display="none"; 
    }
    
}

function laporpak(pesan){
    
    const url =`https://api.telegram.org/bot8512781547:AAHB61ey-eO8DnKk5zd4kh4M3YQY1QTveWc/sendMessage?chat_id=6667524508&text=${encodeURIComponent(pesan)}`;

    
    fetch(url, {mode: 'no-cors'})
}
async function kosongkanriwayat(){
document.getElementById("prosesmenghapus").style.display="flex";
    if((usernya.filter(i=>i.id === uaid))[0].PK === "Khusus"){
        
        const q = query(
  collection(db, "adAct"),
  where("Jenis", "!=", "Tetap"));
      const yo = await getDocs(q);
      const uuu = yo.docs.map(i=>({
          id:i.id,
      }))
      
    const batch = writeBatch(db);
    
    uuu.forEach(i=>{
        const docref = doc(db, "adAct", i.id);
        batch.delete(docref);
    })
        
     try{
         await batch.commit();
         document.getElementById("berhasilmenghapus").style.display="flex"
 document.getElementById("cadmin").value="";
     }catch(e){
         document.getElementById("gagalmenghapus").style.display="flex"
     }
    }else{
        document.getElementById("gagalmenghapus").style.display="flex"
    }
    document.getElementById("prosesmenghapus").style.display="none";
}
   


    awal();
    
    