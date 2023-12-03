function randomInteger(min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
}

const getUserResponseInteger = (message) => {
    let userResponse;
    do {
        userResponse = parseInt(prompt(message));
    } while (!Number.isInteger(userResponse));

    return userResponse;
};

const guessTheNumber = () => {
    const riddledNumber = randomInteger(1, 100);

    for (let i = 0; i < 7; i++) {
        let userNumber = getUserResponseInteger('Guess The Number From 1 To 100');

        if (riddledNumber === userNumber) {
            alert('You are winner!');
            return;
        } else if (riddledNumber < userNumber) {
            alert('Less!')
        } else if (riddledNumber > userNumber) {
            alert('More!')
        }
    }

    alert('You are loser! You had seven attempts only!')
};

guessTheNumber();

// -------------------------------

// const binarySearch = (list, item) => {
//     let left = 0;
//     let right = list.length - 1;
//     let mid;
//
//     while (left <= right) {
//         mid = Math.floor((left + right) / 2);
//
//         if (item === list[mid]) {
//             return mid;
//         } else if (item < list[mid]) {
//             right = mid - 1;
//         } else {
//             left = mid + 1;
//         }
//     }
//
//     return -1;
// };
//
// const myList = [1, 2, 3, 4, 5, 6, 7, 8, 9];
// console.log(binarySearch(myList, 3));