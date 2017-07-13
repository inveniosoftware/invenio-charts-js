import _ from 'lodash';
import config from './config';
import './styles.scss';
import { BarGraph } from '../../src/index';
import { barData1, barData2 } from '../data/data';

let data1 = _.cloneDeep(barData1);
let data2 = _.cloneDeep(barData2);
let toggle = true;

const graph = new BarGraph(config);
graph.render(data1);

function update() {
  toggle = !toggle;
  if (toggle) {
    data1 = _.cloneDeep(barData1);
    graph.render(data1);
  } else {
    data2 = _.cloneDeep(barData2);
    graph.render(data2);
  }
}

if (document.getElementById('option')) {
  document.getElementById('option').addEventListener('click', update);
}
