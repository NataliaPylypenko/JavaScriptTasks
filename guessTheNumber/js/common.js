const myList = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const binarySearch = (list, item) => {
    let left = 0;
    let right = list.length - 1;
    let mid;

    while (left <= right) {
        mid = Math.floor((left + right) / 2);

        if (item === list[mid]) {
            return mid;
        } else if (item < list[mid]) {
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }

    return -1;
};

console.log(binarySearch(myList, 3));