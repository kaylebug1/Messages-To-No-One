let pg = require('pg');
if (process.env.DATABASE_URL) {
  pg.defaults.ssl = true;
}

let connString = process.env.DATABASE_URL || 'postgresql://ta:password@localhost:5432/messages';
const { Pool } = require('pg');

// console.log(connString);
const pool = new Pool({
  connectionString : connString
});

function addConversation(request, response) {
	
	var name = request.body.name;
	var user = request.body.user;
	console.log("added a conversation with the name " + name);
	if(name){
		pool.query('INSERT INTO conversation("name", "users") VALUES ($1, $2)', [name, user] );
	}
}

function getConversation(request, response){
	var id = request.params.id;
	response.type("json");
	console.log("The id of conversation is " + id);
	if(id){
		pool.query('SELECT name FROM conversation WHERE conversation_id = $1', [id], (err, res) =>{
			if (err){
				throw err;
			}
			console.log(res.rows[0]);
			response.write(JSON.stringify(res.rows[0]));
			response.end();
		} )
	}
}

function conversationTitles(request, response){
	var user = request.params.user;
	response.type("json");
	console.log("The id of the user of conversation is " + user);
	if(user){
		pool.query('SELECT name, conversation_id FROM conversation WHERE users = $1', [user], (err, res) =>{
			if (err){
				throw err;
			}
			console.log(res.rows[0]);

			response.write(JSON.stringify(res.rows));
			response.end();
		} )
	}

}

function deleteConversation(request, response){
	var id = request.params.id;

	console.log("The id of the conversation is " + id);

	if(id){
		pool.query('DELETE FROM conversation WHERE conversation_id = $1', [id], (err, res) =>{
			if (err){
				throw err;
			}
		} )
	}

}


module.exports = {
	addConversation: addConversation,
	getConversation: getConversation,
	conversationTitles: conversationTitles,
	deleteConversation: deleteConversation
};