const start = 0;
const end = 31;
for (let index = start; index <= end; ++ index) {
//	writeLine("{0}: {1}".format(index, 360*index/31));
}

const just = [
    1/1, //C
    9/8, //D
    5/4, //E
    4/3, //F
    3/2, //G
    5/3, //A
    15/8, // B
    2/1 //C
];


for (let index = start; index < just.length; ++index) {
	const cents = 100*Math.log2(just[index]);  
	const note = 360*cents/100;
	writeLine("{0}: {1} => {2}".format(index, cents, note));
}