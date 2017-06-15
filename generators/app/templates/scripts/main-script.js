// Description:
//  <%= description %>
//
// Dependencies:
//  <%= dependencies %>
//
// Configuration:
//  <%= configurations %>
//
// Commands:
//  <%= commands %>
//

function loadConfig(str) {
  try {
    if (typeof str === 'undefined') return [];
    else return JSON.parse(str);
  } catch (e) {
    return console.error(e);
  }
}


module.exports = function(robot) {

  robot.hear(/<%= name %>/g, function(msg){
    msg.send('Hello <%= description %>!!');
  });

};
