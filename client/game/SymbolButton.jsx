import React from 'react';
export default class SymbolButton extends React.Component {
/* 
  @prop id - id of the symbol
  @prop name - name of the symbol (TESTING PURPOSES)
*/
  constructor(props) {
      super(props);
  }

  // When button is selected, player sets the id of the button he selected
  handleClick = () => {
      const { game, player, stage, name, handleButtonSelect } = this.props;
      if (!player.get("submitted")) {
        player.set("symbolSelected", name);
        handleButtonSelect(name);
      }
      // console.log(`${player.get("nodeId")} selected ${name}`);
  }

  render() {
    const { game, stage, player, name, selected, totalSymbols} = this.props;
    const size = 100/totalSymbols;
    return (
      <div className="symbol-container">
        <button className={`${selected ? "symbolButtonSelected" : "symbolButtonUnselected"} ${player.get("submitted") ? "noHover" : ""}` } 
          onClick={this.handleClick}>
            <img src={`images/symbols/tangrams/${name}.png`} style={{maxWidth:"100%", maxHeight:`100%`}}/>
        </button>
     </div>
    );
  }
}
