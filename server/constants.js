const fillerNames = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const allSymbols = ["t1", "t2", "t3", "t4", "t5", "t6", "t7","t8","t9","t10","t11","t12"];

// n = number of people , p = number of symbols
// (n-1)*p + 1
// i.e. n = 3, p = 3 : 7
export const testSymbols = [
  {
    _id: "0",
    taskName: "Easy 1",
    symbols: ["A", "B", "C", "D", "E", "F", "G"],
    answer: "C",
  },
  {
    _id: "1",
    taskName: "Easy 2",
    symbols: ["A", "B", "C", "D", "E", "F", "G"],
    answer: "D",
  },
  {
    _id: "2",
    taskName: "Easy 3",
    symbols: ["E", "O", "C", "R", "D", "E", "F",],
    answer: "F",
  },
  // {
  //   _id: "3",
  //   taskName: "Easy 4",
  //   symbols: ["Z", "X", "Y", "V", "W", "C"],
  //   answer: "C",
  // },
  // {
  //   _id: "4",
  //   taskName: "Easy 5",
  //   symbols: ["G", "H", "I", "J", "K", "C"],
  //   answer: "K",
  // },
  // {
  //   _id: "5",
  //   taskName: "Easy 6",
  //   symbols: ["O", "P", "L", "O", "Q", "U", "T"],
  //   answer: "Q",
  // },
  // {
  //   _id: "6",
  //   taskName: "Easy 7",
  //   symbols: ["A", "B", "C", "L", "M", "I", "N"],
  //   answer: "L",
  // },

];

export const testTangrams = [
  {
    _id: "0",
    taskName: "Task 1",
    symbols: allSymbols,
    answer: "t1",
  },
  {
    _id: "1",
    taskName: "Task 2",
    symbols: allSymbols,
    answer: "t2",
  },
  {
    _id: "2",
    taskName: "Task 3",
    symbols: allSymbols,
    answer: "t3",
  },
  {
    _id: "3",
    taskName: "Task 4",
    symbols: allSymbols,
    answer: "t4",
  },
  {
    _id: "4",
    taskName: "Task 5",
    symbols: allSymbols,
    answer: "t5",
  },
  {
    _id: "5",
    taskName: "Task 6",
    symbols: allSymbols,
    answer: "t6",
  },
  {
    _id: "6",
    taskName: "Task 7",
    symbols: allSymbols,
    answer: "t7",
  },
  {
    _id: "7",
    taskName: "Task 8",
    symbols: allSymbols,
    answer: "t8",
  },
  {
    _id: "8",
    taskName: "Task 9",
    symbols: allSymbols,
    answer: "t9",
  },
  {
    _id: "9",
    taskName: "Task 10",
    symbols: allSymbols,
    answer: "t10",
  },
  {
    _id: "10",
    taskName: "Task 11",
    symbols: allSymbols,
    answer: "t11",
  },
  {
    _id: "11",
    taskName: "Task 12",
    symbols: allSymbols,
    answer: "t12",
  },
  {
    _id: "12",
    taskName: "Task 13",
    symbols: allSymbols,
    answer: "t1",
  },
  {
    _id: "13",
    taskName: "Task 14",
    symbols: allSymbols,
    answer: "t2",
  },
  {
    _id: "14",
    taskName: "Task 15",
    symbols: allSymbols,
    answer: "t3",
  },


  // {
  //   _id: "3",
  //   taskName: "Easy 4",
  //   symbols: ["Z", "X", "Y", "V", "W", "C"],
  //   answer: "C",
  // },
  // {
  //   _id: "4",
  //   taskName: "Easy 5",
  //   symbols: ["G", "H", "I", "J", "K", "C"],
  //   answer: "K",
  // },
  // {
  //   _id: "5",
  //   taskName: "Easy 6",
  //   symbols: ["O", "P", "L", "O", "Q", "U", "T"],
  //   answer: "Q",
  // },
  // {
  //   _id: "6",
  //   taskName: "Easy 7",
  //   symbols: ["A", "B", "C", "L", "M", "I", "N"],
  //   answer: "L",
  // },

];
