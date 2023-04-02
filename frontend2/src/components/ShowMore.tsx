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
		<div className="flex flex-col gap-4 auto-rows-max xl:grid-cols-2 row-auto gap-2 mb-10 lg:text-lg w-">
			<div>{content}</div>
			<button
				onClick={handleClick}
				disabled={count === showMoreLimit}
				className="bg-blue-4 text-white p-4 inline-block w-40 mx-auto"
			>
				show more
			</button>
		</div>
	);
};

export default ShowMore;
