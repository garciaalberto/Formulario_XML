var formElement=null;
var numeroSecreto=null;
var respuestaSelect=null;
var respuestasCheckbox = [];
var nota = 0;  //nota de la prueba sobre 10 puntos (hay 10 preguntas)

window.onload = function(){ 
 formElement=document.getElementById('myform');
 formElement.onsubmit=function(){
 	inicializar();
 	if (comprobar()){
 		corregirNumber();
 		corregirSelect();
 		corregirCheckbox();
 		presentarNota();
 	}
 	return false;
 }
 
 var xhttp = new XMLHttpRequest();
 xhttp.onreadystatechange = function() {
 	if (this.readyState == 4 && this.status == 200) {
 		gestionarXml(this);
 	}
 };
 xhttp.open("GET", "xml/preguntas.xml", true);
 xhttp.send();
}

function gestionarXml(dadesXml){
 var xmlDoc = dadesXml.responseXML; 
 var tituloInput=xmlDoc.getElementsByTagName("title")[0].innerHTML;
 ponerDatosInputHtml(tituloInput);
 numeroSecreto=parseInt(xmlDoc.getElementsByTagName("answer")[0].innerHTML);
 var tituloSelect=xmlDoc.getElementsByTagName("title")[1].innerHTML;
 var opcionesSelect = [];
 var nopt = xmlDoc.getElementById("profe_002").getElementsByTagName('option').length;
 for (i = 0; i < nopt; i++) { 
 	opcionesSelect[i] = xmlDoc.getElementById("profe_002").getElementsByTagName('option')[i].innerHTML;
 }
 ponerDatosSelectHtml(tituloSelect,opcionesSelect);
 respuestaSelect=parseInt(xmlDoc.getElementsByTagName("answer")[1].innerHTML);
 var tituloCheckbox = xmlDoc.getElementsByTagName("title")[2].innerHTML;
 var opcionesCheckbox = [];
 var nopt = xmlDoc.getElementById("profe_003").getElementsByTagName('option').length;
 for (i = 0; i < nopt; i++) { 
 	opcionesCheckbox[i]=xmlDoc.getElementById("profe_003").getElementsByTagName('option')[i].innerHTML;
 }  
 ponerDatosCheckboxHtml(tituloCheckbox,opcionesCheckbox);
 var nres = xmlDoc.getElementById("profe_003").getElementsByTagName('answer').length;
 for (i = 0; i < nres; i++) { 
 	respuestasCheckbox[i]=xmlDoc.getElementById("profe_003").getElementsByTagName("answer")[i].innerHTML;
 }
}
function corregirNumber(){
  var s=formElement.elements[0].value;     
  if (s==numeroSecreto) {
  	darRespuestaHtml("P1: Exacto!");
  	nota +=1;
  }
  else {
  	if (s>numeroSecreto) darRespuestaHtml("P1: Te has pasado");
  	else darRespuestaHtml("P1: Te has quedado corto");
  }
}

function corregirSelect(){
  var sel = formElement.elements[1];  
  if (sel.selectedIndex-1==respuestaSelect) {
  	darRespuestaHtml("P2: Correcto");
  	nota +=1;
  }
  else darRespuestaHtml("P2: Incorrecto");
}

function corregirCheckbox(){
  var f=formElement;
  var escorrecta = [];
  for (i = 0; i < f.color.length; i++) {
  	if (f.color[i].checked) {
  		escorrecta[i]=false;     
  		for (j = 0; j < respuestasCheckbox.length; j++) {
  			if (i==respuestasCheckbox[j]) escorrecta[i]=true;
  		}
    if (escorrecta[i]) {
     nota +=1.0/respuestasCheckbox.length; 
     darRespuestaHtml("P3: "+i+" correcta");    
 } else {
     nota -=1.0/respuestasCheckbox.length; 
     darRespuestaHtml("P3: "+i+" incorrecta");
 }   
} 
}
}

function ponerDatosInputHtml(t){
	document.getElementById("tituloInput").innerHTML = t;
}

function ponerDatosSelectHtml(t,opt){
	document.getElementById("tituloSelect").innerHTML=t;
	var select = document.getElementsByTagName("select")[0];
	for (i = 0; i < opt.length; i++) { 
		var option = document.createElement("option");
		option.text = opt[i];
		option.value=i+1;
		select.options.add(option);
	}  
}

function ponerDatosCheckboxHtml(t,opt){
	var checkboxContainer=document.getElementById('checkboxDiv');
	document.getElementById('tituloCheckbox').innerHTML = t;
	for (i = 0; i < opt.length; i++) { 
		var input = document.createElement("input");
		var label = document.createElement("label");
		label.innerHTML=opt[i];
		label.setAttribute("for", "color_"+i);
		input.type="checkbox";
		input.name="color";
		input.id="color_"+i;;    
		checkboxContainer.appendChild(input);
		checkboxContainer.appendChild(label);
		checkboxContainer.appendChild(document.createElement("br"));
	}  
}

function darRespuestaHtml(r){
	var p = document.createElement("p");
	var node = document.createTextNode(r);
	p.appendChild(node);
	document.getElementById('resultadosDiv').appendChild(p);
}

function presentarNota(){
	darRespuestaHtml("Nota: "+nota+" puntos sobre 3");
}

function inicializar(){
	document.getElementById('resultadosDiv').innerHTML = "";
	nota=0.0;
}

function comprobar(){
	var f=formElement;
	var checked=false;
   for (i = 0; i < f.color.length; i++) { 
   	if (f.color[i].checked) checked=true;
}
for (i = 0; i < preguntasText.length; i++){
	var input = document.getElementById("pregunta"+i).getElementsByTagName("input")[0];
	if (input.value="") {
	input.focus();
	alert("Escribe un número");
	return false;
	}
}
} else if (f.elements[1].selectedIndex==0) {
	f.elements[1].focus();
	alert("Selecciona una opción");
	return false;
} if (!checked) {    
	document.getElementsByTagName("h3")[2].focus();
	alert("Selecciona una opción del checkbox");
	return false;
} else  return true;
}
