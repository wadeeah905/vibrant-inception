import {Combo, ComboConfig, Model} from "@bryntum/schedulerpro";

export class ComboLegend extends Combo {
	static $name   = 'ComboLegend';
	static type = 'comboLegend';

	private static createIconTag(record) {
		return `<i class="b-fa b-fa-solid b-fa-circle" style="color: ${record.color};${(record.border ? `border-radius: 100%;border: ${record.border}` : "")}; margin-right: .3em"></i>`
	}
	private static createItemTag(record) {
		return `${this.createIconTag(record)} ${record.text}`;
	}

	static get configurable(): Partial<ComboConfig> {
		return {
			multiSelect: true,
			label: window.Helper.getTranslatedString('Legend'),
			editable: false,
			chipView : {
				iconTpl: (record: Model) => this.createIconTag(record)
			},
			listItemTpl: (record: Model) => this.createItemTag(record),
			displayField : 'text',
			valueField   : 'value',
			store: {
				fields: [
					'border',
					'type'
				]
			}
		}
	}
}