import { TableSheet, BaseEvent, S2Event } from '@antv/s2';
import '@antv/s2/dist/s2.min.css';

class HiddenInteraction extends BaseEvent {
  bindEvents() {
    // 列头双击
    this.spreadsheet.on(S2Event.COL_CELL_DOUBLE_CLICK, (event) => {
      const cell = this.spreadsheet.getCell(event.target);
      const meta = cell.getMeta();
      this.spreadsheet.hideColumns([meta.field]);
    });

    this.spreadsheet.on(S2Event.LAYOUT_TABLE_COL_EXPANDED, (cell) => {
      console.log('列头展开:', cell);
    });

    this.spreadsheet.on(
      S2Event.LAYOUT_TABLE_COL_HIDDEN,
      (currentHiddenColumnsInfo, hiddenColumnsDetail) => {
        console.log('列头隐藏:', currentHiddenColumnsInfo, hiddenColumnsDetail);
      },
    );
  }
}

class ContextMenuInteraction extends BaseEvent {
  bindEvents() {
    // 禁止弹出右键菜单
    this.spreadsheet.on(S2Event.GLOBAL_CONTEXT_MENU, (event) => {
      event.preventDefault();
      console.log('右键', event);
    });
  }
}

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/94a016a4-6672-41b1-aef3-8f6094cd2c18.json',
)
  .then((res) => res.json())
  .then((data) => {
    const container = document.getElementById('container');
    const s2DataConfig = {
      fields: {
        columns: ['province', 'city', 'type', 'price'],
      },
      data,
    };

    const s2options = {
      width: 600,
      height: 300,
      tooltip: {
        showTooltip: true,
      },
      customInteractions: [
        {
          key: 'HiddenInteraction',
          interaction: HiddenInteraction,
        },
        {
          key: 'ContextMenuInteraction',
          interaction: ContextMenuInteraction,
        },
      ],
    };
    const s2 = new TableSheet(container, s2DataConfig, s2options);

    s2.render();
  });
