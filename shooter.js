var gameRunning = false;
Crafty.init(1000,550, document.getElementById('game'));

// Load Sprites
var assetsObj = {
	"sprites": {
		"spacesprite.png": {
			tile: 137,
			tileh: 183,
			map: {
				ship: [0, 0]
			}
		},
		"alien1.png": {
			tile: 166,
			tileh: 315,
			map: {
				enemyShip: [0, 0]
			}
		},
		"explosion3.png": {
			tile: 128,
			tileh: 128,
			map: {
				expStart: [0,0],
				expEnd: [2, 4]

			}
		},
		"goodlaser.png": {
			tile: 74,
			tileh: 290,
			map: {
				goodLaser: [0,0]
			}
		},
		"badlaser.png": {
			tile: 74,
			tileh: 290,
			map: {
				badLaser: [0,0]
			}
		}
	},
	"audio": {
		"shoot": ['laser.wav'],
		"explosion": ['explosion.wav'],
		"introSong": ['short.wav'],
		"gameSong": ['long.wav']
	}
}
Crafty.load(assetsObj)


//Define Splash Scene
Crafty.defineScene('intro', function intro(){
	Crafty.audio.play('introSong', -1)
	Crafty.e("2D, DOM, Text, KeyBoard")
		.attr({ x: 450, y: 200, w:500 })
		.textColor('red')
		.text('Press Enter')
		.textFont({size:'30px'})
		.bind("KeyDown", function(e){
			if(e.key == Crafty.keys['ENTER']){
				// Load Gameplay Scene
				Crafty.audio.stop('introSong')
				Crafty.enterScene('gameplay')
				
			}
		})
});


// Enter Spash Screen on Page Load
Crafty.enterScene('intro')

// Define Win Scene
Crafty.defineScene('win', function(){
	Crafty.audio.play('introSong', -1)
	Crafty.e("2D, DOM, Text, KeyBoard")
		.attr({ x: 300, y: 200, w:500 })
		.textColor('red')
		.text('You Win \n Press Enter to Play Again')
		.textFont({size:'30px'})
		.bind("KeyDown", function(e){
			if(e.key == Crafty.keys['ENTER']){
				// Load Gameplay Scene
				Crafty.audio.stop('introSong')
				Crafty.enterScene('gameplay')
				
			}
		})
})

// Define Lose Scene
Crafty.defineScene('lose', function(){
	Crafty.audio.play('introSong', -1)
	Crafty.e("2D, DOM, Text, KeyBoard")
		.attr({ x: 300, y: 200, w:500 })
		.textColor('red')
		.text('You Lose \n Press Enter to Play Again')
		.textFont({size:'30px'})
		.bind("KeyDown", function(e){
			if(e.key == Crafty.keys['ENTER']){
				// Load Gameplay Scene
				Crafty.audio.stop('introSong')
				Crafty.enterScene('gameplay')
				
			}
		})
})


// Define Gameplay Scene
Crafty.defineScene('gameplay', function(){

	Crafty.audio.play('gameSong', -1)
	// Player Object
	player = Crafty.e('Player, 2D, Canvas, Twoway, Collision, ship')
		.attr({x: 20, y: 450, w:50, h: 50})
		.twoway(800)
	  	.bind('Moved', function(evt){
	        if (this.hit('Wall')){
	            this[evt.axis] = evt.oldValue;
	    	}
		})

		// Shooting/Bullet Creation
	  	.bind("KeyDown",function(evt){
			if (evt	.key == Crafty.keys["SPACE" ]){
				Crafty.audio.play('shoot')
				var bulletX = this.x + 25;
				var bulletY = this.y;

				// Player Bullet Object
				Crafty.e("Bullet, 2D, Canvas, Collision, goodLaser")
					.attr({x:bulletX, y:bulletY, w:6, h:6})
					.bind('EnterFrame', function(evt){
						this.y -= 10
					})
					.onHit('Wall', function(evt){
						this.destroy()
					})

					// Hit Enemy
					.onHit('Enemy', function(evt){
						enemy = evt[0].obj
						enemy.HP -= 10;
						if (enemy.HP <= 0){
							// Explosion object for enemy destruction
							explosion = Crafty.e("2D, Canvas, expStart, SpriteAnimation")
							.attr({x:enemy.x, y:enemy.y, w: 50, h: 50})
							.reel('exploding', 1000, [
								[0,0], [1, 0], [2, 0], [3, 0],
								[1, 0], [1, 1], [1, 2], [1, 3],
								[2, 0], [2, 1], [2, 2], [2, 3],
								[3, 0], [3, 1]
							])
							.animate('exploding', -1)
							enemy.destroy()
							Crafty.audio.play('explosion')
							setTimeout(function(){
								explosion.destroy()
								Crafty.audio.stop('gameSong')
								Crafty.enterScene('win')
								
							}, 1000
							)
						}
						this.destroy()

					})

			}
		})

	// Enemies
	enemy = Crafty.e('Enemy, Canvas, 2D, Collision, Motion, Delay, enemyShip')
		.attr({x: 100, y: 50, w: 50, h: 50})
		.onHit('Wall', function(evt){
			vel = this.velocity();
			initialx = vel.x;
			vel.x = 0;
			vel.x = (initialx * -1);
		})
		.bind('EnterFrame', function(evt){
			vel = this.velocity();
			if (vel.x == 0){
				vel.x = 200;
			}
		})
		.delay(function(){
			var bulletX = enemy.x + 25;
			var bulletY = enemy.y + 25;
			// Enemy Bullet Object
			enemyBullet = Crafty.e("Bullet, 2D, Canvas, Collision, badLaser")
				.attr({x:bulletX, y:bulletY, w:6, h:6})
				.bind('EnterFrame', function(evt){
					this.y += 15;
				})
				.onHit('Wall', function(evt){
					this.destroy()
				})
				.onHit('Player', function(evt){
					// Explosion Object for player destruction
					explosion = Crafty.e("2D, Canvas, expStart, SpriteAnimation")
						.attr({x:player.x, y:player.y, w: 60, h: 60})
						.reel('exploding', 1000, [
							[0,0], [1, 0], [2, 0], [3, 0],
							[1, 0], [1, 1], [1, 2], [1, 3],
							[2, 0], [2, 1], [2, 2], [2, 3],
							[3, 0], [3, 1]
						])
						.animate('exploding', -1)
						Crafty.audio.play('explosion')
						player.destroy()
						Crafty.audio.stop('gameSong')
						setTimeout(function(){
							explosion.destroy()
							enemyBullet.destroy()
							Crafty.enterScene('lose')
						}, 1000)
					})
		}, 500, -1)

	enemy.HP = 50;


	// Boundaries
	Crafty.e('Roof, 2D, Canvas, Solid, Collision')
	.attr({x: 0, y:0, w: 995, h: 5})

	Crafty.e('Wall, 2D, Canvas, Solid, Collision')
	.attr({x: 1, y:0, w: 5, h: 550})

	Crafty.e('Floor, 2D, Canvas, Solid, Collision')
	.attr({x:0, y:540, w: 995, h: 5})

	Crafty.e('Wall, 2D, Canvas, Solid, Collision')
	.attr({x: 995, y:0, w: 5, h: 550})
})




