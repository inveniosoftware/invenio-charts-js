/*
 * This file is part of Invenio.
 * Copyright (C) 2017 CERN.
 *
 * Invenio is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 2 of the
 * License, or (at your option) any later version.
 *
 * Invenio is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Invenio; if not, write to the Free Software Foundation, Inc.,
 * 59 Temple Place, Suite 330, Boston, MA 02111-1307, USA.
 *
 * In applying this license, CERN does not
 * waive the privileges and immunities granted to it by virtue of its status
 * as an Intergovernmental Organization or submit itself to any jurisdiction.
 */

/* eslint-disable */
const testData = {};

testData.bar = [
  {
    label: 'pageviews',
    data: [
      {
        term: 'CH',
        count: 675866
      },
      {
        term: 'FR',
        count: 612115
      },
      {
        term: 'US',
        count: 385141
      },
      {
        term: 'GB',
        count: 300612
      }
    ]
  }
];

testData.barUpdate = [
  {
    label: 'pageviews',
    data: [
      {
        term: 'CH',
        count: 675866
      },
      {
        term: 'FR',
        count: 612115
      },
      {
        term: 'US',
        count: 385141
      },
      {
        term: 'GB',
        count: 300612
      },
      {
        term: 'US',
        count: 140612
      }
    ]
  }
];

testData.line = [
  {
    label: 'dataset0',
    data: [
      {
        time: 1483228800000,
        count: 4259339
      },
      {
        time: 1485907200000,
        count: 6247896
      },
      {
        time: 1488326400000,
        count: 4845656
      },
      {
        time: 1491004800000,
        count: 4702646
      },
      {
        time: 1493596800000,
        count: 5258057
      },
      {
        time: 1496275200000,
        count: 5219734
      },
      {
        time: 1498867200000,
        count: 1944084
      }
    ]
  },
  {
    label: 'dataset1',
    data: [
      {
        time: 1483228800000,
        count: 3357363
      },
      {
        time: 1485907200000,
        count: 2955902
      },
      {
        time: 1488326400000,
        count: 3710712
      },
      {
        time: 1491004800000,
        count: 3428567
      },
      {
        time: 1493596800000,
        count: 3524159
      },
      {
        time: 1496275200000,
        count: 3362457
      },
      {
        time: 1498867200000,
        count: 1618705
      }
    ]
  }
];

testData.lineUpdate = [
  {
     label: 'dataset0',
     data: [
       {
          time: 1483228800000,
          count: 5259339
       },
       {
          time: 1485907200000,
          count: 7247896
       },
       {
          time: 1488326400000,
          count: 2845656
       },
       {
          time: 1491004800000,
          count: 4702646
       },
       {
          time: 1493596800000,
          count: 6758057
       },
       {
          time: 1496275200000,
          count: 4419734
       },
       {
          time: 1498867200000,
          count: 1244084
       }
     ]
  },
   {
      label: 'dataset1',
      data: [
         {
            "time":1483228800000,
            "count":3357363
         },
         {
            "time":1485907200000,
            "count":2955902
         },
         {
            "time":1488326400000,
            "count":3710712
         },
         {
            "time":1491004800000,
            "count":3428567
         },
         {
            "time":1493596800000,
            "count":3524159
         },
         {
            "time":1496275200000,
            "count":3362457
         },
         {
            "time":1498867200000,
            "count":1618705
         }
      ]
   }
];

export default testData;
