/**
 * Created by cry on 2016/12/15.
 */
/*index页面*/
//Haga clic para mostrar el elemento especificado
var clickVisible = function (clickId, visibleId) {
    var clickDom = document.getElementById(clickId);
    var visibleDom = document.getElementById(visibleId);
    clickDom.onclick = function (evt) {
        evt.preventDefault();
        visibleDom.style.visibility = "visible";
    };
};

//Haga clic para ocultar el elemento especificado
var clickHidden = function (clickId, hiddenId1, hiddenId2) {
    var clickDom = document.getElementById(clickId);
    var hiddenDom1 = document.getElementById(hiddenId1);
    if (hiddenId2) {
        var hiddenDom2 = document.getElementById(hiddenId2);
    }
    clickDom.onclick = function (evt) {
        evt.preventDefault();
        hiddenDom1.style.visibility = "hidden";
        if (!hiddenId2) return false;
        hiddenDom2.style.visibility = "hidden";
    };
};

/*Cambio de interfaz*/
var ChangePage = function () {
    /*Ingrese la interfaz de navegación*/
    clickVisible('start', 'interface');
    /*Interfaz de nivel*/
    clickVisible('game', 'menu-page');
    clickHidden('back', 'menu-page');
    /*La interfaz de índice del libro*/
    clickVisible('almanac', 'almanac-page');
    clickHidden('almanac-close', 'almanac-page');
    /*Ilustración de la planta*/
    clickVisible('almanac-plant', 'almanac-plant-page');
    clickVisible('almanac-peashooter-img', 'almanac-peashooter-des');
    clickHidden('almanac-plant-close', 'almanac-plant-page', 'almanac-peashooter-des');
    /*Ilustración Zombie*/
    clickVisible('almanac-zombie', 'almanac-zombie-page');
    clickVisible('almanac-zombie-img', 'almanac-zombie-des');
    clickHidden('almanac-zombie-close', 'almanac-zombie-page', 'almanac-zombie-des');
    /*Interfaz de ayuda*/
    clickVisible('help', 'help-page');
    clickHidden('help-page', 'help-page');
    /*Aún no está abierta la interfaz*/
    clickVisible('survival', 'void-page');
    clickVisible('challenges', 'void-page');
    clickVisible('option', 'void-page');
    clickHidden('void-page', 'void-page');
    /*Salir*/
    clickHidden('quit', 'interface');
};


var ReturnHome = function () {
    //var href = window.location.href;
    var test = "index.html#interface";
    if (href.indexOf(test) != -1) {
        var inter = document.getElementById("interface");
        inter.style.visibility = "visible";
    }
};



var game = function (jsNum) {
    if (jsNum && jsNum < 1 || jsNum == 0) {
        document.write("僵尸数不能少于1");
        throw "僵尸数不能少于1";
    }
    var jsAll = Math.round(jsNum) || parseInt(window.location.href.split("#")[1]) || 8;
    var bg = document.getElementById("bg");
    var card = document.getElementById("card");
    var wrap = document.getElementById("wrap");
    var board = document.getElementById("board");
    var cardList = document.getElementById("cardList");
    var sunScore = document.getElementById("sunScore");
    var num = parseInt(sunScore.innerHTML);//Obtener un número entero
    var story = document.getElementById("story");
    var prepare = document.getElementById("prepare");
    var pointUp = document.getElementById("pointUp");
    var state = [];
    //Graba zombies en el campo
    var jsGroup = [];
    //Zombies registrados han aparecido
    var jsTotal = [];
    //Habrá un número total de zombis
    console.log("Número de zombies:" + jsAll);

    //Efecto de apertura
    var OpenEffect = function () {
        //Efecto de apertura
        //El fondo se muestra y se panoramiza hacia la derecha
        bg.style.backgroundImage = "url('img/sod/background1unsodded.jpg')";
        bg.style.visibility = "visible";
        var xpos = 0;
        var bgRun = setInterval(function () {
            xpos -= 20;
            bg.style.backgroundPosition = xpos + "px 0";
            if (xpos <= -500) {//900-1400
                clearInterval(bgRun);
                //Zombie show 5 zombies
                var zombies = document.getElementById("zombies");
                zombies.style.left = "565px";
                for (i = 0; i < 5; i++) {
                    //Crea un zombie
                    var zombie = document.createElement("div");
                    zombie.style.position = "absolute";
                    //Zombies aparecen aleatoriamente en el área visible
                    zombie.style.left = Math.random() * (zombies.offsetWidth - 166) + "px";
                    zombie.style.top = Math.random() * (zombies.offsetHeight - 144) + "px";
                    zombie.style.zIndex = "1";
                    zombie.innerHTML = '<img src="img/plantshadow32.png" alt="plantshadow32" class="shadow"><img src="img/1.gif" alt="1" class="zombie">';
                    zombies.appendChild(zombie);
                }

                //Después de 2 segundos
                setTimeout(function () {
                    //Zombie Hide
                    zombies.style.left = "1065px";
                    //Fondo atrás-115px
                    bg.style.backgroundPosition = "-115px 0";

                    //Baldosa de césped
                    //Césped rodante
                    var wrap = document.getElementById("wrap");
                    var sod = document.createElement("div");
                    sod.setAttribute('id', 'sod');
                    wrap.appendChild(sod);

                    //Desplazarse
                    var sodRoll = document.createElement("img");
                    sodRoll.src = "img/sod/SodRoll.png";
                    sodRoll.className = "sodRoll";
                    wrap.appendChild(sodRoll);

                    //Cubierta del carrete
                    var sodCap = document.createElement("img");
                    sodCap.src = "img/sod/SodRollCap.png";
                    sodCap.className = "sodCap";
                    wrap.appendChild(sodCap);

                    //Desplazamiento del césped
                    var l = 20;
                    var w = -1;
                    var buildSodRoll = setInterval(function () {
                        //Lawn right shop
                        sod.style.width = sod.offsetWidth + l + "px";
                        sodRoll.style.left = sodRoll.offsetLeft + l - w + "px";
                        sodCap.style.left = sodCap.offsetLeft + l - w + "px";

                        sodRoll.style.width = sodRoll.offsetWidth + w + "px";
                        sodCap.style.width = sodCap.offsetWidth + w + "px";
                        sodCap.style.height = sodCap.offsetHeight + w + "px";
                        sodCap.style.top = sodCap.offsetTop - w + "px";

                        //Deténgase cuando el césped esté lleno
                        if (sod.offsetWidth >= 755) {
                            clearInterval(buildSodRoll);
                            wrap.removeChild(sodRoll);
                            wrap.removeChild(sodCap);
                        }
                    }, 30);
                }, 2000);
            }
        }, 30);
    };

    //Haga clic para comprar un método para cultivar plantas
    var BuyPlant = function () {
        /*Detección de puntuación*/
        if (num < 100) {
            throw "分数不够100";
        }
        if (pointUp) {
            pointUp.style.visibility = "hidden";
        }
       
        var peashooter = document.createElement("img");
        peashooter.src = "img/Peashooter.gif";
        peashooter.className = "peashooter";
        wrap.appendChild(peashooter);

        
        var peashooter_opa = document.createElement("img");
        peashooter_opa.src = "img/Peashooter.gif";
        peashooter_opa.className = "peashooter_opa";
        wrap.appendChild(peashooter_opa);

       
        var imgs = card.getElementsByTagName("img");
        imgs[1].style.visibility = "hidden";

        //植物跟着鼠标进行一个拖动
        document.onmousemove = function (event) {//如果把事件绑定在peashooter上，鼠标移动过快会导致脱离范围，所以此处给文档绑定事件
            var evt = event || window.event;
            peashooter.style.left = evt.clientX - peashooter.offsetWidth / 2 + "px";
            peashooter.style.top = evt.clientY - peashooter.offsetHeight /2 + "px";

            
            if (evt.clientY < sod.offsetTop || evt.clientY > sod.offsetTop + sod.offsetHeight) {
               
                peashooter_opa.style.display = "none";
                
                peashooter.onclick = function () {
                    wrap.removeChild(peashooter);
                    wrap.removeChild(peashooter_opa);
                    imgs[1].style.visibility = "visible";
                };
            
                peashooter.oncontextmenu = function (evt) {
                   
                    evt.preventDefault();
                    wrap.removeChild(peashooter);
                    wrap.removeChild(peashooter_opa);
                    imgs[1].style.visibility = "visible";
                }
            }else {
                
                peashooter.onclick = null;
                peashooter_opa.style.display = "block";
                peashooter_opa.style.top = sod.offsetTop + sod.offsetHeight / 2 - peashooter_opa.offsetHeight / 2 -20 + "px";

               
                var sod_one_width = sod.offsetWidth / 9;
                var index;
                if (evt.clientX < sod.offsetLeft + sod_one_width) {
                  
                    peashooter.style.cursor = "pointer";
                    peashooter_opa.style.left = sod.offsetLeft + sod_one_width / 2 - peashooter_opa.offsetWidth / 2 + "px";
                    index = 0;
                } else if (evt.clientX > sod.offsetLeft + 8 * sod_one_width) {
                  
                    peashooter.style.cursor = "pointer";
                    peashooter_opa.style.left = sod.offsetLeft + 8 * sod_one_width + sod_one_width / 2 - peashooter_opa.offsetWidth / 2 + "px";
                    index = 8;
                } else {
                   
                    for (var i = 1; i < 8; i++) {
                        if (evt.clientX > sod.offsetLeft + i * sod_one_width && evt.clientX < sod.offsetLeft + (i + 1) * sod_one_width){
                            peashooter.style.cursor = "pointer";
                            peashooter_opa.style.left = sod.offsetLeft + i * sod_one_width + sod_one_width / 2 - peashooter_opa.offsetWidth / 2 + "px";
                            index = i;
                        }
                    }
                }
               
                peashooter.onclick = function () {
                 
                    if (state[index]) {
                        throw "相同位置只能种植一个植物";
                    }
            
                    var zw = new Plant(5, 2500);
                    num -= 100;
                    sunScore.innerHTML = num;
                    state[index] = true;
                    peashooter.style.left = peashooter_opa.offsetLeft + "px";
                    peashooter.style.top = peashooter_opa.offsetTop + "px";
                    document.onmousemove = null;
                    peashooter.onclick = null;
                    peashooter.oncontextmenu = null;
                  
                    if (num >= 100) {
                        imgs[1].style.visibility = "visible";
                    }
                    wrap.removeChild(peashooter_opa);
                    zw.doPlant(peashooter.offsetLeft, peashooter.offsetTop);
                    wrap.removeChild(peashooter);
                    peashooter.style.cursor = "default";
                    zw.shoot(jsGroup);
                };
            }
        }
    };

    //收集阳光的方法
    var BuildSun = function () {
        //创建阳光，随机在游戏界面的顶部掉落
        var sun = document.createElement("img");
        sun.src = "img/Sun.gif";
        sun.className = "sun";
        wrap.appendChild(sun);
        //sun出现在顶部随机位置
        sun.style.left = Math.random() * (wrap.offsetWidth - 78) + "px";
        sun.style.top = "-78px";
        //定义sun下落的动画以及终点位置随机
        var sunTop = Math.random() * (wrap.offsetHeight - 78);
        var t = 1;
        var autoPick = true;
        var sunDown = setInterval(function () {
            sun.style.top = sun.offsetTop + t + "px";
            if (sun.offsetTop >= sunTop) {
                clearInterval(sunDown);
                sunDown = null;
                //3秒后自动获取
                setTimeout(function () {
                    if (autoPick == true) {
                        sun.onclick();
                    }else {
                        wrap.removeChild(sun);
                    }
                }, 3000);
            }
        }, 30);
        //点击阳光
        sun.onclick = function () {
            //停止掉落
            if (sunDown != null) {
                clearInterval(sunDown);
            }
            //阳光飞向计分牌
            var a = sun.offsetTop - 17 + sun.offsetHeight / 2;//垂直方向移动距离
            var b = sun.offsetLeft - 110 + sun.offsetWidth / 2;//水平方向移动距离
            var c = Math.sqrt(a * a + b * b);//直线距离
            var speedX = b / c;
            var speedY = a / c;
            var speed = 20;
            var sunRun = setInterval(function () {
                sun.style.left = sun.offsetLeft - speed * speedX + "px";
                sun.style.top = sun.offsetTop - speed * speedY + "px";
                if (sun.offsetLeft <= 100 && sun.offsetTop <= 7) {
                    clearInterval(sunRun);
                    sunRun = null;
                    sun.style.left = "80px";
                    sun.style.top = "-20px";
                    //阳光在0.5秒就消失，计分牌分数累计
                    setTimeout(function () {
                        var sunScore = document.getElementById("sunScore");
                        num += 25;
                        sunScore.innerHTML = num;
                        var imgs = card.getElementsByTagName("img");
                        //分数大于等于100植物射手可购买
                        if (num >= 100 && imgs[1].style.visibility == "hidden") {
                            imgs[1].style.visibility = "visible";
                        }
                        if (sun.parentNode != wrap) return;
                        wrap.removeChild(sun);
                    }, 500);
                }
            }, 30);
        }
    };

    //创建一个植物对象
    function Plant(blood, buildShootSpeed) {
        var plants = document.getElementById("plants");
        var dzombies = document.getElementById("dzombies");
        this.plant = this.init();//初始化
        this.blood = (blood || 4);//血量
        this.buildShootSpeed = (buildShootSpeed || 2000);//子弹发射速度
    }
    //植物初始化的方法
    Plant.prototype.init = function () {
        var plant = document.createElement("div");
        plant.innerHTML = '<img src="img/plantshadow32.png" style="left:-12px;top:49px;"><img src="img/Peashooter.gif">';
        return plant;
    };
    //种植物方法
    Plant.prototype.doPlant = function (left, top) {
        this.plant.style.left = (left || 500) + "px";//如果left不存在，取500
        this.plant.style.top = (top || 294) + "px";//如果top不存在，取294
        plants.appendChild(this.plant);
    };
    //创建子弹方法
    Plant.prototype.bullet = function () {
        var bullet = document.createElement("img");
        bullet.src = "img/PB00.gif";
        bullet.className = "bullet";
        bullet.style.left = this.plant.offsetLeft + 30 + "px";
        bullet.style.top = this.plant.offsetTop -3 +"px";
        dzombies.appendChild(bullet);
        return bullet;
    };
    //植物射击的方法
    var new_jsGroup;
    var stopJs = [];
    var dieJS = [];
    Plant.prototype.shoot = function (jsGroup) {
        var o = this;
        //创建子弹打击僵尸的方法
        var new_shoot = function () {
            if (jsGroup.length < 1) return;
            //判定植物右侧是否存在僵尸
            var jsOffset = [];
            for (var n in jsGroup) {
                if (!jsGroup[n].zombie) continue;
                if (!o.plant) continue;
                jsOffset.push(jsGroup[n].zombie.offsetLeft);
            }
            //植物右侧没有僵尸不射击,通过获取jsOffset中最大值计算
            if ((Math.max.apply(null, jsOffset) + 35) < o.plant.offsetLeft - 75) return;
            var bullet = o.bullet();
            //console.log('shoot');
            //每30秒子弹移动11px
            bullet.runId = setInterval(function () {
                bullet.style.left = bullet.offsetLeft + 11 + "px";
                //遍历僵尸
                for (var i in jsGroup) {
                    var js = jsGroup[i];
                    if (!js.zombie) continue;
                    if (!o.plant) continue;
                    //僵尸位置在植物左侧时不射击
                    if ((js.zombie.offsetLeft + 35) < o.plant.offsetLeft - 75) continue;
                    //子弹射击到僵尸的时候
                    if (bullet.offsetLeft > js.zombie.offsetLeft + 55) {
                        clearInterval(bullet.runId);
                        bullet.runId = null;
                        bullet.src = "img/PeaBulletHit.gif";
                        setTimeout(function () {
                            if (bullet.parentNode != dzombies) return;
                            dzombies.removeChild(bullet);
                        }, 300);
                        if (js.blood >= 0) js.blood--;
                    }
                    //僵尸在植物右侧
                    if ((js.zombie.offsetLeft + 35) > (o.plant.offsetLeft + o.plant.offsetWidth) && js.blood >= 0 && o.blood >= 0) {
                        if (js.blood == 2) {
                            js.lostHead();
                            js.stopWalk();
                            js.noHeadWalk();
                        }else if (js.blood == 1) {
                            js.down();
                        }else if (js.blood == 0) {
                            js.die(dieJS);
                            o.stopShoot();
                            //去掉死亡僵尸
                            jsGroup.remove(js);
                            new_jsGroup = jsGroup;
                            //僵尸全部死亡时游戏通关
                            if (dieJS.length >= jsAll) {
                                if (jsAll < 8) {
                                    setTimeout(function () {
                                        alert("闯关成功！ \n点击以进入下一关");
                                        window.location.href = "game.html#" + (jsAll + 1);
                                        window.location.reload();
                                    }, 1000);
                                }else {
                                    gamePass();
                                }
                            }
                            //射击存活僵尸
                            o.shoot(new_jsGroup);
                        }
                        return false;
                    }else if ((js.zombie.offsetLeft + 35) <= (o.plant.offsetLeft + o.plant.offsetWidth) && js.blood >= 0 && o.blood >= 0) {
                        //僵尸靠近植物并吞噬植物
                        if (js.blood > 0) {
                            o.blood--;
                        }
                        //记录停止行走的僵尸数量
                        stopJs.push(js);
                        //去掉重复记录
                        stopJs.distinct();
                        if (js.blood > 2) {
                            js.eatPlant();
                        }else if (js.blood == 2) {
                            js.lostHead();
                            js.noHeadEatPlant();
                        }else if (js.blood == 1) {
                            js.down();
                        }else if (js.blood == 0) {
                            js.die(dieJS);
                            o.stopShoot();
                            jsGroup.remove(js);
                            new_jsGroup = jsGroup;
                            //僵尸全部死亡时游戏通关
                            if (dieJS.length >= jsAll) {
                                if (jsAll < 8) {
                                    setTimeout(function () {
                                        alert("闯关成功！ \n点击以进入下一关");
                                        window.location.href = "game.html#" + (jsAll + 1);
                                        window.location.reload();
                                    }, 1000);
                                }else {
                                    gamePass();
                                }
                            }
                            o.shoot(new_jsGroup);
                        }
                        if (o.blood == 0) {
                            o.stopShoot();
                            o.die();
                            //遍历停止行走的僵尸数组让其行走
                            for (var j in stopJs) {
                                if (stopJs[j].blood > 2) {
                                    stopJs[j].walk();
                                }
                                if (stopJs[j].blood == 2 ) {
                                    stopJs[j].noHeadWalk();
                                }
                            }
                            stopJs = [];
                        }
                    }
                }
            }, 30);
        };
        //2秒后创建一个子弹
        this.bulletRun = setInterval(new_shoot, o.buildShootSpeed);
    };
    //植物停止射击的方法
    Plant.prototype.stopShoot = function () {
        clearInterval(this.bulletRun);
        this.bulletRun = null;
    };
    //植物的死亡方法  139, 225, 310, 396, 482, 567, 653, 738, 824
    Plant.prototype.die = function () {
        this.stopShoot();
        //植物死亡位置可以种植植物
        if (this.plant.offsetLeft == 139) state[0] = false;
        if (this.plant.offsetLeft == 225) state[1] = false;
        if (this.plant.offsetLeft == 310) state[2] = false;
        if (this.plant.offsetLeft == 396) state[3] = false;
        if (this.plant.offsetLeft == 482) state[4] = false;
        if (this.plant.offsetLeft == 567) state[5] = false;
        if (this.plant.offsetLeft == 653) state[6] = false;
        if (this.plant.offsetLeft == 738) state[7] = false;
        if (this.plant.offsetLeft == 824) state[8] = false;
        plants.removeChild(this.plant);
    };

    //创建一个僵尸对象
    function Zombie(blood, walkSpeed, left, category) {
        var dzombies = document.getElementById("dzombies");
        this.left = (left || 850);//距离左边距离
        this.zombie = this.init();//初始化
        this.blood = (blood || 10);//血量
        this.walkSpeed = (walkSpeed || 80);//僵尸移动速度
        this.category = (category || "Zombie/Zombie");//僵尸种类
    }
    //僵尸初始化的方法
    Zombie.prototype.init = function () {
        var zombie = document.createElement("div");
        zombie.style.left = this.left + "px";
        zombie.innerHTML = "<img src='img/plantshadow32.png' style='position:absolute; left: 72px; top: 122px;'><img src='img/Zombie/Zombie.gif'>";
        dzombies.appendChild(zombie);
        return zombie;
    };
    //正常走路
    Zombie.prototype.walk = function () {
        var o = this;
        this.zombieWalk = setInterval(function () {
            o.zombie.style.left = o.zombie.offsetLeft - 1 + "px";
            if (o.zombie.offsetLeft < -100) {
                if (gameEnd) return;
                gameOver();
            }
        }, this.walkSpeed);
        var imgs = this.zombie.getElementsByTagName("img");
        imgs[1].src = "img/" + this.category + ".gif";
    };
    //无头行走
    Zombie.prototype.noHeadWalk = function () {
        var o = this;
        this.zombieWalk = setInterval(function () {
            o.zombie.style.left = o.zombie.offsetLeft - 1 + "px";
            if (o.zombie.offsetLeft < -100) {
                if (gameEnd) return;
                gameOver();
            }
        }, this.walkSpeed);
        var imgs = this.zombie.getElementsByTagName("img");
        imgs[1].src = "img/" + this.category + "LostHead.gif";
    };
    //头颅掉落
    Zombie.prototype.lostHead = function () {
        var head = document.createElement("img");
        head.src = "img/Zombie/ZombieHead.gif";
        head.className = "head";
        head.style.left = this.zombie.offsetLeft + "px";
        head.style.top = this.zombie.offsetTop + "px";
        dzombies.appendChild(head);
        setTimeout(function () {
            dzombies.removeChild(head);
        }, 1000);
    };
    //停止走路
    Zombie.prototype.stopWalk = function () {
        clearInterval(this.zombieWalk);
    };
    //咀嚼植物
    Zombie.prototype.eatPlant = function () {
        this.stopWalk();
        var imgs = this.zombie.getElementsByTagName("img");
        imgs[1].src = "img/" + this.category + "Attack.gif";
    };
    //无头的咀嚼植物
    Zombie.prototype.noHeadEatPlant = function () {
        this.stopWalk();
        var imgs = this.zombie.getElementsByTagName("img");
        imgs[1].src = "img/" +  this.category + "LostHeadAttack.gif";
    };
    //僵尸倒地
    Zombie.prototype.down = function () {
        this.stopWalk();
        var imgs = this.zombie.getElementsByTagName("img");
        imgs[1].src = "img/Zombie/ZombieDie.gif";
    };
    //僵尸死亡
    Zombie.prototype.die = function (dieJS) {
        dieJS.push(true);
        dzombies.removeChild(this.zombie);
    };

    //游戏失败
    var gameEnd;
    var gameOver = function () {
        gameEnd = true;
        var endText = document.createElement('img');
        endText.src = "img/ZombiesWon.png";
        endText.className = "endText";
        wrap.appendChild(endText);
        setTimeout(function () {
            alert('游戏失败！\n请点击以返回首页');
            //返回主页
            window.location.href = "index.html#interface";
        }, 3000);
    };

    //闯关成功
    var gamePass = function () {
        //出现太阳花卡片
        var sunflower = document.createElement('img');
        sunflower.src = "img/flower.png";
        sunflower.className = "sunflower";
        wrap.appendChild(sunflower);
        sunflower.onclick = function () {
            sunflower.className = "sunflower-card";
            //跳转到图鉴页面
            setTimeout(function () {
             window.location.href = "flower.html";
             }, 2500);
        };
        var AutoPick = true;
        //3秒后自动拾取
        setTimeout(function () {
            if (AutoPick == true) {
                sunflower.onclick();
            }else {
                sunflower.onclick = null;
                sunflower.style.visibility = "hidden";
            }
        }, 3000);
    };

    //获取元素在数组中的位置
    Array.prototype.indexOf = function(val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == val) return i;
        }
        return -1;
    };
    //删除数组中某个元素
    Array.prototype.remove = function(val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };
    //去掉数组中重复
    Array.prototype.distinct = function(){
        for(var i = 0; i < this.length; i++){
            var n = this[i];
            this.splice(i, 1, null);
            if(this.indexOf(n) < 0){
                this.splice(i, 1, n);//不存在重复
            }else{
                this.splice(i, 1);//存在重复
            }
        }
        return this;
    };


    //游戏开始的方法
    var GameStart = function () {
        //开场效果
        OpenEffect();

        //8秒后游戏开始
        setTimeout(function () {
            var sod = document.getElementById("sod");
            //移除故事文字
            wrap.removeChild(story);
            //显示阳光计分器
            board.style.visibility = "visible";
            //显示植物选项卡
            cardList.style.visibility = "visible";
            //显示指示
            pointUp.style.visibility = "visible";
            //显示准备文字
            setTimeout(function () {
                prepare.style.visibility = "visible";
            }, 1000);
            //购买植物
            card.onclick = BuyPlant;
            //记录阳光分数
            //10s掉落一个阳光
            var sunRun = setInterval(BuildSun, 10000);
            //调用植物对象和僵尸对象进行战斗
            //调用僵尸
            setTimeout(function () {
                prepare.style.visibility = "hidden";
                var js = new Zombie(8, 100, 830);
                jsGroup.push(js);
                jsTotal.push(js);
                //console.log(js);
                js.walk();
            }, 5000);
            setTimeout(function () {
                if (jsAll < 2) return;
                //大波僵尸
                prepare.src = "img/LargeWave.gif";
                prepare.style.visibility = "visible";
                setTimeout(function () {
                    prepare.style.visibility = "hidden";
                }, 4000);
                //创建一个举旗僵尸
                var zom = new Zombie(12, 60, 830, "FlagZombie/FlagZombie");
                jsGroup.push(zom);
                jsTotal.push(zom);
                zom.walk();
                if (jsAll < 3) return;
                var buildJS = setInterval(function () {
                    var zom = new Zombie(10, 80, 830);
                    jsGroup.push(zom);
                    jsTotal.push(zom);
                    zom.walk();
                    if (jsTotal.length >= jsAll) {
                        clearInterval(buildJS);
                        buildJS = null;
                    }
                }, 5000);
            }, 25000);
        }, 8000);
    };

    GameStart();
};

var href = window.location.href;
if (href.indexOf("index.html") != -1) {
    window.onload = function () {
        ChangePage();
        ReturnHome();
    }
}
if (href.indexOf("game.html") != -1) {
    window.onload = function () {
        game();
    };
}


