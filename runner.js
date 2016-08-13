Crafty.init(1000,550, document.getElementById('game'));



Crafty.defineScene('Stage', createAll())

// Set up pick ups
function setPickUps(){
	for (i=0;i<10;i++){
	randx = Math.floor(Math.random() * 750) + 1;
	randy = Math.floor(Math.random() * 500) + 1;
	Crafty.e('Item, 2D, Canvas, Color, Collision')
		.attr({x:randx, y:randy, w:10, h:10, points:50})
		.color('green')
		.onHit('Wall', function(evt){
			location.reload()
		})
	}
}

function setEnemies(num){
	for (i=0;i<num;i++){
		randx = Math.floor(Math.random() * 750) + 1;
		randy = Math.floor(Math.random() * 500) + 1;
		 Crafty.e('Enemy, 2D, Canvas, Color, Solid, Collision, Motion')
		 	.attr({x:randx, y:randy, w:30, h:30})
		 	.color('red')
		 	.bind('EnterFrame', function(evt){
				var vel = this.velocity();
				vel.x;
				vel.x = 0;
				vel.y = 0;
				vel.y += 300;
				vel.x += 300;
		 	})
	  		.onHit('Wall', function(evt){
	  			initialx = this.vx;
	  			initialy = this.vy;
	            this.vx = 0;
	            this.vy = 0;
	            this.vx = (initialx * -1);
	    	})
		}
	}


function reverse(){
	this.x  -= Math.random();
	this.y -= Math.random();
}

function createAll(){
	
	score = 0;

	if (localStorage.getItem('wins')){
		wins = parseInt(localStorage.getItem('wins'));
	} else {
		wins = 0;
	}

	if (localStorage.getItem('losses')){
		losses = parseInt(localStorage.getItem('losses'));
	} else {
		losses = 0;
	}


// Score Current Game
	num = Crafty.e("2D, DOM, Text")
	.attr({ x: 900, y: 100 })
	.text("Score: " + score.toString())
	.textFont({size:'30px'})

// Total Wins
	Crafty.e("2D, DOM, Text")
	.attr({ x: 900, y: 200 })
	.text('Total Wins: ' + wins.toString())
	.textFont({size:'30px'})

// Total Loses
	Crafty.e("2D, DOM, Text")
	.attr({ x: 900, y: 350 })
	.text('Total Losses: ' + losses.toString())
	.textFont({size:'30px'})


// Create Player
	player = Crafty.e('Player, 2D, Canvas, Color, Fourway, Collision')
	  .attr({x: 20, y: 20, w: 50, h: 50})
	  .color('#F00')
	  .fourway(300)
	  .bind('Moved', function(evt){
	        if (this.hit('Wall')){
	            this[evt.axis] = evt.oldValue;
	    	}
		})
	  .onHit('Item', function(e){
	  		item = e[0].obj
	  		points = item.points
	  		score += points
	  		num.text('Score: ' + score.toString())
	  		item.destroy()
	  		if (score >= 500){
	  			alert('You win')
	  			wins += 1
	  			localStorage.setItem('wins', wins)
	  			location.reload()
	  		}
	  })
	  .onHit('Enemy', function(evt){
	  	enemy = evt[0].obj
	  	enemy.destroy()
	  	alert('You Lose')
	  	losses += 1
	  	localStorage.setItem('losses', losses)
	  	location.reload()
	  })
	  .bind("KeyDown",function(evt){
			if (evt	.key == Crafty.keys["SPACE" ]){
				console.log('shot')			
				var bulletX = this.x + 7;
				var bulletY = this.y;
				
				Crafty.e("Bullet, 2D, Canvas, Color, Collision")
					.attr({x:bulletX, y:bulletY, w:6, h:6, speed:10})
					.color( "#bf2121" )
					.bind('EnterFrame', function(evt){
						this.y -= 10
					})
					.onHit('Enemy', function(evt){
	    					enemy = evt[0].obj
	    					console.log(enemy.Hp)
	    					enemy.Hp -= 1;
	    					console.log(enemy.Hp)
	    					if (enemy.Hp == 2){
	    						enemy.color = "blue";
	    					} else if (enemy.Hp == 1){
	    						enemy.color == "red"
	    					}

	    					this.destroy()
	    					if (enemy.Hp <= 0){
	    						enemy.destroy()
	    					}

	    			})
	    			.onHit('Wall', function(evt){
	    				this.destroy()
	    			})
			}
		})

// Boundaries
 Crafty.e('Wall, 2D, Canvas, Color, Solid, Collision')
  .attr({x: 0, y:0, w: 800, h: 5})
  .color('blue')

  Crafty.e('Wall, 2D, Canvas, Color, Solid, Collision')
  .attr({x: 0, y:0, w: 5, h: 550})
  .color('blue')

  Crafty.e('Wall, 2D, Canvas, Color, Solid, Collision')
  .attr({x:0, y:540, w: 800, h: 5})
  .color('blue')

   Crafty.e('Wall, 2D, Canvas, Color, Solid, Collision')
  .attr({x: 790, y:0, w: 5, h: 550})
  .color('blue')

  setPickUps()
  enemyNum = (wins + 1);
  setEnemies(enemyNum)
}
