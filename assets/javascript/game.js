function removeSpaces(str) {
	return str.replace(/\s+/g,'');
}

var audio = document.getElementById("myAudio");

var game = {
	charsGuessed: [],
	currentWord: "",
	currentAudioSource: "",
	opportunities: 15,
	allowedCharacters: /^[a-zA-Z0-9]+$/,

	teams: [{name:"Cleveland Caveliers",player:"Lebron James",country:"USA",pic:"assets/images/players/Lebron.jpg",bgpic:"assets/images/bgs/Lebron_bg.jpg",musicSrc1:"assets/teams/basketball.mp3",picClass:"whiteBorder",textClass:"whiteFont"},
	{name:"Los Angeles Lakers",player:"Kobe Bryant",country:"USA",pic:"assets/images/players/Kobe.jpg",bgpic:"assets/images/bgs/Kobe_bg.jpg",musicSrc1:"assets/teams/basketball.mp3",picClass:"whiteBorder",textClass:"whiteFont"},
	{name:"Chicago Bulls",player:"Michael Jordan",country:"USA",pic:"assets/images/players/Michael-Jordan-dunk.jpg",bgpic:"assets/images/bgs/mj-bg.jpg",musicSrc1:"assets/song/basketball.mp3",picClass:"fireBorder",textClass:"fireFont"},
	{name:"Dallas Mavericks",player:"Dirk Nowitzki",country:"USA",pic:"assets/images/players/Dirk.jpg",bgpic:"assets/images/bgs/Dirk_bg.jpg",musicSrc1:"assets/teams/basketball.mp3",picClass:"whiteBorder",textClass:"whiteFont"}],
	wins: 0,
	getRandomSong: function(){
		this.BasketballTeam = this.teams[Math.floor(Math.random()*this.teams.length)];
	},
	initGame: function(){
		game.charsGuessed = [];
		game.getRandomSong();
		this.setInitialCurrentWord();
	},
	setInitialCurrentWord: function(){
		var txt = "";
		//This will replace all the allowed characters of the song name with an underscore ('_') 
		this.BasketballTeam.name.split('').forEach(function(c) {
   			if( !game.allowedCharacters.test(c) )
	   			txt=txt+c;
   			else
   				txt=txt+"_";

		});
   		this.currentWord = txt;
	}
}

game.initGame();

if( audio.canPlayType('audio/mpeg;') )
	game.currentAudioSource = game.BasketballTeam.musicSrc1;
//my music is not working for some reason
//I've been told that there is a bug, but I will have to come back to it
document.getElementById("currentWord").innerHTML = game.currentWord;
document.getElementById("charactersGuessed").innerHTML = "[ ]";

document.onkeyup = function(event) {
	var userKey = String.fromCharCode(event.keyCode).toLowerCase();
	if( game.allowedCharacters.test(userKey) )
	{
		if( game.charsGuessed.indexOf(userKey) < 0 )
		{
			game.currentWord="";
			
			if( game.BasketballTeam.name.toLowerCase().indexOf(userKey) > -1 )
			{
				for(var i = 0; i < game.BasketballTeam.name.length; i++)
				{
					if( userKey === game.BasketballTeam.name[i].toLowerCase() || !game.allowedCharacters.test(game.BasketballTeam.name[i])  || game.charsGuessed.indexOf(game.BasketballTeam.name[i].toLowerCase()) > -1 )
					{
						game.currentWord = game.currentWord + game.BasketballTeam.name[i];
					}
					else
					{
						game.currentWord = game.currentWord + "_";
					}
				}
				console.log('new');
			}
			else
			{
				for( var i = 0; i < game.BasketballTeam.name.length; i++ )
				{
					if( !game.allowedCharacters.test(game.BasketballTeam.name[i]) || (game.charsGuessed.indexOf(game.BasketballTeam.name[i].toLowerCase()) > -1) )
					{
						game.currentWord = game.currentWord + game.BasketballTeam.name[i];
					}
					else
					{
						game.currentWord = game.currentWord + "_";
					}
				}	
				//decrease oportunities
				game.opportunities = game.opportunities - 1;
				console.log('wrong');
				if( game.opportunities <= 0 )
				{
					game.initGame();
					if (audio.canPlayType('audio/mpeg;'))
						game.currentAudioSource = game.BasketballTeam.musicSrc1;
					document.getElementById("teamName").innerHTML = "You Lost!";
					game.opportunities=15;
					game.wins = 0;
					document.getElementById("winsQty").innerHTML = game.wins;
				}
			}
			game.charsGuessed.push(userKey);
			if( removeSpaces(game.currentWord.toLowerCase()) === removeSpaces(game.BasketballTeam.name.toLowerCase()) )
			{
				console.log("You are now the Champion!");
				game.wins = game.wins + 1;
				document.getElementById("winsQty").innerHTML = game.wins;
				document.getElementById("teamName").innerHTML = game.BasketballTeam.name;
				document.getElementById("playerPic").setAttribute("src", game.BasketballTeam.pic);
				document.getElementById("playerPic").className = game.BasketballTeam.picClass;
				document.getElementById("secondContainer").className = "col-xs-8 col-sm-8 col-md-8 col-lg-8 col-xs-offset-2 col-sm-offset-2 col-md-offset-2 col-lg-offset-2 "+game.BasketballTeam.picClass;				document.getElementById("bg").style.backgroundImage='url("'+game.BasketballTeam.bgpic+'")';
				document.getElementById("titleContainer").className = "row "+game.BasketballTeam.textClass;
				document.getElementById("centralDiv").className = "col-xs-6 col-sm-6 col-md-6 col-lg-6 "+game.BasketballTeam.textClass;
				document.getElementById("teamName").className = "row "+game.BasketballTeam.textClass;
				
				audio.src="";
				audio.src=game.currentAudioSource;
				audio.play();
				game.initGame();
				if (audio.canPlayType('audio/mpeg;'))
					game.currentAudioSource = game.BasketballTeam.musicSrc1;
			}
		}
		document.getElementById("currentWord").innerHTML = game.currentWord;
		document.getElementById("charactersGuessed").innerHTML = "["+game.charsGuessed.toString()+"]";
		document.getElementById("guessesRemaining").innerHTML = game.opportunities;
	}
}