//! Illustrative pH recovery model. This is not a validated chemical equilibrium solver.
fn rate(ph:f64,t:f64,acid:f64,buffer:f64)->f64 {
    let rest_h=10f64.powf(-6.8); let h=10f64.powf(-ph);
    let acid_h=acid*(-t/8.0).exp();
    let net=acid_h-buffer*(h-rest_h);
    // Convert the toy proton-rate scale to a bounded pH-rate scale.
    (-net*0.025).clamp(-0.25,0.25)
}

pub fn rk4_step(ph:f64,t:f64,acid:f64,buffer:f64,dt:f64)->f64 {
    if !ph.is_finite() || !t.is_finite() || dt<=0.0 { return ph; }
    let k1=rate(ph,t,acid,buffer);
    let k2=rate(ph+k1*dt/2.0,t+dt/2.0,acid,buffer);
    let k3=rate(ph+k2*dt/2.0,t+dt/2.0,acid,buffer);
    let k4=rate(ph+k3*dt,t+dt,acid,buffer);
    (ph+dt*(k1+2.0*k2+2.0*k3+k4)/6.0).clamp(3.0,7.2)
}
