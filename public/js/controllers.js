'use strict';

/* Controllers */

function AppCtrl($scope, socket) {

	// Socket listeners
	// =================
	$scope.messages = new Array();

	socket.on('init', function (data){
		$scope.name = data.name;
		$scope.users = data.users;

	});

	socket.on('send:message', function (data){
	
		$scope.messages.push(data);
		console.log('socket:send:message called');

	});

	socket.on('change:name', function (data){
		changeName(data.oldName, data.newName);
		console.log('socket:change:name called');
	});

	socket.on('user:join', function (data){
		$scope.messages.push({
			user: 'chatroom',
			text: 'User ' + data.name + 'has joined.'
		});
		$scope.users.push(data.name);
		console.log('socket:user:join called');
	});

	socket.on('user:left', function (data){
		$scope.messages.push({
			user: 'chatroom',
			text: 'User ' + data.name + 'has left.'
		});
		var i;
		for(i= 0 ; i < $scope.users.length;i++)
		{
			if(data.name == $scope.users[i])
			{
				$scope.users.splice(i,1);
				break;
			}
		}
		console.log('socket:user:left called');
	});


	// Private Helpers

	var changeName = function(oldName,newName)
	{
		var i;
		for(i = 0; i < $scope.users.length;i++)
		{
			if($scope.users[i] == oldName){
				$scope.users[i] = newName;
				break;
			}
		}

		$scope.messages.push({
			user: 'chatroom',
			text: 'User ' + oldName + 'is know as '+ newName
		});

	}


	// Methods published to Scope
	$scope.changeName = function()
	{
		console.log('socket:changename called');
		socket.emit('change:name',{
			name: $scope.newName
		},
		function (result){
			if(!result){
				alert('Your Name cant be changed, Try later');
			}else{
				changeName($scope.name,$scope.newName);
				
				$scope.name = $scope.newName;
				$scope.newName = '';
			}

		});
		
	};

	$scope.sendMessage = function(){
		
		socket.emit('send:message',{ message:$scope.message});

		//add the message to our local model
		$scope.messages.push({user:$scope.name, text:$scope.message});

		$scope.message = '';
		console.log('socket:sendmessage called');
	}
}
