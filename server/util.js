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

