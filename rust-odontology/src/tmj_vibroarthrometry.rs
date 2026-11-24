//! Windowed spectral energy summary and conservative pattern labels.
/// Returns 0 baseline, 1 transient/low-band, 2 mixed, 3 sustained broadband.
pub fn classify(low_energy: f64, high_energy: f64, duration_ms: f64) -> f64 {
    if !low_energy.is_finite() || !high_energy.is_finite() || low_energy < 0.0 || high_energy < 0.0 { return 0.0; }
    let ratio = high_energy / low_energy.max(1e-9);
    if ratio >= 0.25 && duration_ms > 60.0 { 3.0 }
    else if duration_ms > 0.0 && duration_ms < 20.0 { 1.0 }
    else if ratio < 0.20 { 1.0 }
    else { 2.0 }
}

/// Mean-square energy of a real signal in a frequency bin, with Hann windowing.
pub fn hann_bin_energy(samples: &[f64], bin: usize) -> f64 {
    let n=samples.len(); if n<2 || bin>=n/2 { return 0.0; }
    let mut re=0.0; let mut im=0.0;
    for (i,x) in samples.iter().enumerate() {
        let w=0.5-0.5*(2.0*std::f64::consts::PI*i as f64/(n-1) as f64).cos();
        let a=2.0*std::f64::consts::PI*bin as f64*i as f64/n as f64;
        re+=x*w*a.cos(); im-=x*w*a.sin();
    }
    (re*re+im*im)/(n as f64*n as f64)
}

pub fn brush_force_grams(unloaded_hz:f64, loaded_hz:f64, harmonic_ratio:f64)->f64 {
    ((unloaded_hz-loaded_hz).max(0.0)*6.0 + harmonic_ratio.max(0.0)*160.0).clamp(0.0,500.0)
}
