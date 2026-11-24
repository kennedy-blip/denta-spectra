package com.dentaspectra.plugins;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.media.AudioFormat;
import android.media.AudioRecord;
import android.media.MediaRecorder;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import androidx.core.content.ContextCompat;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.PermissionState;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;
import java.util.concurrent.atomic.AtomicBoolean;

@CapacitorPlugin(name="TmjCondylarAcousticImu", permissions={@Permission(alias="microphone",strings={Manifest.permission.RECORD_AUDIO})})
public class TmjCondylarAcousticImuPlugin extends Plugin implements SensorEventListener {
  private AudioRecord recorder; private Thread worker; private final AtomicBoolean recording=new AtomicBoolean(false); private SensorManager sensors;
  @PluginMethod public void startAudio(PluginCall call){if(ContextCompat.checkSelfPermission(getContext(),Manifest.permission.RECORD_AUDIO)!=PackageManager.PERMISSION_GRANTED){requestPermissionForAlias("microphone",call,"micPermission");return;}startRecorder(call);}
  @PermissionCallback private void micPermission(PluginCall call){if(getPermissionState("microphone")==PermissionState.GRANTED)startRecorder(call);else call.reject("Microphone permission denied");}
  private void startRecorder(PluginCall call){try{int rate=48000;int min=AudioRecord.getMinBufferSize(rate,AudioFormat.CHANNEL_IN_MONO,AudioFormat.ENCODING_PCM_16BIT);if(min<=0){call.reject("Audio input unsupported");return;}recorder=new AudioRecord(MediaRecorder.AudioSource.UNPROCESSED,rate,AudioFormat.CHANNEL_IN_MONO,AudioFormat.ENCODING_PCM_16BIT,Math.max(min,rate/2));if(recorder.getState()!=AudioRecord.STATE_INITIALIZED){call.reject("AudioRecord initialization failed");return;}recorder.startRecording();recording.set(true);worker=new Thread(()->{short[] samples=new short[1024];while(recording.get()){int n=recorder.read(samples,0,samples.length);if(n>0){double sum=0;for(int i=0;i<n;i++){double v=samples[i]/32768.0;sum+=v*v;}notifyListeners("audioFrame",payload("rms",Math.sqrt(sum/n),"sampleRate",rate));}}},"denta-audio");worker.start();call.resolve(payload("sampleRate",rate,"encoding","PCM16","status","capturing"));}catch(Exception e){call.reject("Unable to start raw audio capture",e);}}
  @PluginMethod public void stopAudio(PluginCall call){recording.set(false);if(recorder!=null){try{recorder.stop();}catch(Exception ignored){}recorder.release();recorder=null;}call.resolve(payload("status","stopped"));}
  @PluginMethod public void startMotion(PluginCall call){sensors=(SensorManager)getContext().getSystemService(Context.SENSOR_SERVICE);Sensor s=sensors.getDefaultSensor(Sensor.TYPE_GAME_ROTATION_VECTOR);if(s==null)s=sensors.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);if(s==null){call.reject("No motion sensor available");return;}sensors.registerListener(this,s,SensorManager.SENSOR_DELAY_GAME);call.resolve(payload("status","listening"));}
  @Override public void onSensorChanged(SensorEvent e){org.json.JSONArray values=new org.json.JSONArray();try{for(float v:e.values)values.put(v);}catch(org.json.JSONException ex){return;}notifyListeners("motionFrame",payload("sensorType",e.sensor.getType(),"timestampNanos",e.timestamp,"values",values));}
  private JSObject payload(Object... fields){JSObject result=new JSObject();try{for(int i=0;i+1<fields.length;i+=2)result.put(String.valueOf(fields[i]),fields[i+1]);}catch(org.json.JSONException ex){throw new IllegalStateException("Unable to encode sensor payload",ex);}return result;}
  @Override public void onAccuracyChanged(Sensor sensor,int accuracy){}
  @Override protected void handleOnPause(){super.handleOnPause();if(sensors!=null)sensors.unregisterListener(this);}
  @Override protected void handleOnDestroy(){recording.set(false);if(sensors!=null)sensors.unregisterListener(this);if(recorder!=null){try{recorder.stop();}catch(Exception ignored){}recorder.release();}super.handleOnDestroy();}
}
