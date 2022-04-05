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
      player.set("symbolSelected", name);
      handleButtonSelect(name);
      console.log(`${player.get("nodeId")} selected ${name}`);
  }

  render() {
    const { game, stage, player, name, selected} = this.props;


    return (
      <div className="symbol-container">
        <button className={selected ? "symbolButtonSelected" : "symbolButtonUnselected"} onClick={this.handleClick}>
            <img src={`images/symbols/tangrams/${name}.png`} height="80px" width="80px"/>
        </button>
     </div>
    );
  }
}
