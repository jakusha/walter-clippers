import React, { ReactNode, useState } from "react";

const ShowMore = ({ data }: {data: unknown[]}) => {
	let itemsToShow = 10;
	let showMoreLimit = Math.ceil(data?.length / itemsToShow);
	const [count, setCount] = useState(1);

	let content:ReactNode = data?.slice(0, count * itemsToShow)?.map((item) => item) as ReactNode;

	function handleClick() {
		setCount((count) => count + 1);
	}

	return (
		<div className="grid place-content-center">
			<div>{content}</div>
			<button
				onClick={handleClick}
				disabled={count === showMoreLimit}
				className="border-2 bg-blue-700 text-white p-4 rounded-md"
			>
				show more
			</button>
		</div>
	);
};

export default ShowMore;
