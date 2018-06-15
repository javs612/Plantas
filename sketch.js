
let play=true

let fondoImg
let marcadoresImg
let solImg
let soles=275
let txtInformativo
let cartaArrastrarImg
let button
let sfxPego;
let sfxZombie;
let sfxPlant;
let sfxBg;
let progreso=0

const zombies=[]
const animacionZombieComun=[]
const animacionZombieJackson=[]
const animacionZombieCubeta=[]
const animacionZombieGrandote=[]
const plantas=[]
const cartasImg=[]
const podadoras=[]

let zombiesMatados=0
let cantidadZombiesMatar=5

let presione=0
let plantaSeleccionada=false
let cartaSeleccionada

let noCartas=5	
let noZombies=4

let nivel=1

function setup() {

	createCanvas(1365, 650)
	definirNivel()
	sfxBg.play();

}

function draw()
{
	pintarFondo()
	
	
}

function pintarFondo()
{
	pintarTablero()
	pintarCartas()
	pintarPodadoras()
	pintarPlantas()
	pintarZombies()
	pintarSolAleatorio()
	arrastrarCarta()
	activarZombieParaDisparar()
	disparoDePlantas()
	comerPlantas()
}

function preload()
{
	fondoImg=loadImage("img/Otras/fondo.jpg")
	marcadoresImg=loadImage("img/Otras/marcadores.png")
	sfxPego = loadSound("sounds/Splat.wav");
	sfxZombie = loadSound("sounds/Groan.wav");
	sfxPlant = loadSound("sounds/Plant.wav");
	sfxBg = loadSound("sounds/Soundtrack_Main Menu.mp3");

	cargarSol()
	cargarPlanta()

	for(let x=0; x<noCartas; x++)
	{
		cargarCarta(x)
	}

	for(let x=0; x<noZombies; x++)
	{
		cargarZombie()
	}

	for(let x=0; x<19; x++)
	{
		animacionZombieComun[x]=loadImage(`img/Zombies/Zombie Simple/${x}.png`);
	}

	for(let x=0; x<34; x++)
	{
		animacionZombieJackson[x]=loadImage(`img/Zombies/ZombieJackson/${x}.png`);
	}

	for(let x=0; x<31; x++)
	{
		animacionZombieCubeta[x]=loadImage(`img/Zombies/Zombie Cubeta/${x}.png`);
	}

	for(let x=0; x<38; x++)
	{
		animacionZombieGrandote[x]=loadImage(`img/Zombies/Zombie Grandote/${x}.png`);
	}

	for(let x=0; x<5; x++)
	{
		cargarPodadoras(x)
	}
}

function definirNivel()
{
	nivel=document.getElementById("nivelJugar").value;

	switch(nivel)
	{
		case 1:
			cantidadZombiesMatar=5
			noZombies=4
		break

		case 2:
			cantidadZombiesMatar=17
			noZombies=4
		break

		case 3:
			cantidadZombiesMatar=23
			noZombies=4
		break
	}
}

function pintarTablero(tinte)
{
	if(tinte)
		tint(0, 153, 204, 126)
	else
		noTint()

	image(fondoImg, 0, 0, windowWidth, windowHeight)
	
	image(marcadoresImg, 200, 0, 472, 93)
	fill("BLACK")
	textSize(18)
	text(soles, 225, 83)
}

function pintarCartas()
{
	for(let x=0; x<cartasImg.length; x++)
	{
		image(cartasImg[x].img, cartasImg[x].posX, cartasImg[x].posY, cartasImg[x].tamX, cartasImg[x].tamY)
	}
}

function pintarPodadoras()
{
	for(let x=0; x<podadoras.length; x++)
	{
		for(let y=0; y<zombies.length; y++)
		{
			if(!podadoras[x].utilizado)
				image(podadoras[x].img, podadoras[x].posX, podadoras[x].posY, podadoras[x].tamX, podadoras[x].tamY)		

			if(zombies[y].posX<=200 && zombies[y].zombieActivado && !podadoras[x].utilizado)
			{
				let p=0

				while(p<podadoras.length && podadoras[p].posLineaPodadora!=zombies[y].posLineaZombie)
				{
					p++
				}

				podadoras[p].activar=true
			}

			if(podadoras[x].posLineaPodadora==zombies[y].posLineaZombie && podadoras[x].activar && !podadoras[x].utilizado)
			{
				if(podadoras[x].posX>=zombies[y].posX && zombies[y].zombieActivado)
				{
					let zombiesActivosActuales=0

					for(let j=0; j<zombies.length; j++)
					{
						if(zombies[j].zombieActivado)
							zombiesActivosActuales++
					}

					if(zombiesMatados+zombiesActivosActuales<cantidadZombiesMatar+1)
						zombies[y]=inicializarZombie()
					else
						zombies[y].zombieActivado=false	


								
				}
			}
			if(podadoras[x].activar && podadoras[x].posX<=1000 && !podadoras[x].utilizado)
				podadoras[x].posX+=podadoras[x].velocidad
			
			if(podadoras[x].posX>1000)
				podadoras[x].utilizado=true
		}
	}
}

function pintarPlantas()
{
	for(let x=0; x<plantas.length; x++)
	{
		if(plantas[x].plantaActivada)
		{
			image(plantas[x].img, plantas[x].posX, plantas[x].posY, plantas[x].tamX, plantas[x].tamY)

			//Este tipo de plantas son los girasoles
			if(plantas[x].tipoPlanta==0)
			{
				plantas[x].tiempoRecargaSol--
				
				if(plantas[x].tiempoRecargaSol<=0)
				{
					plantas[x].mostrarSol=true
					image(plantas[x].imgBala, plantas[x].posXBala, plantas[x].posYBala, plantas[x].tamXbala, plantas[x].tamYbala)
				}

				if(plantas[x].mostrarSol)
				{
					plantas[x].tiempoMostrarSol--
					
					if(plantas[x].tiempoMostrarSol<=0)
					{
						plantas[x].mostrarSol=false
						plantas[x].tiempoRecargaSol=plantas[x].tiempoRecargaSolAux
						plantas[x].tiempoMostrarSol=plantas[x].tiempoMostrarSolAux
					}
				}
			}
		}
	}
}

function pintarZombies()
{
	for(let x=0; x<zombies.length; x++)
	{
		if (zombies[x].psfx != true){
				sfxZombie.play();
				zombies[x].psfx = true;
		}
		if(zombies[x].zombieActivado)
		{
			if(zombies[x].posSprites<zombies[x].sprites)
				zombies[x].posSprites++
			else
				zombies[x].posSprites=0

			switch(zombies[x].tipoZombie)
			{
				case 0:
					image(animacionZombieComun[zombies[x].posSprites], zombies[x].posX, zombies[x].posY, zombies[x].tamX, zombies[x].tamY)
				break

				case 1:
					image(animacionZombieJackson[zombies[x].posSprites], zombies[x].posX, zombies[x].posY, zombies[x].tamX, zombies[x].tamY)
				break

				case 2:
					image(animacionZombieCubeta[zombies[x].posSprites], zombies[x].posX, zombies[x].posY, zombies[x].tamX, zombies[x].tamY)
				break

				case 3:
					image(animacionZombieGrandote[zombies[x].posSprites], zombies[x].posX, zombies[x].posY, zombies[x].tamX, zombies[x].tamY)
				break
			}
			

		}

		if(zombies[x].posX<=190 && zombies[x].zombieActivado)
		{
			for(let y=0; y<podadoras.length; y++)
			{
				if(podadoras[y].posLineaPodadora==zombies[x].posLineaZombie && podadoras[y].utilizado)
					alert("¡Te han comido los sesos!")
			}
		}

		zombies[x].posX-=zombies[x].velocidadMovimiento
	}
}

function pintarSolAleatorio()
{
	image(solImg.img, solImg.posX, solImg.posY, solImg.tamX, solImg.tamY)

	if(solImg.posY<solImg.limite)
		solImg.posY+=solImg.velocidad
}

function arrastrarCarta()
{
	if(cartaArrastrarImg.activada)
	{
		image(cartaArrastrarImg.img, cartaArrastrarImg.posX, cartaArrastrarImg.posY, cartaArrastrarImg.tamX, cartaArrastrarImg.tamY)
		cartaArrastrarImg.posX=mouseX-cartaArrastrarImg.tamX/2
		cartaArrastrarImg.posY=mouseY-cartaArrastrarImg.tamY/2
	}
}

function activarZombieParaDisparar()
{
	for(let y=0; y<zombies.length; y++)
	{
		//Reestablecer daños no vistos
		if(zombies[y].posX<=1200 && zombies[y].zombieActivado)
		{
			if(!zombies[y].listoParaDisparar)
				zombies[y].vida=zombies[y].auxVida

			//Activar todas las plantas de la linea
			for(let z=0; z<plantas.length; z++)
			{
				if(plantas[z].posLineaPlanta==zombies[y].posLineaZombie && plantas[z].tipoPlanta!=0 && plantas[z].plantaActivada)
				{
					if(!plantas[z].listoParaDisparar)
						plantas[z].posXBala=plantas[z].posXBalaAux

					plantas[z].listoParaDisparar=true

					
				}
			}
			zombies[y].listoParaDisparar=true
		}
	}
}

function disparoDePlantas()
{
	for(let x=0; x<plantas.length; x++)
	{
		for(let y=0; y<zombies.length; y++)
		{
			//Disparar bala
			if(plantas[x].tipoPlanta!=0 && plantas[x].posLineaPlanta==zombies[y].posLineaZombie && plantas[x].tiempoRecarga==plantas[x].tiempoRecargaAux && zombies[y].posX>=plantas[x].posX && plantas[x].listoParaDisparar && zombies[y].listoParaDisparar && plantas[x].plantaActivada && zombies[y].zombieActivado){
				image(plantas[x].imgBala, plantas[x].posXBala, plantas[x].posYBala, plantas[x].tamXbala, plantas[x].tamYbala)
				
			}

			if(plantas[x].listoParaDisparar && plantas[x].tiempoRecarga==plantas[x].tiempoRecargaAux){
				
				plantas[x].posXBala+=plantas[x].velocidadBala
			}

			//Validar disparo a zombie
			if(plantas[x].tipoPlanta!=0 && plantas[x].posLineaPlanta==zombies[y].posLineaZombie && plantas[x].tiempoRecarga==plantas[x].tiempoRecargaAux && zombies[y].posX>=plantas[x].posX && plantas[x].posXBala-25>=zombies[y].posX && zombies[y].listoParaDisparar && plantas[x].listoParaDisparar && plantas[x].plantaActivada && zombies[y].zombieActivado)
			{
				sfxPego.play();
				plantas[x].posXBala=plantas[x].posXBalaAux
				plantas[x].tiempoRecarga=0
				plantas[x].tiempoRecargaAux+=8
				zombies[y].vida-=plantas[x].danio

				if (zombies[y].vida <= 0) {
					zombiesMatados++;
					console.log(" muerte "+ zombiesMatados + " debe matar " + cantidadZombiesMatar )

					if(zombiesMatados>=cantidadZombiesMatar)
						alert("Nivel completado")
				}
				


				if(zombies[y].vida<=0 && zombies[y].listoParaDisparar) 
				{					
					plantas[x].listoParaDisparar=false
					plantas[x].posXBala=plantas[x].posXBalaAux
					plantas[x].tiempoRecargaAux=plantas[x].tiempoRecargaOriginal

					let zombiesActivos=0

					for(let j=0; j<zombies.length; j++)
					{
						if(zombies[j].zombieActivado)
							zombiesActivos++
					}

					if(zombiesMatados+zombiesActivos<cantidadZombiesMatar+1)
						zombies[y]=inicializarZombie()
					else{
						zombies[y].zombieActivado=false
					}

					

				}
			}

			if(plantas[x].tiempoRecarga<plantas[x].tiempoRecargaAux)
				plantas[x].tiempoRecarga++

			

		}
	}
}

function comerPlantas()
{
	for(let x=0; x<plantas.length; x++)
	{
		for(let y=0; y<zombies.length; y++)
		{
			//Comer plantas
			if(zombies[y].posLineaZombie==plantas[x].posLineaPlanta && zombies[y].posX-50<=plantas[x].posX && zombies[y].posX+50>=plantas[x].posX && plantas[x].plantaActivada && zombies[y].zombieActivado)
			{
				zombies[y].velocidadMovimiento=0
				plantas[x].vida-=zombies[y].danio

				if(plantas[x].vida<=0 && plantas[x].plantaActivada)
				{					
					//Volver a permitir que caminen todos los zombies
					for(let z=0; z<zombies.length; z++)
					{
						if(zombies[z].posLineaZombie==plantas[x].posLineaPlanta)
							zombies[z].velocidadMovimiento=zombies[z].velocidadMovimientoAux
					}
					plantas[x].plantaActivada=false
				}
			}
		}
	}
}



function cargarPlanta()
{
	let cartaArrastrar={
		img: "",
		posX: mouseX-70/2,
		posY: mouseY-70/2,
		tamX: 70,
		tamY: 70,
		activada: false,
	}

	cartaArrastrarImg=cartaArrastrar
}

function cargarSol()
{
	solImg={
		img: loadImage("img/Otras/sol.png"),
		posX: Math.floor(random(200,1000)),
		posY: Math.floor(random(-150,-350)),
		tamX: 50,
		tamY: 50,
		velocidad: 0.6,
		limite: Math.floor(random(50,580)),
	}
}

function cargarPodadoras(x)
{
	let posX=165
	let posY
	let posLineaPodadora

	switch(x)
	{
		case 0:
			posY=100
			posLineaPodadora=1
		break

		case 1:
			posY=200
			posLineaPodadora=2
		break

		case 2:
			posY=310
			posLineaPodadora=3
		break

		case 3:
			posY=415
			posLineaPodadora=4
		break	

		case 4:
			posY=520
			posLineaPodadora=5
		break
	}
	let podadora={
		img: loadImage("img/Plantas/podadora.png"),
		posX: posX,
		posY: posY,
		posLineaPodadora: posLineaPodadora,
		tamX: 90,
		tamY: 70,
		velocidad: 0.8,
		limite: 1000,
		utilizado: false,
		activar: false,
	}
	podadoras.push(podadora)
}

function cargarCarta(x)
{
	let posX=285+x*75
	let posY=8
	let tamX=70
	let tamY=70

	switch(x)
	{
		case 0:
			costo=50
		break

		case 1:
			costo=100
		break

		case 2:
			costo=125
		break

		case 3:
			costo=175
		break

		case 4:
			costo=300
		break

		case 5:
			costo=1000
			posX+=25
		break;
	}

	let carta={
		img: loadImage(`img/Cartas/${x}.png`),
		posX: posX,
		posY: posY,
		tamX: tamX,
		tamY: tamY,
		nombre: x,
		costo: costo,
	}
	cartasImg.push(carta)
}

function mouseClicked()
{
	//Valida que solo se realize una accion a la vez
	let accion=false

	if(accion==false)
	{
		if(mouseX>=900 && mouseX<=965 && mouseY>=10 && mouseY<=35)
		{
			accion=true

			if(play)
				play=false
			else
				play=true
		}
	}

	//Click a un sol
	if(accion==false) 
	{
		if(mouseX+50>solImg.posX && mouseX<solImg.posX+50 && mouseY+50>solImg.posY && mouseY<solImg.posY+50)
		{
			accion=true
			cargarSol()
			soles+=25
		}
	}

	//Click a un sol de un girasol
	if(accion==false)
	{
		let salir=false

		for(let x=0; x<plantas.length; x++)
		{
			if(plantas[x].tipoPlanta==0 && plantas[x].mostrarSol && !salir)
			{
				if(mouseX+50>plantas[x].posXBala && mouseX<plantas[x].posXBala+50 && mouseY+50>plantas[x].posYBala && mouseY<plantas[x].posYBala+50)
				{
					accion=true
					salir=true
					plantas[x].mostrarSol=false
					plantas[x].tiempoRecargaSol=plantas[x].tiempoRecargaSolAux
					soles+=25
				}
			}
		}
	}

	//Click a una carta
	if(accion==false)
	{
		let encontrePlanta=false 
		let x=0
		presione++

		while(x<cartasImg.length && encontrePlanta==false)
		{
			if(mouseX+70>cartasImg[x].posX && mouseX<cartasImg[x].posX+70 && mouseY+70>cartasImg[x].posY && mouseY<cartasImg[x].posY+70)
			{
				accion=true
				encontrePlanta=true
				plantaSeleccionada=true
				presione=1

				cartaSeleccionada={
					nombre: cartasImg[x].nombre,
					costo: cartasImg[x].costo,
				}

				if(soles>=cartasImg[x].costo)
				{
					cartaArrastrarImg.activada=true
					cartaArrastrarImg.img=loadImage("img/Cartas/"+cartasImg[x].nombre+".png");
					cartaArrastrarImg.posX=mouseX-cartaArrastrarImg.tamX/2
					cartaArrastrarImg.posY=mouseY-cartaArrastrarImg.tamY/2
				}
				
			}
			x++
		}

		if(plantaSeleccionada && presione>=2)
		{
			if(soles>=cartaSeleccionada.costo)
				inicializarPlanta(mouseX, mouseY, cartaSeleccionada.nombre, cartaSeleccionada.costo)

			plantaSeleccionada=false
			presione=0
			cartaArrastrarImg.activada=false
		}
	}
}

function cargarZombie()
{
	zombies.push(inicializarZombie())

}

function inicializarZombie()
{
	let posXzombie=Math.floor(random(1350,1600))
	//let posXzombie=Math.floor(random(500,1000))
	let posYzombie
	let lineaUbicadoZombie
	let vida
	let urlImg="img/Zombies/"
	let anchoZombie
	let altoZombie
	let congelado=false
	let tipoZombie
	let danio=1
	let sprites=18
	let posSprites=0

	switch(Math.floor(random(1,6)))
	{
		case 1:
			posYzombie=55
			lineaUbicadoZombie=1
		break

		case 2:
			posYzombie=165
			lineaUbicadoZombie=2
		break

		case 3:
			posYzombie=270
			lineaUbicadoZombie=3
		break

		case 4:
			posYzombie=370
			lineaUbicadoZombie=4
		break

		case 5:
			posYzombie=480
			lineaUbicadoZombie=5
		break
	}

	switch(Math.floor(random(1, 5)))
	{
		case 1:
			vida=6
			tipoZombie=0
			urlImg+="0.png"
			anchoZombie=84
			altoZombie=58
			posYzombie+=13
		break

		case 2:
			vida=10
			tipoZombie=1
			urlImg+="1.png"
			anchoZombie=96
			altoZombie=138
			posSprites=0
			sprites=33
		break

		case 3:
			vida=13
			tipoZombie=2
			urlImg+="2.png"
			anchoZombie=90
			altoZombie=115
			sprites=30
		break

		case 4:
			vida=25
			tipoZombie=3
			urlImg+="3.png"
			posXzombie-=100
			posYzombie-=80
			anchoZombie=190
			altoZombie=190
			danio=500
			sprites=37
		break
	}

	let zombie={
		img: loadImage(urlImg),
		imgAux: loadImage(urlImg),
		vida: vida,
		auxVida: vida,
		posLineaZombie: lineaUbicadoZombie,
		posX: posXzombie,
		posY: posYzombie,
		tamX: anchoZombie,
		tamY: altoZombie,
		velocidadMovimiento: 0.25,
		velocidadMovimientoAux: 0.25,
		listoParaDisparar: false,
		tipoZombie: tipoZombie,
		congelado: congelado,
		danio: danio,
		sprites: sprites,
		posSprites: posSprites,
		zombieActivado: true,
		psfx:false,
	}

	return zombie
}

function inicializarPlanta(posX, posY, cartaNombre, cartaCosto)
{
	let rutaImg="img/Plantas/"
	let rutaImgBala="img/Plantas/"
	let posPlantaX=191
	let posPlantaY
	let ubicacionPlantaMapa
	let tamX
	let tamY
	let costo
	let lineaUbicadaPlanta
	let vida
	let velocidadBala=0
	let tipoPlanta
	let plantaHielo=false
	let danio

	let posXBala
	let posYBala
	let tamXbala=25
	let tamYbala=25
	let tiempoRecarga=200

	if(posY<=196)
	{
		lineaUbicadaPlanta=1
		posPlantaY=96
	}
	else
	{
		if(posY<=298)
		{
			lineaUbicadaPlanta=2
			posPlantaY=198		
		}
		else
		{
			if(posY<=410)
			{
				lineaUbicadaPlanta=3
				posPlantaY=310
			}
			else
			{
				if(posY<=513)
				{
					lineaUbicadaPlanta=4
					posPlantaY=413
				}
				else
				{
					lineaUbicadaPlanta=5
					posPlantaY=520
				}
			}
		}
	}
	if(posX<=326)
	{
		ubicacionPlantaMapa=1
		posPlantaX=250
	}
	else
		if(posX<=397)
		{
			ubicacionPlantaMapa=2
			posPlantaX=330
		}
		else
			if(posX<=486)
			{
				ubicacionPlantaMapa=3
				posPlantaX=410
			}
			else
				if(posX<=561)
				{
					ubicacionPlantaMapa=4
					posPlantaX=490
				}
				else
					if(posX<=644)
					{
						ubicacionPlantaMapa=5
						posPlantaX=570
					}
					else
						if(posX<=719)
						{
							ubicacionPlantaMapa=6
							posPlantaX=650
						}
						else
							if(posX<=798)
							{
								ubicacionPlantaMapa=7
								posPlantaX=730
							}
							else
								if(posX<=872)
								{
									ubicacionPlantaMapa=8
									posPlantaX=810
								}
								else
								{
									ubicacionPlantaMapa=9
									posPlantaX=890
								}
	let cuadroOcupado=false

	for(let x=0; x<plantas.length; x++)
	{
		if(ubicacionPlantaMapa==plantas[x].ubicacionPlantaMapa && lineaUbicadaPlanta==plantas[x].posLineaPlanta && plantas[x].plantaActivada)
			cuadroOcupado=true
	}

	if(!cuadroOcupado)
	{
		soles-=cartaCosto

		switch(cartaNombre)
		{
			case 0:
				rutaImg+="girasol.png"
				rutaImgBala="img/Otras/sol.png"
				costo=50
				tamX=74
				tamY=73
				vida=180
				tipoPlanta=0
				tamXbala=50
				tamYbala=50
				tiempoRecarga=300
			break

			case 1:
				rutaImg+="lanzaguisantes.png"
				rutaImgBala+="ataqueGuisante.png"
				costo=100
				tamX=70
				tamY=70
				vida=180
				velocidadBala=1.1
				tipoPlanta=1
				danio=1
			break

			case 2:
				rutaImg+="nuez.png"
				costo=125
				tamX=120
				tamY=120
				posPlantaX-=20
				posPlantaY-=20
				vida=1500
				tipoPlanta=2
			break

			case 3:
				rutaImg+="lanzaguisantesHielo.png"
				rutaImgBala+="ataqueGuisanteHielo.png"
				costo=175
				tamX=70
				tamY=70
				vida=180
				velocidadBala=1.2
				tipoPlanta=3
				plantaHielo=true
				danio=2
			break

			case 4:
				rutaImg+="sandia.png"
				rutaImgBala+="ataqueSandia.png"
				costo=300
				tamX=125
				tamY=105
				posPlantaX-=28
				posPlantaY-=20
				vida=150
				velocidadBala=1.1
				tipoPlanta=4
				danio=3
			break

		}

		if(tipoPlanta==0)
			posXBala=posPlantaX+30
		else		
			posXBala=posPlantaX+60

		if(tipoPlanta==5)
			posYBala=posPlantaY+25
		else
			posYBala=posPlantaY

		let planta={
			img: loadImage(rutaImg),
			posX: posPlantaX,
			posY: posPlantaY,
			ubicacionPlantaMapa: ubicacionPlantaMapa,
			tamX: tamX,
			tamY: tamY,
			posLineaPlanta: lineaUbicadaPlanta,
			costo: costo,
			vida: vida,
			tipoPlanta: tipoPlanta,
			plantaHielo: plantaHielo,
			imgBala: loadImage(rutaImgBala),
			posXBala: posXBala,
			posXBalaAux: posXBala,
			posYBala: posYBala,
			tamXbala: tamXbala,
			tamYbala: tamYbala,
			velocidadBala: velocidadBala,
			danio: danio,
			listoParaDisparar: false,
			plantaActivada: true,
			tiempoRecarga: tiempoRecarga,
			tiempoRecargaAux: tiempoRecarga,
			tiempoRecargaOriginal: tiempoRecarga,
			tiempoRecargaSol: tiempoRecarga,
			tiempoRecargaSolAux: tiempoRecarga,
			tiempoMostrarSol: 600,
			tiempoMostrarSolAux: 600,
			mostrarSol: false,
			psfx: false,
		}

		plantas.push(planta)
		sfxPlant.play();

	}
}