interface monthValue {
	value: string ;
	num: number
}

export const months: monthValue[] = [
	{ value: "January", num: 0 },
	{ value: "February", num: 1 },
	{ value: "March", num: 2 },
	{ value: "April", num: 3 },
	{ value: "May", num: 4 },
	{ value: "June", num: 5 },
	{ value: "July", num: 6 },
	{ value: "August", num: 7 },
	{ value: "September", num: 8 },
	{ value: "October", num: 9 },
	{ value: "November", num: 10 },
	{ value: "December", num: 11 },
];

export function getCurrentYear() {
	return new Date().getFullYear();
}

export function getCurrentMonth() {
	return new Date().getMonth();
}

export function getFirstDay(month:number, year:number) {
	let firstDay = new Date(year, month).getDay();

	return firstDay;
}
