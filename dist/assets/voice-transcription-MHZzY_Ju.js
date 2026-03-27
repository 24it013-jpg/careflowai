import{c as l}from"./gemini-CPuTSIyp.js";class p{recognition;isSupported;onResultCallback;onErrorCallback;constructor(){const t=window.SpeechRecognition||window.webkitSpeechRecognition;this.isSupported=!!t,this.isSupported&&(this.recognition=new t)}isAvailable(){return this.isSupported}start(t={}){if(!this.isSupported){this.onErrorCallback?.("Speech recognition is not supported in this browser");return}this.recognition.continuous=t.continuous??!0,this.recognition.interimResults=t.interimResults??!0,this.recognition.lang=t.language??"en-US",this.recognition.onresult=s=>{const n=s.results.length-1,e=s.results[n],c=e[0].transcript,r=e[0].confidence,a=e.isFinal;this.onResultCallback?.({text:c,confidence:r,isFinal:a,timestamp:new Date})},this.recognition.onerror=s=>{this.onErrorCallback?.(s.error)},this.recognition.onend=()=>{t.continuous&&this.recognition.start()};try{this.recognition.start()}catch{this.onErrorCallback?.("Failed to start speech recognition")}}stop(){this.recognition&&this.recognition.stop()}onResult(t){this.onResultCallback=t}onError(t){this.onErrorCallback=t}}async function h(o,t){try{const n=await l(`You are a medical scribe assistant. Convert the following clinical conversation into structured SOAP notes (Subjective, Objective, Assessment, Plan). Be concise and use medical terminology appropriately. Format each section clearly with headers. Return only the structured text.

Transcript:
${o}`,void 0,[],{temperature:.3}),e={subjective:"",objective:"",assessment:"",plan:""},c=n.split(`
`);let r="";for(const a of c){const i=a.trim();i.toLowerCase().startsWith("subjective:")?(r="subjective",e.subjective=i.replace(/^subjective:/i,"").trim()):i.toLowerCase().startsWith("objective:")?(r="objective",e.objective=i.replace(/^objective:/i,"").trim()):i.toLowerCase().startsWith("assessment:")?(r="assessment",e.assessment=i.replace(/^assessment:/i,"").trim()):i.toLowerCase().startsWith("plan:")?(r="plan",e.plan=i.replace(/^plan:/i,"").trim()):i&&r&&(e[r]+=" "+i)}return e}catch(s){throw console.error("Error structuring notes:",s),s}}function m(o){return`SOAP NOTES
================

SUBJECTIVE:
${o.subjective}

OBJECTIVE:
${o.objective}

ASSESSMENT:
${o.assessment}

PLAN:
${o.plan}

Generated: ${new Date().toLocaleString()}
`}export{p as V,m as e,h as s};
