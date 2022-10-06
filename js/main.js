currentLang=location.href.includes("index_zh.html")?"zh":"en"
if(isMobile()){if(currentLang==="en"){window.location=location.origin+"/m_index.html"}else{window.location=location.origin+"/m_index_zh.html"}}else{}
const $newestTable=$("#newest_order").children("table").children("tbody");const $myOrderTable=$("#my_order").children("table").children("tbody");const orderStatusMap={1:"未生效",2:"等待生效",3:"已生效",4:"已完成",5:"待确认",6:"退款",};const orderStatusMapEn={1:"Not Effective",2:"Waiting Effective",3:"Effective",4:"Completed",5:"Waiting Confirmed",6:"Refund",};const orderStatusColorMap={1:"status_tag_waring",2:"status_tag_waring",3:"status_tag_success",4:"status_tag_info",5:"status_tag_waring",6:"status_tag_error",};let formatDay=currentLang==="zh"?" 天":" day"
let formatEnergy=currentLang==="zh"?" 能量":" Energy"
loadNewestOrder();function loadNewestOrder(){$.ajax({url:baseUrl+"order/newest",timeout:2000,beforeSend:function(){$newestTable.empty();$newestTable.append('<tr><td colspan="6" class="loadingTD"><svg class="load" viewBox="25 25 50 50"><circle class="loading" cx="50" cy="50" r="20" fill="none" /></svg><div class="loadText">Loading...</div></td></tr>');},success:function(res){if(res.code!==undefined&&res.code===0){let orderList=res.data;$newestTable.empty();let html="";$.each(orderList,function(i,record){html+='<tr class="tr_rent"><td><a href="https://tronscan.org/#/transaction/'+
record.frozen_tx_id+
'" target="_blank">TxHash</a> </td><td>'+
record.receive_address+
"</td><td>"+
parseInt(record.resource_value).toLocaleString()+
formatEnergy+
"</td><td>"+
record.rent_duration+
formatDay+
"</td><td>"+
timeFormat(record.freeze_time)+
"</td></tr>";});if(html){$newestTable.append(html);}else{$newestTable.append('<tr><td colspan="6" class="loadingTD"><div class="loadText"><div> <img class="no-data"  src="img/nodata.svg" /> </div><div >No Data</div> </div></td></tr>');}}else{$newestTable.empty();$newestTable.append('<tr><td colspan="6" class="loadingTD"><div class="loadText"> <div> <img class="no-data"  src="img/nodata.svg" /> </div><div >No Data</div> </div></td></tr>');}},error:function(){$newestTable.empty();$newestTable.append('<tr><td colspan="6" class="loadingTD"><div class="loadText"> <div> <img class="no-data"  src="img/nodata.svg" /> </div><div >No Data</div> </div></td></tr>');},});}
let pageNum=defaultPageIndex;let maxPage=maxPageIndex;let $pagination=$("#pagination");function loadMyOrder(page,pageSize){if(myAddress==''){$myOrderTable.empty();$myOrderTable.append('<tr><td colspan="9" class="loadingTD"><div class="loadText"> <div> <img class="no-data"  src="img/nodata.svg" /> </div><div >No Data</div> </div></td></tr>');return}
page=Number(page)||1;pageSize=Number(pageSize)||20;$.ajax({url:baseUrl+"order/list",data:{page_size:pageSize,trx_address:myAddress,page:page,},timeout:2000,beforeSend:function(){$myOrderTable.empty();$myOrderTable.append('<tr><td colspan="9" class="loadingTD"><svg class="load" viewBox="25 25 50 50"><circle class="loading" cx="50" cy="50" r="20" fill="none" /></svg><div class="loadText">Loading...</div></td></tr>');},success:function(res){if(res.code!==undefined&&res.code===0){let orderList=res.data;$myOrderTable.empty();let html="";let statusMap=currentLang==="zh"?orderStatusMap:orderStatusMapEn
$.each(orderList,function(i,record){html+='<tr class="tr_rent"><td><a href="https://tronscan.org/#/transaction/'+
record.frozen_tx_id+
'" target="_blank">TxHash</a> </td><td>'+
timeFormat(record.pay_time)+
`</td><td><span class='${orderStatusColorMap[record.status]}'>`+
(statusMap[record.status]||"异常")+
"</span></td><td>"+
record.order_no+
"</td><td>"+
HideStar(record.receive_address)+
"</td><td>"+
parseInt(record.resource_value).toLocaleString()+
formatEnergy+
"</td><td>"+
record.rent_duration+
formatDay+
"</td><td>"+
timeFormat(record.rent_expire_time)+
"</td><td>"+
record.pay_amount+
" "+
record.pay_symbol+
"</td></tr>";});if(html){$myOrderTable.append(html);}else{$myOrderTable.append('<tr><td colspan="9" class="loadingTD"><div class="loadText"> <div> <img class="no-data"  src="img/nodata.svg" /> </div><div >No Data</div> </div></td></tr>');}
let multiPage=pagination("my_order_page_item",page,pageSize,(res.pagination!==undefined&&res.pagination.total)?res.pagination.total:0,maxPage);if(multiPage!==""){$pagination.html(multiPage);}}else{$myOrderTable.empty();$myOrderTable.append('<tr><td colspan="9" class="loadingTD"><div class="loadText"> <div> <img class="no-data"  src="img/nodata.svg" /> </div><div >No Data</div> </div></td></tr>');}},error:function(){$myOrderTable.empty();$myOrderTable.append('<tr><td colspan="9" class="loadingTD"><div class="loadText"><div> <img class="no-data"  src="img/nodata.svg" /> </div><div >No Data</div> </div></td></tr>');},});}
$pagination.on("click","li.my_order_page_item",function(){let page=$(this).data("page");loadMyOrder(page,defaultPageSize);});$(".service1_button.item1").click(function(){$(this).addClass("active").siblings().removeClass("active");let objID=$(this).data("name");if(objID==="accountAddressETF"){$("#pay_dapp").hide();$("#pay_copy").show();}else{$("#pay_dapp").show();$("#pay_copy").hide();}
$(".transferDiv").hide();$("#"+objID).show();});$(".service1_button.item2").click(function(){$(this).addClass("active").siblings().removeClass("active");});$(".service1_button.item3").click(function(){$(this).attr("id","pay_action").siblings().removeAttr("id");$(this).addClass("active").siblings().removeClass("active");let objID=$(this).data("name");$(".payTypeDiv").hide();$("#"+objID).show();payAction=$("#pay_action").text();if(objID==="payTypeUSDT"){$.ajax({url:baseUrl+'config/base',data:{config_name:"USDT_PRICE_IN_TRX"},timeout:2000,success:function(res){if(res.code===0){calculationAmount(resourceValue,rentDay);}},error:function(){calculationAmount(resourceValue,rentDay);},})}else{calculationAmount(resourceValue,rentDay);}});$(".choice_button").click(function(){$(this).addClass("active").siblings().removeClass("active");let objID=$(this).data("name");$(".table_box").hide();$("#"+objID).show();switch(objID){case "newest_order":loadNewestOrder();break;case "my_order":loadMyOrder(defaultPageIndex,defaultPageSize);break;}});$("#top_menu").find("li").click(function(){let objID=$(this).data("name");if(objID==='business_box'){return}
let scrollOffset=$("#"+objID).offset();$([document.documentElement,document.body]).animate({scrollTop:scrollOffset.top,},800);});$(".service3_hover_wrap").hover(function(){$("#demo-wrap").show();},function(){$("#demo-wrap").hide();});$(".float_box").click(function(){$(".paySuccess_lx").show();});$("#reduce_day").click(function(){console.log("+++")
let obj=$("#leaseDayNumber");if(obj.val()>3){obj.val(Number(obj.val())-1);$("#leaseDayNumber").trigger("input");}});$("#add_day").click(function(){console.log("+++")
let obj=$("#leaseDayNumber");if(obj.val()<30){obj.val(Number(obj.val())+1);$("#leaseDayNumber").trigger("input");}});function showLoginModel(){$(".mask.login_model").show();}
function timeFormat(ts){let date=new Date(ts*1000);let year=date.getFullYear();let month=date.getMonth()+1<10?"0"+(date.getMonth()+1):date.getMonth()+1;let day=date.getDate()<10?"0"+date.getDate():date.getDate();let hour=date.getHours()<10?"0"+date.getHours():date.getHours();let minute=date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes();let second=date.getSeconds()<10?"0"+date.getSeconds():date.getSeconds();return month+"-"+day;}
function HideStar(str){let len=str?.length;if(len===0){return str;}
let head=str?.substr(0,4);let tail=str?.substr(len-4);return head+"****"+tail;}
$(window).on("scroll",function(){var scrollPos=$(window).scrollTop();if(scrollPos<=0){$(".float_box").fadeOut();$(".top_box").fadeOut();}else{$(".float_box").fadeIn();$(".top_box").fadeIn();}});$(".language").click(function(ev){const target=ev.target;const lang=target.innerText;if(target.classList.contains("item")||target.classList.contains("a-item")){const originLanguage=$(".language .current .name").text()==="English"?"en":"zh"
document.querySelector(".language .name").innerText=lang;let language
if(target.classList.contains("a-item")||target.classList.contains("item")){language=$(target).attr("data-lang");if(language==="zh"){if(originLanguage==="zh"){$(".options").toggle();return}
location.href=location.origin+"/index_zh.html"}else{if(originLanguage==="en"){$(".options").toggle();return}
location.href=location.origin}}}
$(".options").toggle();});$("#top_menu").find("li").click(function(){const ele=$(this).parent().find("li.active");ele.removeClass("active");$(this).addClass("active");});var container;var camera,scene,renderer,controls,obj,manager,onProgress,onError;var mouseX=0,mouseY=0;var winWidth=1400;var winHeight=700;var windowHalfX=winWidth/2;var windowHalfY=winHeight/2;function init(){camera=new THREE.PerspectiveCamera(31,winWidth/winHeight,1,2000);camera.position.z=250;controls=new THREE.OrbitControls(camera);controls.autoRotate=true;controls.enabled=false;controls.autoRotateSpeed=-1;controls.update();scene=new THREE.Scene();var ambientLight=new THREE.AmbientLight(0xffffff,0.5);scene.add(ambientLight);var pointLight=new THREE.DirectionalLight(0x121e42,4);pointLight.position.set(250,250,220);camera.add(pointLight);scene.add(camera);manager=new THREE.LoadingManager();addTronNew();addTronLizi('./obj/TRON_lizi1.obj');addTronLizi('./obj/TRON_lizi2.obj');addTronLizi('./obj/TRON_lizi3.obj');addTronLizi('./obj/TRON_lizi4.obj');renderer=new THREE.WebGLRenderer({alpha:true});renderer.setPixelRatio(window.devicePixelRatio);renderer.setSize(winWidth,winHeight);container=document.querySelector(".background_img");container.appendChild(renderer.domElement);document.addEventListener('mousemove',onDocumentMouseMove,false);}
function onDocumentMouseMove(event){controls.autoRotateSpeed=(event.clientX-windowHalfX)/100;}
function animate(){requestAnimationFrame(animate);render();}
function render(){controls.update();controls.autoRotateSpeed=-1;camera.lookAt(scene.position);renderer.render(scene,camera);}
function addTronNew(){let loader=new THREE.OBJLoader(manager);var cubetLoader=new THREE.CubeTextureLoader();var CubeTexture=cubetLoader.load(['./obj/h.jpeg','./obj/q.jpeg','./obj/s.jpeg','./obj/x.jpeg','./obj/y.jpeg','./obj/z.jpeg']);loader.load('./obj/TRON_new.obj',function(object){var sphereMaterial=new THREE.MeshPhongMaterial({color:0x2052FF,specular:0xffffff,shininess:4,envMap:CubeTexture,reflectivity:0.5,});object.traverse(function(child){if(child instanceof THREE.Mesh){child.material=sphereMaterial;}});object.rotateY(Math.PI/2);object.rotateX(Math.PI/0.292);object.scale.set(0.7,0.7,0.7)
object.position.y=10;obj=object;scene.add(object);},onProgress,onError);};function addTronLizi(obj){let loader=new THREE.OBJLoader(manager);loader.load(obj,function(object){var sphereMaterial=new THREE.MeshPhongMaterial({color:0x2A47AB,specular:0xffffff,shininess:0,});object.traverse(function(child){if(child instanceof THREE.Mesh){child.material=sphereMaterial;}});for(let i=0;i<=50;i++){let newObj=object.clone();let sr=1/getRndInteger(3,8);newObj.scale.set(sr,sr,sr)
newObj.rotateY(Math.PI/getRndInteger(1,10));newObj.rotateX(Math.PI/getRndInteger(1,10));newObj.position.x=getRndInteger(-100,100);newObj.position.y=getRndInteger(-10,10);newObj.position.z=getRndInteger(-100,100);scene.add(newObj);}},onProgress,onError);};function getRndInteger(min,max){return Math.floor(Math.random()*(max-min))+min;};function backTop(){window.scrollTo({top:0,behavior:'smooth'})};window.onload=function(){init();animate();}
function setCookie(name,value,time){var d=new Date();d.setTime(d.getTime()+(time*24*60*60*1000));var expires="expires="+d.toGMTString();document.cookie=name+"="+value+"; "+expires;}
function getCookie(name){var arr=document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));if(arr!=null)return unescape(arr[2]);return null;};function delCookie(name){var exp=new Date();exp.setTime(exp.getTime()-1);var cval=getCookie(name);if(cval!=null)document.cookie=name+"="+cval+";expires="+exp.toGMTString();};function clickActivity(){showModal("activity_show","activity_show_box")}
function showModal(show_div,bg_div){document.getElementById(show_div).style.display='flex';document.getElementById(bg_div).style.display='flex';var bgdiv=document.getElementById(bg_div);bgdiv.style.width=document.body.scrollWidth;$("#"+bg_div).height($(document).height());}
function closeModal(show_div,bg_div){document.getElementById(show_div).style.display='none';document.getElementById(bg_div).style.display='none';}
function setActivity(){if(currentLang==="zh"){if(!getCookie("activityZh")){clickActivity()
setCookie("activityZh",Math.round(new Date()/1000),1)}}else{if(!getCookie("activityEn")){clickActivity()
setCookie("activityEn",Math.round(new Date()/1000),1)}}}
setTimeout(()=>{setActivity()},3000);
