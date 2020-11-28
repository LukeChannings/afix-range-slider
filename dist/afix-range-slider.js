function s(r,t="Assertion Error"){if(!r)throw new Error(t)}var p=r=>(r||"1").replace(".","").length-1,n=(r,t=0,e=100,i)=>{let a=Math.max(t,Math.min(e,r));return typeof i=="undefined"?a:h(a,i)},h=(r,t=1)=>{let e=1/t;return Math.round(r*e)/e},m=f`
  <template>
    <div class="slider" part="root">
      <slot name="input">
        <input type="range" />
      </slot>
      <div class="track" part="comparison-value"></div>
      <div class="track" part="value"></div>
    </div>
    <style>
      :host {
        display: inline-block;
        overflow: hidden;
        background-color: #c3d5df;
        box-sizing: border-box;
        position: relative;
      }

      :host(:focus),
      :host(:focus-within) {
        outline-color: -webkit-focus-ring-color;
        outline-style: auto;
        outline-width: 5px;
      }

      :host([vertical]) {
        width: 2rem;
        height: 12rem;
        cursor: ns-resize;
      }

      :host(:not([vertical])) {
        cursor: ew-resize;
        width: 12rem;
        height: 2rem;
      }

      :host([comparison-label])::after {
        display: block;
        position: absolute;
        left: 0;
        content: attr(comparison-value);
        color: var(--afix-range-slider-comparison-label-color, #fff);
        width: 100%;
        mix-blend-mode: difference;
      }

      :host([comparison-label][vertical])::after {
        transform: translateY(
          clamp(0%, calc(105% - var(--comparison-value)), 85%)
        );
        top: 0;
        height: 100%;
        text-align: center;
      }

      :host([comparison-label]:not([vertical]))::after {
        transform: translateX(
            clamp(5%, calc(var(--comparison-value) - 15%), 85%)
          )
          translateY(-50%);
        top: 50%;
        text-align: left;
      }

      .slider {
        width: 100%;
        height: 100%;
        position: relative;
      }

      .track {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;

        /*
        * Safari's painting optimisation ends up leaving line artefacts behind sometimes.
        * Expanding the track's box by 2px in all directions helps prevent artefacts.
        */
        box-shadow: 2px 2px transparent;
      }

      .track[part='comparison-value'] {
        background-color: var(--ars-comparison-value-color, #fd892e);
      }

      :host(:not([comparison-value])) .track[part='comparison-value'] {
        display: none;
      }

      :host([vertical]) .track[part='comparison-value'] {
        transform: translateY(calc(100% - var(--comparison-value)));
      }

      :host(:not([vertical])) .track[part='comparison-value'] {
        transform: translateX(calc(-100% + var(--comparison-value)));
      }

      :host([vertical]) .track[part='value'] {
        transform: translateY(calc(100% - var(--value)));
      }

      :host(:not([vertical])) .track[part='value'] {
        transform: translateX(calc(-100% + var(--value)));
      }

      :host(:not([line-style])) .track[part='value'] {
        background-color: var(--afix-range-slider-value-color, currentColor);
      }

      :host([line-style]) .track[part='value'] {
        height: calc(100% - 2px);
      }

      :host([line-style]) .track[part='value']::after {
        position: absolute;
        content: '';
        display: block;
        background: var(--afix-range-slider-track-line-color, currentColor);
      }

      :host([vertical][line-style]) .track[part='value']::after {
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
      }

      :host(:not([vertical])[line-style]) .track[part='value'] {
        width: calc(100% - 2px);
        height: 100%;
      }

      :host(:not([vertical])[line-style]) .track[part='value']::after {
        top: 0;
        right: -2px;
        height: 100%;
        width: 2px;
      }

      input {
        clip: rect(1px, 1px, 1px, 1px);
        clip-path: inset(50%);
        height: 1px;
        width: 1px;
        margin: -1px;
        overflow: hidden;
        position: absolute;
      }
    </style>
  </template>
`;function f(r){let t=document.createElement("div");return t.innerHTML=String.raw(r),s(t.firstElementChild instanceof HTMLTemplateElement),t.firstElementChild}var o=class extends HTMLElement{constructor(){super();this.min=this.getAttribute("min")??"0";let t=this.max=this.getAttribute("max")??"100";this.step=this.getAttribute("step")??"1",this.value=this.getAttribute("value")??String(+t/2),this.hasAttribute("comparison-value")&&(this.comparisonValue=this.getAttribute("comparison-value")),this.attachShadow({mode:"open"}).appendChild(m.content.cloneNode(!0)),this.inputEl=this.configureInput(this.shadowRoot.querySelector("input")),this.inputSlotEl=this.shadowRoot.querySelector("slot[name=input]"),this.inputSlotEl?.addEventListener("slotchange",()=>{let e=this.inputSlotEl?.assignedElements();s(!!e&&e.length!==0),this.inputEl=this.configureInput(e[0],this.inputEl)}),this.hasAttribute("tabindex")||(this.tabIndex=0),this.updateAccessibilityModel({min:this.min,max:this.max,value:this.value,vertical:this.getAttribute("vertical")}),this.addEventListener("wheel",this.handleWheel),this.addEventListener("pointerdown",this.handlePointer),this.addEventListener("touchstart",e=>e.preventDefault()),this.addEventListener("keydown",this.handleKeyboard)}get value(){return this.getAttribute("value")??"0"}set value(t){let e=String(n(+this.max,+this.min,+t,+this.step));this.setAttribute("value",e),this.style.setProperty("--value",e+"%")}get step(){return this.getAttribute("step")??"1"}set step(t){this.setAttribute("step",t)}get min(){return this.getAttribute("min")??"0"}set min(t){this.setAttribute("min",t)}get max(){return this.getAttribute("max")??"100"}set max(t){this.setAttribute("max",t)}get comparisonValue(){return this.getAttribute("comparison-value")}set comparisonValue(t){if(t===null){this.removeAttribute("comparison-value");return}let e=String(n(+this.max,+this.min,+t));this.setAttribute("comparison-value",e),this.style.setProperty("--comparison-value",e+"%")}get vertical(){return this.hasAttribute("vertical")}set vertical(t){t?this.setAttribute("vertical",""):this.removeAttribute("vertical")}attributeChangedCallback(t,e,i){t==="value"&&(+i<+this.min||+i>+this.max||h(+i,+this.step)!==+this.value)&&(this.value=i),this.updateAccessibilityModel({[t]:i})}configureInput(t,e){return s(t instanceof HTMLInputElement),e&&(e.removeEventListener("change",this.emitChangeEvent),e.remove()),t.addEventListener("change",this.emitChangeEvent,{passive:!0}),this.value&&(t.value=this.value),this.min&&(t.min=this.min),this.max&&(t.max=this.max),this.step&&(t.step=this.step),t}emitChangeEvent(){this.dispatchEvent(new MessageEvent("change",{data:{value:(+this.value).toFixed(p(this.step)),rawValue:+this.value},bubbles:!0}))}getState(){let{width:t,height:e}=this.getBoundingClientRect();return{width:t,height:e,min:+this.min,max:+this.max,value:+this.value}}handleWheel(t){t.preventDefault(),this.handleMove(t.deltaX,t.deltaY,this.getState())}handlePointer(t){let e=this.getState(),i=a=>{this.handleMove(t.clientX-a.clientX,t.clientY-a.clientY,e)};t.preventDefault(),this.setPointerCapture(t.pointerId),this.addEventListener("lostpointercapture",()=>window.removeEventListener("pointermove",i),{passive:!0,once:!0}),window.addEventListener("pointermove",i,{passive:!0})}handleKeyboard(t){t.preventDefault();let e=(t.shiftKey||/^Page(Up|Down)$/.test(t.key)?10:1)*+this.step;switch(t.key){case"ArrowLeft":case"ArrowDown":case"PageDown":this.value=String(n(+this.value-e,+this.min,+this.max,+this.step));break;case"ArrowRight":case"ArrowUp":case"PageUp":this.value=String(n(+this.value+e,+this.min,+this.max,+this.step));break;case"Home":this.value=this.min;break;case"End":this.value=this.max;break}}handleMove(t,e,{height:i,width:a,min:v,max:l,value:d}){s(typeof t=="number"&&typeof e=="number","handleMove was called without dx or dy!");let[u,g]=i>a?[i,e]:[a,-t],b=u/l*d+g,c=n(b/u*l,v,l).toFixed(+this.step);this.value=c,this.inputEl.value=c,this.emitChangeEvent()}updateAccessibilityModel({min:t,max:e,value:i,vertical:a}){this.hasAttribute("role")||this.setAttribute("role","slider"),typeof t!="undefined"&&this.setAttribute("aria-valuemin",String(t)),typeof e!="undefined"&&this.setAttribute("aria-valuemax",String(e)),typeof i!="undefined"&&this.setAttribute("aria-valuenow",String(i)),typeof a!="undefined"&&this.setAttribute("aria-orientation",a===""?"vertical":"horizontal")}};o.observedAttributes=["value","step","min","max","comparison-value","vertical"];customElements.define("afix-range-slider",o);var x=o;export{o as AfixRangeSlider,x as default};
