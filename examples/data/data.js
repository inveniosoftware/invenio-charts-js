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
const dataCDS = {};

// Elasticsearch responses from Invenio-Stats
dataCDS.response1 = {
  "downloads": {
    "type": "bucket",
    "key_type": "date",
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
      },
      {
         "value": 21.0,
         "key": 1481155200000
      },
      {
         "value": 81.0,
         "key": 1481241600000
      },
      {
         "value": 21.0,
         "key": 1481328000000
      },
      {
         "value": 47.0,
         "key": 1481414400000
      },
      {
         "value": 14.0,
         "key": 1481500800000
      },
      {
         "value": 21.0,
         "key": 1481587200000
      },
      {
         "value": 41.0,
         "key": 1481673600000
      },
      {
         "value": 18.0,
         "key": 1481760000000
      },
      {
         "value": 14.0,
         "key": 1481846400000
      },
      {
         "value": 41.0,
         "key": 1481932800000
      },
      {
         "value": 21.0,
         "key": 1482019200000
      },
      {
         "value": 35.0,
         "key": 1482105600000
      },
      {
         "value": 2.0,
         "key": 1482192000000
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
      },
      {
       "value": 2.0,
       "key": 1481155200000
      },
      {
       "value": 8.0,
       "key": 1481241600000
      },
      {
       "value": 2.0,
       "key": 1481328000000
      },
      {
       "value": 4.0,
       "key": 1481414400000
      },
      {
       "value": 10.0,
       "key": 1481500800000
      },
      {
       "value": 2.0,
       "key": 1481587200000
      },
      {
       "value": 4.0,
       "key": 1481673600000
      },
      {
       "value": 12.0,
       "key": 1481760000000
      },
      {
       "value": 10.0,
       "key": 1481846400000
      },
      {
       "value": 4.0,
       "key": 1481932800000
      },
      {
       "value": 12.0,
       "key": 1482019200000
      },
      {
       "value": 16.0,
       "key": 1482105600000
      },
      {
       "value": 2.0,
       "key": 1482192000000
      }
    ]
  },
  "views": {
    "type": "bucket",
    "keyType": "date",
    "interval": "week",
    "buckets": [
      {
        "value": 80.0,
        "key": 1480550400000
      },
      {
        "value": 31.0,
        "key": 1480636800000
      },
      {
        "value": 51.0,
        "key": 1480723200000
      },
      {
        "value": 11.0,
        "key": 1480809600000
      },
      {
        "value": 121.0,
        "key": 1480896000000
      },
      {
        "value": 151.0,
        "key": 1480982400000
      },
      {
        "value": 34.0,
        "key": 1481068800000
      },
      {
        "value": 45.0,
        "key": 1481155200000
      },
      {
        "value": 102.0,
        "key": 1481241600000
      },
      {
        "value": 75.0,
        "key": 1481328000000
      },
      {
        "value": 77.0,
        "key": 1481414400000
      },
      {
        "value": 94.0,
        "key": 1481500800000
      },
      {
        "value": 11.0,
        "key": 1481587200000
      },
      {
        "value": 5.0,
        "key": 1481673600000
      },
      {
        "value": 25.0,
        "key": 1481760000000
      },
      {
        "value": 84.0,
        "key": 1481846400000
      },
      {
        "value": 23.0,
        "key": 1481932800000
      },
      {
        "value": 66.0,
        "key": 1482019200000
      },
      {
        "value": 45.0,
        "key": 1482105600000
      },
      {
        "value": 12.0,
        "key": 1482192000000
      }
    ]
  }
}
dataCDS.response2 = {
  "pageviews": {
    "type": "bucket",
    "key_type": "other",
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
        },
        {
           "key": 'IT',
           "value": 153017
        },
        {
           "key": 'DE',
           "value": 111927
        },
        {
           "key": 'GR',
           "value": 281636
        },
        {
           "key": 'PK',
           "value": 204673
        },
        {
           "key": 'ES',
           "value": 183742
        },
        {
           "key": 'PL',
           "value": 119485
        },
        {
           "key": 'CA',
           "value": 53971
        },
        {
           "key": 'TR',
           "value": 36127
        },
        {
           "key": 'NL',
           "value": 75974
        },
        {
           "key": 'NO',
           "value": 55996
        },
        {
           "key": 'BR',
           "value": 40850
        },
        {
           "key": 'BE',
           "value": 98797
        },
        {
           "key": 'RU',
           "value": 26022
        },
        {
           "key": 'PT',
           "value": 49180
        },
        {
           "key": 'SE',
           "value": 61965
        },
        {
           "key": 'FI',
           "value": 33684
        },
        {
           "key": 'AT',
           "value": 30898
        },
        {
           "key": 'AU',
           "value": 15521
        },
        {
           "key": 'RO',
           "value": 45462
        },
        {
           "key": 'DK',
           "value": 77261
        },
        {
           "key": 'CZ',
           "value": 15707
        },
        {
           "key": 'MX',
           "value": 30205
        },
        {
           "key": 'ID',
           "value": 15539
        },
        {
           "key": 'JP',
           "value": 21179
        },
        {
           "key": 'IR',
           "value": 20635
        },
        {
           "key": 'HU',
           "value": 45375
        },
        {
           "key": 'BG',
           "value": 13254
        }
    ]
  }
}
dataCDS.response3 = {
  "pageviews": {
    "type": "bucket",
    "key_type": "other",
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
      },
      {
         term:  'IT',
         count:  153017
      },
      {
         term:  'DE',
         count:  111927
      },
      {
         term:  'GR',
         count:  281636
      },
      {
         term:  'PK',
         count:  204673
      },
      {
         term:  'ES',
         count:  183742
      },
      {
         term:  'PL',
         count:  119485
      },
      {
         term:  'CA',
         count:  53971
      },
      {
         term:  'TR',
         count:  36127
      },
      {
         term:  'NL',
         count:  75974
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
        },
        {
           term:  'IT',
           count:  53017
        },
        {
           term:  'DE',
           count:  11927
        },
        {
           term:  'GR',
           count:  21636
        },
        {
           term:  'PK',
           count:  24673
        },
        {
           term:  'ES',
           count:  83742
        },
        {
           term:  'PL',
           count:  19485
        },
        {
           term:  'CA',
           count:  3971
        },
        {
           term:  'TR',
           count:  6127
        },
        {
           term:  'NL',
           count:  7974
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
         },
         {
            term:  'IT',
            count:  105017
         },
         {
            term:  'DE',
            count:  22927
         },
         {
            term:  'GR',
            count:  42636
         },
         {
            term:  'PK',
            count:  48673
         },
         {
            term:  'ES',
            count:  152742
         },
         {
            term:  'PL',
            count:  38485
         },
         {
            term:  'CA',
            count:  8971
         },
         {
            term:  'TR',
            count:  12127
         },
         {
            term:  'NL',
            count:  14974
         }
     ]
 }

}

export default dataCDS;
