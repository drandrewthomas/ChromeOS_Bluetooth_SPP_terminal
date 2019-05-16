// This Bluetooth code is partly based on the example BT Connect app: https://github.com/mimetics/Chrome-BTconnect-App

"use strict";

var bton=false;
var btgotdevices=false;
var btsocket=0;
var btdevices=[];
var btconnected=false;
var btaddress="";
var bttxt="";
var btmessagediv;
  
chrome.bluetoothSocket.onReceive.addListener(btreceive);
chrome.bluetoothSocket.onReceiveError.addListener(btreceiveerror);
chrome.bluetooth.onAdapterStateChanged.addListener(
  function(adapter)
  {
    if (adapter.powered!=bton)
    {
      bton=adapter.powered;
      if(bton)
      {
        $('#btdevicesbox').show();
        $('#sendbox').hide();
        $('#bluetoothoff').hide();
      }
      else
      {
        dobterror('Bluetooth is turned off');
        $('#connectbutton').show();
        $('#btdevicesbox').hide();
        $('#sendbox').hide();
        $('#bluetoothoff').show();
        $('#sendbox').hide();
        if(btconnected===true) btdisconnect();
        btconnected=false;
      }
    }
  });

function btdevicefromname(nm)
{
  var c;
  for(c=0;c<btdevices.length;c++)
    if(btdevices[c].name===nm)
      return c;
  return -1;
}
  
function btdevicefromaddress(addr)
{
  var c;
  for(c=0;c<btdevices.length;c++)
    if(btdevices[c].address===addr)
      return c;
  return -1;
}

function btsend(txt)
{
  if(btconnected===false) return;
  var txbuffer=convertStringToArrayBuffer(txt);
  chrome.bluetoothSocket.send(btsocket,txbuffer,function(bytes_sent)
  {
    if(chrome.runtime.lastError)
    {
      dobterror("Send failed: "+chrome.runtime.lastError.message);
    }
  });
}
  
function convertStringToArrayBuffer(str)
{
  var buf=new ArrayBuffer(str.length);
  var bufView=new Uint8Array(buf);
  for (var i=0;i<str.length;i++) bufView[i]=str.charCodeAt(i);
  return buf;
}
  
function convertArrayBufferToString(buf)
{
  return String.fromCharCode.apply(null,new Uint8Array(buf));
}
  
function btreceiveerror(errorInfo)
{
  dobterror("Receive error: "+errorInfo.errorMessage);
}

function btreceive(info)
{
  var numbytes=info.data.byteLength;
  var rxstring=convertArrayBufferToString(info.data);
  bttxt+=rxstring;
  btmessagediv.append(rxstring);
  btmessagediv.scrollTop(btmessagediv[0].scrollHeight);
}
  
function btdisconnect()
{
  chrome.bluetoothSocket.disconnect(btsocket);
  if (chrome.runtime.lastError)
  {
    dobterror("Disconnect failed: " + chrome.runtime.lastError.message);
    return false;
  }
  else
  {
    dobterror('Not connected');
    $('#connectbutton').show();
    $('#btdevicesbox').show();
    $('#sendbox').hide();
    btconnected=false;
  }
  return true;
}
  
function getbtdeviceinfo(devicenumber)
{
  var deviceInfo=btdevices[devicenumber];
  console.log(btdevices[devicenumber].name + " Has Address " + deviceInfo.address);
  if(deviceInfo.deviceClass) console.log(" Device Class:" + deviceInfo.deviceClass);
  if(deviceInfo.vendorId) console.log(" Vendor ID:" + deviceInfo.vendorId);
  if(deviceInfo.productId) console.log(" Product ID:" + deviceInfo.productId);
  if(deviceInfo.deviceId) console.log(" Device ID:" + deviceInfo.deviceId);
  if(deviceInfo.paired) console.log(" Paired:" + deviceInfo.paired);
  if(deviceInfo.connected) console.log(" Connected:" + deviceInfo.connected);
  for(var i = 0; deviceInfo.uuids.length > i; ++i) console.log(" uuid:" + deviceInfo.uuids[i]);
  if (chrome.runtime.lastError) console.log("getDevice Operation failed: " + chrome.runtime.lastError.message);
}
  
function btconnect(btadd)
{
  if(btconnected===true) return false;
  btaddress=btadd;
  chrome.bluetoothSocket.create(function(createInfo)
  {
    if (chrome.runtime.lastError)
    {
      dobterror("Connection failed: "+chrome.runtime.lastError.message);
      return false;
    }
    else
    {
      btsocket=createInfo.socketId;
      chrome.bluetoothSocket.connect(createInfo.socketId,btadd,"1101", btconnectedcallback);
    }
  });
  if (chrome.runtime.lastError)
  {
    dobterror("Connection failed: "+chrome.runtime.lastError.message);
    return false;
  }
  return true;
}
  
function btconnectedcallback()
{
  if (chrome.runtime.lastError)
  {
    dobterror("Connection failed: "+chrome.runtime.lastError.message);
    $('#connectbutton').show();
  }
  else
  {
    var n=btdevices[btdevicefromaddress(btaddress)].name;
    dobterror("Connected to "+n+" ("+btaddress+")");
    btconnected=true;
    $('#btdevicesbox').hide();
    $('#sendbox').show();
  }
}

function dobterror(txt)
{
	console.log(txt);
	$('#statustext').html(txt);
}

function checkbtstatus()
{
  chrome.bluetooth.getAdapterState(function(adapter)
  {
    bton=adapter.powered;
    if(bton===true)
    {
      $('#btdevicesbox').show();
      $('#sendbox').hide();
      $('#bluetoothoff').hide();
    }
    else
    {
      $('#btdevicesbox').hide();
      $('#sendbox').hide();
      $('#bluetoothoff').show();
      btconnected=false;
      dobterror("Not connected");
    }
  });
}

function getbtdevices()
{
  btdevices=[];
  btgotdevices=false;
  chrome.bluetooth.getDevices(function(devices)
  {
    $('#btselect').empty();
    for (var c=0;c<devices.length;c++)
    {
      if(devices[c].paired===true)
        if(devices[c].uuids.includes("00001101-0000-1000-8000-00805f9b34fb"))
        {
          btdevices.push(devices[c]);
          $('#btselect').append('<option value="'+devices[c].name+'">'+devices[c].name+'</option>');
        }
    }
    if(btdevices.length===0)
    {
      $('#connectbutton').hide();
      dobterror("No paired Bluetooth SPP devices!");
    }
    else btgotdevices=true;
  });
}

