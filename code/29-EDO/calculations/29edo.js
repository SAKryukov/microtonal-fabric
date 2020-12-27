// see also: https://en.xen.wiki/w/29edo
const tonalSystem = 29;
const frequencies = [];
const firstFrequency = 1; //27.5;

const justIntonation = [
    { note: "C  do", ratioHumanReadable: " 1/1", min: Number.POSITIVE_INFINITY },
    { note: "D  re", ratioHumanReadable: " 9/8", min: Number.POSITIVE_INFINITY },
    { note: "E  me", ratioHumanReadable: " 5/4", min: Number.POSITIVE_INFINITY },
    { note: "F  fa", ratioHumanReadable: " 4/3", min: Number.POSITIVE_INFINITY },
    { note: "G sol", ratioHumanReadable: " 3/2", min: Number.POSITIVE_INFINITY },
    { note: "A  la", ratioHumanReadable: " 5/3", min: Number.POSITIVE_INFINITY },
    { note: "B  ti", ratioHumanReadable: "15/8", min: Number.POSITIVE_INFINITY },
    { note: "c  do", ratioHumanReadable: " 2/1", min: Number.POSITIVE_INFINITY },
];

for (let index = 0; index <= tonalSystem; ++index) {
    const frequency = firstFrequency * Math.pow(2, index / tonalSystem);
    frequencies.push({ index: index, frequency: frequency });
}

for (let just of justIntonation) {
    just.ratio = eval(just.ratioHumanReadable);
    let microtone = 0;
    for (let f of frequencies) {
        let min = Math.abs(1 - (just.ratio)/(f.frequency/firstFrequency)); //Math.log(just.ratio) - Math.log(f.frequency/firstFrequency);
        min *= min;
        if (min < just.min) {
            just.min = min;
            just.microtone = microtone;
        }
        ++microtone;
    }
}

for (let just of justIntonation)
   console.log(`${just.note}: harmonic ratio: ${just.ratioHumanReadable}, offset in microtones: ${just.microtone}`);

const harmonicE = 5/4;

const E_Brainin = Math.pow(2, 10/26);
const difference_Brainin = Math.log(E_Brainin) - Math.log(harmonicE);

const E_lower = Math.pow(2, 9/26);
const difference_lower = Math.log(E_lower) - Math.log(harmonicE);

const E_higher = Math.pow(2, 11/26);
const difference_higher = Math.log(E_higher) - Math.log(harmonicE);

console.log(`Brainin: ${difference_Brainin}, lower: ${difference_lower}, higher: ${difference_higher}`);

/*

1) Из ваших пометок на клавиатуре Оголевца следует, что интервал между тоном клавиш, обозначенными "c" и "e", равен 10 29-EDO микротонов.
Отсюда же видно, что если принять C за первую ступень, E будет третьей.

2) Тогда для отношения их частот получим: R10 = 2 в степени (10/26).

3) Из вашего электронного письма следует, что вы признаёте известный факт, что третья ступень должна приближаться к отношению 5/4,
поэтому это рациональное отношение оспаривать не будем.

4) Посмотрим на отклонение интервала, заданного в пункте (1) от рационального отношения частот 5/4. Для этого вычтем логарифмы отношений.
Из основных свойств логарифмов видно, что основание логарифма неважно, важно лишь пользоваться одним и тем же. Назовём это число ошибкой Е10:

Е10 = log(R10) - log(5/4) =  0.04345151813192305
Допустим, что это неплохо

5) Я утверждаю, что это не лучшее приближение, и что в качестве Е нужно взять на один 29-EDO микротон ниже, то есть интервал между истинными C и Е равен
9, а не 10 29-EDO микротонов
Проверяем, повторяя пункт (2) для интервала в 9 29-EDO микротонов:

R9 = 2 в степени (9/26).

6) Как в пункте (4), вычисляем ошибки приближения к отношению частот 5/4:
Е9 = log(R9) - log(5/4) = 0.01679201118730972

7) Видно, что ошибка |Е9| < |Е10|, существенно меньше. Отсюда следует, что интервалом между первой и истинной третьей, то есть интервалом между истинными C и Е в 29 EDO
следует считать не 10, а 9 микротонов, что противоречит рисунку с клавиаторой Оголевца в вашей статье.
Что и требовалось доказать.

*/