/*
 * Basic Dialogue Plugin
 *
 * This plugin plans to do dialog in the style of an RPG.
 *
 * This plugin is loaded by default.
 */

class Dialogue {
	constructor(character,text) {
		this.dbox = new Object();
		// default style
		this.dbox.set("background","black");
		this.dbox.set("color","white");
		this.dbox.set("stroke",{
			color: "white",
			width: 5
		})
		this.dbox.set("rounding",5);
		this.dbox.set("padding",10);
		this.dbox.set("margin",20);
		let name = character.info.name;
		this.dbox.object().html(text);
	}
}