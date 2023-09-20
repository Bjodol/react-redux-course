// Variables
var variable1: string = "variable";
let variable2: string = "variable";
variable1 = "Banana";
variable2 = "Banana";

const variable3: string = "variable";

const variable4 = "variable";
const variable5 = "variable" as string;

type Data = {
  cake: string;
  banana: string;
};
const data: Data = { cake: "cake", banana: "banana" };

const variable6 = data.banana;

// Function
function myFn(myParam: number): string {
  return `Cake ${myParam}`;
}

const myFn2 = (myParam: number): string => {
  return `Cake ${myParam}`;
};

const myFnZ = (myParam: string) => `Cake ${myParam}`;

const myFn3 = (myParam: number) => {
  return `Cake ${myParam}`;
};

type MyFn = (myParam: number) => string;
const myFn4: MyFn = (myParam) => {
  return `Cake ${myParam}`;
};

const myFn5 = (myParama: number): string => `Cake ${myParama}`;

const myFn6 = (myParams: string): Data => {
  return { cake: myParams, banana: "banana" };
};

const myFn7 = (myParams: string): Data => ({
  cake: myParams,
  banana: "banana",
});

const myPromise = async (myParams: string): Promise<Data> => {
  const response = await fetch("...");
  const data = await response.json();
  return data;
};

async function myPromise2(myParams: string): Promise<Data> {
  const response = await fetch("...");
  const data = await response.json();
  return data;
}

// Deconstructing objects
const obj: Data = {
  banana: "banana",
  cake: "cake",
};

const banana1 = obj.banana;
const banana2 = obj["banana"];
const { banana, cake, ...rest } = obj;
const { banana: banana3 } = obj;

const complext = {
  count: 0,
  obj: {
    banana: "banana",
    cake: "cake",
  },
};

const {
  obj: { banana: banana4 },
  count,
} = complext;

// Contstructing objects
const cake2: string = "cake";
const obj2 = {
  cake2,
};
const obj3 = {
  cake2: "cake",
};
const obj4 = {
  [cake2]: banana1,
};
const obj5 = {
  cake: banana1,
};

const keyValue = obj4[cake2];
const keyValu2 = obj5.cake;

Object.keys(obj4); // ["cake"]
Object.values(obj4); // ["banana"]
Object.entries(obj4); // [["cake", "banana"]]

const array = ["cake", "banana"];

const newArray = array.map<string>((item) => `prefix-${item}`); // ["prefix-cake", "prefix-banan"]

const mutableArray: string[] = [];
array.forEach((item) => {
  mutableArray.push(`prefix-${item}`);
});

const filteredPrefixArray = array
  .filter((item) => item === "cake")
  .map((item) => `prefix-${item}`); // ["cake"]

JSON.stringify(obj4) === JSON.stringify(obj3);

const reduced = array.reduce<Data>(
  (acc, cur) => {
    //   if (cur !== "cake") return acc;
    return {
      ...acc,
      [cur]: cur,
    };
  },
  { cake: "", banana: "" }
); // { cake: "cake", banana: "banana" }

const totalPrice = [1, 2, 3, 4, 5].reduce<number>((total, current) => {
  return total + current;
}, 0); // 15

const sortedArray = array.sort((a, b) => {
  return -1 || 0 || 1;
});

const myPredicate = (item: string): boolean => item === "cake";
const doesExist: boolean = array.some(myPredicate);
const allHas: boolean = array.every((item) => item === "cake");
const item = array.find((item) => item === "cake");
const itemIndex = array.findIndex((item) => item === "cake");

const myFnX = (myParam: string) => {
  if (myParam === "cake") return "Cake";
  else if (myParam === "banana") return "banana";
  else return "WFT?";
};
