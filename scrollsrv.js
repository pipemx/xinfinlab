const http=require("http"),fs=require("fs"),path=require("path");
const root="C:\\Users\\Felipe Plascencia\\Downloads";
const mimes={".html":"text/html",".js":"application/javascript",".css":"text/css",".mp4":"video/mp4",".png":"image/png",".jpg":"image/jpeg",".ico":"image/x-icon",".woff2":"font/woff2",".woff":"font/woff"};
http.createServer((req,res)=>{
  let urlPath;
  try{ urlPath=decodeURIComponent(req.url.split("?")[0]); }catch(e){ urlPath=req.url.split("?")[0]; }
  if(urlPath==="/"||urlPath==="") urlPath="/scroll-video.html";
  let fp=path.join(root,urlPath);
  fs.stat(fp,(e,stat)=>{
    if(e){ res.writeHead(404,{"Content-Type":"text/plain"}); res.end("404: "+fp); return; }
    const ext=path.extname(fp).toLowerCase();
    const mime=mimes[ext]||"application/octet-stream";
    const h={"Content-Type":mime,"Access-Control-Allow-Origin":"*","Cache-Control":"no-cache"};
    const range=req.headers.range;
    if(mime==="video/mp4"&&range){
      const[s0,e0]=range.replace(/bytes=/,"").split("-");
      const start=parseInt(s0)||0;
      const end=e0?parseInt(e0):stat.size-1;
      h["Content-Range"]="bytes "+start+"-"+end+"/"+stat.size;
      h["Accept-Ranges"]="bytes";
      h["Content-Length"]=end-start+1;
      res.writeHead(206,h);
      fs.createReadStream(fp,{start,end}).pipe(res);
    }else{
      h["Content-Length"]=stat.size;
      res.writeHead(200,h);
      fs.createReadStream(fp).pipe(res);
    }
  });
}).listen(3701,()=>console.log("Serving Downloads on :3701"));