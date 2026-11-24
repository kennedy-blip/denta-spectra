//! Optional native/DSP reference crate. Browser builds use rustOdontologyBridge.js.
mod stephan_hydroxyapatite_kinetics;
mod tmj_vibroarthrometry;

#[no_mangle]
pub extern "C" fn denta_classify_jva(low_energy: f64, high_energy: f64, duration_ms: f64) -> f64 {
    tmj_vibroarthrometry::classify(low_energy, high_energy, duration_ms)
}

#[no_mangle]
pub extern "C" fn denta_stephan_step(ph: f64, t_min: f64, acid_rate: f64, buffer_rate: f64, dt: f64) -> f64 {
    stephan_hydroxyapatite_kinetics::rk4_step(ph, t_min, acid_rate, buffer_rate, dt)
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test] fn click_is_low_frequency_pattern() { assert_eq!(denta_classify_jva(10.0, 1.0, 12.0), 1.0); }
    #[test] fn rk4_is_bounded() { let p=denta_stephan_step(6.8,0.0,0.1,0.08,0.1); assert!(p.is_finite()); }
}
