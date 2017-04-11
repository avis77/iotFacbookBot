var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('mydb.db');
function initDb(){
  db.run("CREATE TABLE if not exists agents (agentId TEXT, ownerId TEXT, folowers TEXT)");
}
function cleanDb(){
  db.run("drop TABLE agents");
}
function addAgent(onerId,res){
  initDb();
  var agentId = 0;
  db.get("SELECT count(1) as m FROM agents where ownerId='"+onerId+"'", function(err, row) {
        agentId = parseInt(row.m);
        console.log(row.m+"="+agentId);
        agentId = agentId+1;
        if(isNaN(agentId)){
          agentId=1;
        }
        id = ""+onerId+"-"+agentId;
        db.run("INSERT INTO agents VALUES ('"+id+"','"+onerId+"','"+onerId+"')");
        console.log("created agent "+agentId);
        res(onerId,"created agent "+id,true);
   });
}

function remAgent(agentId,onerId,res){
  initDb();
  var agentId = 0;
  db.run("DELETE FROM agents WHERE agentId ='"+agentId+"' and ownerId='"+onerId+"'");
  res(onerId,"DELETE agent "+agentId,true);
}


function getAllFolowers(agentId,res){
  initDb();
  db.get("SELECT COUNT(folowers) as r FROM agents where agentId='"+agentId+"'", function(err, row) {
    if(row.r > 0){
    db.get("SELECT folowers FROM agents where agentId='"+agentId+"'", function(err, row) {
      var f = "";
      console.log(row.folowers);
      f = row.folowers;
      res.end("this are agent "+agentId+"folowers "+row.folowers);
   });
 }else{
   res.end("none");
 }
  });
}

function RegFolowers(agentId,f,res){
  initDb();
  console.log("register "+f+" to "+agentId);
  db.get("SELECT COUNT(folowers) as r FROM agents where agentId='"+agentId+"'", function(err, row) {
    if(row.r > 0){
      return db.get("SELECT folowers FROM agents where agentId='"+agentId+"'", function(err, row) {
        var fo = row.folowers.replace(";"+f,'');
        db.run("UPDATE agents SET folowers='"+ fo+";"+f +"' WHERE agentId='"+agentId+"'");
        res(f,"you where add to "+agentId,true);
      });
    }else{
      res(f,"cannot faind "+agentId,true);
    }
  });
}

function RemFolowers(agentId,f,res){
  initDb();
  console.log("register "+f+" to "+agentId);
  db.get("SELECT COUNT(folowers) as r FROM agents where agentId='"+agentId+"'", function(err, row) {
    if(row.r > 0){
      return db.get("SELECT folowers FROM agents where agentId='"+agentId+"'", function(err, row) {
        var fo = row.folowers.replace(";"+f,"");
        db.run("UPDATE agents SET folowers='"+ fo +"' WHERE agentId='"+agentId+"'");
        res(f,"you where remooved from "+agentId,true);
      });
    }else{
      res(f,"cannot faind "+agentId,true);
    }
  });
}
function getAllMyAgents(f,res){
  initDb();
  return db.each("SELECT agentId,ownerId FROM agents ", function(err, row) {
  res(f,"you have agent "+row.agentId+" "+row.ownerId,true);
  });
}
module.exports.addAgent=addAgent;
module.exports.remAgent=remAgent;
module.exports.getAllFolowers=getAllFolowers;
module.exports.RegFolowers=RegFolowers;
module.exports.RemFolowers=RemFolowers;
module.exports.getAllMyAgents=getAllMyAgents;
module.exports.cleanDb=cleanDb;
