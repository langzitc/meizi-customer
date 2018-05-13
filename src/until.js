function useMap(){
    let loadScript = ()=>{
          let script = document.createElement("script");
          script.type = "text/javascript";
          script.src = "https://webapi.amap.com/maps?v=1.4.3&key=3e2fe09b64ba28506acda9729430bdc3&callback=init";
          document.body.appendChild(script);    
    }
    return new Promise((resolve,reject)=>{
      if(window.isInitMap){
        resolve();
      }else{
        window.init = ()=>{
          window.isInitMap = true;
          resolve();
        }
        loadScript();      
      }
      setTimeout(()=>{
        reject();
      },10000);
    })
  }
  export default {
    useMap
  }