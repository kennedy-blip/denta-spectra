// Package odontology contains sample color and fee comparison calculations.
// Illustrative tables are not regional insurance/UCR data or clinical guidelines.
package odontology

import "math"

type Lab struct { L, A, B float64 }
type Shade struct { Name string; Lab Lab }
type Match struct { Name string `json:"name"`; DeltaE float64 `json:"deltaE"` }

func DeltaE2000(x, y Lab) float64 {
    rad:=math.Pi/180
    c1:=math.Hypot(x.A,x.B); c2:=math.Hypot(y.A,y.B); cbar:=(c1+c2)/2
    g:=.5*(1-math.Sqrt(math.Pow(cbar,7)/(math.Pow(cbar,7)+math.Pow(25,7))))
    a1:=(1+g)*x.A; a2:=(1+g)*y.A
    c1=math.Hypot(a1,x.B); c2=math.Hypot(a2,y.B)
    hue:=func(a,b float64)float64{h:=math.Atan2(b,a)/rad;if h<0{h+=360};return h}
    h1:=hue(a1,x.B); h2:=hue(a2,y.B)
    dl:=y.L-x.L; dc:=c2-c1; dh:=h2-h1
    if c1*c2==0 { dh=0 } else if dh>180 {dh-=360} else if dh < -180 {dh+=360}
    dH:=2*math.Sqrt(c1*c2)*math.Sin(dh*rad/2)
    lbar:=(x.L+y.L)/2; cbar=(c1+c2)/2; hbar:=h1+h2
    if c1*c2==0 {hbar=h1+h2} else if math.Abs(h1-h2)>180 {if hbar<360 {hbar=(hbar+360)/2}else{hbar=(hbar-360)/2}} else {hbar/=2}
    t:=1-.17*math.Cos((hbar-30)*rad)+.24*math.Cos(2*hbar*rad)+.32*math.Cos((3*hbar+6)*rad)-.20*math.Cos((4*hbar-63)*rad)
    sl:=1+.015*math.Pow(lbar-50,2)/math.Sqrt(20+math.Pow(lbar-50,2)); sc:=1+.045*cbar; sh:=1+.015*cbar*t
    rt:=-2*math.Sqrt(math.Pow(cbar,7)/(math.Pow(cbar,7)+math.Pow(25,7)))*math.Sin(60*math.Exp(-math.Pow((hbar-275)/25,2))*rad)
    return math.Sqrt(math.Pow(dl/sl,2)+math.Pow(dc/sc,2)+math.Pow(dH/sh,2)+rt*(dc/sc)*(dH/sh))
}
func WhitenessIndex(l Lab) float64 { return .511*l.L-2.324*l.A-1.100*l.B }
func MatchShade(l Lab, shades []Shade) Match { best:=Match{DeltaE:math.Inf(1)}; for _,s:=range shades { d:=DeltaE2000(l,s.Lab); if d<best.DeltaE {best=Match{Name:s.Name,DeltaE:d}} }; return best }

type FeeBand struct { Code string `json:"code"`; Median float64 `json:"median"`; P80 float64 `json:"p80"`; P95 float64 `json:"p95"` }
func CompareFee(code string, price float64, bands []FeeBand) (FeeBand, string) { for _,b:=range bands {if b.Code==code {if price>b.P95{return b,"above illustrative 95th percentile"}; if price>b.P80{return b,"above illustrative 80th percentile"};return b,"within illustrative comparison"}}; return FeeBand{Code:code},"unknown code; request an itemized explanation" }
