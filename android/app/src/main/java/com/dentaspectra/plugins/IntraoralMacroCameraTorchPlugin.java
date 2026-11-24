package com.dentaspectra.plugins;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.hardware.camera2.CameraAccessException;
import android.hardware.camera2.CameraCharacteristics;
import android.hardware.camera2.CameraManager;
import android.hardware.camera2.CaptureRequest;
import androidx.core.content.ContextCompat;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

@CapacitorPlugin(name = "IntraoralMacroCameraTorch", permissions = {@Permission(alias = "camera", strings = {Manifest.permission.CAMERA})})
public class IntraoralMacroCameraTorchPlugin extends Plugin {
  @PluginMethod public void capabilities(PluginCall call) {
    CameraManager manager=(CameraManager)getContext().getSystemService(Context.CAMERA_SERVICE);
    JSObject result=new JSObject();
    try { String id=manager.getCameraIdList()[0]; CameraCharacteristics c=manager.getCameraCharacteristics(id);
      Float minFocus=c.get(CameraCharacteristics.LENS_INFO_MINIMUM_FOCUS_DISTANCE);
      result.put("cameraId",id); result.put("minimumFocusDiopters",minFocus==null?0:minFocus);
      result.put("torchAvailable",Boolean.TRUE.equals(c.get(CameraCharacteristics.FLASH_INFO_AVAILABLE)));
      result.put("awbLockSupported",c.get(CameraCharacteristics.CONTROL_AWB_LOCK_AVAILABLE));
      result.put("note","Actual focus and white-balance behavior is device-specific."); call.resolve(result);
    } catch (Exception e) { call.reject("Camera capabilities unavailable",e); }
  }
  @PluginMethod public void setTorch(PluginCall call) {
    Boolean enabled=call.getBoolean("enabled"); if(enabled==null){call.reject("enabled is required");return;}
    if(ContextCompat.checkSelfPermission(getContext(),Manifest.permission.CAMERA)!=PackageManager.PERMISSION_GRANTED){requestPermissionForAlias("camera",call,"cameraPermission");return;}
    applyTorch(call,enabled);
  }
  @PermissionCallback private void cameraPermission(PluginCall call){Boolean enabled=call.getBoolean("enabled");if(hasRequiredPermissions("camera"))applyTorch(call,Boolean.TRUE.equals(enabled));else call.reject("Camera permission denied");}
  private void applyTorch(PluginCall call,boolean enabled){try{CameraManager manager=(CameraManager)getContext().getSystemService(Context.CAMERA_SERVICE);String chosen=null;for(String id:manager.getCameraIdList()){CameraCharacteristics c=manager.getCameraCharacteristics(id);if(Boolean.TRUE.equals(c.get(CameraCharacteristics.FLASH_INFO_AVAILABLE))){chosen=id;break;}}if(chosen==null){call.reject("Torch not available on this device");return;}manager.setTorchMode(chosen,enabled);JSObject result=new JSObject();result.put("enabled",enabled);call.resolve(result);}catch(CameraAccessException e){call.reject("Unable to control torch",e);}}
}
