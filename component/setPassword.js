const coinUtil = require("../js/coinUtil.js")
const crypto = require('crypto');
const storage = require("../js/storage.js")
module.exports=require("./setPassword.html")({
  data(){
    return {
      passwordType:"password",
      currentPassword:"",
      password:"",
      password2:"",
      change:false,
      error:false,
      loading:false
    }
  },
  store:require("../js/store.js"),
  methods:{
    next(){
      if(!this.password||this.password!==this.password2){
        return;
      }
      this.loading=true
      let cipherPromise=null;
      if(this.change){
        cipherPromise=storage.get("keyPairs").then((cipher)=>coinUtil.makePairsAndEncrypt({
          entropy:coinUtil.decrypt(cipher.entropy,this.currentPassword),
          password:this.password,
          makeCur:Object.keys(cipher.pubs)
        }))
      }else{
        cipherPromise=coinUtil.makePairsAndEncrypt({
          entropy:this.$store.state.entropy,
          password:this.password,
          makeCur:["mona","zny"]
        })
      }
      cipherPromise.then((data)=>storage.set("keyPairs",data))
        .then(()=>{
          this.$store.commit("deleteEntropy")
          this.$store.commit("setFinishNextPage",{page:require("./login.js"),infoId:"createdWallet"})
          this.$emit("replace",require("./finished.js"))
          
        }).catch(()=>{
          this.error=true
          this.loading=false
        })
    }
    
  },
  mounted(){
    if(this.$store.state.entropy){
      this.change=false
    }else{
      this.change=true
    }
  },
  components:{
    
  }
})
