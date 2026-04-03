import{r as c,j as p}from"./vendor-react-Q_Gn7dIx.js";import{C as g,S as x,P as y,a as E,V as R,M as j,W as S}from"./vendor-three-CM3GqCLt.js";function C(){const i=c.useRef(null),e=c.useRef(null);return c.useEffect(()=>{if(!i.current)return;const t=i.current,f=` 
       void main() { 
         gl_Position = vec4( position, 1.0 ); 
       } 
     `,v=` 
       #define TWO_PI 6.2831853072 
       #define PI 3.14159265359 
 
       precision highp float; 
       uniform vec2 resolution; 
       uniform float time; 
 
       void main(void) { 
         vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y); 
         float t = time*0.05; 
         float lineWidth = 0.002; 
 
         vec3 color = vec3(0.0); 
         for(int j = 0; j < 3; j++){ 
           for(int i=0; i < 5; i++){ 
             color[j] += lineWidth*float(i*i) / abs(fract(t - 0.01*float(j)+float(i)*0.01)*5.0 - length(uv) + mod(uv.x+uv.y, 0.2)); 
           } 
         } 
         
         gl_FragColor = vec4(color[0],color[1],color[2],1.0); 
       } 
     `,r=new g;r.position.z=1;const a=new x,d=new y(2,2),o={time:{type:"f",value:1},resolution:{type:"v2",value:new R}},m=new E({uniforms:o,vertexShader:f,fragmentShader:v}),h=new j(d,m);a.add(h);const n=new S({antialias:!0});n.setPixelRatio(window.devicePixelRatio),t.appendChild(n.domElement);const s=()=>{const l=t.clientWidth,w=t.clientHeight;n.setSize(l,w),o.resolution.value.x=n.domElement.width,o.resolution.value.y=n.domElement.height};s(),window.addEventListener("resize",s,!1);const u=()=>{const l=requestAnimationFrame(u);o.time.value+=.05,n.render(a,r),e.current&&(e.current.animationId=l)};return e.current={camera:r,scene:a,renderer:n,uniforms:o,animationId:0},u(),()=>{window.removeEventListener("resize",s),e.current&&(cancelAnimationFrame(e.current.animationId),t&&e.current.renderer.domElement&&t.removeChild(e.current.renderer.domElement),e.current.renderer.dispose(),d.dispose(),m.dispose())}},[]),p.jsx("div",{ref:i,className:"w-full h-full",style:{background:"#000",overflow:"hidden"}})}export{C as S};
