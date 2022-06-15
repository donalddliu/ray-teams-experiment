export function getNeighbors(structure, player) {
    const neighbors = [];
    let network = structure.split(",");

    network.forEach((n) => {
      const connection = n.split("-");
      const playerIndex = player.get("nodeId");
  
      if (playerIndex === parseInt(connection[0])) {
        neighbors.push(connection[1]);
      } else if (playerIndex === parseInt(connection[1])) {
        neighbors.push(connection[0]);
      }
    });
  
    return _.uniq(neighbors, true);
  }

export function getFullyConnectedLayer(game) {
    const activeNodes = [];
    const allNodes = [];
    // const activePlayers = game.players.filter(p => p.online === true && !p.get("inactive"));
    const activePlayers = game.players.filter(p => !p.get("inactive"));


    // activePlayers.forEach((p) => {
    //   activeNodes.push(`${p.get("nodeId")}`);
    // })

    game.players.forEach((p) => {
      // if (p.online === true && !p.get("inactve")) {
      if (!p.get("inactve")) {

        activeNodes.push(`${p.get("nodeId")}`);
      }
      allNodes.push(`${p.get("nodeId")}`);
    })

    game.players.forEach((p) => {
      // Only show active people
      // const newNeighbors = activeNodes.filter(id => parseInt(id) !== p.get("nodeId"))
      // p.set("neighbors", newNeighbors);

      // Show everyone, mark offline people as offline
      const newNeighbors = allNodes.filter(id => parseInt(id) !== p.get("nodeId"))
      p.set("neighbors", newNeighbors);
    })
}