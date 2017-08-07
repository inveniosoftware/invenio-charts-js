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

// Test data for LineGraph
testData.line = {
  "downloads": {
    "type": "bucket",
    "keyType": "date",
    "interval": "week",
    "buckets": [
      {
         "value": 61.0,
         "key": 1480550400000
      },
      {
         "value": 11.0,
         "key": 1480636800000
      },
      {
         "value": 31.0,
         "key": 1480723200000
      },
      {
         "value": 31.0,
         "key": 1480809600000
      },
      {
         "value": 71.0,
         "key": 1480896000000
      },
      {
         "value": 71.0,
         "key": 1480982400000
      },
      {
         "value": 91.0,
         "key": 1481068800000
      }
    ]
  },
  "uploads": {
    "type": "bucket",
    "keyType": "date",
    "interval": "week",
    "buckets": [
      {
       "value": 6.0,
       "key": 1480550400000
      },
      {
       "value": 1.0,
       "key": 1480636800000
      },
      {
       "value": 3.0,
       "key": 1480723200000
      },
      {
       "value": 3.0,
       "key": 1480809600000
      },
      {
       "value": 7.0,
       "key": 1480896000000
      },
      {
       "value": 7.0,
       "key": 1480982400000
      },
      {
       "value": 9.0,
       "key": 1481068800000
      }
    ]
  }
}
testData.lineUpdate = {
  "downloads": {
    "type": "bucket",
    "keyType": "date",
    "interval": "week",
    "buckets": [
      {
         "value": 41.0,
         "key": 1480550400000
      },
      {
         "value": 5.0,
         "key": 1480636800000
      },
      {
         "value": 51.0,
         "key": 1480723200000
      },
      {
         "value": 21.0,
         "key": 1480809600000
      },
      {
         "value": 55.0,
         "key": 1480896000000
      },
      {
         "value": 45.0,
         "key": 1480982400000
      },
      {
         "value": 66.0,
         "key": 1481068800000
      }
    ]
  },
  "uploads": {
    "type": "bucket",
    "keyType": "date",
    "interval": "week",
    "buckets": [
      {
       "value": 3.0,
       "key": 1480550400000
      },
      {
       "value": 2.0,
       "key": 1480636800000
      },
      {
       "value": 3.0,
       "key": 1480723200000
      },
      {
       "value": 6.0,
       "key": 1480809600000
      },
      {
       "value": 12.0,
       "key": 1480896000000
      },
      {
       "value": 14.0,
       "key": 1480982400000
      },
      {
       "value": 4.0,
       "key": 1481068800000
      }
    ]
  }
}

// Test data for BarGraph
testData.bar = {
  "pageviews": {
    "type": "bucket",
    "keyType": "other",
    "buckets": [
        {
           "key": 'CH',
           "value": 375866
        },
        {
           "key": 'FR',
           "value": 412115
        },
        {
           "key": 'US',
           "value": 685141
        },
        {
           "key": 'GB',
           "value": 250612
        },
        {
           "key": 'IN',
           "value": 166008
        }
    ]
  }
}
testData.barUpdate = {
  "pageviews": {
    "type": "bucket",
    "keyType": "other",
    "buckets": [
        {
           "key": 'CH',
           "value": 175866
        },
        {
           "key": 'FR',
           "value": 812115
        },
        {
           "key": 'US',
           "value": 485141
        },
        {
           "key": 'GB',
           "value": 150612
        },
        {
           "key": 'IN',
           "value": 366008
        }
    ]
  }
}

// Test data for GroupedBarGraph
testData.groupedBar = {
  "pageviews": {
    "type": "bucket",
    "keyType": "other",
    "buckets": [
      {
         term:  'CH',
         count:  375866
      },
      {
         term:  'FR',
         count:  412115
      },
      {
         term:  'US',
         count:  685141
      },
      {
         term:  'GB',
         count:  250612
      },
      {
         term:  'IN',
         count:  166008
      }
    ]
  },
  "downloads": {
    "type": "bucket",
    "keyType": "other",
    "buckets": [
        {
           term:  'CH',
           count:  75866
        },
        {
           term:  'FR',
           count:  42115
        },
        {
           term:  'US',
           count:  65141
        },
        {
           term:  'GB',
           count:  50612
        },
        {
           term:  'IN',
           count:  66008
        }
    ]
  },
  "uploads": {
     "type": "bucket",
     "keyType": "other",
     "buckets": [
         {
            term:  'CH',
            count:  150866
         },
         {
            term:  'FR',
            count:  85115
         },
         {
            term:  'US',
            count:  130141
         },
         {
            term:  'GB',
            count:  100612
         },
         {
            term:  'IN',
            count:  120008
         }
     ]
   }
 }
testData.groupedBarUpdate = {
   "pageviews": {
     "type": "bucket",
     "keyType": "other",
     "buckets": [
       {
          term:  'CH',
          count:  175866
       },
       {
          term:  'FR',
          count:  612115
       },
       {
          term:  'US',
          count:  485141
       },
       {
          term:  'GB',
          count:  280612
       },
       {
          term:  'IN',
          count:  456008
       }
     ]
   },
   "downloads": {
     "type": "bucket",
     "keyType": "other",
     "buckets": [
         {
            term:  'CH',
            count:  35866
         },
         {
            term:  'FR',
            count:  62115
         },
         {
            term:  'US',
            count:  85141
         },
         {
            term:  'GB',
            count:  20612
         },
         {
            term:  'IN',
            count:  36008
         }
     ]
   },
   "uploads": {
      "type": "bucket",
      "keyType": "other",
      "buckets": [
          {
             term:  'CH',
             count:  170866
          },
          {
             term:  'FR',
             count:  45115
          },
          {
             term:  'US',
             count:  140141
          },
          {
             term:  'GB',
             count:  180612
          },
          {
             term:  'IN',
             count:  110008
          }
      ]
    }
}

export default testData;
