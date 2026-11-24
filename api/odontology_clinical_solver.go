package handler

import (
 "encoding/json"
 "net/http"
 "strings"
)

// Handler offers basic sample telemetry summaries. It is not a clinical decision engine.
type Request struct { Module string `json:"module"`; Payload map[string]any `json:"payload"` }
type Response struct { OK bool `json:"ok"`; Module string `json:"module"`; Summary string `json:"summary"`; Disclaimer string `json:"disclaimer"` }
func Handler(w http.ResponseWriter, r *http.Request) {
 w.Header().Set("Content-Type","application/json; charset=utf-8")
 w.Header().Set("Cache-Control","no-store")
 if r.Method != http.MethodPost { w.Header().Set("Allow",http.MethodPost); http.Error(w,"POST only",http.StatusMethodNotAllowed); return }
 var req Request; dec:=json.NewDecoder(http.MaxBytesReader(w,r.Body,1<<20)); dec.DisallowUnknownFields()
 if err:=dec.Decode(&req); err!=nil {http.Error(w,"invalid JSON payload",http.StatusBadRequest);return}
 module:=strings.TrimSpace(req.Module); allowed:=map[string]bool{"qlf":true,"tmj":true,"stephan":true,"shade":true,"brush":true}
 if !allowed[module] {http.Error(w,"unsupported module",http.StatusBadRequest);return}
 _=json.NewEncoder(w).Encode(Response{OK:true,Module:module,Summary:"Payload accepted for educational processing.",Disclaimer:"This endpoint is a demo only and does not diagnose, triage, or recommend treatment."})
}
