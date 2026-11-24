import { ref, onMounted, onUnmounted } from 'vue';
export function useSpringPhysics(initial=0,{stiffness=185,damping=21,mass=1}={}){
 const value=ref(initial), target=ref(initial); let velocity=0, raf=0, previous=0;
 const tick=now=>{if(!previous)previous=now;const dt=Math.min((now-previous)/1000,.032);previous=now;const acceleration=(-stiffness*(value.value-target.value)-damping*velocity)/mass;velocity+=acceleration*dt;value.value+=velocity*dt;if(Math.abs(velocity)>.001||Math.abs(value.value-target.value)>.001)raf=requestAnimationFrame(tick);else{value.value=target.value;raf=0;previous=0}};
 const set=next=>{target.value=next;if(!raf)raf=requestAnimationFrame(tick)};onUnmounted(()=>cancelAnimationFrame(raf));return {value,target,set};
}
