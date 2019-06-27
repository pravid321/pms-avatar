import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'searchresult',
    pure: false
})
export class SearchResultPipe implements PipeTransform {

    transform(dataList: any, filterText: string, filterType: string) {
        if (filterType == 'timezone') {
            if (filterText == '' || filterText.length < 3)
                return dataList;
            else
                return dataList.filter(timeZone => timeZone.toLowerCase().includes(filterText.toLowerCase()));
        } else if (filterType == 'roomCode') {
            return (filterText == 'All Room Types') ? dataList : dataList.filter(roomItem => roomItem.roomCode == filterText);
        }
    }
}