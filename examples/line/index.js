import _ from 'lodash';
import config from './config';
import './styles.scss';
import { LineGraph } from '../../src/index';
import { lineData1, lineData2 } from '../data/data';

let arr1 = _.cloneDeep(lineData1);
let arr2 = _.cloneDeep(lineData2);
let toggle = true;

const graph = new LineGraph(config);
graph.render(arr1);

function update() {
  toggle = !toggle;
  if (toggle) {
    arr1 = _.cloneDeep(lineData1);
    graph.render(arr1);
  } else {
    arr2 = _.cloneDeep(lineData2);
    graph.render(arr2);
  }
}

if (document.getElementById('option')) {
  document.getElementById('option').addEventListener('click', update);
}
