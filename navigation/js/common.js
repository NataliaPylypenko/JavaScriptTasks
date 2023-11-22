const data = [{
    "id": "1",
    "name": "Електроніка",
    "subcategories": [
        {
            "id": "2",
            "name": "Смартфони",
            "subcategories": [
                {
                    "id": "3",
                    "name": "Аксесуари",
                    "subcategories": [] // Пустий масив означає, що немає додаткових підкатегорій
                }
            ]
        },
        {
            "id": "4",
            "name": "Комп'ютери",
            "subcategories": []
        }
    ]
}];


const getAllCategoryIds = (data) => {
    let ids = [];

    data.forEach(item => {
        ids.push(item['id']);
        ids = [...ids, ...getAllCategoryIds(item['subcategories'])];
    });

    return ids;
};

console.log(getAllCategoryIds(data));
