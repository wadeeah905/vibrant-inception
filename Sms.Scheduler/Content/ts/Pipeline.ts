import {Model, Store, StringHelper, TreeGrid, TreeGridConfig} from "@bryntum/schedulerpro";
import {AbsenceOrder, BaseOrder, ServiceOrder} from "./Model/ServiceOrder";

export class Pipeline extends TreeGrid {
	private recordsClasses = new Map<string, WeakSet<Model>>();
	pipelineFirstLineData: () => string;
	pipelineSecondLineData: () => string;

	construct(config?: Partial<TreeGridConfig>) {
		super.construct(config);

		this.on("expandNode", this.reassignRowsClasses, this);

		//Overriding expandAll in order to reassign row's classes.
		//This cannot be done using an expandAll function in this class because it is assign by the super.construct
		const expandAll = this.expandAll;
		this.expandAll = async () => {
			await expandAll();
			this.reassignRowsClasses();
		}
	}

	static get $name() {
		return 'CRMPipeline';
	}

	// Factoryable type name
	static get type() {
		return 'CRMpipeline';
	}

	static get configurable(): Partial<TreeGridConfig> {
		return {
			rowHeight: 25,
			features: {
				cellEdit: false,
				rowCopyPaste: false,
				regionResize: true,
				tree: true,
				cellMenu: {
					items: {
						removeRow: false
					},
					processItems({items, column, record}) {
						if ((record as BaseOrder).type !== 'ServiceOrder') {
							items.OpenOrderButton = false;
							items.openDispatches = false;
						}
					}
				},
				cellTooltip: {
					allowOver: true,
					scrollable: true,
					width: '28em',
					tooltipRenderer: (data) => { return ""; }
				}
			},
			selectionMode: {
				cell: false,
				deselectOnClick: true,
			},
			columns: [
				{
					type: 'tree',
					field: 'name',
					text: window.Helper.String.getTranslatedString("Pipeline"),
					sortable: false,
					cellMenuItems: {
						OpenOrderButton: {
							text: `${window.Helper.getTranslatedString("Open Order")}`,
							icon: 'b-fa b-fa-fw b-fa-folder-open',
							onItem: (item) => {
								window.open(`#/Crm.Service/ServiceOrder/DetailsTemplate/${item.record.get('id')}`, "_blank");
							}
						},
						openDispatches: {
							text: `${window.Helper.getTranslatedString("Open Dispatch")}`,
							icon: 'zmdi zmdi-layers',
							onItem: (item) => {
								window.open(`#/Crm.Service/ServiceOrder/DetailsTemplate/${item.record.get('id')}?tab=tab-dispatches`, "_blank");
							}
						}
					},
					htmlEncode: false,
					renderer: ({record, size, grid}) => {
						if (!record.isLeaf) {
							return `${StringHelper.encodeHtml((record as BaseOrder).name)} (${(record.allChildren as BaseOrder[]).filter(c => c.isLeaf).length})`;
						}
						(record as BaseOrder).cls = "draggable";
						if ((record as BaseOrder).type === 'ServiceOrder') {
							return `<dl>
                                <dd>
									<p class='serviceorder-title p-0 m-5'>
										${StringHelper.encodeHtml((record as ServiceOrder).OriginalData.OrderNo)} ${(grid as Pipeline).pipelineFirstLineData() != null ? '- ' + StringHelper.encodeHtml((record as ServiceOrder).getRowData((grid as Pipeline).pipelineFirstLineData())) : ""}
										${(record as ServiceOrder).OriginalData.Latitude && (record as ServiceOrder).OriginalData.Longitude ? `<i class='zmdi zmdi-pin zmdi-hc-fw' title='${(record as ServiceOrder).OriginalData.Latitude}, ${(record as ServiceOrder).OriginalData.Longitude}'></i>` : ""}
									</p>
									<p class="p-0 m-5">
										${(grid as Pipeline).pipelineSecondLineData() != null ? StringHelper.encodeHtml((record as ServiceOrder).getRowData((grid as Pipeline).pipelineSecondLineData())) : ""}
									</p>
								</dd>
							</dl>`;
						} else {
							return `<dl>
                                <dd>
                                    ${StringHelper.encodeHtml((record as AbsenceOrder).name)} (${StringHelper.encodeHtml((record as AbsenceOrder).AbsenceType)})
                                </dd>
                            </dl>`;
						}
					}
				}
			],
			store: {
				modelClass: BaseOrder
			},

		};
	}

	private reassignRowsClasses() {
		const allRecords = (this.store as Store).allRecords;
		allRecords.forEach(r => {
			const row = this.getRowFor(r);

			if (row) {
				//This creates an object with one entry per css class and value of true/false to indicate if the class is enabled or not for this record
				const classes = Object.fromEntries(Array.from(this.recordsClasses.keys()).map(cls => ([cls, this.recordsClasses.get(cls).has(r)])));

				row.assignCls(classes);
			}
		});
	}

	assignClassToRecords(cls: string, records: WeakSet<Model>) {
		this.recordsClasses.set(cls, records);

		this.reassignRowsClasses();
	}

	unassignClassFromAllRecords(cls: string) {
		this.recordsClasses.set(cls, new WeakSet());

		this.reassignRowsClasses();
	}
}
