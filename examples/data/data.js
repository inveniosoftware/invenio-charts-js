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

const barData = [[{ user: 'Bob', downloads: 33 }, { user: 'Robin', downloads: 12 }, { user: 'Anne', downloads: 41 },
  { user: 'Mark', downloads: 16 }, { user: 'Joe', downloads: 59 }, { user: 'Eve', downloads: 38 },
  { user: 'Karen', downloads: 21 }, { user: 'Kirsty', downloads: 25 }, { user: 'Chris', downloads: 30 },
  { user: 'Lisa', downloads: 47 }, { user: 'Tom', downloads: 5 }, { user: 'Stacy', downloads: 20 },
  { user: 'Charles', downloads: 13 }, { user: 'Mary', downloads: 29 }],

[{ user: 'Bob', downloads: 15 }, { user: 'Robin', downloads: 25 }, { user: 'Anne', downloads: 44 },
  { user: 'Mark', downloads: 4 }, { user: 'Joe', downloads: 65 }, { user: 'Eve', downloads: 21 },
  { user: 'Karen', downloads: 28 }, { user: 'Kirsty', downloads: 35 }, { user: 'Chris', downloads: 50 },
  { user: 'Lisa', downloads: 12 }, { user: 'Tom', downloads: 16 }, { user: 'Stacy', downloads: 15 },
  { user: 'Charles', downloads: 5 }, { user: 'Mary', downloads: 75 }, { user: 'Giannis', downloads: 25 }]];

const lineData = [[{ date: '1-May-12', value: 58.13 }, { date: '30-Apr-12', value: 53.98 }, { date: '27-Apr-12', value: 67 },
  { date: '26-Apr-12', value: 89.7 }, { date: '25-Apr-12', value: 99 }, { date: '24-Apr-12', value: 130.28 },
  { date: '23-Apr-12', value: 166.7 }, { date: '20-Apr-12', value: 234.98 }, { date: '19-Apr-12', value: 345.44 },
  { date: '18-Apr-12', value: 443.34 }, { date: '17-Apr-12', value: 543.7 }, { date: '16-Apr-12', value: 580.13 },
  { date: '13-Apr-12', value: 605.23 }, { date: '12-Apr-12', value: 622.77 }, { date: '11-Apr-12', value: 626.2 },
  { date: '10-Apr-12', value: 628.44 }, { date: '9-Apr-12', value: 636.23 }, { date: '5-Apr-12', value: 633.68 },
  { date: '4-Apr-12', value: 624.31 }, { date: '3-Apr-12', value: 629.32 }, { date: '2-Apr-12', value: 618.63 },
  { date: '30-Mar-12', value: 599.55 }, { date: '29-Mar-12', value: 609.86 }, { date: '28-Mar-12', value: 617.62 },
  { date: '27-Mar-12', value: 614.48 }, { date: '26-Mar-12', value: 606.98 }],

[{ date: '10-May-12', value: 99.55 }, { date: '8-May-12', value: 76.86 }, { date: '6-May-12', value: 67.62 },
  { date: '4-May-12', value: 64.48 }, { date: '2-May-12', value: 60.98 }, { date: '1-May-12', value: 58.13 },
  { date: '30-Apr-12', value: 53.98 }, { date: '27-Apr-12', value: 67 }, { date: '26-Apr-12', value: 89.7 },
  { date: '25-Apr-12', value: 99 }, { date: '24-Apr-12', value: 90.28 }, { date: '23-Apr-12', value: 106.7 },
  { date: '20-Apr-12', value: 94.98 }, { date: '19-Apr-12', value: 85.44 }, { date: '18-Apr-12', value: 73.34 },
  { date: '17-Apr-12', value: 53.7 }, { date: '16-Apr-12', value: 50.13 }, { date: '13-Apr-12', value: 65.23 },
  { date: '12-Apr-12', value: 62.77 }, { date: '11-Apr-12', value: 66.2 }, { date: '10-Apr-12', value: 68.44 },
  { date: '9-Apr-12', value: 66.23 }, { date: '5-Apr-12', value: 63.68 }, { date: '4-Apr-12', value: 64.31 },
  { date: '3-Apr-12', value: 69.32 }, { date: '2-Apr-12', value: 61.63 }]];

const data = {
  barData, lineData
};
export default data;
