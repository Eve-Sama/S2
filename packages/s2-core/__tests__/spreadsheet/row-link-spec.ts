import { getContainer } from 'tests/util/helpers';
import { noop } from 'lodash';
import { PivotSheet } from '@/sheet-type';
import { S2Event, type S2Options } from '@/common';

const s2Options: S2Options = {
  width: 400,
  height: 400,
  hierarchyType: 'grid',
  totals: {
    row: {
      showSubTotals: true,
      subTotalsDimensions: ['province'],
      reverseSubLayout: true,
    },
  },
  interaction: {
    linkFields: ['province', 'city'],
  },
};

const s2DataCfg = {
  fields: {
    rows: ['province', 'city'],
    columns: ['type'],
    values: ['price', 'cost'],
    valueInCols: true,
  },
  data: [
    {
      province: '浙江',
      city: '义乌1',
      type: '笔',
      price: 1,
      cost: 9,
    },
    {
      province: '浙江',
      city: '义乌1',
      type: '笔',
      price: 10,
      cost: 99,
    },
    {
      province: '浙江',
      city: '义乌2',
      type: '笔',
      price: 1,
      cost: 6,
    },
    {
      province: '浙江',
      type: '笔',
      price: 2,
      cost: 2,
    },
    {
      province: '四川',
      city: '成都',
      type: '笔',
      price: 1,
      cost: 2,
    },
    {
      province: '四川',
      type: '笔',
      price: 1,
      cost: 2,
    },
  ],
};

describe('Row Text Link Tests', () => {
  let container: HTMLDivElement;

  let s2: PivotSheet;
  const linkFieldJump = jest.fn();

  beforeAll(() => {
    container = getContainer();
    s2 = new PivotSheet(container, s2DataCfg, s2Options);
    s2.render();
    s2.on(S2Event.GLOBAL_LINK_FIELD_JUMP, linkFieldJump);
  });

  test('should get correctly row leaf node when click row 浙江', () => {
    const rowNode = s2.facet.layoutResult.rowNodes[0]; // 浙江
    s2.emit(S2Event.ROW_CELL_CLICK, {
      stopPropagation: noop,
      target: {
        attr() {
          return {
            isLinkFieldText: true,
            cellData: rowNode,
          };
        },
      },
    } as any);

    expect(linkFieldJump).toBeCalledWith({
      key: 'province',
      cellData: rowNode,
      record: {
        province: '浙江',
        type: '笔',
        price: 2,
        cost: 2,
        rowIndex: 0,
      },
    });
  });

  test('should get correctly row leaf node when click row 义乌1', () => {
    const rowNode = s2.facet.layoutResult.rowNodes[2]; // 义乌1
    s2.emit(S2Event.ROW_CELL_CLICK, {
      stopPropagation: noop,
      target: {
        attr() {
          return {
            isLinkFieldText: true,
            cellData: rowNode,
          };
        },
      },
    } as any);

    expect(linkFieldJump).toBeCalledWith({
      key: 'city',
      cellData: rowNode,
      record: {
        province: '浙江',
        city: '义乌1',
        type: '笔',
        price: 10,
        cost: 99,
        rowIndex: 1,
      },
    });
  });

  test('should get correctly row leaf node when click row 四川', () => {
    const rowNode = s2.facet.layoutResult.rowNodes[4]; // 四川
    s2.emit(S2Event.ROW_CELL_CLICK, {
      stopPropagation: noop,
      target: {
        attr() {
          return {
            isLinkFieldText: true,
            cellData: rowNode,
          };
        },
      },
    } as any);

    expect(linkFieldJump).toBeCalledWith({
      key: 'province',
      cellData: rowNode,
      record: {
        province: '四川',
        type: '笔',
        price: 1,
        cost: 2,
        rowIndex: 3,
      },
    });
  });
});
