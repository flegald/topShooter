Crafty.init(1000,550, document.getElementById('game'));


Crafty.defineScene('Stage', createAll())

function createAll(){

	var score = 0;

	Score = Crafty.e("2D, DOM, Text")
		.attr({ x: 900, y: 350 })
		.text('Score: ' + score.toString() + '/11')
		.textFont({size:'30px'})

	// Player Paddle
	paddle = Crafty.e('Player, 2D, Canvas, Color, Twoway, Collision')
		.attr({x: 20, y: 500, w: 100, h: 10})
		.color('#F00')
		.twoway(800)
	  	.bind('Moved', function(evt){
	        if (this.hit('Wall')){
	            this[evt.axis] = evt.oldValue;
	    	}
		})

	// Boundaries
	 Crafty.e('Roof, 2D, Canvas, Color, Solid, Collision')
	  .attr({x: 0, y:0, w: 800, h: 5})
	  .color('red')

	  Crafty.e('Wall, 2D, Canvas, Color, Solid, Collision')
	  .attr({x: 10, y:0, w: 5, h: 550})
	  .color('green')

	  Crafty.e('Floor, 2D, Canvas, Color, Solid, Collision')
	  .attr({x:0, y:540, w: 800, h: 5})
	  .color('orange')

	   Crafty.e('Wall, 2D, Canvas, Color, Solid, Collision')
	  .attr({x: 795, y:0, w: 5, h: 550})
	  .color('green')


	// Ball
	ball = Crafty.e('Ball, 2D, Canvas, Color, Collision, Motion')

		.attr({x: 350, y: 100, w: 10, h: 10, speed: 10})
		.color('#F00')
		.onHit('Player', function(evt){
			hitRoof(this)
		})
		.onHit('Wall', function(evt){
			hitWall(this)
		})
		.onHit('Roof', function(evt){
			hitRoof(this)
		})
		.onHit('Floor', function(evt){
			alert('You Lose')
			location.reload()
		})

		function startBall(){
			var vel = ball.velocity();
			vel.x;
			vel.x = 0;
			vel.y = 0;
			vel.y += 500;
			vel.x += 500;
		}

		function hitRoof(object){
			initialy = object.vy;
			object.vy = 0;
			object.vy = (initialy * -1);
		}

		function hitWall(object){
			initialx = object.vx;
			object.vx = 0;
			object.vx = (initialx * -1);
		}

	// Blocks
	blockPos = 50;
	for (i=0; i < 11; i++){
		block = Crafty.e('Block, 2D, Canvas, Color, Solid, Collision')
		.attr({x: blockPos, y: 50, w: 50, h: 25})
		.color('red')
		.onHit('Ball', function(evt){
			this.destroy()
			hitRoof(ball)
			score += 1;
			Score.text('Score: ' + score.toString() + '/11')
			if (score == 11){
				alert('You Win')
				location.reload()
			}
		})
		blockPos += 60;
	}

	$(document).on('keypress', function(){
		startBall()
		$('#start').hide()
	})
}