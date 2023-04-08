import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Item {
    [key: string]: string | number;
    playerName: string,
    playerTag: string,
		playerTownHall: number,
		playerRole: string,
		trophies: number,
		total_stars: number,
		total_destruction: number,
		total_map_position_difference: number,
		total_attacks: number,
		attacks_given: number,
		average_stars: number,
		average_destruction: number,
		average_map_position_difference: number,
		attack_usage_rate: number
}

@Component({
  selector: 'app-sortable-table',
  templateUrl: './sortable-table.component.html',
  styleUrls: ['./sortable-table.component.css']
})
export class SortableTableComponent {
  title = 'ArkAprentice';

  items: Item[] = [];
  sortedItems: Item[] = [];

  sortedColumn: string = '';
  isAscending: boolean = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<Item[]>('https://mi45latbph.execute-api.us-east-1.amazonaws.com/dev/getAttackData').subscribe(data => {
      data = Object.values(data)
      this.items = data;
      console.log(data)
      this.sortedItems = [...data];
    });
  }

  sortTable(columnName: string) {
    if (this.sortedColumn === columnName) {
      this.isAscending = !this.isAscending;
    } else {
      this.sortedColumn = columnName;
      this.isAscending = false;
    }

    this.sortedItems.sort((a, b) => {
      let aValue = a[columnName];
      let bValue = b[columnName];

      if (columnName === 'playerRole') {
        const aRank = getPlayerRoleValue(String(aValue));
        const bRank = getPlayerRoleValue(String(bValue));
        if (aRank < bRank) {
          return this.isAscending ? -1 : 1;
        } else if (aRank > bRank) {
          return this.isAscending ? 1 : -1;
        } else {
          return 0;
        }
      }

      if (typeof aValue === 'string' && !isNaN(Number(aValue))) {
        aValue = Number(aValue);
      }

      if (typeof bValue === 'string' && !isNaN(Number(bValue))) {
        bValue = Number(bValue);
      }

      if (aValue < bValue) {
        return this.isAscending ? -1 : 1;
      } else if (aValue > bValue) {
        return this.isAscending ? 1 : -1;
      } else {
        return 0;
      }
    });
  }

  getColumn(item: Item, columnName: string): string | number {
    if (!isNaN(Number(item[columnName]))){
      return Math.round(Number(item[columnName]) * 100) / 100
    }
    return item[columnName];
  }
}

function getPlayerRoleValue(role: string): number {
  switch (role) {
    case 'Leader':
      return 0;
    case 'Co-Leader':
      return 1;
    case 'Elder':
      return 2;
    case 'Member':
      return 3;
    default:
      return 4;
  }
}
