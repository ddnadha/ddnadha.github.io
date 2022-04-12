$(document).ready(function(){
	let arrNumCard = ["a", "2", "3", "4", "5", "6", "7", "8", "9", "10", "j", "q", "k" ];
	let arrValueCard = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
	let arrElCard = ["c", "d", "h", 's'];
	let arrAvaiableCard = [];
	let playerCardValue = 0;
	let playerCardCount = 2;
	let playerCard = [];
	let roomId = getUrlParameter('code');
	let playerName = getUrlParameter('name');
	let cont = `<img class="deck-card" src="./assets/img/deck/default.png">`
	let resetBtn = false

	arrElCard.forEach(function(item, index){
		arrNumCard.forEach(function(itemNum, indexNum){
			arrAvaiableCard.push(item+""+itemNum)
		})
	})
	$('.time-text').html(insertAfterEveryN(roomId))
	listen()

	
	

	

	


	//EVENT LISTENER
	$('.btn-warning').click(function(){
		let card = randomCard()
		arrAvaiableCard.splice(arrAvaiableCard.indexOf(card), 1)
		saveToDB(card, arrValueCard[arrNumCard.indexOf(card.substr(1))])
		console.log(card)
	})

	$('.btn-primary').click(function(){
		if (resetBtn == false) {
			firebase.database().ref(`${roomId}/player/${playerName}/`).once('value').then((snapshot) => {
				let data = snapshot.val()
				let updates = {}
				data.isDone = true
				updates[`${roomId}/player/${playerName}/`] = data
				firebase.database().ref().update(updates)
			})
			$('.btn-danger').css('visibility', 'hidden')
			$('.btn-warning').css('visibility', 'hidden')
			$('.btn-danger').css('visibility', 'hidden')
		}else{
			window.location.reload()
		}
	})
	$('.btn-danger').click(function(){
		firebase.database().ref(`${roomId}/player/${playerName}`).set({
		})
		window.location.href = "index.html";
	})
	$('.btn-outline-light').click(function(){
		
	})



	// METHOD-METHOD
	function findWinner(score, scoreOrder) {
		//preparation
		var winner = null
		var tmp21 = null
		var moreThanOne21 = false
		var no21made = true
		for (var i = 0; i < score.length; i++) {
			if (score[i] == 21){
				if (tmp21 == null) {
					tmp21 = i
					no21made = false
				}else{
					moreThanOne21 = true
				}
			}else{
				if ( (score[winner] < score[i] && score[i] <= 21) || winner == null ) {
					winner = i
					console.log(winner)
				}
			}
		}
		if (no21made && winner > 21) {
			var min = null
			for (var i = 0; i < score.length; i++) {
				if (min == null || score[i] < min) {
					min = i
				}
			}
			winner = min
		}
		//choose winner
		if (moreThanOne21) alert('tie !')
		else if(tmp21 != null) alert(scoreOrder[tmp21]+" win !")
		else alert(scoreOrder[winner]+" win !")

		firebase.database().ref(`${roomId}/player/${playerName}`).set({
			count: 0,
			value: 0,
			name: playerName,
			isDone: false
		})
		resetBtn = true
		$('.btn-primary').html('<i class="bi bi-arrow-counterclockwise"></i>')
	}

	function getUrlParameter(sParam) {
	    var sPageURL = window.location.search.substring(1)
	    var sURLVariables = sPageURL.split('&')
		var sParameterName
	    for (var i = 0; i < sURLVariables.length; i++) {
	        sParameterName = sURLVariables[i].split('=')
	        if (sParameterName[0] === sParam) {
	            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1])
	        }
	    }
	    return false;
	}

	function saveToDB(card, cardVal) {
		var arr = [];
		var value = 0
		var count = 0
		firebase.database().ref(`${roomId}/player/${playerName}/`).once('value').then((snapshot) => {
			console.log(snapshot.val())
			if (snapshot.val() != null) {
				arr = snapshot.val().card
				value += snapshot.val().value
				count += snapshot.val().count
			}
			if (Array.isArray(card)) {
				arr = card
				value = cardVal
			}else{
				arr.push(card)
				value += cardVal
			}
			count = arr.length
			firebase.database().ref(`${roomId}/player/${playerName}`).set({
				isDone: false,
				name: playerName,
				card: arr,
				count: count,
				value: value
			})
		})
	}

	function randomCard(){
		return arrAvaiableCard[Math.floor(Math.random() * arrAvaiableCard.length) + 1];
	}
	function insertAfterEveryN(str) {
		result = str.substr(0, 3) + '-' + str.substr(3, 3) + '-' + str.substr(6, 4)
	 	return result
	}

	function insertCard() {
		let card = [randomCard(), randomCard()]
		arrAvaiableCard.splice(arrAvaiableCard.indexOf(card[0]), 1)
		arrAvaiableCard.splice(arrAvaiableCard.indexOf(card[1]), 1)
		let tmpArrValCard = arrValueCard[arrNumCard.indexOf(card[0].substr(1))] + arrValueCard[arrNumCard.indexOf(card[1].substr(1))]
		saveToDB(card, tmpArrValCard)
	}

	function listen() {
		//FIREBASE LISTENER
		var arr = null
		var forceInsert = false
		firebase.database().ref(`${roomId}`).on('value', (snapshot) => {
			$(`#player1area`).css('visibility', 'visible')
			$(`#player2area`).css('visibility', 'visible')
			$(`#player3area`).css('visibility', 'visible')
			arr = snapshot.val()
	  		
			var opCard = []
			var m = 1
			
			//listen to card changes
			if (arr != null) {
				Object.keys(arr.player).forEach(function(item, index){
					var obj = arr.player[item]
					if (item != playerName) {
						if (obj.count != 0) {
							var content = ''
							obj.card.forEach(function(i, x){
								opCard.push(i)
								arrAvaiableCard.splice(arrAvaiableCard.indexOf(i), 1)
								content += `<img src="./assets/img/deck/default.png" class="deck-card">`
							})
							$(`#player${m}deck`).html(content)
							$(`#player${m}score`).html("?")
							
						}else{
							$(`#player${m}area`).css('visibility', 'hidden')
						}
					}else{
						if(obj.count != 0){
							var content = ''
							obj.card.forEach(function(i, x){
								opCard.push(i)
								arrAvaiableCard.splice(arrAvaiableCard.indexOf(i), 1)
								content += `<img src="./assets/img/deck/${i}.png" class="deck-card">`

							})
							$(`#player0deck`).html(content)
							$('#player0score').html(obj.value)
						}
						
					}
					
				})
			}
			let f = arr == null ? 0 : Object.keys(arr.player).length - 1
			console.log(f)
		  	for (var i = 3; i > f; i--) {
		  		$(`#player${i}area`).css('visibility', 'hidden')
		  	}

		  	if (arr != null) {
		  		//listen to game over
		  		var over = true
		  		var score = []
		  		var scoreOrder = []
		  		Object.keys(arr.player).forEach(function(item, index){
		  			var obj = arr.player[item]
		  			score.push(obj.value)
		  			scoreOrder.push(obj.name)
		  			if (obj.isDone == false) over = false
		  		})
		  		if (over){
		  			console.log([score, scoreOrder])
		  			findWinner(score, scoreOrder)
		  		}
		  	}
		})
  		if (arr == null || arr.player[playerName] == null || forceInsert == true) {
  			let card = [randomCard(), randomCard()]
			arrAvaiableCard.splice(arrAvaiableCard.indexOf(card[0]), 1)
			arrAvaiableCard.splice(arrAvaiableCard.indexOf(card[1]), 1)
			let tmpArrValCard = arrValueCard[arrNumCard.indexOf(card[0].substr(1))] + arrValueCard[arrNumCard.indexOf(card[1].substr(1))]
			saveToDB(card, tmpArrValCard)
  		}
	}
})