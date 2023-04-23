const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.


describe("Rover class", function() {

  it("constructor sets position and default values for mode and generatorWatts", function() {
   let rover = new Rover(98382);
   expect(rover.position).toEqual(98382);
   expect(rover.mode).toEqual('NORMAL');
   expect(rover.generatorWatts).toEqual(110);
   expect( function() { new Rover();}).toThrow(new Error('Rover position required.'));
 });

  it("response returned by receiveMessage contains name of message", function() {
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
    let message = new Message('Test message with two commands', commands);
    let rover = new Rover(98382);
    let response = rover.receiveMessage(message);
    expect(response.message).toEqual('Test message with two commands');
  });

  it("response returned by receiveMessage includes two results if two commands are sent in the message", function() {
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
    let message = new Message('Test message with two commands', commands);
    let rover = new Rover(98382);
    let response = rover.receiveMessage(message);
    expect(response.results.length).toEqual(commands.length);
    // expect(response.results[0]).toEqual(commands[0]);
    // expect(response.results[1]).toEqual(commands[1]);
  });

  it("responds correctly to Status Check command", function() {
    let commands = [new Command('STATUS_CHECK')];
    let message = new Message('Check rover status', commands);
    let rover = new Rover(98382);
    let response = rover.receiveMessage(message);
    let roverUpdate = {completed: true, roverStatus: {mode: rover.mode, generatorWatts: rover.generatorWatts, position: rover.position}}
    expect(response.results[0].completed).toEqual(true);
    expect(response.results[0].roverStatus).toEqual({mode: rover.mode, generatorWatts: rover.generatorWatts, position: rover.position});
    // let roverUpdate = {mode: rover.mode, generatorWatts: rover.generatorWatts, position: rover.position};
    // expect(response.results).toContain({roverStatus: roverUpdate});
    // expect(response.results[0].roverStatus).toEqual(roverStatus);
    // expect(response.results).toEqual(roverStatus)
  });

  it("responds correctly to mode change command", function() {
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER')];
    let message = new Message('Change mode to low power', commands);
    let rover = new Rover(98382);
    let response = rover.receiveMessage(message);
    expect(response.results[0].completed).toEqual(true);
    expect(rover.mode).toEqual('LOW_POWER');
    // expect(response.results[0].roverStatus.mode).toEqual('LOW_POWER')
  });

  it("responds with false completed value when attempting to move in LOW_POWER mode", function() {
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('MOVE', 12345)];
    let message = new Message('Move bitch get out da way', commands);
    let rover = new Rover(98382);
    let response = rover.receiveMessage(message);
    expect(response.results[0].completed).toEqual(true);
    expect(response.results[1].completed).toEqual(false);
  });

  it("responds with position for move command", function() {
    let commands = [new Command('MOVE', 12345)];
    let message = new Message('Move bitch get out da way', commands);
    let rover = new Rover(98382);
    let response = rover.receiveMessage(message);
    expect(response.results[0].completed).toEqual(true);
    expect(rover.position).toEqual(12345);
  })

});
