var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('mydb.db');
function initDb(){
  db.run("CREATE TABLE if not exists agents (agentId LONG, ownerId TEXT, folowers TEXT)");
}

function addAgent(onerId,res){
  initDb();
  var agentId = 0;
  db.get("SELECT MAX(agentId) as m FROM agents", function(err, row) {
        agentId = parseInt(row.m);
        console.log(row.m);
        agentId = agentId+1;
        if(isNaN(agentId)){
          agentId=0;
        }
        db.run("INSERT INTO agents VALUES ("+onerId+agentId+",'"+onerId+"','"+onerId+"')");
        console.log("created agent "+onerId+agentId);
        res(onerId,"created agent "+agentId,true);
   });
}

function remAgent(agentId,onerId,res){
  initDb();
  var agentId = 0;
  db.run("DELETE FROM agents WHERE agentId ="+onerId+agentId+" and ownerId='"+onerId+"')");
  res(onerId,"DELETE agent "+agentId,true);
}


function getAllFolowers(agentId,res){
  initDb();
  db.get("SELECT COUNT(folowers) as r FROM agents where agentId="+agentId+"", function(err, row) {
    if(row.r > 0){
    db.get("SELECT folowers FROM agents where agentId="+agentId+"", function(err, row) {
      var f = "";
      console.log(row.folowers);
      f = row.folowers;
      res.send("this are agent "+agentId+"folowers "+row.folowers);
   });
 }else{
   res.send("none");
 }
  });
}

function RegFolowers(agentId,f,res){
  initDb();
  console.log("register "+f+" to "+agentId);
  db.get("SELECT COUNT(folowers) as r FROM agents where agentId="+agentId+"", function(err, row) {
    if(row.r > 0){
      return db.get("SELECT folowers FROM agents where agentId='"+agentId+"'", function(err, row) {
        var fo = row.folowers.replace(";"+f,'');
        db.run("UPDATE agents SET folowers='"+ fo+";"+f +"' WHERE agentId='"+agentId+"'");
        res(f,"you where add to "+agentId);
      });
    }else{
      res(f,"cannot faind "+agentId);
    }
  });
}

function RemFolowers(agentId,f,sender,res){
  initDb();
  console.log("register "+f+" to "+agentId);
  db.get("SELECT COUNT(folowers) as r FROM agents where agentId="+agentId+"", function(err, row) {
    if(row.r > 0){
      return db.get("SELECT folowers FROM agents where agentId='"+agentId+"'", function(err, row) {
        var fo = row.folowers.replace(";"+f,"");
        db.run("UPDATE agents SET folowers='"+ fo +"' WHERE agentId='"+agentId+"'");
        res(f,"you where remooved from "+agentId);
      });
    }else{
      res(f,"cannot faind "+agentId);
    }
  });
}

module.exports.addAgent=addAgent;
module.exports.remAgent=remAgent;
module.exports.getAllFolowers=getAllFolowers;
module.exports.RegFolowers=RegFolowers;
module.exports.RemFolowers=RemFolowers;
}
