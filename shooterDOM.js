if(gameRunning == false){
	function blink(){
		text = document.getElementById('gameText')
		if (text.innerText == ''){
			text.innerText = 'Press Enter to Start'
		} else {
			text.innerText = ''
		}
	}

	setInterval(blink, 500)
}