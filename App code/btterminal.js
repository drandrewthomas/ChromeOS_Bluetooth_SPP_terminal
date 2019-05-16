$(window).on('load',function()
{
  layoutwindow();
  $('#btdevicesbox').hide();
  $('#sendbox').hide();
  $('#bluetoothoff').hide();
  getbtdevices();
  $(window).on('resize',function(){layoutwindow();});
  $('#sendbutton').on('click',function(){send_clicked();});
  $('#connectbutton').on('click',function(){connect_clicked();});
  $('#disconnectbutton').on('click',function(){disconnect_clicked();});
  $('#clearbutton').on('click',function(){clear_clicked();});
  $('#savebutton').on('click',function(){save_clicked();});
  if(btgotdevices===true) $('#statustext').html("Not connected");
  chrome.runtime.onSuspend.addListener(function(){if(btconnected===true) btdisconnect();});
  checkbtstatus();
  btmessagediv=$('#messagediv');
});

function send_clicked()
{
	var txt=$('#sendtext').val();
	var ind=$('#lineending').prop('selectedIndex');
	switch(ind)
	{
		case 0: if(txt==="") return; break;
		case 1: txt+="\r"; break;
		case 2: txt+="\r\n"; break;
	}
	btsend(txt);
	$('#sendtext').val("");
}

function connect_clicked()
{
  var dnm,dno,dad;
  dnm=$("#btselect option:selected").text();
  dno=btdevicefromname(dnm);
  if(dno!==-1)
  {
    $('#connectbutton').hide();
    dad=btdevices[dno].address;
    getbtdeviceinfo(dno);
    btconnect(dad);
  }
}

function clear_clicked()
{
  bttxt="";
  $('#messagediv').html("");
}

function save_clicked()
{
  var fname="BT terminal data file.txt";
  var file=new File([bttxt],fname,{type:"text/plain;charset=utf-8"});
  saveAs(file);
}

function disconnect_clicked()
{
  btdisconnect();
}

function layoutwindow()
{
  $('#sendtext').outerHeight($('#sendbutton').outerHeight(true));
  var hmx=$('#btdevicesbox').outerHeight(true);
  var h1=$('#sendbox').outerHeight(true);
  var h2=$('#bluetoothoff').outerHeight(true);
  if(h1>hmx) hmx=h1;
  if(h2>hmx) hmx=h2;
  $('#btdevices').outerHeight(hmx);
  $('#sendbox').outerHeight(hmx);
  $('#bluetoothoff').outerHeight(hmx);
  var mtop=parseInt($('#btdevicesbox').offset().top+$('#btdevicesbox').outerHeight(true),10)+5;
  var mbot=parseInt($(document).height()-$('#statusdiv').offset().top,10)+5;
  $('#messagediv').css("top",mtop+"px");
  $('#messagediv').css("bottom",mbot+"px");
}
